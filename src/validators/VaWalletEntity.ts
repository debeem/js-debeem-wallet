import _ from "lodash";
import { isHexString } from "ethers";
import { WalletEntityBaseItem, WalletEntityItem } from "../entities/WalletEntity";
import { isAddress } from "ethers";


export class VaWalletEntity
{
	/**
	 * 	validate if the input value is a valid WalletEntityBaseItem
	 *
	 *	@param walletEntityBaseItem	{ WalletEntityBaseItem | any }
	 *	@returns {string | null}
	 */
	static validateWalletEntityBaseItem( walletEntityBaseItem : WalletEntityBaseItem | any ) : string | null
	{
		if ( ! walletEntityBaseItem )
		{
			return `invalid walletEntityBaseItem`;
		}

		/**
		 * 	A boolean value indicating if this is an HD wallet
		 */
		if ( ! _.isBoolean( walletEntityBaseItem.isHD ) )
		{
			return `invalid walletEntityBaseItem.isHD`;
		}

		/**
		 * 	mnemonic phrase, a word list
		 * 	English, 日本語, Español, 中文(简体), 中文(繁體), Français, Italiano, 한국어, Čeština, Português
		 */
		if ( undefined !== walletEntityBaseItem.mnemonic )
		{
			if ( ! _.isString( walletEntityBaseItem.mnemonic ) )
			{
				return `invalid walletEntityBaseItem.mnemonic`;
			}
		}

		/**
		 * 	The password of the wallet, used to encrypt mnemonic and privateKey.
		 * 	If password is not empty, mnemonic and privateKey should be ciphertext
		 */
		if ( ! _.isString( walletEntityBaseItem.password ) )
		{
			return `invalid walletEntityBaseItem.password`;
		}

		/**
		 * 	wallet address
		 */
		if ( ! _.isString( walletEntityBaseItem.address ) ||
			_.isEmpty( walletEntityBaseItem.address ) ||
			! isAddress( walletEntityBaseItem.address ) )
		{
			return `invalid walletEntityBaseItem.address`;
		}

		if ( ! _.isString( walletEntityBaseItem.privateKey ) ||
			_.isEmpty( walletEntityBaseItem.privateKey ) ||
			! isHexString( walletEntityBaseItem.privateKey, 32 ) )
		{
			return `invalid walletEntityBaseItem.privateKey`;
		}
		if ( ! _.isString( walletEntityBaseItem.publicKey ) ||
			_.isEmpty( walletEntityBaseItem.publicKey ) ||
			! isHexString( walletEntityBaseItem.publicKey, 33 ) )
		{
			return `invalid walletEntityBaseItem.publicKey`;
		}

		/**
		 * 	The index of the generated wallet address. For non-HD wallets, the index will always be 0
		 */
		if ( ! _.isNumber( walletEntityBaseItem.index ) )
		{
			return `invalid walletEntityBaseItem.index`;
		}

		/**
		 * 	Wallet path. For non-HD wallets, the path is empty
		 */
		if ( undefined !== walletEntityBaseItem.path )
		{
			if ( ! _.isString( walletEntityBaseItem.path ) && null !== walletEntityBaseItem.path )
			{
				return `invalid walletEntityBaseItem.path`;
			}
		}

		/**
		 * 	The depth of this wallet, which is the number of components in its path.
		 */
		if ( undefined !== walletEntityBaseItem.depth )
		{
			if ( ! _.isNumber( walletEntityBaseItem.depth ) )
			{
				return `invalid walletEntityBaseItem.depth`;
			}
		}

		/**
		 * 	The fingerprint.
		 *
		 *	A fingerprint allows quick qay to detect parent and child nodes,
		 *	but developers should be prepared to deal with collisions as it is only 4 bytes.
		 */
		if ( undefined !== walletEntityBaseItem.fingerprint )
		{
			if ( ! _.isString( walletEntityBaseItem.fingerprint ) )
			{
				return `invalid walletEntityBaseItem.fingerprint`;
			}
		}

		/**
		 * 	The parent fingerprint
		 */
		if ( undefined !== walletEntityBaseItem.parentFingerprint )
		{
			if ( ! _.isString( walletEntityBaseItem.parentFingerprint ) )
			{
				return `invalid walletEntityBaseItem.parentFingerprint`;
			}
		}

		/**
		 * 	The chaincode, which is effectively a public key used to derive children.
		 */
		if ( undefined !== walletEntityBaseItem.chainCode )
		{
			if ( ! _.isString( walletEntityBaseItem.chainCode ) )
			{
				return `invalid walletEntityBaseItem.chainCode`;
			}
		}

		return null;
	}

	/**
	 * 	validate if the input is a valid WalletEntityItem
	 *
	 *	@param walletEntityItem	{ WalletEntityItem | any }
	 *	@returns {string | null}
	 */
	static validateWalletEntityItem( walletEntityItem : WalletEntityItem | any ) : string | null
	{
		if ( ! walletEntityItem )
		{
			return `invalid walletEntityItem`;
		}

		const errorWalletEntityBaseItem : string | null = this.validateWalletEntityBaseItem( walletEntityItem );
		if ( null !== errorWalletEntityBaseItem )
		{
			return errorWalletEntityBaseItem;
		}

		/**
		 * 	the wallet name
		 */
		if ( ! _.isString( walletEntityItem.name ) || _.isEmpty( walletEntityItem.name ) )
		{
			return `invalid walletEntityItem.name`;
		}

		/**
		 * 	chainId/network
		 */
		if ( ! _.isNumber( walletEntityItem.chainId ) || walletEntityItem.chainId <= 0 )
		{
			return `invalid walletEntityItem.chainId`;
		}

		/**
		 * 	MUST BE EMPTY STRING
		 *
		 * 	the PIN code (Personal Identification Number Code)
		 * 	Usually consists of pure numbers, and the common length is 4 to 6 digits.
		 *
		 * 	the Password for local storage encryption
		 */
		if ( ! _.isString( walletEntityItem.pinCode ) ||
			! _.isEmpty( walletEntityItem.pinCode ) )
		{
			return `invalid walletEntityItem.pinCode`;
		}

		if ( undefined !== walletEntityItem.remark )
		{
			if ( ! _.isString( walletEntityItem.remark ) ||
				_.isEmpty( walletEntityItem.remark ) )
			{
				return `invalid walletEntityItem.remark`;
			}
			if ( walletEntityItem.remark.length > 256 )
			{
				return `invalid walletEntityItem.remark, cannot be longer than 256 characters`;
			}
		}

		if ( undefined !== walletEntityItem.avatar )
		{
			if ( ! _.isString( walletEntityItem.avatar ) ||
				_.isEmpty( walletEntityItem.avatar ) )
			{
				return `invalid walletEntityItem.avatar`;
			}
			if ( walletEntityItem.avatar.length > 10240 )
			{
				return `invalid walletEntityItem.avatar, cannot be longer than 10240 characters`;
			}
		}

		if ( undefined !== walletEntityItem.freePayment )
		{
			if ( ! _.isBoolean( walletEntityItem.freePayment ) )
			{
				return `invalid walletEntityItem.freePayment`;
			}
		}

		return null;
	}

}