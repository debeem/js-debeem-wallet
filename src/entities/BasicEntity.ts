/**
 * 	@category Storage Entities
 *
 * 	@module ChainEntity
 */

import { DBSchema } from "idb";


export interface BasicEntity extends DBSchema
{
	root : {
		key: string;
		value: string;
		//indexes: { 'by-chainId': number };
	}
}
