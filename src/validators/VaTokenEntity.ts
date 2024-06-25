import _ from "lodash";
import { isAddress } from "ethers";


/**
 * 	@class VaTokenEntity
 */
export class VaTokenEntity
{
	/**
	 * 	validate if the input value is a valid TokenEntityItem
	 *
	 * 	@param tokenEntityItem		{any}
	 * 	@returns {string | null}
	 */
	static validateTokenEntityItem( tokenEntityItem : any ) : string | null
	{
		if ( !tokenEntityItem )
		{
			return `invalid tokenEntityItem`;
		}
		if ( !_.isString( tokenEntityItem.wallet ) || _.isEmpty( tokenEntityItem.wallet ) )
		{
			return `invalid tokenEntityItem.wallet`;
		}
		if ( !_.isString( tokenEntityItem.name ) || _.isEmpty( tokenEntityItem.name ) )
		{
			return `invalid tokenEntityItem.name`;
		}
		if ( !_.isNumber( tokenEntityItem.chainId ) || tokenEntityItem.chainId <= 0 )
		{
			return `invalid tokenEntityItem.chainId`;
		}
		if ( !isAddress( tokenEntityItem.address ) )
		{
			return `invalid tokenEntityItem.address`;
		}
		if ( !_.isString( tokenEntityItem.symbol ) || _.isEmpty( tokenEntityItem.symbol ) )
		{
			return `invalid tokenEntityItem.symbol`;
		}
		if ( !_.isNumber( tokenEntityItem.decimals ) || tokenEntityItem.decimals <= 0 )
		{
			return `invalid tokenEntityItem.decimals`;
		}

		return null;
	}

	/**
	 *	validate if the input value is a valid chain id
	 *
	 * 	@param chainId		{any}
	 * 	@returns {string | null}
	 */
	static validateTokenEntityItemChainId( chainId : any ) : string | null
	{
		if ( !_.isNumber( chainId ) || chainId <= 0 )
		{
			return `invalid chainId`;
		}

		return null;
	}

	/**
	 *	validate if the input value is a valid wallet address
	 *
	 * 	@param wallet		{any}
	 * 	@returns {string | null}
	 */
	static validateTokenEntityItemWallet( wallet : any ) : string | null
	{
		if ( !_.isString( wallet ) || _.isEmpty( wallet ) )
		{
			return `invalid wallet`;
		}

		return null;
	}
}