export class TypeUtil
{
	static isObject( data : any ) : boolean
	{
		const typeOfData = typeof data;
		if ( 'object' !== typeOfData )
		{
			return false;
		}
		return ! Array.isArray( data );
	}

	static isNotNullObject( data : any ) : boolean
	{
		if ( ! this.isObject( data ) )
		{
			return false;
		}
		return null !== data;
	}

	static isNotNullObjectWithKeys( data : any, keys : string[] ) : boolean
	{
		if ( ! this.isNotNullObject( data ) )
		{
			return false;
		}
		if ( Array.isArray( keys ) )
		{
			for ( const key of keys )
			{
				if ( ! data.hasOwnProperty( key ) )
				{
					return false;
				}
			}
		}

		return true;
	}

	static instanceOfWxEncryptedData( data : any ) : boolean
	{
		return this.isNotNullObjectWithKeys( data, [ 'encryptedData', 'iv' ] ) &&
			'string' === typeof data.encryptedData &&
			'string' === typeof data.iv
			;
	}

	static isNumeric( variable : any )
	{
		return 'number' === typeof variable || 'bigint' === typeof variable;
	}

	static isBoolean( variable : any )
	{
		return 'boolean' === typeof variable;
	}

	static getIntValue( obj : any ) : number
	{
		if ( this.isNumeric( obj ) || this.isString( obj ) )
		{
			return parseInt( obj );
		}

		return 0;
	}

	static getFloatValue( obj : any ) : number
	{
		if ( this.isNumeric( obj ) || this.isString( obj ) )
		{
			return parseFloat( obj );
		}

		return 0;
	}

	static isString( str : any )
	{
		return 'string' === typeof str;
	}

	static isNotEmptyString( str : any )
	{
		//	允许空格
		return this.getStringLength( str ) > 0;
	}

	static nullToEmpty( str : any ) : string
	{
		if ( this.isNotEmptyString( str ) )
		{
			return str;
		}

		return '';
	}

	static getStringLength( str : any )
	{
		return this.isString( str ) ? str.length : 0;
	}

	static getObjectLength( object : any )
	{
		if ( 'string' === typeof object )
		{
			return object.length;
		}
		else if ( 'number' === typeof object )
		{
			return String( object ).length;
		}
		else if ( Array.isArray( object ) )
		{
			return  object.length;
		}

		return 0;
	}

	static isValidUrl( urlString : any )
	{
		try
		{
			return Boolean( new URL( urlString ) );
		}
		catch( err )
		{
			return false;
		}
	}
}
