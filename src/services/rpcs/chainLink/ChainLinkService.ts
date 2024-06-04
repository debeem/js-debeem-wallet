import { AbstractRpcService } from "../AbstractRpcService";
import { IRpcService } from "../IRpcService";
import { chainLink } from "../../../config";
import { NetworkModels } from "../../../models/NetworkModels";
import { ethers, JsonRpcProvider } from "ethers";
import { MathUtil, TypeUtil } from "debeem-utils";
import lodash from "lodash";
import {
	ChainLinkPriceFeedAddressItem,
	priceFeedAddressesOnGoerliTestnet,
	priceFeedAddressesOnMainnet,
	priceFeedAddressesOnSepoliaTestnet
} from "./EthereumPriceFeedAddresses";
import { aggregatorV3InterfaceABI } from "./AggregatorV3InterfaceABI";


/**
 * 	ChainLinkPriceResult
 */
export type ChainLinkPriceResult = {
	chainLink : {
		roundId : bigint,
		answer : bigint,
		startedAt : bigint,
		updatedAt : bigint,
		answeredInRound : bigint,
		address : string,
		decimals : number,
	},
	price : bigint,			//
	floatPrice : number,		//	float value with decimals
};

/**
 * 	https://docs.chain.link/data-feeds/price-feeds/addresses
 */
export class ChainLinkService extends AbstractRpcService implements IRpcService
{
	constructor( chainId : number )
	{
		//	there is no chainId limited
		super( chainId );
		this.setChainMap({
			1: 'mainnet',
		});

		//	load config
		//	it will check whether the network specified by chainId can be supported
		this._config = this.loadConfig( chainLink );

		//	...
		this.setEndpoint( this.getEndpointByNetwork( this._config.network ) );
		this.setVersion( "v3" );
		this.setApiKey( this._config.apiKey );
	}

	public get config() : NetworkModels
	{
		return this._config;
	}

	/**
	 * 	overwrite
	 *	@param config
	 */
	protected loadConfig( config : NetworkModels ) : NetworkModels
	{
		return lodash.cloneDeep( config ) as NetworkModels;
	}

	public getEndpointByNetwork( network? : string ) : string
	{
		if ( ! TypeUtil.isNotEmptyString( network ) )
		{
			network = this._config.network;
		}

		switch ( network )
		{
			case "mainnet":
				return "https://rpc.ankr.com/eth";
			case "sepolia":
				return "https://rpc.ankr.com/eth_sepolia";
			case "goerli":
				return "https://rpc.ankr.com/eth_goerli";
		}

		return "https://rpc.ankr.com/eth";
	}

	/**
	 *	@param pair	{string} e.g.: BTC/USD, see the keys in file EthereumPriceFeedAddresses.ts
	 *	@param network	{string}
	 *	@return { ChainLinkPriceFeedAddressItem | null }
	 */
	public getAddressByPair( pair : string, network? : string ) : ChainLinkPriceFeedAddressItem | null
	{
		if ( ! TypeUtil.isNotEmptyString( pair ) )
		{
			return null;
		}

		if ( ! TypeUtil.isNotEmptyString( network ) )
		{
			network = this._config.network;
		}

		//	...
		let priceFeedAddresses = null;
		switch ( network )
		{
			case "mainnet":
				priceFeedAddresses = priceFeedAddressesOnMainnet;
				break;

			case "sepolia":
				priceFeedAddresses = priceFeedAddressesOnSepoliaTestnet;
				break;

			case "goerli":
				priceFeedAddresses = priceFeedAddressesOnGoerliTestnet;
				break;
		}
		if ( priceFeedAddresses )
		{
			const pairKeys : Array<string> = Object.keys( priceFeedAddresses );
			if ( Array.isArray( pairKeys ) )
			{
				pair = pair.trim().toUpperCase();
				for ( const key of pairKeys )
				{
					if ( key.trim().toUpperCase() === pair )
					{
						return priceFeedAddresses[ key ];
					}
				}
			}
		}

		return null;
	}

	/**
	 *	Get the current price of the specified pair
	 *	@param pair		{string} - e.g.: BTC/USD, see: EthereumPriceFeedAddresses.ts
	 *	@return {Promise< ChainLinkPriceResult | null >}
	 */
	public async fetchPairPrice( pair : string ) : Promise< ChainLinkPriceResult | null >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! TypeUtil.isNotEmptyString( pair ) )
				{
					return reject( `invalid pair` );
				}

				const addressItem : ChainLinkPriceFeedAddressItem | null = this.getAddressByPair( pair );
				if ( ! addressItem )
				{
					return reject( `unsupported pair` );
				}

				const endpoint : string = this.getEndpointByNetwork();
				const provider = new JsonRpcProvider( endpoint );
				const priceFeed = new ethers.Contract( addressItem.address, aggregatorV3InterfaceABI, provider )
				const roundData = await priceFeed.latestRoundData();
				if ( ! Array.isArray( roundData ) || 5 !== roundData.length )
				{
					return reject( `invalid response format` );
				}

				//
				//    function latestRoundData() external view
				//    returns (
				//		uint80 roundId,
				//		int256 answer,
				//		uint256 startedAt,
				//		uint256 updatedAt,
				//		uint80 answeredInRound
				//    )
				//
				//    :: for ETH/USD:
				//    console.log( `roundData: `, roundData );
				//    roundData:  Result(5) [
				//       110680464442257317863n,
				//       206797535854n,
				//       1700776535n,
				//       1700776535n,
				//       110680464442257317863n
				//    ]
				//
				//    :: for BTC/USD:
				//    console.log( `roundData: `, roundData );
				//    roundData:  Result(5) [
				//       110680464442257314162n,
				//       2894163638000n,
				//       1692219323n,
				//       1692219323n,
				//       110680464442257314162n
				//    ]
				//
				//
				//	price:  28941.63
				//
				// let price : number = 0.0;
				// if ( addressItem.decimals > 2 )
				// {
				// 	//	try to parse the price into a human-readable format
				// 	const priceTmp : bigint = roundData[ 1 ] / BigInt( 10 ** ( addressItem.decimals - 2 ) );
				// 	price = parseFloat( priceTmp.toString() ) / 100;
				// }

				const price : bigint = roundData[ 1 ];
				const floatPrice : number = MathUtil.floatValueFromBigint( price, addressItem.decimals );
				const result : ChainLinkPriceResult = {
					chainLink : {
						roundId : roundData[ 0 ],
						answer : roundData[ 1 ],
						startedAt : roundData[ 2 ],
						updatedAt : roundData[ 3 ],
						answeredInRound : roundData[ 4 ],
						address : addressItem.address,
						decimals : addressItem.decimals,
					},
					price : price,
					floatPrice : floatPrice,
				};
				resolve( result );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}
}
