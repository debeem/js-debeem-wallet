/**
 * 	@category Storage Services
 * 	@module IStorageService
 */
import { CallbackModels } from "../../models/CallbackModels";

/**
 * 	@interface
 */
export interface IStorageService
{
	isValidItem( item : any, callback ?: CallbackModels ) : boolean;
	getKeyByItem( value : any ) : string | null;

	get( key : string ) : Promise<any | null>;

	getFirst() : Promise<any | null>;
	getAllKeys( query? : string, maxCount? : number ) : Promise<Array<string>>;
	getAll( query? : string, maxCount? : number ) : Promise<Array<any>>;

	put( key : string, value : any ) : Promise<boolean>;

	delete( key : string ) : Promise<boolean>;

	clear() : Promise<boolean>;
	count( query? : string ) : Promise<number>;
}
