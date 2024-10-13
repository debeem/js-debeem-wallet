/**
 * 	@category Rpc Services
 * 	@module OneInchTokenService
 */
import { FetchUtil, FetchOptions, HttpUtil } from "debeem-utils";
import { FetchResponse } from "ethers";
import { AbstractRpcService } from "../AbstractRpcService";
import { IRpcService } from "../IRpcService";
import { oneInch } from "../../../config";
import { NetworkModels } from "../../../models/NetworkModels";
import { defaultOneInchTokenLogoItem, OneInchTokenItem, OneInchTokenMap } from "../../../models/TokenModels";
import _ from "lodash";

/**
 * 	@class OneInchTokenService
 *
 * 	@remark
 * 	https://portal.1inch.dev/documentation/authentication
 */
export class OneInchTokenService extends AbstractRpcService implements IRpcService
{
	/**
	 *	@param chainId {number} the chainId number. defaults to getCurrentChain()
	 */
	constructor( chainId ?: number )
	{
		super( chainId );
		this.setChainMap({
			1 : "mainnet",		//	Ethereum mainnet
			42161 : "arb1",		//	Arbitrum One
			1313161554 : "aurora",	//	Aurora Mainnet
			43114 : "avax",		//	Avalanche C-Chain
			8453 : "base",		//	Base
			56 : "bnb",		//	BNB Smart Chain Mainnet
			324 : "zksync",		//	zkSync Era Mainnet
			250 : "ftm",		//	Fantom Opera
			100 : "gno",		//	Gnosis
			8217 : "cypress",	//	Klaytn Mainnet Cypress
			10 : "oeth",		//	OP Mainnet
			137 : "matic",		//	Polygon Mainnet
		});


		//	load config
		//	it will check whether the network specified by chainId can be supported
		this._config = this.cloneConfig( oneInch );

		this.setEndpoint( this.getEndpointByChainId( this.chainId ) );
		this.setVersion( "v1.2" );
		this.setApiKey( oneInch.apiKey );
	}

	public get config() : NetworkModels
	{
		return this._config;
	}

	/**
	 * 	set end point by chainId
	 *
	 * 	@group Basic Methods
	 * 	@param chainId {number} the chainId number
	 *	@returns {string}
	 */
	public getEndpointByChainId( chainId ?: number ) : string
	{
		return `https://api.1inch.dev`;
	}

	/**
	 * 	fetch token custom info
	 *
	 *	@param contractAddress	{string} contract address
	 *	@returns {Promise<OneInchTokenItem>}
	 */
	public async fetchTokenItemInfo( contractAddress : string ) : Promise<OneInchTokenItem>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! _.isNumber( this.chainId ) || this.chainId <= 0 )
				{
					return reject( `${ this.constructor.name }.fetchTokenItemInfo :: invalid chainId` );
				}

				//	https://api.1inch.dev/token/v1.2/1/custom/0x491e136ff7ff03e6ab097e54734697bb5802fc1c
				//	/token/v1.2/{chain_id}/custom/{addresses}
				const url = `${ this.endpoint }/token/${ this.version }/${ this.chainId }/custom/${ contractAddress }`;
				const options : FetchOptions = {
					url : url,
					timeout : 5 * 60 * 1000,
					accept : `application/json`,
					headers : [
						{ key : 'Authorization', value : `Bearer ${ this.apiKey }` }
					]
				};
				const response : FetchResponse = await FetchUtil.getRequest( options );
				if ( ! response || ! _.isObject( response.bodyJson ) )
				{
					return reject( `${ this.constructor.name }.fetchTokenItemInfo :: invalid response` );
				}

				const tokenItem : any = {
					...response.bodyJson,
					logo : defaultOneInchTokenLogoItem,
				}
				if ( ! OneInchTokenService.isValid1InchTokenItem( tokenItem ) )
				{
					return reject( `${ this.constructor.name }.fetchTokenItemInfo :: invalid 1inch token item` );
				}

				//
				//	{
				//		"id": 385599,
				//		"symbol": "KTN",
				//		"name": "Kattana",
				//		"address": "0x491e136ff7ff03e6ab097e54734697bb5802fc1c",
				//		"decimals": 18,
				//		"logoURI": "https://tokens.1inch.io/0x491e136ff7ff03e6ab097e54734697bb5802fc1c.png",
				//		"rating": 3,
				//		"eip2612": null,
				//		"tags": [
				//			{
				//				"value": "tokens",
				//				"provider": "1inch"
				//			}
				//		],
				//		"providers": [
				//			"1inch",
				//			"Trust Wallet Assets",
				//			"Zapper Token List"
				//		]
				//	}
				//
				return resolve( tokenItem as OneInchTokenItem );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	fetch token map/list
	 *
	 *	@returns {Promise<OneInchTokenMap>}
	 */
	public async fetchTokenMap() : Promise<OneInchTokenMap>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! _.isNumber( this.chainId ) || this.chainId <= 0 )
				{
					return reject( `${ this.constructor.name }.fetchTokenMap :: invalid chainId` );
				}

				//	https://api.1inch.dev/token/v1.2/{chain_id}
				const url = `${ this.endpoint }/token/${ this.version }/${ this.chainId }`;
				const options : FetchOptions = {
					url : url,
					timeout : 5 * 60 * 1000,
					accept : `application/json`,
					headers : [
						{ key : 'Authorization', value : `Bearer ${ this.apiKey }` }
					]
				};
				const response : FetchResponse = await FetchUtil.getRequest( options );
				console.log( `fetchTokenMap url: `, url );
				console.log( `fetchTokenMap options: `, options );
				//console.log( `fetchTokenMap response: `, response );
				console.log( `fetchTokenMap response.bodyJson: `, response.bodyJson );
				if ( ! response || ! response.bodyJson || ! _.isObject( response.bodyJson ) )
				{
					return reject(`invalid response`);
				}

				const body : any = response.bodyJson;
				let res : OneInchTokenMap = {};
				for ( const key in body )
				{
					if ( ! _.isObject( body[ key ] ) )
					{
						return reject( `${ this.constructor.name }.fetchTokenMap :: invalid 1inch token item by body[ key ]` );
					}

					const item = {
						...body[ key ],
						logo : defaultOneInchTokenLogoItem
					};
					if ( OneInchTokenService.isValid1InchTokenItem( item ) )
					{
						const contractAddress = key.trim().toLowerCase();
						res[ contractAddress ] = item;
					}
					else
					{
						console.log( `key: ${ key }, item: `, item );
						return reject( `${ this.constructor.name }.fetchTokenMap :: invalid resource 1inch token item` );
					}
				}

				//	...
				resolve( res );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	check if the input object is a valid OneInchTokenItem
	 *
	 *	@param item	{ [ key : string ] : any | null } the object to be checked
	 *	@returns {boolean}
	 */
	public static isValid1InchTokenItem( item : { [ key : string ] : any } | null ) : boolean
	{
		if ( ! _.isObject( item ) )
		{
			return false;
		}

		if ( ! _.isNumber( item.chainId ) || item.chainId <= 0 )
		{
			return false;
		}
		if ( ! _.isString( item.symbol ) || _.isEmpty( item.symbol ) )
		{
			return false;
		}
		if ( ! _.isString( item.name ) || _.isEmpty( item.name ) )
		{
			return false;
		}
		if ( ! _.isString( item.address ) || _.isEmpty( item.address ) )
		{
			return false;
		}
		if ( ! _.isNumber( item.decimals ) )
		{
			return false;
		}
		if ( _.isString( item.logoURI ) && ! _.isEmpty( item.logoURI ) )
		{
			if ( ! HttpUtil.isValidUrl( item.logoURI ) )
			{
				return false;
			}
		}
		if ( ! this.isValid1InchTokenLogoItem( item.logo ) )
		{
			return false;
		}

		if ( ! Array.isArray( item.providers ) )
		{
			return false;
		}
		if ( undefined !== item.eip2612 )
		{
			if ( ! _.isBoolean( item.eip2612 ) )
			{
				return false;
			}
		}
		if ( undefined !== item.isFoT )
		{
			if ( ! _.isBoolean( item.isFoT ) )
			{
				return false;
			}
		}
		if ( ! Array.isArray( item.tags ) )
		{
			return false;
		}

		//	...
		return true;
	}

	/**
	 * 	check if the input value is a valid OneInchTokenLogoItem
	 *
	 *	@param logoItem		{ { [ key : string ] : any } | null }
	 *	@returns {boolean}
	 */
	public static isValid1InchTokenLogoItem( logoItem : { [ key : string ] : any } | null ) : boolean
	{
		if ( ! _.isObject( logoItem ) )
		{
			return false;
		}
		// if ( ! _.isString( logoItem.oneInch ) )
		// {
		// 	return false;
		// }
		// if ( ! _.isString( logoItem.metaBeem ) )
		// {
		// 	return false;
		// }
		if ( undefined !== logoItem.base64 )
		{
			if ( ! _.isString( logoItem.base64 ) )
			{
				return false;
			}
		}

		return true;
	}
}
