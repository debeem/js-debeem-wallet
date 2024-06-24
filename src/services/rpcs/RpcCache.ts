/**
 * 	@category Rpc Services
 * 	@module RpcCache
 */
import { RpcCacheContainer, RpcCacheItem } from "../../models/RpcCacheModels";
import _ from "lodash";


/**
 * 	@class RpcCache
 */
export class RpcCache
{
	/**
	 * 	time to live, defaults to 10 minutes
	 *	@private
	 */
	private ttl : number = 10 * 60 * 1000;

	/**
	 * 	container
	 *	@private
	 */
	private container : RpcCacheContainer = {};


	constructor( ttl ?: number )
	{
		if ( _.isNumber( ttl ) && ttl > 0 )
		{
			this.ttl = ttl;
		}
	}

	/**
	 * 	get item
	 *
	 *	@param key	{string}
	 *	@returns {RpcCacheItem | null}
	 */
	public get( key : string ) : RpcCacheItem | null
	{
		if ( ! _.isString( key ) || _.isEmpty( key ) )
		{
			return null;
		}
		if ( _.has( this.container, key ) )
		{
			const item : RpcCacheItem = this.container[ key ];
			if ( item &&
				_.isNumber( item.ts ) &&
				item.ts > 0 &&
				item.ts > ( new Date().getTime() - this.ttl ) )
			{
				return item;
			}
		}

		return null;
	}

	/**
	 * 	set item
	 *
	 *	@param key	{string}
	 *	@param value	{any}
	 *	@returns {boolean}
	 */
	public set( key : string, value : any ) : boolean
	{
		if ( ! _.isString( key ) || _.isEmpty( key ) )
		{
			return false;
		}

		this.container[ key ] = {
			ts : new Date().getTime(),
			value : value,
		};

		return true;
	}
}