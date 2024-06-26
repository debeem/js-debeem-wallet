/**
 * 	@category Storage Services
 * 	@module WalletStorageService
 */
import { CallbackModels } from "../../models/CallbackModels";
import { TestUtil } from "debeem-utils";

if ( TestUtil.isTestEnv() )
{
	//import "fake-indexeddb/auto";
	require('fake-indexeddb/auto');
}

//import { v4 as uuidv4 } from 'uuid';
//import { encodeBase58, toUtf8Bytes } from 'ethers';
import { isAddress, Wallet } from 'ethers';
import { WalletEntityItem } from "../../entities/WalletEntity";
import { AbstractStorageService } from "./AbstractStorageService";
import { IStorageService } from "./IStorageService";
import { VerifyUtil } from "../../utils/VerifyUtil";


export class WalletStorageService extends AbstractStorageService<WalletEntityItem> implements IStorageService
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
		if ( ! VerifyUtil.returnNotNullObject( item, callback, `null item` ) )
		{
			return false;
		}
		if ( ! VerifyUtil.returnNotEmptyString( item.name, callback, `empty .name` ) )
		{
			return false;
		}
		if ( ! VerifyUtil.returnNotGreaterThanNumeric( item.chainId, 0, callback, `invalid .chainId` ) )
		{
			VerifyUtil.setErrorDesc( callback,  );
			return false;
		}
		if ( ! VerifyUtil.returnNotEmptyString( item.pinCode, callback, `empty .pinCode` ) )
		{
			return false;
		}
		if ( ! VerifyUtil.returnNotEmptyString( item.address, callback, `empty .address` ) )
		{
			return false;
		}
		if ( ! isAddress( item.address ) )
		{
			VerifyUtil.setErrorDesc( callback, `invalid .address` );
			return false;
		}

		//	TODO
		//	check network

		return true;
	}

	/**
	 * 	get storage key by item object
	 *
	 * 	@group Basic Methods
	 *	@param value {WalletEntityItem} WalletEntityItem object
	 *	@returns {string | null}
	 */
	public getKeyByItem( value : WalletEntityItem ) : string | null
	{
		if ( this.isValidItem( value ) )
		{
			return value.address;
		}

		return null;
	}
}
