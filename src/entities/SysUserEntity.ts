/**
 * 	@category Storage Entities
 *
 * 	@module SysUserEntity
 */
import { DBSchema } from "idb";

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
		value: {
			entity: string;
			password: string;
		};
		indexes: { 'by-entity': string };
	};
}
