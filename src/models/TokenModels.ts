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
	decimals : number,
};

/**
 * 	@module TokenModels
 * 	@interface
 */
export type TokenValueItem = {
	//	balance
	balance : bigint,
	balanceDecimals : number,
	floatBalance : number,

	//	value
	value : bigint,
	valueDecimals : number,
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




/**
 * 	@module TokenModels
 * 	@interface
 */
export type OneInchTokenLogoItem = {

	/**
	 * 	logo url provided by OneInch
	 */
	oneInch : string,

	/**
	 *	logo url provided by MetaBeem
	 */
	metaBeem : string,

	/**
	 * 	base64-encoded string of the image file
	 */
	base64 ?: string,

};

/**
 * 	@module TokenModels
 * 	@interface
 */
export const defaultOneInchTokenLogoItem = {

	oneInch : ``,
	metaBeem : ``,
};


/**
 * 	@module TokenModels
 * 	@interface
 */
export type OneInchTokenItem = {

	/**
	 * 	@example
	 * 	385599
	 */
	id ?: number;

	/**
	 * 	@example
	 * 	1
	 */
	chainId : number,

	/**
	 * 	@example
	 * 	"JRT"
	 */
	symbol: string,

	/**
	 * 	@example
	 * 	"Jarvis Reward Token"
	 */
	name : string,

	/**
	 *	contract address
	 *
	 * 	@example
	 * 	"0x8a9c67fee641579deba04928c4bc45f66e26343a"
	 */
	address : string,

	/**
	 * 	@example
	 * 	18
	 */
	decimals : number,

	/**
	 * 	@example
	 * 	"https://tokens.1inch.io/0x8a9c67fee641579deba04928c4bc45f66e26343a.png"
	 */
	logoURI : string | null,

	/**
	 *	logo data
	 */
	logo : OneInchTokenLogoItem,

	/**
	 * 	@example
	 * 	[
	 *       "1inch",
	 *       "CMC DeFi",
	 *       "CoinGecko",
	 *       "Coinmarketcap",
	 *       "Dharma Token List",
	 *       "Kleros Tokens",
	 *       "Zerion"
	 *     ]
	 */
	providers : Array<string>,

	eip2612 ?: boolean,
	isFoT ?: boolean,

	/**
	 * 	@example
	 * 	[
	 *       "tokens"
	 *	]
	 */
	tags : Array<string>,

	displayedSymbol ?: string,
};

/**
 * 	@module TokenModels
 * 	@interface
 */
export type OneInchTokenMap = {

	/**
	 * 	string index is the contract address
	 *
	 * 	@example
	 * 	"0x8a9c67fee641579deba04928c4bc45f66e26343a": {
	 *		"chainId": 1,
	 *		"symbol": "JRT",
	 *		"name": "Jarvis Reward Token",
	 *		"address": "0x8a9c67fee641579deba04928c4bc45f66e26343a",
	 *		"decimals": 18,
	 *		"logoURI": "https://tokens.1inch.io/0x8a9c67fee641579deba04928c4bc45f66e26343a.png",
	 *		"providers": [
	 *			"1inch",
	 *			"CMC DeFi",
	 *			"CoinGecko",
	 *			"Coinmarketcap",
	 *			"Dharma Token List",
	 *			"Kleros Tokens",
	 *			"Zerion"
	 *		],
	 *		"eip2612": true,
	 *		"tags": [
	 *			"tokens"
	 *		]
	 *	},
	 */
	[ index: string ] : OneInchTokenItem
};


/**
 * 	@module TokenModels
 * 	@interface
 */
export type OneInchTokenLogoImageItem = {

	/**
	 *	contract address
	 *
	 * 	@example
	 * 	"0x8a9c67fee641579deba04928c4bc45f66e26343a"
	 */
	address : string,

	/**
	 * 	base64-encoded string of the image file
	 */
	base64 : string,
};

/**
 * 	@module TokenModels
 * 	@interface
 */
export type OneInchTokenLogoImageMap = {

	/**
	 * 	string index is the contract address
	 */
	[ index: string ] : OneInchTokenLogoImageItem
};