/**
 * 	@category Storage Services
 * 	@module SysUserStorageService
 */
import { TestUtil } from "debeem-utils";

if ( TestUtil.isTestEnv() )
{
	//import "fake-indexeddb/auto";
	require('fake-indexeddb/auto');
}

import _ from "lodash";
import { v4 as uuidv4 } from 'uuid';
import { openDB, StoreNames } from "idb";
import { IDBPDatabase } from "idb/build/entry";
import { AesCrypto } from "debeem-cipher";
import { SysUserEntity } from "../../entities/SysUserEntity";


/**
 * 	@class
 */
export class SysUserStorageService
{
	/**
	 *	@ignore
	 */
	protected sysDb !: IDBPDatabase<SysUserEntity>;

	/**
	 *	@ignore
	 */
	protected databaseName : string = 'sys_user_entity';

	/**
	 *	@ignore
	 */
	protected storeName : StoreNames<SysUserEntity> = 'root';

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
	 * 	@returns {Promise< IDBPDatabase<SysUserEntity> | null >}
	 */
	async initDb() : Promise< IDBPDatabase<SysUserEntity> | null >
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
	 * 	Check if the pinCode is correct
	 *
	 * 	@group Extended Methods
	 *	@param entityName	{string} entityName, for WalletStorageService, it is: `wallet_entity`
	 *	@param pinCode		{string} the pinCode to be checked
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
	 * 	change pinCode
	 *
	 * 	@group Extended Methods
	 * 	@param entityName	{string} entityName, for WalletStorageService, it is: `wallet_entity`
	 *	@param oldPinCode	{string} the old pinCode
	 *	@param newPinCode	{string} the new pinCode
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
	 * 	generate a password
	 *
	 * 	@group Extended Methods
	 * 	@returns {string}
	 */
	public generatePassword() : string
	{
		return `${ uuidv4().toString() }-${ uuidv4().toString() }`;
	}

	/**
	 * 	Extract the password for the specified entity using pinCode
	 *
	 * 	@group Extended Methods
	 * 	@param entityName	{string} entityName, for WalletStorageService, it is: `wallet_entity`
	 *	@param pinCode		{string} pinCode for decryption
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
	 *	Saves the password encrypted with pinCode for the specified entity
	 *
	 * 	@group Extended Methods
	 * 	@param entityName	{string} entityName, for WalletStorageService, it is: `wallet_entity`
	 *	@param pinCode		{string} pinCode
	 *	@param password		{string} The password to be saved. If the user does not specify one, a new password will be randomly generated.
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
