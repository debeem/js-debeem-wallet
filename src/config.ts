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
import { SysConfigStorageService } from "./services/storage/SysConfigStorageService";
import { SysConfigKeys } from "./entities/SysConfigEntity";
import _ from "lodash";
import { WalletEntityItem } from "./entities/WalletEntity";
import { VaWalletEntity } from "./validators/VaWalletEntity";
import { SysUserStorageService } from "./services/storage/SysUserStorageService";
import { WalletStorageService } from "./services/storage/WalletStorageService";


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
 * 	asynchronously obtain the currently used chainId from the database
 *
 * for example:
 * ```ts
 * import { getCurrentChainAsync } from "debeem-wallet";
 *
 * const chainId = await getCurrentChainAsync();
 * ```
 *
 * 	@returns {Promise<number | undefined>}
 */
export async function getCurrentChainAsync() : Promise<number | undefined>
{
	return new Promise( async ( resolve, reject ) =>
	{
		try
		{
			const configCurrentChain : number | undefined = await new SysConfigStorageService().getConfigInt( SysConfigKeys.currentChain );
			resolve( configCurrentChain );
		}
		catch ( err )
		{
			reject( err );
		}
	});
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
 * 	asynchronously set/update the ChainId into the database
 *
 * for example:
 * ```ts
 * import { putCurrentChainAsync } from "debeem-wallet";
 *
 * const chainId = 1;
 * const saved : boolean = await putCurrentChainAsync( chainId );
 * ```
 *
 *	@param chainId	{number} numeric chainId
 * 	@returns {Promise<boolean>}
 */
export async function putCurrentChainAsync( chainId : number ) : Promise<boolean>
{
	return new Promise( async ( resolve, reject ) =>
	{
		try
		{
			//	save chainId into local database
			const value : string = String( chainId );
			const saved : boolean = await new SysConfigStorageService().putConfig( SysConfigKeys.currentChain, value );

			//	set chainId into memory
			setCurrentChain( chainId );
			resolve( saved );
		}
		catch ( err )
		{
			reject( err );
		}
	});
}


/**
 * 	revert the currently used ChainId to the default ChainId
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
 * 	asynchronously revert the currently used ChainId to the default ChainId,
 * 	and put it into the database
 *
 * for example:
 * ```ts
 * import { revertToDefaultChainAsync } from "debeem-wallet";
 *
 * const saved : boolean = await revertToDefaultChainAsync();
 * ```
 *
 * 	@returns {void}
 */
export async function revertToDefaultChainAsync() : Promise<boolean>
{
	currentChain = defaultChain;
	return new Promise( async ( resolve, reject ) =>
	{
		try
		{
			const saved : boolean = await putCurrentChainAsync( getDefaultChain() );
			resolve( saved );
		}
		catch ( err )
		{
			reject( err );
		}
	});
}




/**
 * 	asynchronously obtain the currently used wallet from the database
 *
 * for example:
 * ```ts
 * import { getCurrentWalletAsync } from "debeem-wallet";
 *
 * const walletAddress = await getCurrentWalletAsync();
 * ```
 *
 * 	@returns {Promise<number>}
 */
export async function getCurrentWalletAsync() : Promise< string | undefined >
{
	return new Promise( async ( resolve, reject ) =>
	{
		try
		{
			const configCurrentWallet : string | undefined = await new SysConfigStorageService().getConfig( SysConfigKeys.currentWallet );
			resolve( configCurrentWallet );
		}
		catch ( err )
		{
			reject( err );
		}
	});
}

/**
 * 	asynchronously set/update the currently used wallet into the database
 *
 * for example:
 * ```ts
 * import { putCurrentWalletAsync } from "debeem-wallet";
 *
 * const walletAddress = `0x8B4c0Dc5AA90c322C747c10FDD7cf1759D343573`;
 * const saved : boolean = await putCurrentWalletAsync( walletAddress );
 * ```
 *
 *	@param wallet	{string} wallet address
 * 	@returns {Promise<boolean>}
 */
export async function putCurrentWalletAsync( wallet : string ) : Promise<boolean>
{
	return new Promise( async ( resolve, reject ) =>
	{
		try
		{
			if ( ! _.isString( wallet ) || _.isEmpty( wallet ) )
			{
				return reject( `putCurrentWalletAsync :: invalid wallet` );
			}

			//	...
			wallet = wallet.trim().toLowerCase();
			const saved : boolean = await new SysConfigStorageService().putConfig( SysConfigKeys.currentWallet, wallet );
			resolve( saved );
		}
		catch ( err )
		{
			reject( err );
		}
	});
}

/**
 *	init wallet/user
 *
 *	@param walletItem		{WalletEntityItem}
 *	@param pinCode			{string}
 *	@param [overwriteExisting]	{boolean} defaults to false
 */
export async function initWalletAsync( walletItem : WalletEntityItem, pinCode : string, overwriteExisting ?: boolean ) : Promise<boolean>
{
	return new Promise( async ( resolve, reject ) =>
	{
		try
		{
			const vaError : string | null = VaWalletEntity.validateWalletEntityItem( walletItem );
			if ( null !== vaError )
			{
				return reject( `initWalletAsync :: ${ vaError }` );
			}
			if ( ! _.isString( pinCode ) )
			{
				return reject( `initWalletAsync :: invalid pinCode` );
			}

			//	...
			const sysUserStorageService = new SysUserStorageService();

			//	...
			const userCreated : boolean = await sysUserStorageService.createUser( walletItem, pinCode, overwriteExisting );
			if ( ! userCreated )
			{
				return reject( `initWalletAsync :: failed to create user` );
			}

			//	...
			await putCurrentWalletAsync( walletItem.address );

			//	...
			const walletStorageService = new WalletStorageService( pinCode );
			const walletKey : string | null = walletStorageService.getKeyByItem( walletItem );
			if ( ! _.isString( walletKey ) || _.isEmpty( walletKey ) )
			{
				return reject( `initWalletAsync :: failed to get walletKey` );
			}

			//	...
			const walletCreated : boolean = await walletStorageService.put( walletKey, walletItem );
			resolve( walletCreated );
		}
		catch ( err )
		{
			reject( err );
		}
	});
}




/**
 * 	@deprecated
 * 	@ignore
 *
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
