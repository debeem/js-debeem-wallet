export type ContractTokenBalanceItem = {
	pair : string,			//	e.g.: ETH/USD, see: EthereumPriceFeedAddresses.ts
	contractAddress : string,	//	key
	tokenBalance : bigint,
	decimals ?: number,
};

export type TokenValueItem = {
	//	balance
	balance : bigint,
	floatBalance : number,

	//	value
	value : bigint,
	floatValue : number,
};

export type ContractTokenValueItem = TokenValueItem & {
	pair : string,
	contractAddress : string,
};

export type TotalValues = {
	values : Array<ContractTokenValueItem>,
	total : TokenValueItem,
};

export type ContractTokenBalances = {
	//	wallet address
	address: string,
	tokenBalances: Array<ContractTokenBalanceItem>
};
