import { supportedChains, defaultChains, WalletEntityItem, WalletStorageService } from 'debeem-wallet';
import { defaultTokens } from 'debeem-wallet';
import { ChainService } from 'debeem-wallet';
import { getCurrentChain, setCurrentChain } from 'debeem-wallet';
import * as Wallet from 'debeem-wallet';


console.log( `supportedChains: `, supportedChains );
console.log( `defaultChains: `, defaultChains );
console.log( `defaultTokens: `, defaultTokens );

const chainService = new ChainService();
console.log( `Chain 1: `, chainService.getItem( 1 ) );

console.log( `current chain: ${ getCurrentChain() }` );
setCurrentChain( 1 );
console.log( `current chain: ${ getCurrentChain() }` );



class StorageKeys
{
	static CURRENT_WALLET	= 'CURRENT_WALLET';
}


async function initSettings()
{
	//	user input
	const pinCode : string = '111111';
	const basicStore = new Wallet.BasicStorageService();
	const currentWalletKey : string | null = await basicStore.get( StorageKeys.CURRENT_WALLET );
	if ( ! currentWalletKey )
	{
		//	brand new
		//	redirect to page creating or importing
		throw new Error( `please create a wallet.` );
	}

	const walletStore = new WalletStorageService( pinCode );
	const walletItems : string[] | null = await walletStore.getAllKeys();
	if ( null == walletItems || 0 === walletItems.length )
	{
		//	redirect to page creating or importing
		throw new Error( `please create a wallet.` );
	}

	const walletItem : WalletEntityItem | null = await walletStore.get( currentWalletKey );
	if ( walletItem )
	{
		return walletItem;
	}
	else
	{
		const walletItemFirst : WalletEntityItem | null = await walletStore.getFirst();
		const key : string | null = walletStore.getKeyByItem( walletItemFirst );
		if ( ! key )
		{
			throw new Error( `failed to getKeyByItem` );
		}

		//	save StorageKeys.CURRENT_WALLET to database
		await basicStore.put( StorageKeys.CURRENT_WALLET, key );
		return walletItemFirst;
	}
}

initSettings().then();
