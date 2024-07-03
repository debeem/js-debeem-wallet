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
import { openDB, StoreNames } from "idb";
import { IDBPDatabase } from "idb/build/entry";
import { AesCrypto } from "debeem-cipher";
import { SysUserEntity, SysUserItem } from "../../entities/SysUserEntity";
import { CallbackModels } from "../../models/CallbackModels";
import { VerifyUtil } from "../../utils/VerifyUtil";
import { isAddress } from "ethers";
import { SysConfigStorageService } from "./SysConfigStorageService";
import { SysConfigKeys } from "../../entities/SysConfigEntity";
import { WalletEntityBaseItem } from "../../entities/WalletEntity";
import { VaWalletEntity } from "../../validators/VaWalletEntity";
import { Web3Digester, Web3Signer, Web3Validator } from "debeem-id";
import { IStorageService } from "./IStorageService";


/**
 * 	@class
 */
export class SysUserStorageService implements IStorageService
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
	private async initDb() : Promise< IDBPDatabase<SysUserEntity> | null >
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
	 *	check if the input is a valid SysUserItem object
	 *
	 *	@param item		{SysUserItem | any}
	 *	@param [callback]	{CallbackModels}
	 *	@returns {boolean}
	 */
	public isValidItem( item : SysUserItem | any, callback ?: CallbackModels ) : boolean
	{
		if ( ! VerifyUtil.returnNotNullObject( item, callback, `${ this.constructor.name }.isValidItem :: null item` ) )
		{
			return false;
		}
		if ( ! isAddress( item.wallet ) )
		{
			VerifyUtil.setErrorDesc( callback, `${ this.constructor.name }.isValidItem :: invalid .address` );
			return false;
		}
		if ( ! VerifyUtil.returnNotGreaterThanNumeric(
			item.timestamp,
			0,
			callback,
			`${ this.constructor.name }.isValidItem :: invalid .timestamp` ) )
		{
			return false;
		}
		if ( ! VerifyUtil.returnNotEmptyString(
			item.password,
			callback,
			`${ this.constructor.name }.isValidItem :: invalid .password` ) )
		{
			return false;
		}
		if ( ! VerifyUtil.returnNotEmptyString(
			item.hash,
			callback,
			`${ this.constructor.name }.isValidItem :: invalid .hash` ) )
		{
			return false;
		}
		if ( ! VerifyUtil.returnNotEmptyString(
			item.sig,
			callback,
			`${ this.constructor.name }.isValidItem :: invalid .sig` ) )
		{
			return false;
		}

		return true;
	}

	/**
	 * 	get storage key by SysUserItem
	 *
	 * 	@group Basic Methods
	 *	@param item	{SysUserItem} item object
	 *	@returns {string | null}
	 */
	public getKeyByItem( item : SysUserItem ) : string | null
	{
		if ( this.isValidItem( item ) )
		{
			return item.wallet.trim().toLowerCase();
		}

		return null;
	}

	/**
	 * 	get storage key by WalletEntityBaseItem
	 *
	 * 	@group Basic Methods
	 *	@param walletBaseItem	{WalletEntityBaseItem} item object
	 *	@returns {string | null}
	 */
	public getKeyByWalletEntityBaseItem( walletBaseItem : WalletEntityBaseItem ) : string | null
	{
		if ( null === VaWalletEntity.validateWalletEntityBaseItem( walletBaseItem ) )
		{
			return walletBaseItem.address.trim().toLowerCase();
		}

		return null;
	}

	/**
	 * 	check if the item is existing
	 *
	 * 	@group Basic Methods
	 *	@param walletBaseItem	{WalletEntityBaseItem} item object
	 *	@returns {Promise<boolean>}
	 */
	public async existByWalletEntityBaseItem( walletBaseItem : WalletEntityBaseItem ) : Promise<boolean>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const errorVaWalletBaseItem : string | null = VaWalletEntity.validateWalletEntityBaseItem( walletBaseItem );
				if ( null !== errorVaWalletBaseItem )
				{
					return reject( `${ this.constructor.name }.existByWalletEntityBaseItem :: invalid walletBaseItem(${ errorVaWalletBaseItem })` );
				}

				const key : string | null = this.getKeyByWalletEntityBaseItem( walletBaseItem );
				if ( _.isString( key ) && ! _.isEmpty( key ) )
				{
					const sysUserItem : SysUserItem | null = await this.get( key );
					return resolve( !! sysUserItem );
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
	 * 	create a new user
	 *
	 *	@param walletBaseItem		{WalletEntityBaseItem}
	 *	@param pinCode			{string}
	 *	@param [overwriteExisting]	{boolean} overwrite existing user
	 *	@returns {Promise<boolean>}
	 */
	public async createUser( walletBaseItem : WalletEntityBaseItem, pinCode : string, overwriteExisting ?: boolean ) : Promise<boolean>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const errorVaWalletBaseItem : string | null = VaWalletEntity.validateWalletEntityBaseItem( walletBaseItem );
				if ( null !== errorVaWalletBaseItem )
				{
					return reject( `${ this.constructor.name }.createUser :: invalid walletBaseItem(${ errorVaWalletBaseItem })` );
				}
				if ( ! _.isString( pinCode ) )
				{
					return reject( `${ this.constructor.name }.createUser :: invalid pinCode` );
				}

				if ( true === overwriteExisting )
				{
					const key : string | null = this.getKeyByWalletEntityBaseItem( walletBaseItem );
					if ( ! _.isString( key ) || _.isEmpty( key ) )
					{
						return reject( `${ this.constructor.name }.createUser :: failed to get key` );
					}

					const sysUserItem : SysUserItem | null = await this.get( key );
					if ( sysUserItem )
					{
						if ( ! await Web3Validator.validateObject( walletBaseItem.address, sysUserItem, sysUserItem.sig ) )
						{
							return reject( `${ this.constructor.name }.createUser :: walletBaseItem does not match the existing item by sig1` );
						}

						//	check by sig
						const toBeCheckSig = {
							...walletBaseItem,
							wallet : walletBaseItem.address,
							timestamp : new Date().getTime()
						};
						const newItemSig = await Web3Signer.signObject( walletBaseItem.privateKey, toBeCheckSig );
						if ( ! await Web3Validator.validateObject( sysUserItem.wallet, toBeCheckSig, newItemSig ) )
						{
							return reject( `${ this.constructor.name }.createUser :: walletBaseItem does not match the existing item by sig2` );
						}
					}
				}
				else
				{
					if ( await this.existByWalletEntityBaseItem( walletBaseItem ) )
					{
						return reject( `${ this.constructor.name }.createUser :: user already exists` );
					}
				}

				//	...
				await this.savePassword( walletBaseItem, pinCode );
				resolve( true );
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
	 *	@param pinCode		{string} the PIN Code
	 *	@returns { Promise< boolean > }
	 */
	public async isValidPinCode( pinCode : string ) : Promise< boolean >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! _.isString( pinCode ) )
				{
					return reject( `${ this.constructor.name }.isValidPinCode :: invalid pinCode` );
				}

				//	get current wallet
				const currentWallet : string | undefined = await this.getCurrentWallet();
				if ( ! _.isString( currentWallet ) || _.isEmpty( currentWallet ) )
				{
					return reject( `${ this.constructor.name }.isValidPinCode :: invalid currentWallet` );
				}

				//	...
				await this.initDb();
				await TestUtil.sleep( 1 );
				const sysUserItem : SysUserItem | null = await this.get( currentWallet );
				if ( ! sysUserItem )
				{
					return reject( `${ this.constructor.name }.isValidPinCode :: user not found` );
				}

				const plainPassword : string = this.storageCrypto.decrypt( sysUserItem.password, pinCode );
				if ( _.isString( plainPassword ) &&
					! _.isEmpty( plainPassword ) &&
					sysUserItem.password !== plainPassword )
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
	 *	@param walletBaseItem	{WalletEntityBaseItem} the wallet object
	 *	@param oldPinCode	{string} the old pinCode
	 *	@param newPinCode	{string} the new pinCode
	 *	@returns {Promise<boolean>}
	 */
	public async changePinCode(
		walletBaseItem : WalletEntityBaseItem,
		oldPinCode : string,
		newPinCode : string ) : Promise<boolean>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const errorVaWalletBaseItem : string | null = VaWalletEntity.validateWalletEntityBaseItem( walletBaseItem );
				if ( null !== errorVaWalletBaseItem )
				{
					return reject( `${ this.constructor.name }.changePinCode :: invalid walletBaseItem(${ errorVaWalletBaseItem })` );
				}
				if ( ! _.isString( oldPinCode ) )
				{
					return reject( `${ this.constructor.name }.changePinCode :: invalid oldPinCode` );
				}
				if ( ! _.isString( newPinCode ) )
				{
					return reject( `${ this.constructor.name }.changePinCode :: invalid newPinCode` );
				}
				if ( ! await this.isValidPinCode( oldPinCode ) )
				{
					return reject( `${ this.constructor.name }.changePinCode :: invalid oldPinCode` );
				}

				//	get current wallet
				const currentWallet : string | undefined = await this.getCurrentWallet();
				if ( ! _.isString( currentWallet ) || _.isEmpty( currentWallet ) )
				{
					return reject( `${ this.constructor.name }.changePinCode :: invalid currentWallet` );
				}
				if ( walletBaseItem.address.trim().toLowerCase() !== currentWallet.trim().toLowerCase() )
				{
					return reject( `${ this.constructor.name }.changePinCode :: walletBaseItem does not match currentWallet` );
				}

				//	check by sig
				let checkSig = {
					timestamp : new Date().getTime(),
					wallet : walletBaseItem.address,
					oldPinCode : oldPinCode,
					sig : ``,
				}
				checkSig.sig = await Web3Signer.signObject( walletBaseItem.privateKey, checkSig );
				const matchedWallet : boolean = await Web3Validator.validateObject( currentWallet, checkSig, checkSig.sig );
				if ( ! matchedWallet )
				{
					return reject( `${ this.constructor.name }.changePinCode :: walletBaseItem does not match currentWallet by sig` );
				}

				//	...
				await this.initDb();
				await TestUtil.sleep( 1 );
				const sysUserItem : SysUserItem | null = await this.get( currentWallet );
				if ( ! sysUserItem )
				{
					return reject( `${ this.constructor.name }.changePinCode :: user not found` );
				}

				//	verify the sig
				if ( ! await Web3Validator.validateObject( sysUserItem.wallet, sysUserItem, sysUserItem.sig ) )
				{
					return reject( `${ this.constructor.name }.changePinCode :: failed to validate the password signature` );
				}

				//	...
				await this.savePassword( walletBaseItem, newPinCode );
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
	 * 	@param walletBaseItem	{WalletEntityBaseItem} the wallet object
	 * 	@returns {string}
	 */
	public async generatePassword( walletBaseItem : WalletEntityBaseItem ) : Promise< string >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const errorVaWalletBaseItem : string | null = VaWalletEntity.validateWalletEntityBaseItem( walletBaseItem );
				if ( null !== errorVaWalletBaseItem )
				{
					return reject( `${ this.constructor.name }.generatePassword :: invalid walletBaseItem(${ errorVaWalletBaseItem })` );
				}

				//
				//	hash the private key three times
				//
				const walletAddress : string = walletBaseItem.address.trim().toLowerCase();
				let password : string = await Web3Digester.hashObject( {
					timestamp : 1,
					wallet : walletAddress,
					privateKey : walletBaseItem.privateKey,
				} );
				password = await Web3Digester.hashObject( {
					timestamp : 2,
					wallet : walletAddress,
					privateKey : password,
				} );
				password = await Web3Digester.hashObject( {
					timestamp : 3,
					wallet : walletAddress,
					privateKey : password,
				} );

				//	...
				resolve( password.trim().toLowerCase() );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	Extract the password for the specified entity using pinCode
	 *
	 * 	@group Extended Methods
	 *	@param pinCode		{string} pinCode for decryption
	 *	@returns { Promise< string | null > }
	 */
	public async extractPassword( pinCode : string ) : Promise< string | null >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! _.isString( pinCode ) )
				{
					return reject( `${ this.constructor.name }.extractPassword :: invalid pinCode` );
				}

				//	get current wallet
				const currentWallet : string | undefined = await this.getCurrentWallet();
				if ( ! _.isString( currentWallet ) || _.isEmpty( currentWallet ) )
				{
					return reject( `${ this.constructor.name }.extractPassword :: invalid currentWallet` );
				}

				//	...
				await this.initDb();
				await TestUtil.sleep( 1 );

				const sysUser : SysUserItem | null = await this.get( currentWallet );
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
				// else
				// {
				// 	const newPassword : string = this.generatePassword();
				// 	const savedPassword : string = await this.savePassword( entityName, pinCode, newPassword );
				// 	return resolve( newPassword );
				// }

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
	 * 	get current wallet address
	 *
	 * 	@returns {Promise< string | undefined >}
	 */
	public async getCurrentWallet() : Promise< string | undefined >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const configCurrentWallet : string | undefined = await new SysConfigStorageService().getConfig( SysConfigKeys.currentWallet );
				resolve( configCurrentWallet );
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
	public async clear() : Promise<boolean>
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

	/**
	 *	Saves the password encrypted with pinCode for the specified entity
	 *
	 * 	@group Extended Methods
	 *	@param walletBaseItem	{WalletEntityBaseItem}
	 *	@param pinCode		{string} pinCode
	 *	@returns { Promise<string> }
	 */
	protected async savePassword( walletBaseItem : WalletEntityBaseItem, pinCode : string ) : Promise<string>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const errorVaWalletBaseItem : string | null = VaWalletEntity.validateWalletEntityBaseItem( walletBaseItem );
				if ( null !== errorVaWalletBaseItem )
				{
					return reject( `${ this.constructor.name }.savePassword :: invalid walletBaseItem(${ errorVaWalletBaseItem })` );
				}
				if ( ! _.isString( pinCode ) )
				{
					return reject( `${ this.constructor.name }.savePassword :: invalid pinCode` );
				}

				//	...
				const key : string | null = this.getKeyByWalletEntityBaseItem( walletBaseItem );
				if ( ! _.isString( key ) )
				{
					return reject( `${ this.constructor.name }.savePassword :: failed to get storage key` );
				}

				//	...
				const plainPassword : string = await this.generatePassword( walletBaseItem );
				if ( ! _.isString( plainPassword ) || _.isEmpty( plainPassword ) )
				{
					return reject( `${ this.constructor.name }.savePassword :: failed to generate password` );
				}

				const encryptedPassword : string = this.storageCrypto.encrypt( plainPassword, pinCode );
				let item : SysUserItem = {
					timestamp : new Date().getTime(),
					wallet : walletBaseItem.address.trim().toLowerCase(),
					password: encryptedPassword,
					hash : ``,
					sig : ``,
				};
				item.sig = await Web3Signer.signObject( walletBaseItem.privateKey, item );
				item.hash = await Web3Digester.hashObject( item );

				//	...
				await this.initDb();
				await TestUtil.sleep( 1 );
				await this.put( key, item );

				//	...
				resolve( plainPassword );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	get item object by key
	 *
	 * 	@group Basic Methods
	 *	@param key {string} storage key
	 *	@returns {Promise< SysUserItem | null >}
	 */
	public async get( key : string ) : Promise<SysUserItem | null>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! _.isString( key ) || _.isEmpty( key ) )
				{
					return reject( `${ this.constructor.name }.get :: invalid key` );
				}

				await this.initDb();
				await TestUtil.sleep( 1 );
				if ( this.sysDb )
				{
					const item : SysUserItem | undefined = await this.sysDb.get( this.storeName, key.trim().toLowerCase() );
					return resolve( item ? item : null );
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
	 *	Put an item into database.
	 *	the value will be overwritten with the same key
	 *
	 * 	@group Basic Methods
	 *	@param key	{string} storage key
	 *	@param value	{SysUserItem}	structured data objects
	 *	@returns {Promise<boolean>}
	 */
	public async put( key: string, value : SysUserItem ) : Promise<boolean>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! this.isValidItem( value ) )
				{
					return reject( `${ this.constructor.name }.put :: invalid value` );
				}
				if ( ! _.isString( key ) || _.isEmpty( key ) )
				{
					return reject( `${ this.constructor.name }.put :: invalid key` );
				}

				await this.initDb();
				await TestUtil.sleep( 1 );
				if ( this.sysDb )
				{
					await this.sysDb.put( 'root', value, key.trim().toLowerCase() );
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

	public delete( key : string ) : Promise<boolean>
	{
		throw new Error( "Method not implemented." );
	}

	public count( query? : string | undefined ) : Promise<number>
	{
		throw new Error( "Method not implemented." );
	}
}
