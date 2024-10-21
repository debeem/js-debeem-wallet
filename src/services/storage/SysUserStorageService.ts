/**
 * 	@category Storage Services
 * 	@module SysUserStorageService
 */
import { TestUtil, TypeUtil } from "debeem-utils";

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
import { WalletEntityBaseItem, WalletEntityItem } from "../../entities/WalletEntity";
import { VaWalletEntity } from "../../validators/VaWalletEntity";
import { EtherWallet, Web3Digester, Web3Signer, Web3Validator } from "debeem-id";
import { IStorageService } from "./IStorageService";
import { TWalletBaseItem } from "debeem-id/src/models/TWallet";
import { EncryptedStorageOptions } from "../../models/StorageModels";


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
			return this.getKeyByAddress( item.wallet );
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
			return this.getKeyByAddress( walletBaseItem.address );
		}

		return null;
	}

	/**
	 * 	get storage key by wallet address
	 *
	 * 	@group Basic Methods
	 *	@param address	{string} wallet address
	 *	@returns {string | null}
	 */
	public getKeyByAddress( address : string ) : string | null
	{
		if ( _.isString( address ) && ! _.isEmpty( address ) )
		{
			return address.trim().toLowerCase();
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
	 *	@param walletItem		{WalletEntityItem | WalletEntityBaseItem}
	 *	@param pinCode			{string}
	 *	@param [overwriteExisting]	{boolean} overwrite existing user
	 *	@returns {Promise<boolean>}
	 */
	public async createUser(
		walletItem : WalletEntityItem | WalletEntityBaseItem,
		pinCode : string,
		overwriteExisting ?: boolean ) : Promise<boolean>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const errorVaWalletBaseItem : string | null = VaWalletEntity.validateWalletEntityBaseItem( walletItem );
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
					const key : string | null = this.getKeyByWalletEntityBaseItem( walletItem );
					if ( ! _.isString( key ) || _.isEmpty( key ) )
					{
						return reject( `${ this.constructor.name }.createUser :: failed to get key` );
					}

					const sysUserItem : SysUserItem | null = await this.get( key );
					if ( sysUserItem )
					{
						const exceptedKeys : Array<string> = [ `name` ];
						if ( ! await Web3Validator.validateObject( walletItem.address, sysUserItem, sysUserItem.sig, exceptedKeys ) )
						{
							return reject( `${ this.constructor.name }.createUser :: walletBaseItem does not match the existing item by sig1` );
						}

						//	check by sig
						const toBeCheckSig = {
							...walletItem,
							wallet : walletItem.address,
							timestamp : new Date().getTime()
						};
						const newItemSig = await Web3Signer.signObject( walletItem.privateKey, toBeCheckSig );
						if ( ! await Web3Validator.validateObject( sysUserItem.wallet, toBeCheckSig, newItemSig ) )
						{
							return reject( `${ this.constructor.name }.createUser :: walletBaseItem does not match the existing item by sig2` );
						}
					}
				}
				else
				{
					if ( await this.existByWalletEntityBaseItem( walletItem ) )
					{
						return reject( `${ this.constructor.name }.createUser :: user already exists` );
					}
				}

				//	...
				const plainPassword : string = await this.savePassword( walletItem, pinCode );
				resolve( true );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	check if the PIN Code is correct
	 *
	 * 	@group Extended Methods
	 *	@param pinCode		{string} the PIN Code
	 *	@param [walletAddress]	{string} the user specified wallet address for verification
	 *	@returns { Promise< boolean > }
	 */
	public async isValidPinCode( pinCode : string, walletAddress ?: string ) : Promise< boolean >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! _.isString( pinCode ) )
				{
					return reject( `${ this.constructor.name }.isValidPinCode :: invalid pinCode` );
				}

				if ( ! EtherWallet.isValidAddress( walletAddress ) )
				{
					//	get current wallet
					walletAddress = await this.getCurrentWalletAddress();
				}
				if ( ! walletAddress || ! EtherWallet.isValidAddress( walletAddress ) )
				{
					return reject( `${ this.constructor.name }.isValidPinCode :: invalid walletAddress` );
				}

				//	...
				await this.initDb();
				await TestUtil.sleep( 1 );
				const sysUserItem : SysUserItem | null = await this.get( walletAddress );
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
	 *	@param walletBaseItem	{WalletEntityItem | WalletEntityBaseItem} the wallet object
	 *	@param oldPinCode	{string} the old pinCode
	 *	@param newPinCode	{string} the new pinCode
	 *	@returns {Promise<boolean>}
	 */
	public async changePinCode(
		walletBaseItem : WalletEntityItem | WalletEntityBaseItem,
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
				const currentWallet : string | undefined = await this.getCurrentWalletAddress();
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
				const exceptedKeys = [ `name` ];
				if ( ! await Web3Validator.validateObject( sysUserItem.wallet, sysUserItem, sysUserItem.sig, exceptedKeys ) )
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
	 * 	@param walletBaseItem	{WalletEntityItem | WalletEntityBaseItem} the wallet object
	 * 	@returns {string}
	 */
	public async generatePassword( walletBaseItem : WalletEntityItem | WalletEntityBaseItem ) : Promise< string >
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

				//	...
				const password : string = await this.generatePasswordByPrivateKey( walletBaseItem.privateKey );
				resolve( password.trim().toLowerCase() );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	generate a password by private key
	 *
	 * 	@group Extended Methods
	 * 	@param privateKey	{string} private key
	 * 	@returns {string}
	 */
	public async generatePasswordByPrivateKey( privateKey : string ) : Promise< string >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! EtherWallet.isValidPrivateKey( privateKey ) )
				{
					return reject( `${ this.constructor.name }.generatePasswordByPrivateKey :: invalid privateKey` );
				}

				const walletObj : TWalletBaseItem = EtherWallet.createWalletFromPrivateKey( privateKey );
				if ( ! EtherWallet.isValidWalletFactoryData( walletObj ) )
				{
					return reject( `${ this.constructor.name }.generatePasswordByPrivateKey :: failed to create wallet from privateKey` );
				}

				//
				//	hash the private key three times
				//
				const walletAddress : string = walletObj.address.trim().toLowerCase();
				let password : string = await Web3Digester.hashObject( {
					timestamp : 1,
					wallet : walletAddress,
					privateKey : walletObj.privateKey,
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
	 *	@param [options]	{EncryptedStorageOptions} encrypted storage options
	 *	@returns { Promise< string | null > }
	 */
	public async extractPassword( pinCode : string, options ?: EncryptedStorageOptions ) : Promise< string | null >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! _.isString( pinCode ) )
				{
					return reject( `${ this.constructor.name }.extractPassword :: invalid pinCode` );
				}

				let walletAddress : string | undefined = undefined;
				if ( options?.address && EtherWallet.isValidAddress( options?.address ) )
				{
					//	user specified a wallet address
					walletAddress = options.address;
				}
				else
				{
					//	get current wallet
					walletAddress = await this.getCurrentWalletAddress();
				}
				if ( ! _.isString( walletAddress ) || _.isEmpty( walletAddress ) )
				{
					return reject( `${ this.constructor.name }.extractPassword :: invalid wallet address` );
				}

				//	...
				await this.initDb();
				await TestUtil.sleep( 1 );

				const sysUser : SysUserItem | null = await this.get( walletAddress );
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
	public async getCurrentWalletAddress() : Promise< string | undefined >
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
	 *	@param walletItem	{WalletEntityItem | WalletEntityBaseItem}
	 *	@param pinCode		{string} pinCode
	 *	@returns { Promise<string> }
	 */
	protected async savePassword( walletItem : WalletEntityItem | WalletEntityBaseItem, pinCode : string ) : Promise<string>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const errorVaWalletBaseItem : string | null = VaWalletEntity.validateWalletEntityBaseItem( walletItem );
				if ( null !== errorVaWalletBaseItem )
				{
					return reject( `${ this.constructor.name }.savePassword :: invalid walletBaseItem(${ errorVaWalletBaseItem })` );
				}
				if ( ! _.isString( pinCode ) )
				{
					return reject( `${ this.constructor.name }.savePassword :: invalid pinCode` );
				}

				//	...
				const key : string | null = this.getKeyByWalletEntityBaseItem( walletItem );
				if ( ! _.isString( key ) )
				{
					return reject( `${ this.constructor.name }.savePassword :: failed to get storage key` );
				}

				//	...
				const plainPassword : string = await this.generatePassword( walletItem );
				if ( ! _.isString( plainPassword ) || _.isEmpty( plainPassword ) )
				{
					return reject( `${ this.constructor.name }.savePassword :: failed to generate password` );
				}

				let walletName : string | undefined = undefined;
				if ( _.has( walletItem, 'name' ) &&
					_.isString( walletItem[ `name` ] ) )
				{
					walletName = walletItem[ `name` ].trim();
				}

				const exceptedKeys : Array<string> = [ `name` ];
				const encryptedPassword : string = this.storageCrypto.encrypt( plainPassword, pinCode );
				let item : SysUserItem = {
					timestamp : new Date().getTime(),
					name : walletName,	//	`name` field will not be used by the signer
					wallet : walletItem.address.trim().toLowerCase(),
					password: encryptedPassword,
					hash : ``,
					sig : ``,
				};
				item.sig = await Web3Signer.signObject( walletItem.privateKey, item, exceptedKeys );
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
	 * 	update name by address
	 *
	 *	@param address	{string}
	 *	@param name	{string}
	 *	@returns {Promise<boolean>}
	 */
	public async updateName( address : string, name : string ) : Promise<boolean>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const key : string | null = this.getKeyByAddress( address );
				if ( ! _.isString( key ) || _.isEmpty( key ) )
				{
					return reject( `${ this.constructor.name }.updateName :: invalid address` );
				}

				const userItem : SysUserItem | null = await this.get( key );
				if ( ! userItem )
				{
					return reject( `${ this.constructor.name }.updateName :: not found by address` );
				}

				//	`name` field will not be used by the signer
				const newUserItem : SysUserItem = {
					...userItem,
					name : name
				};

				await this.initDb();
				await TestUtil.sleep( 1 );
				await this.put( key, newUserItem );

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


	/**
	 * 	get the first item
	 *
	 * 	@group Basic Methods
	 * 	@returns {Promise<SysUserItem | null>}
	 */
	public async getFirst() : Promise<SysUserItem | null>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const firstItems : Array<SysUserItem | null> | null = await this.getAll( undefined, 1 );
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
				await this.initDb();
				await TestUtil.sleep( 1 );
				if ( this.sysDb )
				{
					const value : Array<string> | null = await this.sysDb.getAllKeys( this.storeName, query, maxCount );
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
	 *	@returns {Promise<Array< SysUserItem | null >>}
	 */
	public getAll( query? : string | undefined, maxCount? : number | undefined ) : Promise<Array<SysUserItem | null>>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				await this.initDb();
				await TestUtil.sleep( 1 );
				if ( this.sysDb )
				{
					const objectList : Array<SysUserItem> | null = await this.sysDb.getAll( this.storeName, query, maxCount );
					if ( Array.isArray( objectList ) )
					{
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
					return reject( `${ this.constructor.name }.delete :: invalid key for .delete` );
				}

				await this.initDb();
				await TestUtil.sleep( 1 );
				if ( this.sysDb )
				{
					await this.sysDb.delete( this.storeName, key );
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
				await this.initDb();
				await TestUtil.sleep( 1 );
				if ( this.sysDb )
				{
					const count : number = await this.sysDb.count( this.storeName, query );
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
}
