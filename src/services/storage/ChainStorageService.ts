/**
 * 	get the default supported chain list, get the specified chain information, add, delete and update chain information
 *
 * 	@category Storage Services
 * 	@module ChainStorageService
 */
import { IStorageService } from "./IStorageService";
import { TestUtil, TypeUtil } from "debeem-utils";

if ( TestUtil.isTestEnv() )
{
	//import "fake-indexeddb/auto";
	require('fake-indexeddb/auto');
}

import { ChainEntity, ChainEntityItem } from "../../entities/ChainEntity";
import { defaultChains } from '../../constants/ConstantChain';
import { CallbackModels } from "../../models/CallbackModels";
import { VerifyUtil } from "../../utils/VerifyUtil";
import _ from "lodash";
import { openDB, StoreNames } from "idb";
import { IDBPDatabase } from "idb/build/entry";


/**
 * 	@class
 *
 * 	get the default supported chain list, get the specified chain information, add, delete and update chain information
 *
 * 	@example
 * get the current chain/network list:
 *
 * ```ts
 * //
 * //	get the current chain/network list
 * //
 * const chainStorageService = new ChainStorageService();
 *
 * //    flush the default chains into database
 * await chainStorageService.flushDefault();
 *
 * //    query all items
 * const chainList : Array<ChainEntityItem | null > | null = await chainStorageService.getAll();
 *
 * //    should return:
 * [
 *    {
 *      name: 'Ethereum Mainnet',
 *      chainId: 1,
 *      token: 'ETH',
 *      rpcs: [ [Object] ],
 *      explorers: [ 'https://etherscan.io' ]
 *    },
 *    {
 *      name: 'Ethereum Testnet Sepolia',
 *      chainId: 11155111,
 *      token: 'ETH',
 *      rpcs: [ [Object] ],
 *      explorers: [ 'https://sepolia.etherscan.io' ]
 *    }
 * ]
 *
 * //
 * //    get the logo url of a specified chain/network
 * //
 * const chainId = 1;
 * const contractAddress : string = new TokenService( chainId ).nativeTokenAddress;
 * const logoUrl = await new TokenService( chainId ).getItemLogo( contractAddress );
 *
 * //    should return:
 * 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png'
 * ```
 */
export class ChainStorageService implements IStorageService
{
	/**
	 *	@ignore
	 */
	protected db !: IDBPDatabase<ChainEntity>;

	/**
	 *	@ignore
	 *	@protected
	 */
	readonly databaseName : string = 'chain_entity';

	/**
	 *	@ignore
	 *	@protected
	 */
	readonly storeName : StoreNames<ChainEntity> = 'root';


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
				this.db = await openDB<ChainEntity>
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
	 *	Check if the input object is a valid Rpc Item
	 *
	 * 	@group Extended Methods
	 *	@param item	{any}	the object to be checked
	 *	@param callback	{CallbackModels} a callback function address to receive error information
	 *	@returns {boolean}
	 */
	public isValidRpcItem( item : any, callback ?: CallbackModels ) : boolean
	{
		if ( ! VerifyUtil.returnNotNullObject( item, callback, `null rpcItem` ) )
		{
			return false;
		}
		if ( ! VerifyUtil.returnNotEmptyString( item.name, callback, `empty .name` ) )
		{
			return false;
		}
		if ( ! VerifyUtil.returnNotEmptyString( item.url, callback, `empty .url` ) )
		{
			return false;
		}
		if ( ! TypeUtil.isValidUrl( item.url ) )
		{
			return VerifyUtil.setErrorDesc( callback, `invalid .url` );
		}
		if ( ! TypeUtil.isBoolean( item.selected ) )
		{
			return VerifyUtil.setErrorDesc( callback, `invalid .selected` );
		}

		return true;
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
		if ( ! VerifyUtil.returnNotNullObject( item, callback, `null item` ) )
		{
			return false;
		}
		if ( ! VerifyUtil.returnNotEmptyString( item.name, callback, `empty .name` ) )
		{
			return false;
		}
		if ( ! VerifyUtil.returnNotGreaterThanNumeric( item.chainId, 0, callback, `invalid .chainId` ) )
		{
			return false;
		}
		if ( ! VerifyUtil.returnNotEmptyString( item.token, callback, `empty .token` ) )
		{
			return false;
		}
		if ( ! Array.isArray( item.rpcs ) )
		{
			return VerifyUtil.setErrorDesc( callback, `invalid .rpcs` );
		}
		for ( const i in item.rpcs )
		{
			let itemErrorDesc : string | null = ``;
			if ( ! this.isValidRpcItem( item.rpcs[ i ], ( desc ) =>
				{
					itemErrorDesc = desc;
				} )
			)
			{
				return VerifyUtil.setErrorDesc( callback, `invalid .rpcs[${ i }] : ${ itemErrorDesc }` );
			}
		}

		return true;
	}

	/**
	 *	Get the default list of ChainEntityItem object
	 *
	 * 	@group Extended Methods
	 *	@returns {Array<ChainEntityItem>}
	 */
	public getDefault() : Array<ChainEntityItem>
	{
		return defaultChains;
	}

	/**
	 * 	Get the default data by the this.getDefault() method and flush the data into the database
	 *
	 * 	@remark
	 * 	Data is stored in a key-value structure. If a key with the same name already exists,
	 * 	the original data will be overwritten instead of inserting a new record.
	 *
	 * 	@group Extended Methods
	 * 	@returns {Promise<boolean>}
	 */
	public async flushDefault() : Promise<boolean>
	{
		return new Promise( async ( resolve, reject) =>
		{
			try
			{
				for ( const item of this.getDefault() )
				{
					if ( ! this.isValidItem( item ) )
					{
						continue;
					}

					const checkItem : ChainEntityItem | null = await this.getByChainId( item.chainId );
					if ( ! this.isValidItem( checkItem ) )
					{
						const key : string | null = this.getKeyByItem( item );
						if ( key && TypeUtil.isNotEmptyString( key ) )
						{
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
	 *	@param value {ChainEntityItem} ChainEntityItem object
	 *	@returns {string | null}
	 */
	public getKeyByItem( value : ChainEntityItem ) : string | null
	{
		if ( this.isValidItem( value ) )
		{
			return this.getKeyByChainId( value.chainId );
		}

		return null;
	}

	/**
	 * 	get storage key by chainId
	 *
	 * 	@group Extended Methods
	 *	@param chainId {number} the chainId number
	 *	@returns {string}
	 */
	public getKeyByChainId( chainId : number ) : string
	{
		return `chain-${ chainId }`;
	}

	/**
	 * 	get ChainEntityItem object by chainId
	 *
	 * 	@group Extended Methods
	 *	@param chainId {number} the chainId number
	 *	@returns {Promise<ChainEntityItem | null>}
	 */
	public async getByChainId( chainId : number ) : Promise<ChainEntityItem | null>
	{
		return this.get( this.getKeyByChainId( chainId ) );
	}

	/**
	 * 	get item
	 *	@param key	{string}
	 *	@returns {Promise<ChainEntityItem | null>}
	 */
	public async get( key : string ) : Promise<ChainEntityItem | null>
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
					const value : ChainEntityItem | undefined = await this.db.get( 'root', key );
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
	 * 	get all items
	 *
	 * 	@param [query]		{string}
	 * 	@param [maxCount]	{number}
	 * 	@returns {Promise<Array<ChainEntityItem>>}
	 */
	public async getAll( query? : string, maxCount? : number ) : Promise<Array<ChainEntityItem>>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				await this.init();
				if ( this.db )
				{
					const value : Array<ChainEntityItem> | null = await this.db.getAll( 'root', query, maxCount );
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
	 *	@param value	{ChainEntityItem}
	 *	@returns {Promise<boolean>}
	 */
	public async put( key : string, value : ChainEntityItem ) : Promise<boolean>
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
	 * 	get the first item
	 *
	 * 	@returns {Promise<ChainEntityItem | null>}
	 */
	public async getFirst() : Promise<ChainEntityItem | null>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const firstItems : Array<ChainEntityItem> | null = await this.getAll( undefined, 1 );
				if ( Array.isArray( firstItems ) && 1 === firstItems.length )
				{
					return resolve( firstItems[ 0 ] );
				}

				//	...
				reject( null );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 *	calculate the number of data sets
	 *
	 *	@param [query]	{string}
	 *	@returns {Promise<number>}
	 */
	public async count( query? : string ) : Promise<number>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				await this.init();
				if ( this.db )
				{
					const count : number = await this.db.count( this.storeName, query );
					resolve( count );
				}

				//	...
				resolve( 0 );
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
	public async delete( key : string ) : Promise<boolean>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! TypeUtil.isNotEmptyString( key ) )
				{
					return reject( `invalid key for ChainStorage:delete` );
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
	 * 	delete all items
	 * 	@returns {Promise<boolean>}
	 */
	public async clear() : Promise<boolean>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				await this.init();
				if ( this.db )
				{
					await this.db.clear( 'root' );
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
}
