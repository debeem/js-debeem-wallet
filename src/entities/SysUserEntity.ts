import { DBSchema } from "idb";

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
