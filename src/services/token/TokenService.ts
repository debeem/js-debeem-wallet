/**
 * 	Query token information on a specified chain
 *
 * 	@category Token Services
 * 	@module TokenService
 */
import { MathUtil } from "debeem-utils";
import _ from "lodash";
import {OneInchTokenService} from "../rpcs/oneInchToken/OneInchTokenService";
import {OneInchTokenItem} from "../../models/TokenModels";
import {RpcSupportedChainMap} from "../../models/RpcModels";
import {AbstractRpcService} from "../rpcs/AbstractRpcService";
import {IRpcService} from "../rpcs/IRpcService";
import {NetworkModels} from "../../models/NetworkModels";


/**
 * 	The class constructor needs to pass in a chainId. Before you create an instance, you can get the currently supported chainId list in the following way:
 *
 *
 * ```ts
 * //	query currently supported chain/network
 * const supportedChains : Array<number> = new TokenService( 1 ).supportedChains();
 *
 * //	should return a supported chain list, for example:
 * [ 1, 10, 56, 100, 137, 250, 324, 8217, 8453, 42161, 43114, 1313161554 ]
 *
 * //	create an instance based on the specified chain/network
 * const tokenService = new TokenService( {chainId} );
 * ```
 */
export class TokenService extends AbstractRpcService implements IRpcService
{
	/**
	 * 	Create an instance of TokenService
	 *
	 *	@param chainId {number} the chainId number
	 */
	constructor( chainId : number )
	{
		super( chainId );
		this.setChainMap( new OneInchTokenService( 1 ).supportedChainMap );
	}

	/**
	 * 	get supported chain map
	 *
	 * ```ts
	 * const supportedChainMap : RpcSupportedChainMap = new TokenService( 1 ).getSupportedChainMap();
	 * //    should return:
	 * {
	 * 	1 : "mainnet",		//	Ethereum mainnet
	 * 	42161 : "arb1",		//	Arbitrum One
	 * 	1313161554 : "aurora",	//	Aurora Mainnet
	 * 	43114 : "avax",		//	Avalanche C-Chain
	 * 	8453 : "base",		//	Base
	 * 	56 : "bnb",		//	BNB Smart Chain Mainnet
	 * 	324 : "zksync",		//	zkSync Era Mainnet
	 * 	250 : "ftm",		//	Fantom Opera
	 * 	100 : "gno",		//	Gnosis
	 * 	8217 : "cypress",	//	Klaytn Mainnet Cypress
	 * 	10 : "oeth",		//	OP Mainnet
	 * 	137 : "matic",		//	Polygon Mainnet
	 * }
	 * ```
	 *
	 * 	@override
	 * 	@returns {RpcSupportedChainMap}
	 */
	public get supportedChainMap() : RpcSupportedChainMap
	{
		return super.supportedChainMap;
	}

	/**
	 * 	get the contract address of the native token
	 *
	 * ```ts
	 * //	should always return:
	 * '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
	 * ```
	 *
	 * 	@returns {string}
	 */
	public get nativeTokenAddress() : string
	{
		return `0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee`;
	}

	/**
	 * 	check if the input value is the contract address of the native token
	 *
	 * 	@group Extended Methods
	 *	@param contractAddress	{string}
	 *	@returns {boolean}
	 */
	public isNativeToken( contractAddress : string ) : boolean
	{
		if ( ! _.isString( contractAddress ) || _.isEmpty( contractAddress ) )
		{
			return false;
		}

		return this.nativeTokenAddress.trim().toLowerCase() === contractAddress.trim().toLowerCase();
	}


	/**
	 * 	get token item
	 *
	 * 	@example
	 * ```ts
	 * //
	 * //    switch chain/network to BNB Smart Chain Mainnet
	 * //
	 * const currentChainId = 56;
	 *
	 * const contractAddress : string = new TokenService( currentChainId ).nativeTokenAddress;
	 * const item = await new TokenService( currentChainId ).getItem( contractAddress );
	 * //    should return:
	 * {
	 *    chainId: 56,
	 *    symbol: 'BNB',
	 *    name: 'BNB',
	 *    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
	 *    decimals: 18,
	 *    logoURI: 'https://tokens.1inch.io/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c.png',
	 *    providers: [ '1inch', 'Curve Token List' ],
	 *    eip2612: false,
	 *    tags: [ 'native' ]
	 * }
	 * ```
	 *
	 * 	@group Extended Methods
	 *	@param contractAddress	{string} contract address
	 *	@returns {Promise<OneInchTokenItem | null>}
	 */
	public getItem( contractAddress : string ) : Promise<OneInchTokenItem | null>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! _.isNumber( this.chainId ) || this.chainId <= 0 )
				{
					return reject( `${ this.constructor.name }.getItem :: invalid chainId` );
				}
				if ( ! _.isString( contractAddress ) || _.isEmpty( contractAddress ) )
				{
					return reject( `${ this.constructor.name }.getItem :: invalid contractAddress` );
				}

				//	...
				contractAddress = contractAddress.trim().toLowerCase();

				//
				//	search item from local
				//
				const supportedChains = new OneInchTokenService( 1 ).supportedChains;
				if ( supportedChains.includes( this.chainId ) )
				{
					const { ethereumTokens } = await import( `../../resources/oneInchTokenMap.${ this.chainId }` );
					if ( _.isObject( ethereumTokens ) &&
						_.has( ethereumTokens, contractAddress ) )
					{
						const item = ethereumTokens[ contractAddress ];
						if ( _.isObject( item ) )
						{
							return resolve( item );
						}
					}
				}

				//
				//	fetch from internet
				//
				try
				{
					const item : OneInchTokenItem = await new OneInchTokenService( this.chainId ).fetchTokenItemInfo( contractAddress );
					if ( OneInchTokenService.isValid1InchTokenItem( item ) )
					{
						return resolve( item );
					}
				}
				catch ( err )
				{
				}

				//	...
				resolve( null );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	check if the token exists by contractAddress
	 *
	 * 	@group Extended Methods
	 *	@param contractAddress	{string} contract address
	 *	@returns {boolean}
	 */
	public exists( contractAddress : string ) : Promise<boolean>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				return resolve( Boolean( null !== await this.getItem( contractAddress ) ) );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}


	/**
	 * 	get the decimals value of a token
	 *
	 * 	@example
	 * ```ts
	 * //
	 * //    switch chain/network to Ethereum Mainnet
	 * //
	 * const currentChainId = 1;
	 *
	 * //    contract address of ETH
	 * const contractAddress : string = new TokenService( currentChainId ).nativeTokenAddress;
	 * const decimals = await new TokenService( currentChainId ).getItemDecimals( contractAddress );
	 * //    should return:
	 * 18
	 * ```
	 *
	 * 	@example
	 * ```ts
	 * //
	 * //    switch chain/network to Ethereum Mainnet
	 * //
	 * const currentChainId = 1;
	 *
	 * //    contract address of Tether USD
	 * const contractAddress : string = `0xdac17f958d2ee523a2206206994597c13d831ec7`;
	 * const decimals = await new TokenService( currentChainId ).getItemDecimals( contractAddress );
	 * //    should return:
	 * 6
	 * ```
	 * 	@group Extended Methods
	 * 	@param contractAddress	{string} contract address
	 * 	@returns {Promise<number>}
	 */
	public getItemDecimals( contractAddress : string ) : Promise<number>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const item : OneInchTokenItem | Object | null = await this.getItem( contractAddress );
				if ( item &&
					_.has( item, 'decimals' ) )
				{
					return resolve( MathUtil.intFromAny( item[ 'decimals' ] ) );
				}
			}
			catch ( err )
			{
			}

			return resolve( NaN );
		});
	}

	/**
	 * 	get the logo url of a token
	 *
	 * 	@example
	 * ```ts
	 * //
	 * //    switch chain/network to Ethereum Mainnet
	 * //
	 * const currentChainId = 1;
	 *
	 * const contractAddress : string = new TokenService( currentChainId ).nativeTokenAddress;
	 * const logoUrl = await new TokenService( currentChainId ).getItemLogo( contractAddress );
	 * //    should return:
	 * 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png'
	 * ```
	 *
	 * 	@group Extended Methods
	 * 	@param contractAddress	{string} contract address
	 * 	@returns {Promise<string | null>}
	 */
	public getItemLogo( contractAddress : string ) : Promise<string | null>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const item : OneInchTokenItem | Object | null = await this.getItem( contractAddress );
				if ( item &&
					_.has( item, 'logoURI' ) &&
					_.isString( item[ 'logoURI' ] ) )
				{
					return resolve( item[ 'logoURI' ] );
				}

				resolve( null );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}



	/**
	 * 	@hidden
	 */
	public get config() : NetworkModels
	{
		return super.config;
	}

	/**
	 * 	@hidden
	 */
	public getNetworkByChainId( chainId ?: number ) : string | null
	{
		return super.getNetworkByChainId( chainId );
	}

	/**
	 * 	@hidden
	 */
	public getEndpointByChainId( chainId ?: number ) : string
	{
		return super.getEndpointByChainId( chainId );
	}

	/**
	 * 	@hidden
	 */
	protected setChainMap( chainMap : RpcSupportedChainMap ) : void
	{
		super.setChainMap( chainMap );
	}

	/**
	 * 	@hidden
	 */
	protected setEndpoint( endpoint : string ) : void
	{
		super.setEndpoint( endpoint );
	}

	/**
	 * 	@hidden
	 */
	protected setVersion( version : string ) : void
	{
		super.setVersion( version );
	}

	/**
	 * 	@hidden
	 */
	protected setApiKey( apiKey : string ) : void
	{
		super.setApiKey( apiKey );
	}

	/**
	 * 	@hidden
	 */
	protected cloneConfig( config : NetworkModels ) : NetworkModels
	{
		return super.cloneConfig( config );
	}
}
