import { CallbackModels } from "../models/CallbackModels";
import { TypeUtil } from "debeem-utils";

export class VerifyUtil
{
	static setErrorDesc(callback? : CallbackModels, desc? : string ) : boolean
	{
		if ( callback )
		{
			callback( desc ? desc : null );
		}

		return false;
	}

	static returnNotNullObject(obj : any, callback? : CallbackModels, desc? : string ) : boolean
	{
		if ( ! TypeUtil.isNotNullObject( obj ) )
		{
			this.setErrorDesc( callback, desc );
			return false;
		}

		return true;
	}
	static returnNotEmptyString(str : any, callback? : CallbackModels, desc? : string ) : boolean
	{
		if ( ! TypeUtil.isNotEmptyString( str ) )
		{
			this.setErrorDesc( callback, desc );
			return false;
		}

		return true;
	}

	static returnNotGreaterThanNumeric(num : any, target : number, callback? : CallbackModels, desc? : string ) : boolean
	{
		if ( ! ( TypeUtil.isNumeric( num ) && num > target ) )
		{
			this.setErrorDesc( callback, desc );
			return false;
		}

		return true;
	}
}
