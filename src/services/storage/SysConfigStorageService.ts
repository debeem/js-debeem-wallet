/**
 * 	@category Storage Services
 * 	@module SysConfigStorageService
 */
import { TestUtil } from "debeem-utils";


if ( TestUtil.isTestEnv() )
{
	//import "fake-indexeddb/auto";
	require( 'fake-indexeddb/auto' );
}

import _, { parseInt } from "lodash";
import { openDB, StoreNames } from "idb";
import { IDBPDatabase } from "idb/build/entry";
import { AesCrypto } from "debeem-cipher";
import { SysConfigEntity } from "../../entities/SysConfigEntity";
import { IStorageService } from "./IStorageService";
import { CallbackModels } from "../../models/CallbackModels";


/**
 * 	@class
 */
export class SysConfigStorageService implements IStorageService
{
	/**
	 *	@ignore
	 */
	protected sysDb ! : IDBPDatabase<SysConfigEntity>;

	/**
	 *	@ignore
	 */
	protected databaseName : string = 'sys_config_entity';

	/**
	 *	@ignore
	 */
	protected storeName : StoreNames<SysConfigEntity> = 'root';


	constructor()
	{
	}

	/**
	 * 	initialize table
	 *
	 * 	@ignore
	 * 	@returns {Promise< IDBPDatabase<SysConfigEntity> | null >}
	 */
	protected async initDb() : Promise<IDBPDatabase<SysConfigEntity> | null>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( this.sysDb )
				{
					return resolve( this.sysDb );
				}
				if ( !_.isString( this.databaseName ) || _.isEmpty( this.databaseName ) )
				{
					return resolve( null );
				}

				const storeName = this.storeName;
				this.sysDb = await openDB<SysConfigEntity>
				(
					this.databaseName,
					1,
					{
						upgrade( db )
						{
							db.createObjectStore( storeName );
						},
					} );
				if ( !this.sysDb )
				{
					return reject( `${ this.constructor.name }.initDb :: null sysDb` );
				}

				return resolve( this.sysDb );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 * 	check if the input value is a valid SysConfigItem
	 *	@param item	{any}
	 *	@returns {boolean}
	 */
	public isValidItem( item : any ) : boolean
	{
		return _.isString( item );
	}

	/**
	 * 	get int config value
	 * 	@param key	{string}
	 * 	@returns {number}
	 */
	public async getConfigInt( key : string ) : Promise<number | undefined>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const value : string | undefined = await this.getConfig( key );
				if ( _.isString( value ) )
				{
					return resolve( parseInt( value ) );
				}

				resolve( undefined );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 * 	get float config value
	 * 	@param key	{string}
	 * 	@returns {number}
	 */
	public async getConfigFloat( key : string ) : Promise<number | undefined>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const value : string | undefined = await this.getConfig( key );
				if ( _.isString( value ) )
				{
					return resolve( parseFloat( value ) );
				}

				resolve( undefined );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 * 	get config
	 *	@param key	{string}
	 *	@returns {Promise<string | undefined>}
	 */
	public async getConfig( key : string ) : Promise<string | undefined>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( !_.isString( key ) || _.isEmpty( key ) )
				{
					return reject( `${ this.constructor.name }.getConfig :: invalid key` );
				}

				if ( !await this.initDb() )
				{
					return reject( `${ this.constructor.name }.getConfig :: failed to init db` );
				}
				await TestUtil.sleep( 1 );

				//	...
				const item : string | undefined = await this.sysDb.get( this.storeName, key );
				resolve( item );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 * 	put config
	 *	@param key	{string}
	 *	@param item	{string}
	 *	@returns {Promise<boolean>}
	 */
	public async putConfig( key : string, item : string ) : Promise<boolean>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( !_.isString( key ) || _.isEmpty( key ) )
				{
					return reject( `${ this.constructor.name }.putConfig :: invalid key` );
				}
				if ( !this.isValidItem( item ) )
				{
					return reject( `${ this.constructor.name }.putConfig :: invalid item` );
				}

				if ( !await this.initDb() )
				{
					return reject( `${ this.constructor.name }.putConfig :: failed to init db` );
				}
				await TestUtil.sleep( 1 );

				//	...
				await this.sysDb.put( this.storeName, item, key );
				return resolve( true );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 * 	delete all items
	 *
	 * 	@group Basic Methods
	 * 	@returns {Promise<boolean>}
	 */
	public async clear() : Promise<boolean>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( !await this.initDb() )
				{
					return reject( `${ this.constructor.name }.clear :: failed to init db` );
				}
				await TestUtil.sleep( 1 );

				//	...
				await this.sysDb.clear( this.storeName );
				return resolve( true );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}


	public getKeyByItem( value : any ) : string | null
	{
		throw new Error( "Method not implemented." );
	}

	public get( key : string ) : Promise<any>
	{
		throw new Error( "Method not implemented." );
	}

	public getFirst() : Promise<any>
	{
		throw new Error( "Method not implemented." );
	}

	public getAllKeys( query? : string | undefined, maxCount? : number | undefined ) : Promise<string[]>
	{
		throw new Error( "Method not implemented." );
	}

	public getAll( query? : string | undefined, maxCount? : number | undefined ) : Promise<any[]>
	{
		throw new Error( "Method not implemented." );
	}

	public put( key : string, value : any ) : Promise<boolean>
	{
		throw new Error( "Method not implemented." );
	}

	public delete( key : string ) : Promise<boolean>
	{
		throw new Error( "Method not implemented." );
	}

	public count( query? : string | undefined ) : Promise<number>
	{
		throw new Error( "Method not implemented." );
	}
}
