import { DBSchema } from 'idb';

/**
 * 	@module
 */
export interface StorageEntity extends DBSchema
{
	//	store name
	root: {
		key: string;
		value: string;
	};
}
