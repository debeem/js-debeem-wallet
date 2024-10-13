/**
 * 	query balance, calculate total value, and request real-time quotes for Ethereum native token and derivative tokens
 *
 * 	@category Wallet Services
 * 	@module WalletAccount
 */
import { ethers } from "ethers";
import { TypeUtil } from "debeem-utils";
import { NetworkModels } from "../../models/NetworkModels";
import { UsdtABIItem } from "../../models/ABIModels";
import { usdtABI } from "../../resources/usdtABI";
import { InfuraRpcService } from "../rpcs/infura/InfuraRpcService";
import { getCurrentChain } from "../../config";
import { CoinGeckoService } from "../rpcs/coinGecko/CoinGeckoService";
import { ChainLinkPriceResult, ChainLinkService } from "../rpcs/chainLink/ChainLinkService";
import { AlchemyService } from "../rpcs/alchemy/AlchemyService";
import type {
	ContractTokenBalanceItem,
	ContractTokenValueItem,
	TokenValueItem, TotalValues
} from "../../models/TokenModels";
import { defaultTokenValueItem } from "../../constants/ConstantToken";
import { ChainLinkPriceFeedAddressItem } from "../rpcs/chainLink/EthereumPriceFeedAddresses";
import { MathUtil } from "debeem-utils";
import { WalletFactory } from "./WalletFactory";
import { TokenStorageService } from "../storage/TokenStorageService";
import { TokenEntityItem } from "../../entities/TokenEntity";


/**
 * 	@class
 */
export class WalletAccount
{
	constructor()
	{
	}

	/**
	 * 	query the balance of native currency on chain
	 *
	 *	@param address		- wallet address
	 * 	@return {Promise<bigint>} balance in wei, 18 decimal places
	 */
	public async queryBalance( address : string ) : Promise<bigint>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( !TypeUtil.isNotEmptyString( address ) )
				{
					return reject( `${ this.constructor.name }.queryBalance :: wallet address not specified` );
				}

				const service : string = 'alchemy';
				let balance : bigint = BigInt( 0 );
				switch ( service )
				{
					case 'alchemy':
						balance = await new AlchemyService( getCurrentChain() ).queryBalance( address );
						break;
					case 'infura' :
						const config : NetworkModels = new InfuraRpcService( getCurrentChain() ).config;
						const provider = new ethers.InfuraProvider( config.network, config.apiKey );

						//	in wei, 18 decimal places
						balance = await provider.getBalance( address );
						break;
				}

				resolve( balance );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 * 	query the balance of native currency on chain
	 *
	 * 	@deprecated
	 * 	@hidden
	 *
	 *	@param address {string} wallet address
	 *	@return {Promise<bigint>} balance in wei, 18 decimal places
	 */
	public async ethQueryBalance( address : string ) : Promise<bigint>
	{
		return this.queryBalance( address );
	}

	/**
	 * 	query balance of derivative tokens, and try to query the balance of the native token, if specified.
	 *
	 *	@param address	{string} wallet address
	 *	@param tokens	{Array<ContractTokenBalanceItem>} contract addresses list
	 *	@param [ABI]	{Array<UsdtABIItem>} Application Binary Interface
	 *	@returns {Promise<Array<ContractTokenBalanceItem>>}
	 */
	public async queryTokenBalances(
		address : string,
		tokens : Array<ContractTokenBalanceItem>,
		ABI? : Array<UsdtABIItem> ) : Promise<Array<ContractTokenBalanceItem>>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( !TypeUtil.isNotEmptyString( address ) )
				{
					return reject( `${ this.constructor.name }.queryTokenBalances :: invalid address` );
				}
				if ( !Array.isArray( tokens ) || 0 === tokens.length )
				{
					return reject( `${ this.constructor.name }.queryTokenBalances :: invalid contractAddresses` );
				}

				if ( ! ABI )
				{
					ABI = usdtABI;
				}

				let tokenBalances : Array<ContractTokenBalanceItem> = await new AlchemyService().queryTokenBalances( address, tokens );
				//
				//	[
				//		{
				//			pair : "USDT/USD",
				//			decimals : 6,
				// 			"contractAddress": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
				// 			"tokenBalance": 11111111n
				// 		}
				// 	],
				//	...
				//

				//	...
				resolve( tokenBalances );

				// const config : NetworkModels = new InfuraRpcService( getCurrentChain() ).config;
				// console.log( getCurrentChain(), config );
				// const provider = new ethers.InfuraProvider( config.network, config.apiKey );
				// const tokenContract = new ethers.Contract( contractAddress, ABI, provider );
				// const balance = await tokenContract.balanceOf( address );
				// console.log( `balance: `, balance );
			}
			catch ( err : any )
			{
				// if ( err &&
				// 	TypeUtil.isNotNullObjectWithKeys( err, [ 'code', 'value' ] ) &&
				// 	'BAD_DATA' === err[ 'code' ] &&
				// 	'0x' === err[ 'value' ]
				// )
				// {
				// 	return resolve( BigInt( 0 ) );
				// }

				//	...
				reject( err );
			}
		} );
	}

	/**
	 *	Get the price of the specified pair in real-time
	 *
	 * ```ts
	 * //
	 * //    query the price of BTC/USD in real-time
	 * //
	 * const priceObj : ChainLinkPriceResult | null = await new WalletAccount().queryPairPrice( `BTC/USD` );
	 *
	 * //    should return:
	 * {
	 *    chainLink: {
	 *      roundId: 110680464442257326336n,
	 *      answer: 7087192046296n,
	 *      startedAt: 1717653347n,
	 *      updatedAt: 1717653347n,
	 *      answeredInRound: 110680464442257326336n,
	 *      address: '0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c',
	 *      decimals: 8
	 *    },
	 *    price: 7087192046296n,
	 *    floatPrice: 70871.92
	 * }
	 * ```
	 *	@param pair	{string} - e.g.: BTC/USD, see: EthereumPriceFeedAddresses.ts
	 *	@return {Promise< ChainLinkPriceResult | null >}
	 */
	public async queryPairPrice( pair : string ) : Promise<ChainLinkPriceResult | null>
	{
		return new ChainLinkService( getCurrentChain() ).fetchPairPrice( pair );
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
	public async querySimplePrice( ids : string, vsCurrencies : string ) : Promise<any>
	{
		return new CoinGeckoService( getCurrentChain() ).fetchSimplePrice( ids, vsCurrencies );
	}

	/**
	 * 	Get current price of tokens (using contract addresses) for a given platform in any other currency that you need.
	 *
	 *	@param platformId		{string} The id of the platform issuing tokens.
	 *						 see: src/resources/coinGeckoAssetPlatforms.json
	 *	@param contractAddresses	{string} The contract address of tokens, comma separated
	 *						 see: src/resources/ethereumTokens.json.ts
	 *	@param vsCurrencies		{string} vs_currency of coins, comma-separated if querying more than 1 vs_currency
	 * 						 see: src/resources/coinGeckoSupportedVsCurrencies.json
	 *	@returns {Promise<any>}
	 */
	public async querySimpleTokenPrice( platformId : string, contractAddresses : string, vsCurrencies : string ) : Promise<any>
	{
		return new CoinGeckoService( getCurrentChain() ).fetchSimpleTokenPrice( platformId, contractAddresses, vsCurrencies );
	}


	/**
	 * 	query value
	 *
	 *	@param address		{string} wallet address
	 *	@param pair		{string} e.g.: ETH/USD, see: EthereumPriceFeedAddresses.ts
	 * 	@param [decimals]	{number} decimals, default ot 18
	 *	@return {Promise<TokenValueItem>}
	 */
	public async queryValue( address : string, pair : string, decimals : number = 18 ) : Promise<TokenValueItem>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( !TypeUtil.isNotEmptyString( address ) )
				{
					return reject( `${ this.constructor.name }.queryValue :: invalid address` );
				}
				if ( !TypeUtil.isNotEmptyString( pair ) )
				{
					return reject( `${ this.constructor.name }.queryValue :: invalid pair` );
				}

				let floatBalance : number = 0.00;
				let stringBalance : string = ``;
				let bigValue : bigint = BigInt( 0 );
				let valueDecimals : number = 0;
				let floatValue : number = 0.00;
				let stringValue : string = ``;

				//	query the balance of native ETH
				const balance : bigint = await this.queryBalance( address );
				if ( balance > 0 )
				{
					if ( decimals > 0 )
					{
						floatBalance = MathUtil.floatValueFromBigint( balance, decimals );
						stringBalance = MathUtil.stringFromBigint( balance, decimals );
					}

					//	...
					const priceObj : ChainLinkPriceResult | null = await this.queryPairPrice( pair );
					if ( priceObj )
					{
						if ( priceObj.price <= 0 )
						{
							//return reject( `invalid price` );
							priceObj.price = BigInt( 0 );
						}
						bigValue = balance * priceObj.price;

						//
						//	try to convert value to float
						//
						const priceFeedAddressItem : ChainLinkPriceFeedAddressItem | null = new ChainLinkService( getCurrentChain() ).getAddressByPair( pair );
						if ( bigValue > 0 &&
							priceFeedAddressItem && priceFeedAddressItem.decimals > 0 &&
							decimals > 0 )
						{
							//	decimals for balance
							valueDecimals = priceFeedAddressItem.decimals + decimals;
							floatValue = MathUtil.floatValueFromBigint( bigValue, valueDecimals );
							stringValue = MathUtil.stringFromBigint( bigValue, valueDecimals );
						}
					}
				}

				//	...
				const value : TokenValueItem = {
					balance : balance,
					balanceDecimals : decimals,
					floatBalance : floatBalance,
					stringBalance : stringBalance,

					value : bigValue,
					valueDecimals : valueDecimals,
					floatValue : floatValue,
					stringValue : stringValue,
				};
				resolve( value );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 * 	query the value of derivative tokens
	 *
	 *	@param address	{string} wallet address
	 *	@param tokens	{Array<ContractTokenBalanceItem>}
	 *	@param [ABI]	{Array<UsdtABIItem>}
	 *	@return	{Array<ContractTokenValueItem>}
	 */
	public async queryTokenValues
	(
		address : string,
		tokens : Array<ContractTokenBalanceItem>,
		ABI? : Array<UsdtABIItem>
	) : Promise<Array<ContractTokenValueItem>>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( !TypeUtil.isNotEmptyString( address ) )
				{
					return reject( `${ this.constructor.name }.queryTokenValues :: invalid address` );
				}
				if ( ! Array.isArray( tokens ) )
				{
					return reject( `${ this.constructor.name }.queryTokenValues :: invalid tokens` );
				}

				//	query contract token balance
				const balances : Array<ContractTokenBalanceItem> = await this.queryTokenBalances( address, tokens, ABI );
				//console.log( `balances : `, balances );
				//	should output:
				//	balances :  [
				//       {
				//         pair: 'USDC/USD',
				//         decimals: 6, or undefined
				//         contractAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				//         tokenBalance: 0n
				//       },
				//       {
				//         pair: 'USDT/USD',
				//         decimals: 6, or undefined
				//         contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
				//         tokenBalance: 80230000n
				//       },
				//       {
				//         pair: 'ETH/USD',
				//         decimals: 18, or undefined
				//         contractAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
				//         tokenBalance: 4533795296872777595458n
				//       }
				//     ]
				if ( ! Array.isArray( balances ) || 0 === balances.length )
				{
					//return reject( `failed to query balances` );
					return resolve( [] );
				}

				let values : Array<ContractTokenValueItem> = [];
				for ( const balance of balances )
				{
					// {
					// 	"contractAddress": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
					// 	"tokenBalance": 11111111n
					// },
					let floatBalance : number = 0.00;
					let stringBalance : string = ``;

					let bigValue : bigint = BigInt( 0 );
					let valueDecimals : number = 0;
					let floatValue : number = 0.00;
					let stringValue : string = ``;

					if ( balance.tokenBalance > 0 )
					{
						if ( balance.decimals && balance.decimals > 0 )
						{
							floatBalance = MathUtil.floatValueFromBigint( balance.tokenBalance, balance.decimals );
							stringBalance = MathUtil.stringFromBigint( balance.tokenBalance, balance.decimals );
						}

						//	...
						const priceObj : ChainLinkPriceResult | null = await this.queryPairPrice( balance.pair );
						if ( priceObj )
						{
							if ( priceObj.price <= 0.0 )
							{
								//return reject( `invalid price` );
								priceObj.price = BigInt( 0 );
							}

							bigValue = balance.tokenBalance * BigInt( priceObj.price );

							//	try to convert bigint to float
							const priceFeedItem : ChainLinkPriceFeedAddressItem | null = new ChainLinkService( getCurrentChain() ).getAddressByPair( balance.pair );
							if ( bigValue > 0 &&
								priceFeedItem && priceFeedItem.decimals > 0 &&
								balance.decimals && balance.decimals > 0 )
							{
								//	update floatValue
								valueDecimals = priceFeedItem.decimals + balance.decimals;
								floatValue = MathUtil.floatValueFromBigint( bigValue, valueDecimals );
								stringValue = MathUtil.stringFromBigint( bigValue, valueDecimals );
							}
						}
					}

					//	...
					const value : ContractTokenValueItem = {
						pair : balance.pair,
						contractAddress : balance.contractAddress,

						balance : balance.tokenBalance,
						balanceDecimals : balance.decimals,
						floatBalance : floatBalance,
						stringBalance : stringBalance,

						value : bigValue,
						valueDecimals : valueDecimals,
						floatValue : floatValue,
						stringValue : stringValue,
					};
					values.push( value );
				}

				resolve( values );


				// if ( balance > 0 )
				// {
				// 	const priceObj : ChainLinkPriceResult | null = await this.queryPairPrice( pair );
				// 	if ( priceObj )
				// 	{
				// 		if ( priceObj.price <= 0.0 )
				// 		{
				// 			return reject( `invalid price` );
				// 		}
				//
				// 		const balanceEthStr : string = formatUnits( balance, decimals );
				// 		const balanceNum : number = parseFloat( balanceEthStr );
				// 		const value : number = balanceNum * priceObj.price;
				//
				// 		//	...
				// 		return resolve( value );
				// 	}
				// }
				//
				// //	...
				// resolve( 0 );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 * 	query the value of derivative tokens
	 *
	 *	@param address		{string} wallet address
	 *	@param [ABI]		{Array<UsdtABIItem>}
	 *	@return	{Array<ContractTokenValueItem>}
	 */
	public async queryTotalValues
	(
		address : string,
		ABI? : Array<UsdtABIItem>
	) : Promise<TotalValues | null>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! new WalletFactory().isValidAddress( address ) )
				{
					return reject( `${ this.constructor.name }.queryTotalValues :: invalid address` );
				}

				//	query all tokens of the wallet
				const tokens : Array<TokenEntityItem> | null = await new TokenStorageService().getAllByWallet( address );
				if ( ! Array.isArray( tokens ) || 0 === tokens.length )
				{
					return resolve( null );
				}

				let tokenBalances : Array<ContractTokenBalanceItem> = [];
				for ( const token of tokens )
				{
					tokenBalances.push({
						pair : `${ token.symbol }/USD`,
						contractAddress : token.address,
						tokenBalance : BigInt( 0 ),
						decimals : token.decimals
					});
				}
				if ( 0 === tokenBalances.length )
				{
					return resolve( null );
				}

				const values : Array<ContractTokenValueItem> = await this.queryTokenValues( address, tokenBalances, ABI );
				if ( 0 === values.length )
				{
					return resolve( null );
				}

				let total : TotalValues = {
					total : defaultTokenValueItem,
					values : values
				};
				for ( let value of values )
				{
					total.total.value += ( TypeUtil.isNumeric( value.value ) ? value.value : BigInt( 0 ) );
					total.total.floatValue += ( TypeUtil.isNumeric( value.floatValue ) ? value.floatValue : 0.0 );
				}

				resolve( total );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}
}
