/**
 * 	@category Storage Services
 * 	@module SysConfigStorageService
 */
import { TestUtil } from "debeem-utils";

if ( TestUtil.isTestEnv() )
{
	//import "fake-indexeddb/auto";
	require('fake-indexeddb/auto');
}

import _, { parseInt } from "lodash";
import { openDB, StoreNames } from "idb";
import { IDBPDatabase } from "idb/build/entry";
import { AesCrypto } from "debeem-cipher";
import { SysConfigEntity } from "../../entities/SysConfigEntity";


/**
 * 	@class
 */
export class SysConfigStorageService
{
	/**
	 *	@ignore
	 */
	protected sysDb !: IDBPDatabase<SysConfigEntity>;

	/**
	 *	@ignore
	 */
	protected databaseName : string = 'sys_user_entity';

	/**
	 *	@ignore
	 */
	protected storeName : StoreNames<SysConfigEntity> = 'root';

	/**
	 *	@ignore
	 */
	protected storageCrypto : AesCrypto = new AesCrypto( `meta_beem_password_` );


	constructor()
	{
	}

	/**
	 * 	initialize table
	 *
	 * 	@ignore
	 * 	@returns {Promise< IDBPDatabase<SysConfigEntity> | null >}
	 */
	async initDb() : Promise< IDBPDatabase<SysConfigEntity> | null >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( this.sysDb )
				{
					return resolve( this.sysDb );
				}
				if ( ! _.isString( this.databaseName ) || _.isEmpty( this.databaseName ) )
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
				if ( ! this.sysDb )
				{
					return reject( `${ this.constructor.name }.initDb :: null sysDb` );
				}

				return resolve( this.sysDb );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	check if the input value is a valid SysConfigItem
	 *	@param item	{any}
	 *	@returns {boolean}
	 */
	public isValidSysConfigItem( item : any ) : boolean
	{
		return _.isString( item );
	}

	/**
	 * 	get int config value
	 * 	@param key	{string}
	 * 	@returns {number}
	 */
	public getConfigInt( key : string ) : Promise<number | undefined>
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
		});
	}

	/**
	 * 	get float config value
	 * 	@param key	{string}
	 * 	@returns {number}
	 */
	public getConfigFloat( key : string ) : Promise<number | undefined>
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
		});
	}

	/**
	 * 	get config
	 *	@param key	{string}
	 *	@returns {Promise<string | undefined>}
	 */
	public getConfig( key : string ) : Promise<string | undefined>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! _.isString( key ) || _.isEmpty( key ) )
				{
					return reject( `${ this.constructor.name }.getConfig :: invalid key` );
				}

				if ( ! await this.initDb() )
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
		});
	}

	/**
	 * 	put config
	 *	@param key	{string}
	 *	@param item	{string}
	 *	@returns {Promise<boolean>}
	 */
	public putConfig( key : string, item : string ) : Promise<boolean>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! _.isString( key ) || _.isEmpty( key ) )
				{
					return reject( `${ this.constructor.name }.putConfig :: invalid key` );
				}
				if ( ! this.isValidSysConfigItem( item ) )
				{
					return reject( `${ this.constructor.name }.putConfig :: invalid item` );
				}

				if ( ! await this.initDb() )
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
		});
	}

	/**
	 * 	delete all items
	 *
	 * 	@group Basic Methods
	 * 	@returns {Promise<boolean>}
	 */
	public clear() : Promise<boolean>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! await this.initDb() )
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
		});
	}
}
