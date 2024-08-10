/**
 * 	@category Storage Entities
 *
 * 	@module SysUserEntity
 */
import { DBSchema } from "idb";

/**
 * 	@interface
 */
export interface SysUserItem
{
	/**
	 * 	name
	 */
	name ?: string;

	/**
	 * 	timestamp
	 */
	timestamp : number,

	/**
	 * 	wallet address
	 */
	wallet : string;

	/**
	 * 	password by Web3Digester.hashObject( { privateKey } )
	 */
	password: string;

	/**
	 * 	hash value
	 */
	hash : string;

	/**
	 * 	let obj : SysUserItem = {
	 * 	        wallet : `{ wallet address }`,
	 * 	        password : `{ password string }`,
	 * 	        sig : ``
	 * 	}
	 *	obj.sig = Web3Signer.signObject( privateKey, obj )
	 */
	sig : string;
}

/**
 * 	@remarks
 * 	IndexedDB, but with promises:
 * 	https://github.com/jakearchibald/idb
 *
 * 	@interface
 */
export interface SysUserEntity extends DBSchema
{
	root : {
		key: string;
		value: SysUserItem;
		indexes: { 'by-wallet': string };
	};
}
