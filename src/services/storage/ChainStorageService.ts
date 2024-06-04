/**
 * 	@category Storage Services
 * 	@module ChainStorageService
 */
import { IStorageService } from "./IStorageService";

if ( typeof process !== 'undefined' && process.env )
{
	//import "fake-indexeddb/auto";
	require('fake-indexeddb/auto');
}

import { TypeUtil } from "debeem-utils";
import { ChainEntityItem } from "../../entities/ChainEntity";
import { defaultChains } from '../../constants/ConstantChain';
import { AbstractStorageService } from "./AbstractStorageService";
import { CallbackModels } from "../../models/CallbackModels";
import { VerifyUtil } from "../../utils/VerifyUtil";


export class ChainStorageService extends AbstractStorageService<ChainEntityItem> implements IStorageService
{
	constructor( pinCode : string = '' )
	{
		super( 'chain_entity', pinCode );
	}

	// private async init()
	// {
	// 	if ( this.db )
	// 	{
	// 		return this.db;
	// 	}
	//
	// 	return this.db = await openDB<ChainEntity>
	// 	(
	// 		'chain_entity',
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
	// 			walletStore.createIndex( 'by-chainId', 'chainId' );
	// 		},
	// 	});
	// }

	public isValidRpcItem( item : any, callback ?: CallbackModels ) : boolean
	{
		if ( ! VerifyUtil.returnNotNullObject( item, callback, `null rpcItem` ) )
		{
			return false;
		}
		if ( ! VerifyUtil.returnNotEmptyString( item.name, callback, `empty .name` ) )
		{
			return false;
		}
		if ( ! VerifyUtil.returnNotEmptyString( item.url, callback, `empty .url` ) )
		{
			return false;
		}
		if ( ! TypeUtil.isValidUrl( item.url ) )
		{
			return VerifyUtil.setErrorDesc( callback, `invalid .url` );
		}
		if ( ! TypeUtil.isBoolean( item.selected ) )
		{
			return VerifyUtil.setErrorDesc( callback, `invalid .selected` );
		}

		return true;
	}
	public isValidItem( item : any, callback ?: CallbackModels ) : boolean
	{
		if ( ! VerifyUtil.returnNotNullObject( item, callback, `null item` ) )
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
		if ( ! VerifyUtil.returnNotEmptyString( item.token, callback, `empty .token` ) )
		{
			return false;
		}
		if ( ! Array.isArray( item.rpcs ) )
		{
			return VerifyUtil.setErrorDesc( callback, `invalid .rpcs` );
		}
		for ( const i in item.rpcs )
		{
			let itemErrorDesc : string | null = ``;
			if ( ! this.isValidRpcItem( item.rpcs[ i ], ( desc ) =>
				{
					itemErrorDesc = desc;
				} )
			)
			{
				return VerifyUtil.setErrorDesc( callback, `invalid .rpcs[${ i }] : ${ itemErrorDesc }` );
			}
		}

		return true;
	}

	public getDefault() : Array<ChainEntityItem>
	{
		return defaultChains;
	}

	/**
	 * 	flush the default data into database
	 */
	public flushDefault() : Promise<boolean>
	{
		return new Promise( async ( resolve, reject) =>
		{
			try
			{
				for ( const item of this.getDefault() )
				{
					if ( ! this.isValidItem( item ) )
					{
						continue;
					}

					const checkItem : ChainEntityItem | null = await this.getByChainId( item.chainId );
					if ( ! this.isValidItem( checkItem ) )
					{
						const key : string | null = this.getKeyByItem( item );
						if ( key && TypeUtil.isNotEmptyString( key ) )
						{
							await this.put( key, item );
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
	public getKeyByItem( value : ChainEntityItem ) : string | null
	{
		if ( this.isValidItem( value ) )
		{
			return this.getKeyByChainId( value.chainId );
		}

		return null;
	}
	public getKeyByChainId( chainId : number ) : string
	{
		return `chain-${ chainId }`;
	}

	// /**
	//  *	Put an item into database. replaces the item with the same key.
	//  * 	value.chainId will be the storage key
	//  *	@param value
	//  *	@param key
	//  */
	// public async put( value : ChainEntityItem, key?: string ) : Promise<boolean>
	// {
	// 	return new Promise( async ( resolve, reject ) =>
	// 	{
	// 		try
	// 		{
	// 			if ( ! this.isValidItem( value ) )
	// 			{
	// 				return reject( `invalid value for ChainStorage:put` );
	// 			}
	//
	// 			//	...
	// 			await this.init();
	// 			if ( this.db )
	// 			{
	// 				const key = this.getKeyByItem( value );
	// 				if ( ! key || ! TypeUtil.isNotEmptyString( key ) )
	// 				{
	// 					return reject( `invalid storage key` );
	// 				}
	//
	// 				const encrypted : string = await this.encryptFromObject( value );
	// 				await this.db.put( 'root', encrypted, key );
	// 				return resolve( true );
	// 			}
	//
	// 			//	...
	// 			reject( false );
	// 		}
	// 		catch ( err )
	// 		{
	// 			reject( err );
	// 		}
	// 	});
	// }
	//
	// public async getFirst() : Promise<ChainEntityItem | null>
	// {
	// 	return new Promise( async ( resolve, reject ) =>
	// 	{
	// 		try
	// 		{
	// 			const firstItems : Array<ChainEntityItem> | null = await this.getAll( undefined, 1 );
	// 			if ( Array.isArray( firstItems ) && 1 === firstItems.length )
	// 			{
	// 				return resolve( firstItems[ 0 ] );
	// 			}
	//
	// 			//	...
	// 			reject( null );
	// 		}
	// 		catch ( err )
	// 		{
	// 			reject( err );
	// 		}
	// 	});
	// }

	public async getByChainId( chainId : number ) : Promise<ChainEntityItem | null>
	{
		const key : string = this.getKeyByChainId( chainId );
		return this.get( key );
	}

	// public async get( key : string ) : Promise<ChainEntityItem | null>
	// {
	// 	return new Promise( async ( resolve, reject ) =>
	// 	{
	// 		try
	// 		{
	// 			if ( ! TypeUtil.isNotEmptyString( key ) )
	// 			{
	// 				return reject( `invalid key for ChainStorage:get` );
	// 			}
	//
	// 			await this.init();
	// 			if ( this.db )
	// 			{
	// 				const value : ChainEntityItem | undefined = await this.db.get( 'root', key );
	// 				return resolve( value ? value : null );
	// 			}
	//
	// 			//	...
	// 			reject( null );
	// 		}
	// 		catch ( err )
	// 		{
	// 			reject( err );
	// 		}
	// 	});
	// }
	//
	// public async getAllKeys( query? : string, maxCount? : number ) : Promise<Array<string> | null>
	// {
	// 	return new Promise( async ( resolve, reject ) =>
	// 	{
	// 		try
	// 		{
	// 			await this.init();
	// 			if ( this.db )
	// 			{
	// 				const value : Array<string> | null = await this.db.getAllKeys( 'root', query, maxCount );
	// 				return resolve( value ? value : null );
	// 			}
	//
	// 			//	...
	// 			reject( null );
	// 		}
	// 		catch ( err )
	// 		{
	// 			reject( err );
	// 		}
	// 	});
	// }
	//
	// public async getAll( query? : string, maxCount? : number ) : Promise<Array<ChainEntityItem> | null>
	// {
	// 	return new Promise( async ( resolve, reject ) =>
	// 	{
	// 		try
	// 		{
	// 			await this.init();
	// 			if ( this.db )
	// 			{
	// 				const value : Array<ChainEntityItem> | null = await this.db.getAll( 'root', query, maxCount );
	// 				return resolve( value ? value : null );
	// 			}
	//
	// 			//	...
	// 			reject( null );
	// 		}
	// 		catch ( err )
	// 		{
	// 			reject( err );
	// 		}
	// 	});
	// }
	//
	// /**
	//  *	@param key	- wallet address is the key
	//  */
	// public async delete( key : string ) : Promise<boolean>
	// {
	// 	return new Promise( async ( resolve, reject ) =>
	// 	{
	// 		try
	// 		{
	// 			if ( ! TypeUtil.isNotEmptyString( key ) )
	// 			{
	// 				return reject( `invalid key for ChainStorage:delete` );
	// 			}
	//
	// 			await this.init();
	// 			if ( this.db )
	// 			{
	// 				await this.db.delete( 'root', key );
	// 				return resolve( true );
	// 			}
	//
	// 			reject( false );
	// 		}
	// 		catch ( err )
	// 		{
	// 			reject( err );
	// 		}
	// 	});
	// }
	//
	// /**
	//  * 	delete all items
	//  */
	// public async clear() : Promise<boolean>
	// {
	// 	return new Promise( async ( resolve, reject ) =>
	// 	{
	// 		try
	// 		{
	// 			await this.init();
	// 			if ( this.db )
	// 			{
	// 				await this.db.clear( 'root' );
	// 				return resolve( true );
	// 			}
	//
	// 			//	...
	// 			reject( false );
	// 		}
	// 		catch ( err )
	// 		{
	// 			reject( err );
	// 		}
	// 	});
	// }
}
