/**
 * 	@category Storage Entities
 *
 * 	@module TokenEntityItem
 */

/**
 * 	@interface
 *
 * 	@remark
 * 	https://github.com/jakearchibald/idb
 */
export interface TokenEntityItem
{
	/**
	 * 	globally unique chain id
	 */
	chainId: number;

	/**
	 * 	wallet address, tokens belongs to a wallet
	 */
	wallet : string;

	/**
	 * 	token name
	 */
	name: string;

	/**
	 * 	storage key : contract address. see file ethereumToken.json.ts
	 */
	address: string;

	/**
	 * 	token symbol
	 */
	symbol: string;

	/**
	 * 	decimals.
	 * 	for ETH, it is 18
	 */
	decimals: number;
}

// export interface TokenEntity extends DBSchema
// {
// 	root : {
// 		key: string;
// 		value: TokenEntityItem;
// 		indexes: { 'by-address': string };
// 	}
// }
