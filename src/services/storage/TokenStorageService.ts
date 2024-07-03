/**
 * 	@category Storage Services
 * 	@module TokenStorageService
 */
import { VerifyUtil } from "../../utils/VerifyUtil";
import { TestUtil, TypeUtil } from "debeem-utils";

if ( TestUtil.isTestEnv() )
{
	//import "fake-indexeddb/auto";
	require('fake-indexeddb/auto');
}

import { TokenEntity, TokenEntityItem } from "../../entities/TokenEntity";
import { defaultTokens } from "../../constants/ConstantToken";
import { CallbackModels } from "../../models/CallbackModels";
import { IStorageService } from "./IStorageService";
import _ from "lodash";
import { VaTokenEntity } from "../../validators/VaTokenEntity";
import { getCurrentChain } from "../../config";
import { IDBPDatabase } from "idb/build/entry";
import { openDB, StoreNames } from "idb";


export class TokenStorageService implements IStorageService
{
	/**
	 *	@ignore
	 */
	protected db !: IDBPDatabase<TokenEntity>;

	/**
	 *	@ignore
	 *	@protected
	 */
	readonly databaseName : string = 'token_entity';

	/**
	 *	@ignore
	 *	@protected
	 */
	readonly storeName : StoreNames<TokenEntity> = 'root';



	constructor()
	{
	}

	protected async init()
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( this.db )
				{
					return resolve( this.db );
				}

				//	...
				const storeName = this.storeName;
				this.db = await openDB<TokenEntity>
				(
					this.databaseName,
					1,
					{
						upgrade( db )
						{
							db.createObjectStore( storeName );
						},
					});
				if ( ! this.db )
				{
					return reject( `${ this.constructor.name }.init :: null db` );
				}

				//	...
				resolve( this.db );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 *	Check if the input object is a valid item
	 *
	 * 	@group Basic Methods
	 *	@param item	{any}	the object to be checked
	 *	@param callback	{CallbackModels} a callback function address to receive error information
	 * 	@returns {boolean}
	 */
	public isValidItem( item : any, callback ?: CallbackModels ) : boolean
	{
		const error : string | null = VaTokenEntity.validateTokenEntityItem( item );
		if ( null !== error )
		{
			VerifyUtil.setErrorDesc( callback, `${ this.constructor.name }.isValidItem :: ${ error }` );
			return false;
		}

		return true;
	}


	/**
	 *	Get the default token list by wallet address
	 *
	 * 	@group Extended Methods
	 * 	@param wallet	{string} wallet address
	 *	@returns {Array<TokenEntityItem>}
	 */
	public getDefault( wallet : string ) : Array<TokenEntityItem>
	{
		const chainId : number = getCurrentChain();
		const errorChainId : string | null = VaTokenEntity.validateTokenEntityItemChainId( chainId );
		if ( null !== errorChainId )
		{
			throw new Error( `${ this.constructor.name }.getDefault :: invalid chainId` );
		}

		const errorWallet : string | null = VaTokenEntity.validateTokenEntityItemWallet( wallet );
		if ( null !== errorWallet )
		{
			throw new Error( `${ this.constructor.name }.getDefault :: invalid wallet` );
		}

		if ( ! _.has( defaultTokens, chainId ) )
		{
			return [];
			//throw new Error( `${ this.constructor.name }.getDefault :: unsupported chain/network` );
		}

		const defaultTokenList : Array<TokenEntityItem> = defaultTokens[ chainId ];
		if ( ! Array.isArray( defaultTokenList ) || 0 === defaultTokenList.length )
		{
			return [];
			//throw new Error( `${ this.constructor.name }.getDefault :: failed to get the tokens on chain ${ chainId }` );
		}

		let tokens : Array<TokenEntityItem> = [];
		for ( let item of defaultTokenList )
		{
			item.chainId = chainId;
			item.wallet = wallet;
			tokens.push( item );
		}

		return tokens;
	}

	/**
	 * 	Get the default data by the this.getDefault() method and flush the data into the database
	 *
	 * 	@remark
	 * 	Data is stored in a key-value structure. If a key with the same name already exists,
	 * 	the original data will be overwritten instead of inserting a new record.
	 *
	 * 	@group Extended Methods
	 * 	@param wallet	{string} wallet address
	 * 	@returns {Promise<boolean>}
	 */
	public async flushDefault( wallet : string ) : Promise<boolean>
	{
		return new Promise( async ( resolve, reject) =>
		{
			try
			{
				const chainId : number = getCurrentChain();
				const errorChainId : string | null = VaTokenEntity.validateTokenEntityItemChainId( chainId );
				if ( null !== errorChainId )
				{
					return reject( `${ this.constructor.name }.flushDefault :: invalid chainId` );
				}

				const errorWallet : string | null = VaTokenEntity.validateTokenEntityItemWallet( wallet );
				if ( null !== errorWallet )
				{
					return reject( `${ this.constructor.name }.flushDefault :: invalid wallet` );
				}

				//	...
				const defaultTokens : Array<TokenEntityItem> = this.getDefault( wallet );
				if ( ! Array.isArray( defaultTokens ) || 0 === defaultTokens.length )
				{
					return resolve( false );
				}

				//	...
				for ( let item of defaultTokens )
				{
					if ( ! this.isValidItem( item ) )
					{
						continue;
					}

					const key : string | null = this.getKeyByItem( item );
					if ( _.isString( key ) && ! _.isEmpty( key ) )
					{
						const checkItem : TokenEntityItem | null = await this.get( key );
						if ( ! this.isValidItem( checkItem ) )
						{
							//	set chainId and wallet address
							item.chainId = chainId;
							item.wallet = wallet;

							//	save the item into our database
							await this.put( key, item );
						}
					}
				}

				//	...
				resolve( true );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	get storage key by item object
	 *
	 * 	@group Basic Methods
	 *	@param item {TokenEntityItem} TokenEntityItem object
	 *	@returns {string | null}
	 */
	public getKeyByItem( item : TokenEntityItem ) : string | null
	{
		if ( this.isValidItem( item ) )
		{
			//
			//	chainId		- chain id
			//	address		= contract address
			//
			const prefix : string | null = this.getKeyPrefixByItem( item );
			if ( _.isString( prefix ) && ! _.isEmpty( prefix ) )
			{
				return `${ prefix.trim() }-${ item.address.trim() }`.toLowerCase();
			}
		}

		return null;
	}

	/**
	 * 	get the prefix of a storage key by item object
	 *
	 * 	@group Basic Methods
	 *	@param item {TokenEntityItem} TokenEntityItem object
	 *	@returns {string | null}
	 */
	public getKeyPrefixByItem( item : TokenEntityItem ) : string | null
	{
		if ( this.isValidItem( item ) )
		{
			//
			//	chainId		- chain id
			//	address		= contract address
			//
			return this.getKeyPrefixByChainIdAndWallet( item.chainId, item.wallet );
		}

		return null;
	}

	/**
	 * 	get the prefix of a storage key by chainId and wallet
	 *
	 *	@param chainId		{number}
	 *	@param wallet		{string}
	 * 	@returns {string | null}
	 */
	public getKeyPrefixByChainIdAndWallet( chainId : number, wallet : string ) : string | null
	{
		if ( null !== VaTokenEntity.validateTokenEntityItemChainId( chainId ) )
		{
			return null;
		}
		if ( null !== VaTokenEntity.validateTokenEntityItemWallet( wallet ) )
		{
			return null;
		}

		return `chain-${ chainId }-wallet-${ wallet.trim() }`.toLowerCase();
	}

	/**
	 * 	get item
	 *	@param key	{string}
	 *	@returns {Promise<TokenEntityItem | null>}
	 */
	public async get( key : string ) : Promise<TokenEntityItem | null>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! _.isString( key ) || _.isEmpty( key ) )
				{
					return reject( `${ this.constructor.name }.get :: invalid key` );
				}

				await this.init();
				if ( this.db )
				{
					const value : TokenEntityItem | undefined = await this.db.get( 'root', key );
					return resolve( value ? value : null );
				}

				reject( null );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	get all keys
	 *
	 *	@param [query]		{string}
	 *	@param [maxCount]	{number}
	 *	@returns {Promise<Array<string>>}
	 */
	public async getAllKeys( query? : string, maxCount? : number ) : Promise<Array<string>>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				await this.init();
				if ( this.db )
				{
					const value : Array<string> | null = await this.db.getAllKeys( 'root', query, maxCount );
					return resolve( value ? value : [] );
				}

				//	...
				reject( [] );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	put a value by key
	 *
	 * 	@param key	{string}
	 *	@param value	{TokenEntityItem}
	 *	@returns {Promise<boolean>}
	 */
	public async put( key : string, value : TokenEntityItem ) : Promise<boolean>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! _.isString( key ) || _.isEmpty( key ) )
				{
					return reject( `${ this.constructor.name }.put :: invalid key` );
				}
				if ( ! this.isValidItem( value ) )
				{
					return reject( `${ this.constructor.name }.put :: invalid value` );
				}

				//	...
				await this.init();
				if ( this.db )
				{
					await this.db.put( 'root', value, key );
					return resolve( true );
				}

				//	...
				reject( false );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	get the first item by wallet address
	 *
	 * 	@group Basic Methods
	 * 	@param wallet		{string} wallet address
	 * 	@returns {Promise<TokenEntityItem | null>}
	 */
	public async getFirstByWallet( wallet : string ) : Promise<TokenEntityItem | null>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const values = await this.getAllByWallet( wallet );
				if ( Array.isArray( values ) && values.length > 0 )
				{
					return resolve( values[ 0 ] );
				}

				resolve( null );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	get all keys by wallet address
	 *
	 * 	@group Basic Methods
	 * 	@param wallet		{string} wallet address
	 *	@param [query]		{string} query string
	 *	@param [maxCount]	{number} maximum limit number
	 *	@returns {Promise<Array<string> | null>}
	 */
	public async getAllKeysByWallet( wallet : string, query? : string, maxCount? : number ) : Promise<Array<string> | null>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const chainId : number = getCurrentChain();
				const errorChainId : string | null = VaTokenEntity.validateTokenEntityItemChainId( chainId );
				if ( null !== errorChainId )
				{
					return reject( `${ this.constructor.name }.getAllKeysByWallet :: invalid chainId` );
				}

				const errorWallet : string | null = VaTokenEntity.validateTokenEntityItemWallet( wallet );
				if ( null !== errorWallet )
				{
					return reject( `${ this.constructor.name }.getAllKeysByWallet :: invalid wallet` );
				}

				//	...
				const prefix : string | null = this.getKeyPrefixByChainIdAndWallet( chainId, wallet );
				if ( null === prefix )
				{
					return reject( `${ this.constructor.name }.getAllKeysByWallet :: failed to build prefix` );
				}

				//	...
				const allKeys : Array<string> | null = await this.getAllKeys( query, maxCount );
				if ( ! Array.isArray( allKeys ) || 0 === allKeys.length )
				{
					return resolve( null );
				}

				//	...
				const allTokenStorageKeys = allKeys.filter( k => k.startsWith( prefix ) );
				if ( ! Array.isArray( allTokenStorageKeys ) || 0 === allTokenStorageKeys.length )
				{
					return resolve( null );
				}

				resolve( allTokenStorageKeys );
				// const values = await this.getAllByWallet( wallet, query, maxCount );
				// if ( Array.isArray( values ) )
				// {
				// 	let keys : Array<string> = [];
				// 	for ( const item of values )
				// 	{
				// 		const key : string | null = this.getKeyByItem( item );
				// 		if ( key && TypeUtil.isNotEmptyString( key ) )
				// 		{
				// 			keys.push( key );
				// 		}
				// 	}
				// 	return resolve( keys );
				// }
				//
				// resolve( null );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	query all items by wallet address
	 *
	 * 	@group Basic Methods
	 * 	@param wallet		{string} wallet address
	 *	@param [query]		{string} query string
	 *	@param [maxCount]	{number} maximum limit number
	 * 	@return {Promise<Array<TokenEntityItem> | null>}
	 */
	public async getAllByWallet( wallet : string, query? : string, maxCount? : number ) : Promise<Array<TokenEntityItem> | null>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const chainId : number = getCurrentChain();
				const errorChainId : string | null = VaTokenEntity.validateTokenEntityItemChainId( chainId );
				if ( null !== errorChainId )
				{
					return reject( `${ this.constructor.name }.getAllByWallet :: invalid chainId` );
				}

				const errorWallet : string | null = VaTokenEntity.validateTokenEntityItemWallet( wallet );
				if ( null !== errorWallet )
				{
					return reject( `${ this.constructor.name }.getAllByWallet :: invalid wallet` );
				}

				//	...
				const allTokenStorageKeys : Array<string> | null = await this.getAllKeysByWallet( wallet, query, maxCount );
				//	console.log( `allTokenStorageKeys`, allTokenStorageKeys );
				//	should output:
				//	allTokenStorageKeys [
				//       'chain-11155111-wallet-0x47b506704da0370840c2992a3d3d301fd3c260d3-0x271b34781c76fb06bfc54ed9cfe7c817d89f7759',
				//       'chain-11155111-wallet-0x47b506704da0370840c2992a3d3d301fd3c260d3-0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
				//     ]
				//
				if ( ! Array.isArray( allTokenStorageKeys ) )
				{
					return resolve( null );
				}

				//	...
				let tokenItems : Array<TokenEntityItem> = [];
				for ( const tsKey of allTokenStorageKeys )
				{
					const item : TokenEntityItem | null = await this.get( tsKey );
					if ( null === item )
					{
						continue;
					}

					//	verify again
					if ( item &&
						null === VaTokenEntity.validateTokenEntityItemChainId( item.chainId ) &&
						null === VaTokenEntity.validateTokenEntityItemWallet( item.wallet ) &&
						chainId === item.chainId &&
						item.wallet.trim().toLowerCase() === wallet.trim().toLowerCase() )
					{
						tokenItems.push( item );
					}
				}

				return resolve( tokenItems );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	delete all items by wallet address
	 *
	 * 	@group Basic Methods
	 * 	@param wallet	{string} wallet address
	 * 	@returns {Promise<boolean>}
	 */
	public async clearByWallet( wallet : string ) : Promise<boolean>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const keys : Array<string> | null = await this.getAllKeysByWallet( wallet );
				if ( Array.isArray( keys ) )
				{
					for ( const key of keys )
					{
						await this.delete( key );
					}
				}

				resolve( true );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	Retrieves the number of records matching the given wallet and query in a store.
	 *
	 * 	@group Basic Methods
	 * 	@param wallet	{string} wallet address
	 *	@param query	{string} query string
	 *	@returns {Promise<number>}
	 */
	public async countByWallet( wallet : string, query? : string ) : Promise<number>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const keys : Array<string> | null = await this.getAllKeysByWallet( wallet );
				resolve( Array.isArray( keys ) ? keys.length : 0 );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 *	@param key	- wallet address is the key
	 *	@returns {Promise<boolean>}
	 */
	public delete( key : string ) : Promise<boolean>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! TypeUtil.isNotEmptyString( key ) )
				{
					return reject( `${ this.constructor.name }.delete :: invalid key` );
				}

				await this.init();
				if ( this.db )
				{
					await this.db.delete( 'root', key );
					return resolve( true );
				}

				reject( false );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	@hidden
	 * 	@deprecated
	 */
	public async getFirst() : Promise<TokenEntityItem | null>
	{
		throw new Error( `${ this.constructor.name }.getFirst :: this method has been deprecated and it is forbidden to call.` );
	}

	/**
	 * 	@hidden
	 * 	@deprecated
	 */
	public async getAll( query? : string, maxCount? : number ) : Promise<Array<TokenEntityItem | null>>
	{
		throw new Error( `${ this.constructor.name }.getFirst :: this method has been deprecated and it is forbidden to call.` );
	}

	/**
	 * 	@hidden
	 * 	@deprecated
	 */
	public async clear() : Promise<boolean>
	{
		throw new Error( `${ this.constructor.name }.getFirst :: this method has been deprecated and it is forbidden to call.` );
	}

	/**
	 * 	@hidden
	 * 	@deprecated
	 */
	public async count( query? : string ) : Promise<number>
	{
		throw new Error( `${ this.constructor.name }.getFirst :: this method has been deprecated and it is forbidden to call.` );
	}
}
