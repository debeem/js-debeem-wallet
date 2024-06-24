/**
 * 	@category Data Models
 *
 * 	@module CacheModels
 * 	@interface
 */
export interface RpcCacheItem
{
	ts : number,
	value : any,
}

/**
 * 	@module CacheModels
 * 	@interface
 */
export interface RpcCacheContainer
{
	[ key : string ] : RpcCacheItem;
}

