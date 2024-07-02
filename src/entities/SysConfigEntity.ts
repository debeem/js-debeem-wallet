/**
 * 	@category Storage Entities
 *
 * 	@module SysUserEntity
 */
import { DBSchema } from "idb";


/**
 *	@constant
 */
export const SysConfigKeys =
{
	currentChain : `CURRENT_CHAIN`,
	currentWallet : `CURRENT_WALLET`,
};


/**
 * 	@remarks
 * 	IndexedDB, but with promises:
 * 	https://github.com/jakearchibald/idb
 *
 * 	@interface
 */
export interface SysConfigEntity extends DBSchema
{
	root : {
		key: string;
		value: string;
		indexes: { 'by-value': string };
	};
}
