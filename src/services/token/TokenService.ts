/**
 * 	@category Token Services
 * 	@module TokenService
 */
import { MathUtil } from "debeem-utils";
import _ from "lodash";
import {getCurrentChain} from "../../config";
import {OneInchTokenService} from "../rpcs/oneInchToken/OneInchTokenService";
import {OneInchTokenItem} from "../../models/TokenModels";


/**
 * 	class TokenService
 */
export class TokenService
{
	/**
	 * 	get token item
	 *
	 *	@param contractAddress	{string} contract address
	 *	@returns {Promise<OneInchTokenItem | Object | null>}
	 */
	public getItem( contractAddress : string ) : Promise<OneInchTokenItem | Object | null>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const chainId = getCurrentChain();
				if ( ! _.isNumber( chainId ) || chainId <= 0 )
				{
					return reject( `${ this.constructor.name }.getItem :: invalid chainId` );
				}
				if ( ! _.isString( contractAddress ) || _.isEmpty( contractAddress ) )
				{
					return reject( `${ this.constructor.name }.getItem :: invalid contractAddress` );
				}

				contractAddress = contractAddress.trim().toLowerCase();

				//
				//	search item from local
				//
				const supportedChains = new OneInchTokenService( 1 ).supportedChains;
				if ( supportedChains.includes( chainId ) )
				{
					const { ethereumTokens } = await import( `../../resources/oneInchTokenMap.${ chainId }` );
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
					const item = await new OneInchTokenService( chainId ).fetchTokenCustomInfo( contractAddress );
					if ( _.isObject( item ) )
					{
						return resolve( item );
					}
				}
				catch ( err )
				{
				}

				//	...
				return null;
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

				return resolve( null );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}


	/**
	 * 	get the contract address of the native token
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
}
