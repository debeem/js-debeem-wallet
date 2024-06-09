/**
 * 	@category Rpc Services
 * 	@module CoinGeckoService
 */
import { AbstractRpcService } from "../AbstractRpcService";
import { IRpcService } from "../IRpcService";
import { coinGecko } from "../../../config";
import { NetworkModels } from "../../../models/NetworkModels";
import { FetchUtil, FetchOptions } from "debeem-utils";
import { FetchResponse } from "ethers";
import { TypeUtil } from "debeem-utils";
import lodash from "lodash";

/**
 * 	https://www.coingecko.com/zh/api/documentation
 */
export class CoinGeckoService extends AbstractRpcService implements IRpcService
{
	constructor( chainId : number )
	{
		//	there is no chainId limited
		super( chainId );
		this.setChainMap({
			1: 'eth-mainnet',
		});

		//	load config
		//	it will check whether the network specified by chainId can be supported
		this._config = this.cloneConfig( coinGecko );

		//	...
		this.setEndpoint( this.getEndpointByChainId( this.chainId ) );
		this.setVersion( "v3" );
		this.setApiKey( this._config.apiKey );
	}

	/**
	 * 	get current config
	 *
	 * 	@returns {NetworkModels}
	 */
	public get config() : NetworkModels
	{
		return this._config;
	}

	/**
	 * 	deep clone configuration from the input
	 *
	 *	@param config	{NetworkModels}
	 *	@returns {NetworkModels}
	 */
	protected cloneConfig( config : NetworkModels ) : NetworkModels
	{
		return lodash.cloneDeep( config ) as NetworkModels;
	}

	/**
	 * 	get endpoint by network
	 *
	 * 	@param chainId	{number} the chainId number
	 *	@returns {string}
	 */
	public getEndpointByChainId( chainId ?: number ) : string
	{
		return `https://api.coingecko.com`;
	}

	/**
	 *	Get the current price of any cryptocurrencies in any other supported currencies that you need.
	 *
	 *	@param ids		{string} id of coins, comma-separated if querying more than 1 coin.
	 *					 see: src/resources/coinGeckoCoinList.json
	 *	@param vsCurrencies	{string} vs_currency of coins, comma-separated if querying more than 1 vs_currency.
	 *					 see: src/resources/coinGeckoSupportedVsCurrencies.json
	 *	@returns {Promise<any>}
	 */
	public async fetchSimplePrice( ids : string, vsCurrencies : string ) : Promise<any>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! TypeUtil.isNotEmptyString( ids ) )
				{
					return reject( `invalid ids` );
				}
				if ( ! TypeUtil.isNotEmptyString( vsCurrencies ) )
				{
					return reject( `invalid vs_currencies` );
				}

				//
				//	https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin&vs_currencies=USD
				//	https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cbitcoin&vs_currencies=USD
				//	ids = 'ethereum,bitcoin';
				//	vs_currencies = 'USD';
				//
				const encodedIds : string = encodeURIComponent( ids );
				const encodedVsCurrencies : string = encodeURIComponent( vsCurrencies );
				const url = `${ this.endpoint }/api/${ this.version }/simple/price?ids=${ encodedIds }&vs_currencies=${ encodedVsCurrencies }`;
				const options : FetchOptions = {
					url : url,
					timeout : 5 * 60 * 1000,
					accept : `application/json`,
					headers : [
						{ key : 'Authorization', value : `Bearer ${ this.apiKey }` }
					]
				};
				const response : FetchResponse = await FetchUtil.getRequest( options );
				if ( response && response.bodyJson )
				{
					//
					//	{
					//		"bitcoin":
					//		{
					//			"usd": 29005
					//		},
					//		"ethereum":
					//		{
					//			"usd": 1828.13
					//		}
					// 	}
					//
					return resolve( response.bodyJson );
				}

				return reject( `invalid response` );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	Get current price of tokens (using contract addresses) for a given platform in any other currency that you need.
	 *	@param platformId		{string} The id of the platform issuing tokens.
	 *						 see: src/resources/coinGeckoAssetPlatforms.json
	 *	@param contractAddresses	{string} The contract address of tokens, comma separated
	 *						 see: src/resources/ethereumTokens.json.ts
	 *	@param vsCurrencies		{string} vs_currency of coins, comma-separated if querying more than 1 vs_currency
	 * 						 see: src/resources/coinGeckoSupportedVsCurrencies.json
	 *	@returns {Promise<any>}
	 */
	public async fetchSimpleTokenPrice( platformId : string, contractAddresses : string,  vsCurrencies : string ) : Promise<any>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! TypeUtil.isNotEmptyString( platformId ) )
				{
					return reject( `invalid platformId` );
				}
				if ( ! TypeUtil.isNotEmptyString( contractAddresses ) )
				{
					return reject( `invalid platformId` );
				}
				if ( ! TypeUtil.isNotEmptyString( vsCurrencies ) )
				{
					return reject( `invalid vs_currencies` );
				}

				//
				//	https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=0xdac17f958d2ee523a2206206994597c13d831ec7&vs_currencies=USD
				//	platformId	= `ethereum`;
				//	contract_addresses = '0xdac17f958d2ee523a2206206994597c13d831ec7';
				//	vs_currencies = 'USD';
				//
				const encodedContractAddresses : string = encodeURIComponent( contractAddresses );
				const encodedVsCurrencies : string = encodeURIComponent( vsCurrencies );
				const url = `${ this.endpoint }/api/${ this.version }/simple/token_price/${ platformId }?contract_addresses=${ encodedContractAddresses }&vs_currencies=${ encodedVsCurrencies }`;
				const options : FetchOptions = {
					url : url,
					timeout : 5 * 60 * 1000,
					accept : `application/json`,
					headers : [
						{ key : 'Authorization', value : `Bearer ${ this.apiKey }` }
					]
				};
				const response : FetchResponse = await FetchUtil.getRequest( options );
				if ( response && response.bodyJson )
				{
					//
					//	{
					//		"0xdac17f958d2ee523a2206206994597c13d831ec7":
					//		{
					//			"usd": 0.998383
					//   		}
					// 	}
					//
					return resolve( response.bodyJson );
				}

				return reject( `invalid response` );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}
}
