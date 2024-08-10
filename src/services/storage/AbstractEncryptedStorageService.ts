/**
 * 	@category Storage Services
 * 	@module AbstractStorageService
 */
import { IDBPDatabase } from "idb/build/entry";
import { openDB, StoreNames } from "idb";
import { StorageEntity } from "../../entities/StorageEntity";
import { TypeUtil } from "debeem-utils";
import { AesCrypto } from "debeem-cipher";
import { IStorageService } from "./IStorageService";
import { SysUserStorageService } from "./SysUserStorageService";
import _ from "lodash";
import { EtherWallet } from "debeem-id";
import { EncryptedStorageOptions } from "../../models/StorageModels";


/**
 * 	abstract class AbstractStorageService
 */
export abstract class AbstractEncryptedStorageService<T> implements IStorageService
{
	/**
	 *	@ignore
	 */
	protected db ! : IDBPDatabase<StorageEntity>;

	/**
	 *	@ignore
	 *	@protected
	 */
	protected databaseName : string = '';

	/**
	 *	@ignore
	 *	@protected
	 */
	protected storeName : StoreNames<StorageEntity> = 'root';

	/**
	 *	@ignore
	 *	@protected
	 */
	protected pinCode : string = '';

	/**
	 *	@ignore
	 *	@protected
	 */
	protected password : string = '';

	/**
	 * 	@ignore
	 * 	@protected
	 */
	protected options : EncryptedStorageOptions = {};

	/**
	 *	@ignore
	 *	@protected
	 */
	protected sysUserStorageService : SysUserStorageService = new SysUserStorageService();

	/**
	 *	@ignore
	 *	@protected
	 */
	protected storageCrypto : AesCrypto = new AesCrypto( `metabeem_password_` );


	/**
	 *	@param databaseName	{string}
	 *	@param [pinCode]	{string}
	 *	@param [options]	{EncryptedStorageOptions}
	 *	@protected
	 */
	protected constructor(
		databaseName : string,
		pinCode : string = '',
		options ?: EncryptedStorageOptions
	)
	{
		this.databaseName = databaseName;
		this.pinCode = pinCode;
		this.options = options ? _.cloneDeep( options ) : {};
	}

	/**
	 * 	initialize table
	 *
	 * 	@ignore
	 * 	@returns {Promise< IDBPDatabase<StorageEntity> | null >}
	 */
	protected async init() : Promise<IDBPDatabase<StorageEntity> | null>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( this.db )
				{
					return resolve( this.db );
				}
				if ( ! _.isString( this.databaseName ) || _.isEmpty( this.databaseName ) )
				{
					return resolve( null );
				}

				let password : string | null = null;
				if ( this.options.privateKey &&
					EtherWallet.isValidPrivateKey( this.options.privateKey ) )
				{
					//
					//	try to generate password by the private key if user provides a private key
					//
					password = await this.sysUserStorageService.generatePasswordByPrivateKey( this.options.privateKey );
				}
				if ( ! _.isString( password ) || _.isEmpty( password ) )
				{
					//
					//	try to extract password from database by the PIN Code
					//
					password = await this.sysUserStorageService.extractPassword( this.pinCode, this.options );
				}
				if ( ! _.isString( password ) || _.isEmpty( password ) )
				{
					return reject( `${ this.constructor.name } :: invalid pinCode or privateKey` );
				}

				//	...
				this.password = password;

				//	...
				const storeName = this.storeName;
				this.db = await openDB<StorageEntity>
				(
					this.databaseName,
					1,
					{
						upgrade( db )
						{
							db.createObjectStore( storeName );
						},
					} );
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
		} );
	}

	/**
	 *	Check if the input object is valid object
	 *
	 * 	@group Basic Methods
	 *	@param item	{any} the object to be checked
	 *	@returns {boolean}
	 */
	public isValidItem( item : any ) : boolean
	{
		return false;
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
				await this.init();
				if ( this.db )
				{
					await this.db.clear( this.storeName );
					return resolve( true );
				}

				//	...
				resolve( false );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 *	delete item by key
	 *
	 * 	@group Basic Methods
	 *	@param key {string} wallet address is the key
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
					return reject( `invalid key for .delete` );
				}

				await this.init();
				if ( this.db )
				{
					await this.db.delete( this.storeName, key );
					return resolve( true );
				}

				resolve( false );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 * 	get item object by key
	 *
	 * 	@group Basic Methods
	 *	@param key {string} storage key
	 *	@returns {Promise<T | null>}
	 */
	public async get( key : string ) : Promise<T | null>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! TypeUtil.isNotEmptyString( key ) )
				{
					return reject( `invalid key for .get` );
				}

				await this.init();
				if ( this.db )
				{
					//await TestUtil.sleep( 1 );

					const encrypted : string | undefined = await this.db.get( this.storeName, key );
					if ( encrypted )
					{
						try
						{
							const value : T | undefined = await this.storageCrypto.decryptToObject( encrypted, this.password );
							return resolve( value ? value : null );
						}
						catch ( subError )
						{
							//console.error( `${ this.constructor.name }.get subError :`, subError )
							return resolve( null );
						}
					}
				}

				//	...
				// reject( `error in get( '${ key }' )` );
				resolve( null );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 *	Put an item into database. replaces the item with the same key.
	 *
	 * 	@group Basic Methods
	 *	@param key	{string} storage key
	 *	@param value	{T}	structured data objects
	 *	@returns {Promise<boolean>}
	 */
	public async put( key : string, value : T ) : Promise<boolean>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! this.isValidItem( value ) )
				{
					return reject( `invalid value for .put` );
				}
				if ( ! TypeUtil.isNotEmptyString( key ) )
				{
					return reject( `invalid key for .put` );
				}

				//	...
				await this.init();
				if ( this.db )
				{
					const encrypted : string = await this.storageCrypto.encryptFromObject( value, this.password );
					await this.db.put( 'root', encrypted, key );
					return resolve( true );
				}

				//	...
				resolve( false );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 * 	get the first item
	 *
	 * 	@group Basic Methods
	 * 	@returns {Promise<T | null>}
	 */
	public async getFirst() : Promise<T | null>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const firstItems : Array<T | null> | null = await this.getAll( undefined, 1 );
				if ( Array.isArray( firstItems ) && 1 === firstItems.length )
				{
					return resolve( firstItems[ 0 ] );
				}

				//	...
				resolve( null );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 * 	get all of keys
	 *
	 * 	@group Basic Methods
	 *	@param query	{string} query string
	 *	@param maxCount	{number} maximum limit number
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
					const value : Array<string> | null = await this.db.getAllKeys( this.storeName, query, maxCount );
					return resolve( value ? value : [] );
				}

				//	...
				resolve( [] );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 * 	query all items
	 *
	 * 	@group Basic Methods
	 *	@param query	{string} query string
	 *	@param maxCount	{number} maximum limit number
	 *	@returns {Promise<Array< T | null >>}
	 */
	public async getAll( query? : string, maxCount? : number ) : Promise<Array<T | null>>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				await this.init();
				if ( this.db )
				{
					const list : Array<string> | null = await this.db.getAll( this.storeName, query, maxCount );
					if ( Array.isArray( list ) && list.length > 0 )
					{
						let objectList : Array<T | null> = [];
						for ( const encrypted of list )
						{
							let object : T | null = null;
							try
							{
								object = await this.storageCrypto.decryptToObject<T>( encrypted, this.password );
							}
							catch ( err )
							{
								console.error( err );
							}

							//	...
							objectList.push( object );
						}

						//	...
						return resolve( objectList );
					}
				}

				//	...
				resolve( [] );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 * 	Retrieves the number of records matching the given query in a store.
	 *
	 * 	@group Basic Methods
	 *	@param query	{string} query string
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
		} );
	}

	/**
	 * 	get storage key by item
	 *
	 * 	@group Basic Methods
	 *	@param value	{any} item object
	 *	@returns {string | null}
	 */
	public getKeyByItem( value : any ) : string | null
	{
		return null;
	}
}
