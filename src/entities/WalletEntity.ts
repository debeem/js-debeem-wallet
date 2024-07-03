/**
 * 	@category Storage Entities
 *
 * 	@module TokenEntityItem
 */


import { TWalletBaseItem, TWalletItem } from "debeem-id";


/**
 * 	@interface
 *
 * 	@remark
 * 	https://github.com/jakearchibald/idb
 */
export interface WalletEntityBaseItem extends TWalletBaseItem
{
}


/**
 * 	@interface
 */
export interface WalletEntityItem extends TWalletItem
{
}




// export interface WalletEntity extends DBSchema
// {
// 	root : {
// 		key: string;
// 		value: WalletEntityItem;
// 		indexes: { 'by-address': string };
// 	}
// 	// products: {
// 	// 	value: {
// 	// 		name: string;
// 	// 		price: number;
// 	// 		productCode: string;
// 	// 	};
// 	// 	key: string;
// 	// 	indexes: { 'by-price': number };
// 	// };
// }
