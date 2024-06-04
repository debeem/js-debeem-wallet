/**
 * 	@category Wallet Services
 * 	@module WalletFactory
 */
import {
	isAddress
} from "ethers";
import { TypeUtil } from "debeem-utils";
import { WalletEntityBaseItem } from "../../entities/WalletEntity";
import { EtherWallet } from "debeem-id";
import { TWalletBaseItem } from "debeem-id";


/**
 * 	@class
 *	create a new wallet, or import a wallet from a specified mnemonic, keystore, private key or wallet address.
 *
 * ```ts
 * //	create a new instance of WalletFactory
 * const instance = new WalletFactory();
 * ```
 *
 */
export class WalletFactory
{
	constructor()
	{
	}

	/**
	 * 	Check if the input data is valid WalletFactory data
	 *
	 *	@param wallet	{any}
	 *	@returns {boolean}
	 */
	public static isValidWalletFactoryData( wallet : any ) : boolean
	{
		return TypeUtil.isNotNullObjectWithKeys( wallet, [ 'isHD', 'mnemonic', 'password', 'address', 'publicKey', 'privateKey', 'index', 'path' ] );
	}

	/**
	 * 	Create a wallet from a mnemonic phrase.
	 * 	If the parameter is not specified, a random wallet will be created.
	 *
	 * ```ts
	 * //
	 * //	create a random wallet
	 * //
	 * const walletObj = new WalletFactory().createWalletFromMnemonic();
	 *
	 * //	will return a WalletEntityBaseItem object:
	 * {
	 *       isHD: true,
	 *       mnemonic: 'million butter obtain fuel address truck grunt recall gain rotate debris flee',
	 *       password: '',
	 *       address: '0x03a06e86556C819199E602851e4453a89718cB36',
	 *       publicKey: '0x0384636daeaf2f410f7c4a6749a143096838a0482bcee94e412ca3a683bca3ac00',
	 *       privateKey: '0x44dd0864d00e37090622a17e66c0914bd71a1245a3a2e4f88611775854f4eafc',
	 *       index: 0,
	 *       path: "m/44'/60'/0'/0/0"
	 * }
	 * ```
	 *
	 * ```ts
	 * //
	 * //	Create a wallet from a mnemonic phrase
	 * //
	 * const mnemonic = 'olympic cradle tragic crucial exit annual silly cloth scale fine gesture ancient';
	 * const walletObj = new WalletFactory().createWalletFromMnemonic( mnemonic );
	 *
	 * //	will return a WalletEntityBaseItem object:
	 * {
	 *    isHD: true,
	 *    mnemonic: 'olympic cradle tragic crucial exit annual silly cloth scale fine gesture ancient',
	 *    password: '',
	 *    address: '0xC8F60EaF5988aC37a2963aC5Fabe97f709d6b357',
	 *    publicKey: '0x03ed2098910ab9068abd54e1562eb9dee3cb2d9fc1426dfe91541970a89b5aa622',
	 *    privateKey: '0xf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a',
	 *    index: 0,
	 *    path: "m/44'/60'/0'/0/0"
	 * }
	 * ```
	 *
	 *	@param mnemonic	{string} mnemonic string
	 *	@returns {WalletEntityBaseItem}
	 */
	public createWalletFromMnemonic( mnemonic? : string ) : WalletEntityBaseItem
	{
		return EtherWallet.createWalletFromMnemonic( mnemonic ) as WalletEntityBaseItem;
	}

	/**
	 * 	Returns the wallet details for the JSON Keystore Wallet json using {password}.
	 *
	 * 	@remark
	 * 	https://docs.ethers.org/v6/api/wallet/
	 * 	@remark
	 *	https://docs.ethers.org/v6/api/wallet/#KeystoreAccount
	 *
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
	 *
	 *	@param wallet	{WalletEntityBaseItem}	wallet entity base item object
	 *	@param password	{string}		encrypt {wallet} with {password}
	 *	@returns {Promise<string>}
	 */
	public getKeystoreOfWallet( wallet : WalletEntityBaseItem, password : string = '' ) : Promise<string>
	{
		return EtherWallet.getKeystoreOfWallet( wallet, password );
	}

	/**
	 * 	Create a wallet from an extended private key.
	 * 	supported BIP32 Root Key | Account Extended Private Key | BIP32 Extended Private Key
	 *
	 * 	@remark
	 * 	https://iancoleman.io/bip39/
	 * 	m/44'/60'/0'/0
	 * 	Derivation Path  BIP44
	 *
	 *	@param extendedKey	{string}	- BIP32 Extended Private Key
	 *	@returns {WalletEntityBaseItem}
	 */
	public createWalletFromExtendedKey( extendedKey : string ) : WalletEntityBaseItem
	{
		return EtherWallet.createWalletFromExtendedKey( extendedKey ) as WalletEntityBaseItem;
	}


	/**
	 *	Create a wallet from a wallet private key
	 *
	 *	@param privateKey	{any}
	 *	@returns {WalletEntityBaseItem}
	 */
	public createWalletFromPrivateKey( privateKey : any = null ) : WalletEntityBaseItem
	{
		return EtherWallet.createWalletFromPrivateKey( privateKey ) as WalletEntityBaseItem;
	}

	/**
	 *	Create a watch wallet from a wallet address
	 *
	 *	@param address	{string}
	 *	@returns {WalletEntityBaseItem}
	 */
	public createWalletFromAddress( address : string ) : WalletEntityBaseItem
	{
		return EtherWallet.createWalletFromAddress( address ) as WalletEntityBaseItem;
	}

	/**
	 * 	Create a watch wallet
	 *
	 *	@param address	{string}	wallet address
	 *	@returns {WalletEntityBaseItem}
	 */
	public createWatchWallet( address : string ) : WalletEntityBaseItem
	{
		return this.createWalletFromAddress( address );
	}


	/**
	 * 	Check the input value is a valid address
	 *	@param address	{string}	- wallet address
	 *	@return {boolean}
	 */
	public isValidAddress( address : string ) : boolean
	{
		return isAddress( address );
	}

	/**
	 *	Generate a new address for the specified wallet
	 *
	 *	@param wallet	{any}	wallet object
	 *	@returns {WalletEntityBaseItem}
	 */
	public createNewAddress( wallet : any ) : WalletEntityBaseItem
	{
		return EtherWallet.createNewAddress( wallet ) as WalletEntityBaseItem;
	}
}
