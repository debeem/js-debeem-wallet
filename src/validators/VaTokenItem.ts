import _ from "lodash";

export class VaTokenItem
{
	static validateContractTokenBalanceItem( contractTokenBalanceItem : any ) : string | null
	{
		if ( ! contractTokenBalanceItem )
		{
			return `invalid contractTokenBalanceItem`;
		}
		if ( ! _.isString( contractTokenBalanceItem.pair ) || _.isEmpty( contractTokenBalanceItem.pair ) )
		{
			return `invalid contractTokenBalanceItem.pair`;
		}
		if ( ! _.isString( contractTokenBalanceItem.contractAddress ) || _.isEmpty( contractTokenBalanceItem.contractAddress ) )
		{
			return `invalid contractTokenBalanceItem.contractAddress`;
		}
		if ( 'bigint' !== typeof contractTokenBalanceItem.tokenBalance )
		{
			return `invalid contractTokenBalanceItem.tokenBalance`;
		}
		if ( ! _.isNumber( contractTokenBalanceItem.decimals ) || contractTokenBalanceItem.decimals <= 0 )
		{
			return `invalid contractTokenBalanceItem.decimals`;
		}

		return null;
	}

	static validateContractTokenBalanceItemDecimals( decimals : any ) : string | null
	{
		if ( ! decimals || ! _.isNumber( decimals ) || decimals < 0 )
		{
			return `invalid decimals`;
		}

		return null;
	}

}