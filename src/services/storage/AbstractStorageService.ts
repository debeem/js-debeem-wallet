import { IDBPDatabase } from "idb/build/entry";
import { openDB, StoreNames } from "idb";
import { StorageEntity } from "../../entities/StorageEntity";
import { TypeUtil } from "debeem-utils";
import { AesCrypto } from "debeem-cipher";
import { IStorageService } from "./IStorageService";
import { TestUtil } from "debeem-utils";
import { SysUserStorageService } from "./SysUserStorageService";
import _ from "lodash";


/**
 * 	abstract class AbstractStorageService
 */
export abstract class AbstractStorageService<T> implements IStorageService
{
	protected db !: IDBPDatabase<StorageEntity>;
	protected databaseName : string = '';
	protected storeName : StoreNames<StorageEntity> = 'root';
	protected pinCode : string = '';
	protected password : string = '';
	protected sysUserStorageService : SysUserStorageService = new SysUserStorageService();
	protected storageCrypto : AesCrypto = new AesCrypto( `metabeem_password_` );


	protected constructor( databaseName : string, pinCode : string = '' )
	{
		this.databaseName = databaseName;
		this.pinCode = pinCode;
	}

	public init() : Promise< IDBPDatabase<StorageEntity> | null >
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

				//	...
				const password : string | null = await this.sysUserStorageService.extractPassword( this.databaseName, this.pinCode );
				if ( ! password )
				{
					return reject( `${ this.constructor.name } :: invalid pinCode` );
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
	 *	@param pinCode	{string}
	 *	@returns {Promise< boolean >}
	 */
	public isValidPinCode( pinCode : string ) : Promise< boolean >
	{
		return this.sysUserStorageService.isValidPinCode( this.databaseName, pinCode );
	}

	/**
	 *	@param oldPinCode	{string}
	 *	@param newPinCode	{string}
	 *	@returns {Promise<boolean>}
	 */
	public changePinCode( oldPinCode : string, newPinCode : string ) : Promise<boolean>
	{
		return this.sysUserStorageService.changePinCode( this.databaseName, oldPinCode, newPinCode );
	}

	/**
	 *	@param item	{any}
	 *	@returns {boolean}
	 */
	isValidItem( item : any ) : boolean
	{
		return false;
	}

	/**
	 * 	delete all items
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
		});
	}

	/**
	 *	@param key	- wallet address is the key
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
		});
	}

	/**
	 * 	get item by key
	 *	@param key
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
					await TestUtil.sleep( 1 );

					const encrypted : string | undefined = await this.db.get( this.storeName, key );
					if ( encrypted )
					{
						const value : T | undefined = await this.storageCrypto.decryptToObject( encrypted, this.password );
						return resolve( value ? value : null );
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
		});
	}

	/**
	 *	Put an item into database. replaces the item with the same key.
	 * 	value.chainId will be the storage key
	 *	@param key
	 *	@param value
	 */
	public async put( key: string, value : T ) : Promise<boolean>
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
		});
	}

	/**
	 * 	get the first item
	 */
	public async getFirst() : Promise<T | null>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const firstItems : Array< T | null> | null = await this.getAll( undefined, 1 );
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
		});
	}

	/**
	 * 	get all of keys
	 *	@param query
	 *	@param maxCount
	 */
	public async getAllKeys( query? : string, maxCount? : number ) : Promise<Array<string> | null>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				await this.init();
				if ( this.db )
				{
					const value : Array<string> | null = await this.db.getAllKeys( this.storeName, query, maxCount );
					return resolve( value ? value : null );
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
	 * 	query all items
	 *	@param query
	 *	@param maxCount
	 */
	public async getAll( query? : string, maxCount? : number ) : Promise<Array< T | null > | null>
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
						let objectList : Array< T | null > = [];
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
				resolve( null );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	Retrieves the number of records matching the given query in a store.
	 *	@param query
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

	getKeyByItem( value : any ) : string | null
	{
		return null;
	}
}
