import { TypeUtil } from "debeem-utils";


export class ObjectUtil
{
	static deepGet( object : any, keyChain : string ) : any
	{
		if ( ! TypeUtil.isNotNullObject( object ) )
		{
			return null;
		}
		if ( ! TypeUtil.isNotEmptyString( keyChain ) )
		{
			return null;
		}

		//	...
		let res = null;

		try
		{
			const keyArray = keyChain.split( '.' );
			let tmp = object;
			for ( const key of keyArray )
			{
				if ( ! TypeUtil.isNotNullObject( tmp ) )
				{
					break;
				}
				if ( ! tmp.hasOwnProperty( key ) )
				{
					break;
				}

				//	...
				res = tmp[ key ];
				tmp = tmp[ key ];
			}
		}
		catch ( e )
		{
			console.error( e );
		}

		return res;
	}
}
