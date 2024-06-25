/**
 * 	@category Storage Services
 * 	@module BasicStorageService
 */
import { CallbackModels } from "../../models/CallbackModels";

if ( TestUtil.isTestEnv() )
{
	//import "fake-indexeddb/auto";
	require('fake-indexeddb/auto');
}

import { AbstractStorageService } from "./AbstractStorageService";
import { IStorageService } from "./IStorageService";
import { TestUtil } from "debeem-utils";


export namespace WalletBasicKeys
{
	const CURRENT_WALLET	= 'CURRENT_WALLET';
}

export class BasicStorageService extends AbstractStorageService<string> implements IStorageService
{
	constructor( pinCode : string = '' )
	{
		super( 'basic_entity', pinCode );
	}

	public isValidItem( item : any, callback ?: CallbackModels ) : boolean
	{
		return true;
	}
}
