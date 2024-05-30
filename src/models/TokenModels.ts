/**
 * 	@category Data Models
 *
 * 	@module
 */
export type ContractTokenBalanceItem = {
	pair : string,			//	e.g.: ETH/USD, see: EthereumPriceFeedAddresses.ts
	contractAddress : string,	//	key
	tokenBalance : bigint,
	decimals ?: number,
};

/**
 * 	@module
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
 * 	@module
 */
export type ContractTokenValueItem = TokenValueItem & {
	pair : string,
	contractAddress : string,
};

/**
 * 	@module
 */
export type TotalValues = {
	values : Array<ContractTokenValueItem>,
	total : TokenValueItem,
};

/**
 * 	@module
 */
export type ContractTokenBalances = {
	//	wallet address
	address: string,
	tokenBalances: Array<ContractTokenBalanceItem>
};
