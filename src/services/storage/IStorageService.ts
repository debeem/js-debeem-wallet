import { CallbackSetDesc } from "../../models/CallbackSetDesc";

export interface IStorageService
{
	isValidItem( item : any, callback ?: CallbackSetDesc ) : boolean;
	getKeyByItem( value : any ) : string | null;

	get( key : string ) : Promise<any | null>;

	getFirst() : Promise<any | null>;
	getAllKeys( query? : string, maxCount? : number ) : Promise<Array<string> | null>;
	getAll( query? : string, maxCount? : number ) : Promise<Array<any> | null>;

	put( key : string, value : any ) : Promise<boolean>;

	delete( key : string ) : Promise<boolean>;

	clear() : Promise<boolean>;
	count( query? : string ) : Promise<number>;
}
