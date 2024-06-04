/**
 * 	@category Storage Entities
 *
 * 	@module StorageEntity
 */
import { DBSchema } from 'idb';

/**
 * 	@interface
 */
export interface StorageEntity extends DBSchema
{
	//	store name
	root: {
		key: string;
		value: string;
	};
}
