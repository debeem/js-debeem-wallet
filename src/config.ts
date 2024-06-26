/**
 * 	There are many chains in the entire blockchain world, such as the Bitcoin chain, Ethereum chain, etc.
 * 	Every wallet MUST work on a certain chain (or call it a network).
 *	So, before using any functions or classes in this development package, you MUST first configure a chain/network for your wallet.
 *
 * 	@remark
 *	View all chains on:
 *	https://chainlist.org/
 *
 * 	@category Configuration
 * 	@module config functions
 */
import { NetworkModels } from "./models/NetworkModels";
import { TypeUtil } from "debeem-utils";


/**
 * 	@hidden
 */
export type ConfigurationType = {
	[key: string]: NetworkModels;
};

/**
 * 	@hidden
 */
let configurations : ConfigurationType =
{
	/**
	 * 	@ignore
	 */
	infura :
		{
			network : "sepolia",
			apiKey : "807f91ef9c064ddcbedf22d087dc1e3e",	//"a56c02ba9c8a4137a2a0767e4cdee7f5",
		},

	/**
	 * 	@ignore
	 */
	oneInch :
		{
			network		: "sepolia",
			apiKey		: '9khBH8yzfCW4YVsQmLbspLF4ahzBWaTn',
		},

	/**
	 * 	@ignore
	 */
	etherscan :
		{
			network   : "sepolia",
			apiKey    : "E9CHZABUH6BMDVX35PWB4WHSYNHZ53J5NE"
		},

	/**
	 * 	@ignore
	 */
	alchemy :
		{
			//	kamen
			network   : "eth-sepolia",
			apiKey    : "qFtLxSOgkike5Gs_yO363-NAb2l0Blwj"
		},

	/**
	 * 	@ignore
	 */
	coinGecko :
		{
			network   : "mainnet",
			apiKey    : ""
		},

	/**
	 * 	@ignore
	 */
	chainLink :
		{
			network   : "mainnet",
			apiKey    : ""
		},
};


/**
 * 	@hidden
 * 	configuration for infura
 */
export const infura = configurations.infura;

/**
 * 	@hidden
 * 	configuration for 1inch service
 */
export const oneInch = configurations.oneInch;

/**
 * 	@hidden
 * 	configuration for etherscan
 */
export const etherscan = configurations.etherscan;

/**
 * 	@hidden
 * 	configuration for alchemy
 */
export const alchemy = configurations.alchemy;

/**
 * 	@hidden
 * 	configuration for coinGecko
 */
export const coinGecko = configurations.coinGecko;

/**
 * 	@hidden
 *	configuration for chainLink
 */
export const chainLink = configurations.chainLink;


/**
 * 	current chain
 */
const defaultChain : number = 11155111;
let currentChain : number = defaultChain;

/**
 * 	Get the default ChainId number
 *
 *
 * for example:
 * ```ts
 * import { getDefaultChain } from "debeem-wallet";
 *
 * const chainId = getDefaultChain();
 * ```
 *
 * 	@returns {number}
 */
export function getDefaultChain() : number
{
	return defaultChain;
}

/**
 * 	Get the chainId number currently in use
 *
 * for example:
 * ```ts
 * import { getCurrentChain } from "debeem-wallet";
 *
 * const chainId = getCurrentChain();
 * ```
 *
 * 	@returns {number}
 */
export function getCurrentChain() : number
{
	return currentChain;
}

/**
 * 	set/update the ChainId
 *
 * for example:
 * ```ts
 * import { setCurrentChain } from "debeem-wallet";
 *
 * const chainId = 1;
 * setCurrentChain( chainId );
 * ```
 *
 *	@param chainId	{number} numeric chainId
 * 	@returns {void}
 */
export function setCurrentChain( chainId : number ) : void
{
	currentChain = chainId;
}

/**
 * 	Revert the currently used ChainId to the default ChainId
 *
 * for example:
 * ```ts
 * import { revertToDefaultChain } from "debeem-wallet";
 *
 * revertToDefaultChain();
 * ```
 *
 * 	@returns {void}
 */
export function revertToDefaultChain() : void
{
	currentChain = defaultChain;
}


/**
 * 	@ignore
 *	@param key	{string}
 *	@param value	{NetworkModels}
 *	@returns {void}
 */
export function setConfig( key : string, value : NetworkModels ) : void
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
