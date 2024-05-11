import {
	isAddress
} from "ethers";
import { TypeUtil } from "debeem-utils";
import { WalletEntityBaseItem } from "../../entities/WalletEntity";
import { EtherWallet } from "web3id";
import { TWalletBaseItem } from "web3id/src/models/TWallet";


/**
 * 	@class
 */
export class WalletFactory
{
	constructor()
	{
	}

	/**
	 *	@param wallet	{any}
	 *	@returns {boolean}
	 */
	public static isValidWalletFactoryData( wallet : any ) : boolean
	{
		return TypeUtil.isNotNullObjectWithKeys( wallet, [ 'isHD', 'mnemonic', 'password', 'address', 'publicKey', 'privateKey', 'index', 'path' ] );
	}

	/**
	 * 	Create a wallet from a mnemonic phrase.
	 *	@param mnemonic	- string
	 *	@returns {WalletEntityBaseItem}
	 */
	public createWalletFromMnemonic( mnemonic? : string ) : WalletEntityBaseItem
	{
		return EtherWallet.createWalletFromMnemonic( mnemonic ) as WalletEntityBaseItem;
	}

	/**
	 * 	Returns the wallet details for the JSON Keystore Wallet json using {password}.
	 * 	https://docs.ethers.org/v6/api/wallet/
	 *	https://docs.ethers.org/v6/api/wallet/#KeystoreAccount
	 *	@param keystoreJson	{string} Wallet keystore JSON string
	 *	@param password		{string} decrypt keystoreJson using {password}
	 *	@returns {Promise<WalletEntityBaseItem>}
	 */
	public createWalletFromKeystore( keystoreJson : string, password : string = '' ) : Promise<WalletEntityBaseItem>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const wallet : TWalletBaseItem = await EtherWallet.createWalletFromKeystore( keystoreJson, password );
				resolve( wallet as WalletEntityBaseItem );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 * 	Resolved to the JSON Keystore Wallet for {wallet} encrypted with {password}.
	 *	@param wallet	{WalletEntityBaseItem}
	 *	@param password	{string}		encrypt {wallet} with {password}
	 *	@returns {Promise<string>}
	 */
	public getKeystoreOfWallet( wallet : WalletEntityBaseItem, password : string = '' ) : Promise<string>
	{
		return EtherWallet.getKeystoreOfWallet( wallet, password );
	}

	/**
	 * 	https://iancoleman.io/bip39/
	 * 	扩展私钥不是钱包的私钥，是助记词
	 * 	m/44'/60'/0'/0
	 * 	Derivation Path  BIP44
	 *
	 * 	Create a wallet from an extended private key.
	 *	supported BIP32 Root Key | Account Extended Private Key | BIP32 Extended Private Key
	 *	@param extendedKey	{string}	- BIP32 Extended Private Key
	 *	@returns {WalletEntityBaseItem}
	 */
	public createWalletFromExtendedKey( extendedKey : string ) : WalletEntityBaseItem
	{
		return EtherWallet.createWalletFromExtendedKey( extendedKey ) as WalletEntityBaseItem;
	}


	/**
	 *	Create a wallet from a wallet private key
	 *	@param privateKey	{any}
	 *	@returns {WalletEntityBaseItem}
	 */
	public createWalletFromPrivateKey( privateKey : any = null ) : WalletEntityBaseItem
	{
		return EtherWallet.createWalletFromPrivateKey( privateKey ) as WalletEntityBaseItem;
	}

	/**
	 *	Create a watch wallet from a wallet address
	 *	@param address	{string}
	 *	@returns {WalletEntityBaseItem}
	 */
	public createWalletFromAddress( address : string ) : WalletEntityBaseItem
	{
		return EtherWallet.createWalletFromAddress( address ) as WalletEntityBaseItem;
	}

	/**
	 *	@param address	{string}
	 *	@returns {WalletEntityBaseItem}
	 */
	public createWatchWallet( address : string ) : WalletEntityBaseItem
	{
		return this.createWalletFromAddress( address );
	}


	/**
	 *	@param address	{string}	- wallet address
	 *	@return {boolean}
	 */
	public isValidAddress( address : string ) : boolean
	{
		return isAddress( address );
	}

	/**
	 *	Generate a new address for the specified wallet
	 *	@param wallet	{any}
	 *	@returns {WalletEntityBaseItem}
	 */
	public createNewAddress( wallet : any ) : WalletEntityBaseItem
	{
		return EtherWallet.createNewAddress( wallet ) as WalletEntityBaseItem;
	}
}
