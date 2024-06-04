/**
 * 	@category Data Models
 *
 * 	@module TokenModels
 * 	@interface
 */
export type ContractTokenBalanceItem = {
	pair : string,			//	e.g.: ETH/USD, see: EthereumPriceFeedAddresses.ts
	contractAddress : string,	//	key
	tokenBalance : bigint,
	decimals ?: number,
};

/**
 * 	@module TokenModels
 * 	@interface
 */
export type TokenValueItem = {
	//	balance
	balance : bigint,
	floatBalance : number,

	//	value
	value : bigint,
	floatValue : number,
};

/**
 * 	@module TokenModels
 * 	@interface
 */
export type ContractTokenValueItem = TokenValueItem & {
	pair : string,
	contractAddress : string,
};

/**
 * 	@module TokenModels
 *	@interface
 */
export type TotalValues = {
	values : Array<ContractTokenValueItem>,
	total : TokenValueItem,
};

/**
 * 	@module TokenModels
 * 	@interface
 */
export type ContractTokenBalances = {
	//	wallet address
	address: string,
	tokenBalances: Array<ContractTokenBalanceItem>
};
