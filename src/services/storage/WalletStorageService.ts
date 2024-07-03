/**
 * 	@category Storage Services
 * 	@module WalletStorageService
 */
import { CallbackModels } from "../../models/CallbackModels";
import { TestUtil, TypeUtil } from "debeem-utils";

if ( TestUtil.isTestEnv() )
{
	//import "fake-indexeddb/auto";
	require('fake-indexeddb/auto');
}

import { isAddress, Wallet } from 'ethers';
import { WalletEntityBaseItem, WalletEntityItem } from "../../entities/WalletEntity";
import { AbstractEncryptedStorageService } from "./AbstractEncryptedStorageService";
import { IStorageService } from "./IStorageService";
import { VerifyUtil } from "../../utils/VerifyUtil";
import { VaWalletEntity } from "../../validators/VaWalletEntity";
import _ from "lodash";
import { SysUserItem } from "../../entities/SysUserEntity";
import { getCurrentWalletAsync } from "../../config";
import { SysConfigStorageService } from "./SysConfigStorageService";
import { SysConfigKeys } from "../../entities/SysConfigEntity";


export class WalletStorageService extends AbstractEncryptedStorageService<WalletEntityItem> implements IStorageService
{
	constructor( pinCode : string = '' )
	{
		super( 'wallet_entity', pinCode );
	}

	// private async init()
	// {
	// 	if ( this.db )
	// 	{
	// 		return this.db;
	// 	}
	//
	// 	return this.db = await openDB<WalletEntity>
	// 	(
	// 		'wallet_entity',
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
	// 			walletStore.createIndex( 'by-address', 'address' );
	// 		},
	// 	});
	// }


	/**
	 *	generate a random wallet address
	 *
	 * 	@group Extended Methods
	 * 	@returns {string} wallet address
	 */
	public generateRandomWalletAddress() : string
	{
		return Wallet.createRandom().address;
	}

	/**
	 *	Check if the input object is a valid item
	 *
	 * 	@group Basic Methods
	 *	@param item	{any}	the object to be checked
	 *	@param callback	{CallbackModels} a callback function address to receive error information
	 * 	@returns {boolean}
	 */
	public isValidItem( item : any, callback ?: CallbackModels ) : boolean
	{
		const error : string | null = VaWalletEntity.validateWalletEntityItem( item );
		if ( null !== error )
		{
			VerifyUtil.setErrorDesc( callback, error );
			return false;
		}

		return true;
	}

	/**
	 * 	get storage key by item object
	 *
	 * 	@group Basic Methods
	 *	@param item	{WalletEntityItem | WalletEntityBaseItem} WalletEntityItem object
	 *	@returns {string | null}
	 */
	public getKeyByItem( item : WalletEntityItem | WalletEntityBaseItem ) : string | null
	{
		const error : string | null = VaWalletEntity.validateWalletEntityBaseItem( item );
		if ( null === error )
		{
			return item.address;
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

				const key : string | null = this.getKeyByItem( walletBaseItem );
				if ( _.isString( key ) && ! _.isEmpty( key ) )
				{
					const walletEntityItem : WalletEntityItem | null = await this.get( key );
					return resolve( !! walletEntityItem );
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
	 * 	get item by CurrentWallet
	 * 	@returns {Promise< WalletEntityItem | null >}
	 */
	public async getByCurrentWallet() : Promise< WalletEntityItem | null >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				//	get current wallet
				const currentWallet : string | undefined = await new SysConfigStorageService().getConfig( SysConfigKeys.currentWallet );
				if ( ! _.isString( currentWallet ) || _.isEmpty( currentWallet ) )
				{
					return reject( `${ this.constructor.name }.getByCurrentWallet :: invalid currentWallet` );
				}

				//	...
				resolve( await this.get( currentWallet ) );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 *	Put an item into database. replaces the item with the same key.
	 *
	 * 	@group Basic Methods
	 *	@param key	{string} storage key
	 *	@param value	{WalletEntityItem}	structured data objects
	 *	@returns {Promise<boolean>}
	 */
	public async put( key: string, value : WalletEntityItem ) : Promise<boolean>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! this.isValidItem( value ) )
				{
					return reject( `${ this.constructor.name }.put :: invalid value` );
				}

				value = {
					...value,
					pinCode : ``,
				};
				resolve( await super.put( key, value ) );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}
}
