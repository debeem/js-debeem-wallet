/**
 * 	@category Services / Token
 * 	@module TokenService
 */
import { ethereumTokens } from "../../resources/ethereumTokens.json";
import { TypeUtil } from "debeem-utils";
import { MathUtil } from "debeem-utils";

//	todo
//	根据 config 处理下面的请求，否则就出问题了

/**
 * 	class TokenService
 */
export class TokenService
{
	public exists( contractAddress : string ) : boolean
	{
		return Boolean( this.getItem( contractAddress ) );
	}

	public getItem( contractAddress : string ) : Object | null
	{
		if ( ! TypeUtil.isNotEmptyString( contractAddress ) )
		{
			return null;
		}

		contractAddress = contractAddress.trim().toLowerCase();
		const keys : Array<string> = Object.keys( ethereumTokens );
		for ( const key of keys )
		{
			if ( key.trim().toLowerCase() === contractAddress )
			{
				return ethereumTokens[ key ];
			}
		}

		return null;
	}

	/**
	 *	@param contractAddress	{string}
	 */
	public getItemDecimals( contractAddress : string ) : number
	{
		try
		{
			const item : any = this.getItem( contractAddress );
			if ( item && TypeUtil.isNotNullObjectWithKeys( item, [ 'decimals' ] ) )
			{
				return MathUtil.intFromAny( item[ 'decimals' ] );
			}
		}
		catch ( err )
		{
		}

		return NaN;
	}

	/**
	 * 	get token icon by contract
	 *	@param contractAddress
	 */
	public getIconByContract( contractAddress : string ) : string | null
	{
		if ( ethereumTokens.hasOwnProperty( contractAddress ) &&
			TypeUtil.isNotNullObjectWithKeys( ethereumTokens[ contractAddress ],  [ 'symbol', 'logoURI' ] ) &&
			TypeUtil.isNotEmptyString( ethereumTokens[ contractAddress ][ 'logoURI' ] ) )
		{
			return ethereumTokens[ contractAddress ][ 'logoURI' ];
		}

		return null;
	}

	/**
	 * 	get icon by symbol
	 *	@param	symbol	- e.g. "ETH", "USDT"
	 */
	public getIconBySymbol( symbol : string ) : string | null
	{
		for ( const [ _key, value ] of Object.entries( ethereumTokens ) )
		{
			symbol = symbol.trim().toUpperCase();
			if ( TypeUtil.isNotNullObjectWithKeys( value,  [ 'symbol', 'logoURI' ] ) &&
				TypeUtil.isNotEmptyString( value[ 'symbol' ] ) &&
				TypeUtil.isNotEmptyString( value[ 'logoURI' ] ) &&
				0 === value[ 'symbol' ].trim().toUpperCase().localeCompare( symbol )
			)
			{
				return value[ 'logoURI' ];
			}
		}

		return null;
	}

	public get ETHAddress()
	{
		return `0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee`;
	}

	/**
	 *	@param contractAddress	{string}
	 */
	public isETH( contractAddress : string )
	{
		if ( ! TypeUtil.isNotEmptyString( contractAddress ) )
		{
			return false;
		}

		return this.ETHAddress.trim().toLowerCase() === contractAddress.trim().toLowerCase();
	}
}
