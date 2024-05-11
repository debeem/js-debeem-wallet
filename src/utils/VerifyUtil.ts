import { CallbackSetDesc } from "../models/CallbackSetDesc";
import { TypeUtil } from "debeem-utils";

export class VerifyUtil
{
	static setErrorDesc( callback? : CallbackSetDesc, desc? : string ) : boolean
	{
		if ( callback )
		{
			callback( desc ? desc : null );
		}

		return false;
	}

	static returnNotNullObject( obj : any, callback? : CallbackSetDesc, desc? : string ) : boolean
	{
		if ( ! TypeUtil.isNotNullObject( obj ) )
		{
			this.setErrorDesc( callback, desc );
			return false;
		}

		return true;
	}
	static returnNotEmptyString( str : any, callback? : CallbackSetDesc, desc? : string ) : boolean
	{
		if ( ! TypeUtil.isNotEmptyString( str ) )
		{
			this.setErrorDesc( callback, desc );
			return false;
		}

		return true;
	}

	static returnNotGreaterThanNumeric( num : any, target : number, callback? : CallbackSetDesc, desc? : string ) : boolean
	{
		if ( ! ( TypeUtil.isNumeric( num ) && num > target ) )
		{
			this.setErrorDesc( callback, desc );
			return false;
		}

		return true;
	}
}
