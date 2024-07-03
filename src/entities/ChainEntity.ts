/**
 * 	@category Storage Entities
 *
 * 	@module ChainEntity
 */

import { DBSchema } from "idb";


/**
 * 	@remark
 *	Definition of the structure of the database entities
 *
 * 	@interface
 */
export interface ChainEntityRpcItem
{
	name : string;		//	rpc name
	url : string;		//	rpc url
	selected : boolean;	//	current selected
}

/**
 * 	@module
 */
export interface ChainEntityItem
{
	name: string;			//	chain name
	chainId: number;		//	globally unique chain id
	token?: string;			//	native currency name, e.g.: ETH
	rpcs: Array<ChainEntityRpcItem>;
	explorers?: Array<string>;
}

export interface ChainEntity extends DBSchema
{
	root : {
		key: string;
		value: ChainEntityItem;
		//indexes: { 'by-chainId': number };
	}
}
