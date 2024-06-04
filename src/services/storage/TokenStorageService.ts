/**
 * 	@category Storage Services
 * 	@module TokenStorageService
 */
import { VerifyUtil } from "../../utils/VerifyUtil";

if ( typeof process !== 'undefined' && process.env )
{
	//import "fake-indexeddb/auto";
	require('fake-indexeddb/auto');
}

import { isAddress } from "ethers";
import { TypeUtil } from "debeem-utils";
import { TokenEntityItem } from "../../entities/TokenEntity";
import { defaultTokens } from "../../constants/ConstantToken";
import { AbstractStorageService } from "./AbstractStorageService";
import { CallbackModels } from "../../models/CallbackModels";
import { IStorageService } from "./IStorageService";


export class TokenStorageService extends AbstractStorageService<TokenEntityItem> implements IStorageService
{
	constructor( pinCode : string = '' )
	{
		super( 'token_entity', pinCode );
	}

	// private async init()
	// {
	// 	if ( this.db )
	// 	{
	// 		return this.db;
	// 	}
	//
	// 	return this.db = await openDB<TokenEntity>
	// 	(
	// 		'token_entity',
	// 		1,
	// 		{
	// 		upgrade( db )
	// 		{
	// 			// const walletStore = db.createObjectStore('wallet', {
	// 			// 	//	The 'name' property of the object will be the key.
	// 			// 	keyPath: 'name',
	// 			// 	autoIncrement : false,
	// 			// } );
	//
	// 			//
	// 			//	key is a random sha256 value
	// 			//
	// 			const walletStore = db.createObjectStore('root' );
	// 			walletStore.createIndex( 'by-address', 'address' );
	// 		},
	// 	});
	// }

	public isValidItem( item : any, callback ?: CallbackModels ) : boolean
	{
		if ( ! VerifyUtil.returnNotNullObject( item, callback, `null item` ) )
		{
			return false;
		}
		if ( ! VerifyUtil.returnNotEmptyString( item.wallet, callback, `empty .wallet` ) )
		{
			return false;
		}
		if ( ! VerifyUtil.returnNotEmptyString( item.name, callback, `empty .name` ) )
		{
			return false;
		}
		if ( ! VerifyUtil.returnNotGreaterThanNumeric( item.chainId, 0, callback, `invalid .chainId` ) )
		{
			return false;
		}
		if ( ! isAddress( item.address ) )
		{
			VerifyUtil.setErrorDesc( callback, `invalid .address` );
			return false;
		}
		if ( ! VerifyUtil.returnNotEmptyString( item.symbol, callback, `empty .symbol` ) )
		{
			return false;
		}
		if ( ! VerifyUtil.returnNotGreaterThanNumeric( item.decimals, 0, callback, `invalid .decimals` ) )
		{
			return false;
		}

		return true;
	}

	/**
	 *	@param wallet	{string} wallet address
	 *	@return {Array<TokenEntityItem>}
	 */
	public getDefault( wallet : string ) : Array<TokenEntityItem>
	{
		if ( ! TypeUtil.isNotEmptyString( wallet ) )
		{
			throw new Error( `invalid wallet` );
		}

		let tokens : Array<TokenEntityItem> = [];
		for ( let item of defaultTokens )
		{
			item.wallet = wallet;
			tokens.push( item );
		}

		return tokens;
	}

	/**
	 * 	flush the default data into database
	 *	@param wallet	{string} wallet address
	 */
	public flushDefault( wallet : string ) : Promise<boolean>
	{
		return new Promise( async ( resolve, reject) =>
		{
			try
			{
				if ( ! TypeUtil.isNotEmptyString( wallet ) )
				{
					return reject( `invalid wallet` );
				}

				for ( let item of this.getDefault( wallet ) )
				{
					if ( ! this.isValidItem( item ) )
					{
						continue;
					}

					const key : string | null = this.getKeyByItem( item );
					if ( key )
					{
						const checkItem : TokenEntityItem | null = await this.get( key );
						if ( ! this.isValidItem( checkItem ) )
						{
							const key : string | null = this.getKeyByItem( item );
							if ( key && TypeUtil.isNotEmptyString( key ) )
							{
								//	set wallet address and put
								item.wallet = wallet;
								await this.put( key, item );
							}
						}
					}
				}

				//	...
				resolve( true );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	get storage key
	 *	@param value
	 */
	public getKeyByItem( value : TokenEntityItem ) : string | null
	{
		if ( this.isValidItem( value ) )
		{
			return value.address;
		}

		return null;
	}


	/**
	 *	@param wallet	{string} wallet address
	 *	@return {Promise<TokenEntityItem | null>}
	 */
	public async getFirstByWallet( wallet : string ) : Promise<TokenEntityItem | null>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const values = await this.getAllByWallet( wallet );
				if ( Array.isArray( values ) && values.length > 0 )
				{
					return resolve( values[ 0 ] );
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
	 *	@param wallet	{string} wallet address
	 *	@param query	{string}
	 *	@param maxCount	{number}
	 *	@return {Promise<Array<string> | null>}
	 */
	public async getAllKeysByWallet( wallet : string, query? : string, maxCount? : number ) : Promise<Array<string> | null>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! TypeUtil.isNotEmptyString( wallet ) )
				{
					return reject( `invalid wallet` );
				}

				const values = await this.getAllByWallet( wallet, query, maxCount );
				if ( Array.isArray( values ) )
				{
					let keys : Array<string> = [];
					for ( const item of values )
					{
						const key : string | null = this.getKeyByItem( item );
						if ( key && TypeUtil.isNotEmptyString( key ) )
						{
							keys.push( key );
						}
					}
					return resolve( keys );
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
	 *	@param wallet	{string} wallet address
	 *	@param query	{string}
	 *	@param maxCount	{number}
	 *	@return {Promise<Array<TokenEntityItem> | null>}
	 */
	public async getAllByWallet( wallet : string, query? : string, maxCount? : number ) : Promise<Array<TokenEntityItem> | null>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! TypeUtil.isNotEmptyString( wallet ) )
				{
					return reject( `invalid wallet` );
				}

				const rawValues = await super.getAll( query, maxCount );
				if ( Array.isArray( rawValues ) )
				{
					let values : Array<TokenEntityItem> = [];
					for ( const item of rawValues )
					{
						if ( item &&
							TypeUtil.isNotEmptyString( item.wallet ) &&
							item.wallet.trim().toLowerCase() === wallet.trim().toLowerCase() )
						{
							values.push( item );
						}
					}
					return resolve( values );
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
	 *	@param wallet	{string} wallet address
	 */
	public async clearByWallet( wallet : string ) : Promise<boolean>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! TypeUtil.isNotEmptyString( wallet ) )
				{
					return reject( `invalid wallet` );
				}

				const keys : Array<string> | null = await this.getAllKeysByWallet( wallet );
				if ( Array.isArray( keys ) )
				{
					for ( const key of keys )
					{
						await this.delete( key );
					}
				}

				resolve( true );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 *	@param wallet	{string} wallet address
	 *	@param query	{string}
	 *	@return {Promise<number>}
	 */
	public async countByWallet( wallet : string, query? : string ) : Promise<number>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! TypeUtil.isNotEmptyString( wallet ) )
				{
					return reject( `invalid wallet` );
				}

				const keys : Array<string> | null = await this.getAllKeysByWallet( wallet );
				resolve( Array.isArray( keys ) ? keys.length : 0 );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}



	/**
	 * 	@deprecated
	 */
	public async getFirst() : Promise<TokenEntityItem | null>
	{
		throw new Error( `this method has been deprecated and it is forbidden to call.` );
	}

	/**
	 * 	@deprecated
	 */
	public async getAllKeys( query? : string, maxCount? : number ) : Promise<Array<string> | null>
	{
		throw new Error( `this method has been deprecated and it is forbidden to call.` );
	}

	/**
	 * 	@deprecated
	 */
	public async getAll( query? : string, maxCount? : number ) : Promise<Array<TokenEntityItem | null> | null>
	{
		throw new Error( `this method has been deprecated and it is forbidden to call.` );
	}

	/**
	 * 	@deprecated
	 */
	public async clear() : Promise<boolean>
	{
		throw new Error( `this method has been deprecated and it is forbidden to call.` );
	}

	/**
	 * 	@deprecated
	 */
	public async count( query? : string ) : Promise<number>
	{
		throw new Error( `this method has been deprecated and it is forbidden to call.` );
	}
}
