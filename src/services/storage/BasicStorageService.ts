/**
 * 	@category Storage Services
 * 	@module BasicStorageService
 */
import { CallbackModels } from "../../models/CallbackModels";
import { TestUtil, TypeUtil } from "debeem-utils";

if ( TestUtil.isTestEnv() )
{
	//import "fake-indexeddb/auto";
	require('fake-indexeddb/auto');
}

import { IStorageService } from "./IStorageService";
import { IDBPDatabase } from "idb/build/entry";
import { openDB, StoreNames } from "idb";
import _ from "lodash";
import { BasicEntity } from "../../entities/BasicEntity";


export class BasicStorageService implements IStorageService
{
	/**
	 *	@ignore
	 */
	protected db !: IDBPDatabase<BasicEntity>;

	/**
	 *	@ignore
	 *	@protected
	 */
	readonly databaseName : string = 'basic_entity';

	/**
	 *	@ignore
	 *	@protected
	 */
	readonly storeName : StoreNames<BasicEntity> = 'root';


	constructor()
	{
	}


	protected async init()
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( this.db )
				{
					return resolve( this.db );
				}

				//	...
				const storeName = this.storeName;
				this.db = await openDB<BasicEntity>
				(
					this.databaseName,
					1,
					{
						upgrade( db )
						{
							db.createObjectStore( storeName );
						},
					});
				if ( ! this.db )
				{
					return reject( `${ this.constructor.name }.init :: null db` );
				}

				//	...
				resolve( this.db );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	check if the input item is valid
	 *
	 *	@param item		{any}
	 *	@param [callback]	{CallbackModels}
	 *	@returns {boolean}
	 */
	public isValidItem( item : any, callback ?: CallbackModels ) : boolean
	{
		return _.isString( item );
	}

	/**
	 * 	get storage key by item object
	 *
	 * 	@group Basic Methods
	 *	@param _value		{string}
	 *	@returns {string | null}
	 */
	public getKeyByItem( _value : string ) : string | null
	{
		throw new Error( `${ this.constructor.name }.getKeyByItem :: this method has been deprecated and it is forbidden to call.` );
	}

	/**
	 * 	get item
	 *	@param key	{string}
	 *	@returns {Promise<ChainEntityItem | null>}
	 */
	public async get( key : string ) : Promise<string | null>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! _.isString( key ) || _.isEmpty( key ) )
				{
					return reject( `${ this.constructor.name }.get :: invalid key` );
				}

				await this.init();
				if ( this.db )
				{
					const value : string | undefined = await this.db.get( 'root', key );
					return resolve( value ? value : null );
				}

				reject( null );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	get all keys
	 *
	 *	@param [query]		{string}
	 *	@param [maxCount]	{number}
	 *	@returns {Promise<Array<string>>}
	 */
	public async getAllKeys( query? : string, maxCount? : number ) : Promise<Array<string>>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				await this.init();
				if ( this.db )
				{
					const value : Array<string> | null = await this.db.getAllKeys( 'root', query, maxCount );
					return resolve( value ? value : [] );
				}

				//	...
				reject( [] );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	get all items
	 *
	 * 	@param [query]		{string}
	 * 	@param [maxCount]	{number}
	 * 	@returns {Promise<Array<string>>}
	 */
	public async getAll( query? : string, maxCount? : number ) : Promise<Array<string>>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				await this.init();
				if ( this.db )
				{
					const value : Array<string> | null = await this.db.getAll( 'root', query, maxCount );
					return resolve( value ? value : [] );
				}

				//	...
				reject( [] );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	put a value by key
	 *
	 * 	@param key	{string}
	 *	@param value	{string}
	 *	@returns {Promise<boolean>}
	 */
	public async put( key : string, value : string ) : Promise<boolean>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! _.isString( key ) || _.isEmpty( key ) )
				{
					return reject( `${ this.constructor.name }.put :: invalid key` );
				}
				if ( ! this.isValidItem( value ) )
				{
					return reject( `${ this.constructor.name }.put :: invalid value` );
				}

				//	...
				await this.init();
				if ( this.db )
				{
					await this.db.put( 'root', value, key );
					return resolve( true );
				}

				//	...
				reject( false );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	get the first item
	 *
	 * 	@returns {Promise<string | null>}
	 */
	public async getFirst() : Promise<string | null>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const firstItems : Array<string> | null = await this.getAll( undefined, 1 );
				if ( Array.isArray( firstItems ) && 1 === firstItems.length )
				{
					return resolve( firstItems[ 0 ] );
				}

				//	...
				reject( null );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 *	calculate the number of data sets
	 *
	 *	@param [query]	{string}
	 *	@returns {Promise<number>}
	 */
	public async count( query? : string ) : Promise<number>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				await this.init();
				if ( this.db )
				{
					const count : number = await this.db.count( this.storeName, query );
					resolve( count );
				}

				//	...
				resolve( 0 );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 *	@param key	- wallet address is the key
	 *	@returns {Promise<boolean>}
	 */
	public async delete( key : string ) : Promise<boolean>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! TypeUtil.isNotEmptyString( key ) )
				{
					return reject( `${ this.constructor.name }.delete :: invalid key` );
				}

				await this.init();
				if ( this.db )
				{
					await this.db.delete( 'root', key );
					return resolve( true );
				}

				reject( false );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	delete all items
	 * 	@returns {Promise<boolean>}
	 */
	public async clear() : Promise<boolean>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				await this.init();
				if ( this.db )
				{
					await this.db.clear( 'root' );
					return resolve( true );
				}

				//	...
				reject( false );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}
}
