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


async function initSettings( pinCode : string = `` ) : Promise<WalletEntityItem | null>
{
	return new Promise( async ( resolve, reject ) =>
	{
		try
		{
			const basicStore = new Wallet.BasicStorageService();
			const walletStore = new WalletStorageService( pinCode );

			//	...
			let currentWalletKey : string | null = await basicStore.get( StorageKeys.CURRENT_WALLET );
			if ( null === currentWalletKey )
			{
				currentWalletKey = `wallet1`;
				await basicStore.put( StorageKeys.CURRENT_WALLET, currentWalletKey );
			}

			//	...
			const walletItem : WalletEntityItem | null = await walletStore.get( currentWalletKey );
			if ( walletItem )
			{
				return resolve( walletItem );
			}

			resolve( null );
		}
		catch ( err )
		{
			reject( err );
		}
	});
}

initSettings().then( res =>
{
	console.log( `asynchronously loaded walletEntityItem object :`, res );
})
.catch( err => {

	console.error( `err :`, err );
} );
