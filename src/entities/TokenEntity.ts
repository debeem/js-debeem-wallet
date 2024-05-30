/**
 * 	@module entities
 * 	https://github.com/jakearchibald/idb
 */
export interface TokenEntityItem
{
	wallet : string;	//	wallet address, all tokens belongs to wallet
	name: string;		//	token name
	chainId: number;	//	globally unique chain id
	address: string;	//	storage key : contract address. see file ethereumToken.json.ts
	symbol: string;		//	token name
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
