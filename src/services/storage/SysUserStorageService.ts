import { TestUtil } from "debeem-utils";

if ( typeof process !== 'undefined' && process.env )
{
	//import "fake-indexeddb/auto";
	require('fake-indexeddb/auto');
}

import _ from "lodash";
import { v4 as uuidv4 } from 'uuid';
import { openDB, StoreNames } from "idb";
import { IDBPDatabase } from "idb/build/entry";
import { AesCrypto } from "debeem-crypto";
import { SysUserEntity } from "../../entities/SysUserEntity";


/**
 * 	@class
 */
export class SysUserStorageService
{
	protected sysDb !: IDBPDatabase<SysUserEntity>;
	protected databaseName : string = 'sys_user_entity';
	protected storeName : StoreNames<SysUserEntity> = 'root';
	protected storageCrypto : AesCrypto = new AesCrypto( `meta_beem_password_` );


	constructor()
	{
	}

	async initDb()
	{
		if ( this.sysDb )
		{
			return this.sysDb;
		}
		if ( ! _.isString( this.databaseName ) || _.isEmpty( this.databaseName ) )
		{
			return null;
		}

		const storeName = this.storeName;
		this.sysDb = await openDB<SysUserEntity>
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
			throw new Error( `${ this.constructor.name }.initDb :: null sysDb` );
		}

		return this.sysDb;
	}

	/**
	 *	@param entityName	{string}
	 *	@param pinCode		{string}
	 *	@returns { Promise< boolean > }
	 */
	public isValidPinCode( entityName : string, pinCode : string ) : Promise< boolean >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! _.isString( entityName ) || _.isEmpty( entityName ) )
				{
					return reject( `${ this.constructor.name }.isValidPinCode :: invalid entityName` );
				}
				if ( ! _.isString( pinCode ) )
				{
					return reject( `${ this.constructor.name }.isValidPinCode :: invalid pinCode` );
				}

				await this.initDb();
				await TestUtil.sleep( 1 );
				const sysUser = await this.sysDb.get( this.storeName, entityName );
				if ( ! sysUser )
				{
					return reject( `${ this.constructor.name }.isValidPinCode :: entity not found` );
				}

				const plainPassword : string = this.storageCrypto.decrypt( sysUser.password, pinCode );
				if ( _.isString( plainPassword ) &&
					! _.isEmpty( plainPassword ) &&
					sysUser.password !== plainPassword )
				{
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
	 *	@param entityName	{string}
	 *	@param oldPinCode	{string}
	 *	@param newPinCode	{string}
	 *	@returns {Promise<boolean>}
	 */
	public changePinCode( entityName : string, oldPinCode : string, newPinCode : string ) : Promise<boolean>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! _.isString( entityName ) || _.isEmpty( entityName ) )
				{
					return reject( `${ this.constructor.name }.changePinCode :: invalid entityName` );
				}
				if ( ! _.isString( oldPinCode ) )
				{
					return reject( `${ this.constructor.name }.changePinCode :: invalid oldPinCode` );
				}
				if ( ! _.isString( newPinCode ) )
				{
					return reject( `${ this.constructor.name }.changePinCode :: invalid newPinCode` );
				}
				if ( oldPinCode === newPinCode )
				{
					return reject( `${ this.constructor.name }.changePinCode :: pinCode no change` );
				}

				await this.initDb();

				const sysUser = await this.sysDb.get( this.storeName, entityName );
				if ( ! sysUser )
				{
					return reject( `${ this.constructor.name }.changePinCode :: entity not found` );
				}

				const plainPassword : string = this.storageCrypto.decrypt( sysUser.password, oldPinCode );
				if ( ! _.isString( plainPassword ) ||
					_.isEmpty( plainPassword ) ||
					sysUser.password === plainPassword )
				{
					return reject( `${ this.constructor.name }.changePinCode :: incorrect oldPinCode` );
				}

				//	...
				const encryptedPassword : string = this.storageCrypto.encrypt( plainPassword, newPinCode );
				const item = {
					entity: entityName,
					password: encryptedPassword,
				};
				await this.sysDb.put( this.storeName, item, entityName );
				return resolve( true );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	generate password
	 */
	public generatePassword() : string
	{
		return `${ uuidv4().toString() }-${ uuidv4().toString() }`;
	}

	/**
	 *	@param entityName	{string}
	 *	@param pinCode		{string}
	 *	@returns { Promise< string | null > }
	 */
	public extractPassword( entityName : string, pinCode : string ) : Promise< string | null >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! _.isString( entityName ) || _.isEmpty( entityName ) )
				{
					return reject( `${ this.constructor.name }.extractPassword :: invalid entityName` );
				}
				if ( ! _.isString( pinCode ) )
				{
					return reject( `${ this.constructor.name }.extractPassword :: invalid pinCode` );
				}

				await this.initDb();
				await TestUtil.sleep( 1 );

				const sysUser = await this.sysDb.get( this.storeName, entityName );
				if ( sysUser )
				{
					const plainPassword : string = this.storageCrypto.decrypt( sysUser.password, pinCode );
					if ( _.isString( plainPassword ) &&
						! _.isEmpty( plainPassword ) &&
						sysUser.password !== plainPassword )
					{
						return resolve( plainPassword );
					}
				}
				else
				{
					const newPassword : string = this.generatePassword();
					const savedPassword : string = await this.savePassword( entityName, pinCode, newPassword );
					return resolve( newPassword );
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
	 *	@param entityName	{string}
	 *	@param pinCode		{string}
	 *	@param password		{string}
	 *	@returns { Promise<string> }
	 */
	public savePassword( entityName : string, pinCode : string, password ?: string ) : Promise<string>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! _.isString( entityName ) || _.isEmpty( entityName ) )
				{
					return reject( `${ this.constructor.name }.savePassword :: invalid entityName` );
				}
				if ( ! _.isString( pinCode ) )
				{
					return reject( `${ this.constructor.name }.savePassword :: invalid pinCode` );
				}

				await this.initDb();
				if ( ! _.isString( password ) || _.isEmpty( password ) )
				{
					password = this.generatePassword();
				}

				const encryptedPassword : string = this.storageCrypto.encrypt( password, pinCode );
				const item = {
					entity: entityName,
					password: encryptedPassword,
				};
				await this.sysDb.put( this.storeName, item, entityName );
				return resolve( password );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	delete all items
	 */
	public clear() : Promise<boolean>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				await this.initDb();
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
