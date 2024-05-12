import { EthersNetworkProvider } from "./models/EthersNetworkProvider";
import { TypeUtil } from "debeem-utils";

export type ConfigurationType = {
	[key: string]: EthersNetworkProvider;
};

let configurations : ConfigurationType =
{
	infura :
		{
			network : "goerli",
			apiKey : "807f91ef9c064ddcbedf22d087dc1e3e",	//"a56c02ba9c8a4137a2a0767e4cdee7f5",
		},
	oneInch :
		{
			network		: "sepolia",
			apiKey		: '9khBH8yzfCW4YVsQmLbspLF4ahzBWaTn',
		},
	etherscan :
		{
			network   : "sepolia",
			apiKey    : "E9CHZABUH6BMDVX35PWB4WHSYNHZ53J5NE"
		},
	alchemy :
		{
			//	kamen
			network   : "eth-sepolia",
			apiKey    : "qFtLxSOgkike5Gs_yO363-NAb2l0Blwj"
		},
	coinGecko :
		{
			network   : "mainnet",
			apiKey    : ""
		},
	chainLink :
		{
			network   : "mainnet",
			apiKey    : ""
		},
};



let configDefaultEthereumTokensMainnet = [
	"0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",	//	ETH
	"0xdac17f958d2ee523a2206206994597c13d831ec7",	//	USDT
	"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",	//	USDC
];
let configDefaultEthereumTokensSepolia = [
	"0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",	//	ETH
	"0x9e15898acf36C544B6f4547269Ca8385Ce6304d8",	//	USDT
	"0x51fCe89b9f6D4c530698f181167043e1bB4abf89",	//	USDC
];
let configDefaultEthereumTokensGoerli = [
	"0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",	//	ETH
	"0x9DC9a9a2a753c13b63526d628B1Bf43CabB468Fe",	//	USDT
];



// if ( typeof process !== 'undefined' && process.env )
// {
// 	//	we are run in Node.js
// 	require('dotenv').config();
// 	let loadedCount = 0;
//
// 	//	infura
// 	if ( process.env.CONFIG_INFURA_NETWORK )
// 	{
// 		loadedCount ++;
// 		configInfura.network = process.env.CONFIG_INFURA_NETWORK;
// 	}
// 	if ( process.env.CONFIG_INFURA_APIKEY )
// 	{
// 		loadedCount ++;
// 		configInfura.apiKey = process.env.CONFIG_INFURA_APIKEY;
// 	}
//
// 	//	1inch
// 	if ( process.env.CONFIG_ONEINCH_NETWORK )
// 	{
// 		loadedCount ++;
// 		configOneInch.network = process.env.CONFIG_ONEINCH_NETWORK;
// 	}
// 	if ( process.env.CONFIG_ONEINCH_APIKEY )
// 	{
// 		loadedCount ++;
// 		configOneInch.apiKey = process.env.CONFIG_ONEINCH_APIKEY;
// 	}
// 	if ( process.env.CONFIG_ONEINCH_ENDPOINT )
// 	{
// 		loadedCount ++;
// 		configOneInch.endpoint = process.env.CONFIG_ONEINCH_ENDPOINT;
// 	}
//
// 	//	etherscan
// 	if ( process.env.CONFIG_ETHERSCAN_NETWORK )
// 	{
// 		loadedCount ++;
// 		configEtherscan.network = process.env.CONFIG_ETHERSCAN_NETWORK;
// 	}
// 	if ( process.env.CONFIG_ETHERSCAN_APIKEY )
// 	{
// 		loadedCount ++;
// 		configEtherscan.apiKey = process.env.CONFIG_ETHERSCAN_APIKEY;
// 	}
//
// 	//	alchemy
// 	if ( process.env.CONFIG_ALCHEMY_NETWORK )
// 	{
// 		loadedCount ++;
// 		configAlchemy.network = process.env.CONFIG_ALCHEMY_NETWORK;
// 	}
// 	if ( process.env.CONFIG_ALCHEMY_APIKEY )
// 	{
// 		loadedCount ++;
// 		configAlchemy.apiKey = process.env.CONFIG_ALCHEMY_APIKEY;
// 	}
//
// 	//	tokens
// 	if ( process.env.CONFIG_DEFAULT_ETHEREUM_TOKENS_MAINNET )
// 	{
// 		loadedCount ++;
// 		configDefaultEthereumTokensMainnet = process.env.CONFIG_DEFAULT_ETHEREUM_TOKENS_MAINNET.split( ',' );
// 	}
// 	if ( process.env.CONFIG_DEFAULT_ETHEREUM_TOKENS_SEPOLIA )
// 	{
// 		loadedCount ++;
// 		configDefaultEthereumTokensSepolia = process.env.CONFIG_DEFAULT_ETHEREUM_TOKENS_SEPOLIA.split( ',' );
// 	}
// 	if ( process.env.CONFIG_DEFAULT_ETHEREUM_TOKENS_GOERLI )
// 	{
// 		loadedCount ++;
// 		configDefaultEthereumTokensGoerli = process.env.CONFIG_DEFAULT_ETHEREUM_TOKENS_GOERLI.split( ',' );
// 	}
//
// 	console.log( `))) ${ loadedCount } configuration data in the .evn file are loaded!` );
// }
// else
// {
// 	console.log( `))) No configuration data is loaded from the .env file!` );
// }



/**
 * 	configuration for infura
 */
export const infura = configurations.infura;

/**
 * 	configuration for 1inch service
 */
export const oneInch = configurations.oneInch;

/**
 * 	configuration for etherscan
 */
export const etherscan = configurations.etherscan;

/**
 * 	configuration for alchemy
 */
export const alchemy = configurations.alchemy;

/**
 * 	configuration for coinGecko
 */
export const coinGecko = configurations.coinGecko;

/**
 *	configuration for chainLink
 */
export const chainLink = configurations.chainLink;


/**
 * 	define default tokens/contracts on chain ethereum
 */
export const defaultEthereumTokensMainnet	= configDefaultEthereumTokensMainnet;
export const defaultEthereumTokensSepolia	= configDefaultEthereumTokensSepolia;
export const defaultEthereumTokensGoerli	= configDefaultEthereumTokensGoerli;


/**
 * 	current chain
 */
const defaultChain : number = 11155111;
let currentChain : number = defaultChain;

export function getDefaultChain() : number
{
	return defaultChain;
}
export function getCurrentChain() : number
{
	return currentChain;
}
export function setCurrentChain( chainId : number ) : void
{
	currentChain = chainId;
}
export function revertToDefaultChain()
{
	currentChain = defaultChain;
}

export function setConfig( key : string, value : EthersNetworkProvider )
{
	if ( ! Object.keys( configurations ).includes( key ) )
	{
		throw new Error( `key not exists` );
	}
	if ( ! TypeUtil.isNotNullObjectWithKeys( value, [ 'network', 'apiKey' ] ) )
	{
		throw new Error( `invalid value` );
	}

	//	...
	configurations[ key ] = value;
}
