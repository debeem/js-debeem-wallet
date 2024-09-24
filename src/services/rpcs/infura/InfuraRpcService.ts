/**
 * 	@category Rpc Services
 * 	@module InfuraRpcService
 */
import lodash from 'lodash';
import { FetchUtil, FetchOptions, MathUtil } from "debeem-utils";
import { FetchResponse } from "ethers";
import { AbstractRpcService } from "../AbstractRpcService";
import { infura } from "../../../config";
import { TypeUtil } from "debeem-utils";
import { TransactionRequest } from "ethers/src.ts";
import { NetworkModels } from "../../../models/NetworkModels";
import { IRpcService } from "../IRpcService";
import _ from "lodash";
import { TransactionDetailItem } from "../../../models/TransactionModels";
import { AccessListish } from "ethers/src.ts/transaction";
import { RpcCache } from "../RpcCache";
import { RpcCacheItem } from "../../../models/RpcCacheModels";
import { BlockItem } from "../../../models/BlockModels";


export class InfuraRpcService extends AbstractRpcService implements IRpcService
{
	/**
	 * 	cache of Latest Gas Limit
	 *	@private
	 */
	private static cacheLatestGasLimit = new RpcCache( 10 * 60 * 1000 );



	/**
	 *	@param chainId {number} the chainId number. defaults to getCurrentChain()
	 */
	constructor( chainId ?: number )
	{
		super( chainId );
		this.setChainMap({
			1 : "mainnet",		//	Ethereum mainnet
			11155111 : "sepolia",	//	Ethereum Testnet Sepolia
		});

		//	load config
		//	it will check whether the network specified by chainId can be supported
		this._config = this.cloneConfig( infura );

		//	...
		this.setEndpoint( this.getEndpointByChainId( this.chainId ) );
		this.setVersion( "v3" );
		this.setApiKey( this._config.apiKey );
	}

	public get config() : NetworkModels
	{
		return this._config;
	}

	/**
	 * 	set end point by chainId
	 *
	 * 	@group Basic Methods
	 * 	@param chainId {number} the chainId number
	 *	@returns {string}
	 */
	public getEndpointByChainId( chainId ?: number ) : string
	{
		chainId = _.isNumber( chainId ) ? chainId : this.chainId;
		const network : string | null = this.getNetworkByChainId( chainId );
		if ( ! _.isString( network ) ||
			! this.supportedNetworks.includes( network ) )
		{
			throw new Error( `${ this.constructor.name }.getEndpointByChainId :: invalid network` );
		}

		return `https://${ network }.infura.io`;
	}

	public getNFTEndpoint()
	{
		return `https://nft.api.infura.io/`;
	}

	public wrapTransactionRequest( txRequest : TransactionRequest ) : any
	{
		const newTxReq : any = lodash.cloneDeep( txRequest );
		const shouldFunc = ( input : any ) =>
		{
			return typeof input === 'bigint' || typeof input === 'number';
		};
		const converterFunc = ( input : any ) =>
		{
			if ( typeof input === 'bigint' )
			{
				return `0x${ input.toString( 16 ) }`;
			}
			if ( typeof input === 'number' )
			{
				return `0x${ Number( input ).toString( 16 ) }`;
			}

			return `0x${ input }`;
		};

		if ( shouldFunc( newTxReq.gasLimit ) )
		{
			newTxReq.gasLimit = converterFunc( newTxReq.gasLimit );
		}
		if ( shouldFunc( newTxReq.gasPrice ) )
		{
			newTxReq.gasPrice = converterFunc( newTxReq.gasPrice );
		}
		if ( shouldFunc( newTxReq.maxPriorityFeePerGas ) )
		{
			newTxReq.maxPriorityFeePerGas = converterFunc( newTxReq.maxPriorityFeePerGas );
		}
		if ( shouldFunc( newTxReq.maxFeePerGas ) )
		{
			newTxReq.maxFeePerGas = converterFunc( newTxReq.maxFeePerGas );
		}
		if ( shouldFunc( newTxReq.value ) )
		{
			newTxReq.value = converterFunc( newTxReq.value );
		}
		if ( shouldFunc( newTxReq.chainId ) )
		{
			newTxReq.chainId = converterFunc( newTxReq.chainId );
		}
		if ( shouldFunc( newTxReq.nonce ) )
		{
			newTxReq.nonce = converterFunc( newTxReq.nonce );
		}

		return newTxReq;
	}

	/**
	 * 	fetch gas price
	 * 	https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_gasprice
	 */
	public async fetchEthGasPrice() : Promise<bigint>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const result = await this.fetchEthValue( 'eth_gasPrice' );
				resolve( BigInt( result ) );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	Returns an estimate of how much priority fee, in wei, you need to be included in a block.
	 * 	https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_maxpriorityfeepergas
	 */
	public async fetchEthMaxPriorityFeePerGas() : Promise<bigint>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const result = await this.fetchEthValue( 'eth_maxPriorityFeePerGas' );
				resolve( BigInt( result ) );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	Generates and returns an estimate of how much gas is necessary to allow the transaction to complete.
	 * 	The transaction will not be added to the blockchain.
	 * 	Note that the estimate may be significantly more than the amount of gas actually used by the transaction,
	 * 	for a variety of reasons including EVM mechanics and node performance.
	 * 	https://docs.infura.io/api/networks/ethereum/json-rpc-methods/eth_estimategas
	 *
	 * 	@param transactionRequest {TransactionRequest} transaction request object
	 * 	@returns {Promise<number>} gas limit in wei.
	 */
	public async fetchEthEstimatedGasLimit( transactionRequest : TransactionRequest ) : Promise<number>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				//
				//	@documentation
				//	https://docs.infura.io/api/networks/ethereum/json-rpc-methods/eth_estimategas
				//
				if ( ! _.isObject( transactionRequest ) ||
					! _.isString( transactionRequest.to ) ||
					_.isEmpty( transactionRequest.to ) )
				{
					return reject( `${ this.constructor.name }.fetchEthEstimatedGasLimit :: invalid transactionRequest` );
				}

				//	try to get the item from the cache
				const cacheKey : string = `latestGasLimit`;
				const cacheItem : RpcCacheItem | null = InfuraRpcService.cacheLatestGasLimit.get( cacheKey );
				if ( null !== cacheItem )
				{
					return resolve( cacheItem.value );
				}

				//	...
				const txReq : any = {
					... _.cloneDeep( transactionRequest ),
					block : `safe`
				};
				const params = [ this.wrapTransactionRequest( txReq ) ];
				const result = await this.fetchEthValue( 'eth_estimateGas', params );
				if ( _.isString( result ) &&
					(
						_.startsWith( result, `0x` ) || _.startsWith( result, `0X` )
					)
				)
				{
					try
					{
						//
						//	{
						//		"jsonrpc": "2.0",
						//		"id": 1,
						//		"result": "0x5cec"
						//	}
						//
						const decimalGasLimit : number = parseInt( result, 16 );

						//	update cache
						InfuraRpcService.cacheLatestGasLimit.set( cacheKey, decimalGasLimit );

						//	...
						return resolve( decimalGasLimit );
					}
					catch ( err )
					{
						console.error( `${ this.constructor.name }.fetchEthEstimatedGasLimit error in parseInt :`, err );
					}
				}

				//	failed
				resolve( 0 );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	returns the number of transactions sent from the address
	 *	@param address	{string}
	 */
	public async fetchEthTransactionCountFromAddress( address : string ) : Promise<bigint>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! TypeUtil.isNotEmptyString( address ) )
				{
					return reject( `invalid address` );
				}

				//
				//	- address: [Required]
				//	  A string representing the address (20 bytes).
				//	- block parameter: [Required]
				//	  A hexadecimal block number, or the string latest,
				//	  earliest or pending. See the default block parameter.
				//	  https://ethereum.org/en/developers/docs/apis/json-rpc/#default-block
				//
				const params = [ address, 'latest' ];
				const result = await this.fetchEthValue( 'eth_getTransactionCount', params );
				resolve( BigInt( result ) );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}


	/**
	 *	fetch information about a transaction by a given hash.
	 *
	 *	@param txHash	{string}
	 *	@returns {TransactionDetailItem}
	 *
	 */
	public async fetchEthTransactionByHash( txHash : string ) : Promise<TransactionDetailItem>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! TypeUtil.isNotEmptyString( txHash ) )
				{
					return reject( `${ this.constructor.name }.fetchEthTransactionByHash :: invalid txHash` );
				}

				//	...
				const params = [ txHash ];
				const result : any = await this.fetchEthValue( 'eth_getTransactionByHash', params );
				if ( ! result )
				{
					return reject( `${ this.constructor.name }.fetchEthTransactionByHash :: invalid response` );
				}

				//	accessList: [],
				const accessList : AccessListish | null = result.accessList;

				//	chainId: '0xaa36a7',
				const chainId : number = MathUtil.intFromHex( result.chainId );

				//	gasPrice: '0x60d781ab',
				//	The price per gas unit in wei that the sender is willing to pay.
				const gasPrice : number = MathUtil.intFromHex( result.gasPrice );

				//	maxFeePerGas: '0x62f63262',
				//	The maximum fee per gas that the sender is willing to pay (for EIP-1559 transactions).
				const maxFeePerGas : number = MathUtil.intFromHex( result.maxFeePerGas );

				//	maxPriorityFeePerGas: '0x59682f00',
				//	The maximum priority fee per gas (tip) that the sender is willing to pay.
				const maxPriorityFeePerGas : number = MathUtil.intFromHex( result.maxPriorityFeePerGas );

				//	nonce: '0xc',
				//	The number of transactions sent from the sender's address.
				const nonce : number = MathUtil.intFromHex( result.nonce );

				//	type: '0x2',
				//	The type of the transaction.
				//	0x2 indicates it is an EIP-1559 (London hard fork) transaction.
				const type : number = MathUtil.intFromHex( result.type );

				//	value: '0x2386f26fc10000',
				//	The amount of Ether (in wei) being transferred.
				//	Decimal: 0x2386f26fc10000 converts to 10000000000000000 wei, which is 0.01 Ether.
				const value : bigint = MathUtil.bigintFromHex( result.value );
				const floatValue : number = MathUtil.floatValueFromBigint( value, 18 );

				//	blockNumber: '0x5dcff7',
				//	The number of the block containing this transaction.
				// 	Decimal: `0x5dcff7` converts to 6147063.
				const blockNumber: number = MathUtil.intFromHex( result.blockNumber );

				//	gas limit
				const transactionRequest : TransactionRequest = {
					to : result.to,
				};
				const gasLimit : number = await this.fetchEthEstimatedGasLimit( transactionRequest );

				//	gas used
				//	gas: '0x5208',
				//	the maximum amount of gas units that the transaction can consume.
				// 	Decimal: `0x5208` converts to 21000.
				const gas : number = MathUtil.intFromHex( result.gas );
				const totalGasFee : bigint = BigInt( gas ) * BigInt( gasPrice );
				const floatTotalGasFee : number = MathUtil.floatValueFromBigint( totalGasFee, 18 );
				const total : bigint = value + totalGasFee;
				const floatTotal : number = MathUtil.floatValueFromBigint( total, 18 );

				//	the recovery id of the transaction signature
				const v : number = MathUtil.intFromHex( result.v );

				//	transactionIndex: '0xd',
				//	the index of the transaction in the block.
				// 	Decimal: `0xd` converts to 13.
				const transactionIndex: number = MathUtil.intFromHex( result.transactionIndex );

				//	yParity: '0x1'
				//	the parity bit for the v value in EIP-1559 transactions,
				// 	indicating the y-coordinate of the curve point for the public key recovery.
				const yParity : number = MathUtil.intFromHex( result.yParity );


				//	...
				resolve( {
					accessList : accessList,
					chainId : chainId,
					from : result.from,
					to : result.to,
					gasPrice : gasPrice,
					hash : result.hash,
					maxFeePerGas : maxFeePerGas,
					maxPriorityFeePerGas : maxPriorityFeePerGas,
					nonce : nonce,
					type : type,
					value : value,
					floatValue : floatValue,

					blockHash : result.blockHash,
					blockNumber : blockNumber,
					gasLimit : gasLimit,
					gas : gas,
					totalGasFee : totalGasFee,
					floatTotalGasFee : floatTotalGasFee,
					total : total,
					floatTotal : floatTotal,
					input : result.input,
					r: result.r,
					s: result.s,
					v: v,
					transactionIndex : transactionIndex,
					yParity : yParity,
				} );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	query information about a block by blockHash
	 *	@param blockHash		{string}	A string representing the hash (32 bytes) of a block.
	 *	@param [transactionDetails]	{boolean}	If set to true, returns the full transaction objects,
	 *							if false returns only the hashes of the transactions.
	 *	@returns {Promise<BlockItem>}
	 */
	public fetchBlockByHash( blockHash : string, transactionDetails ?: boolean ) : Promise<BlockItem>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! TypeUtil.isNotEmptyString( blockHash ) )
				{
					return reject( `invalid blockHash` );
				}

				//	...
				const params = [ blockHash, !! transactionDetails ];
				const blockInfo : BlockItem = await this.fetchEthValue( 'eth_getBlockByHash', params );
				if ( blockInfo )
				{
					blockInfo.timestampInSecond = MathUtil.intFromHex( blockInfo.timestamp );
				}

				resolve( blockInfo );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	query information about a block by hexBlockNumber
	 *	@param hexBlockNumber		{string}	A hexadecimal block number, or one of the string tags
	 *							latest, earliest, pending, safe, or finalized.
	 *							https://ethereum.org/en/developers/docs/apis/json-rpc/#default-block

	 *	@param [transactionDetails]	{boolean}	If set to true, returns the full transaction objects,
	 *							if false returns only the hashes of the transactions.
	 * 	@returns {Promise<BlockItem>}
	 */
	public fetchBlockByNumber( hexBlockNumber : string, transactionDetails ?: boolean ) : Promise<BlockItem>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! TypeUtil.isNotEmptyString( hexBlockNumber ) )
				{
					return reject( `invalid hexBlockNumber` );
				}

				//	...
				const params = [ hexBlockNumber, !! transactionDetails ];
				const blockInfo : BlockItem = await this.fetchEthValue( 'eth_getBlockByNumber', params );
				if ( blockInfo )
				{
					blockInfo.timestampInSecond = MathUtil.intFromHex( blockInfo.timestamp );
				}

				resolve( blockInfo );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	fetch the receipt of a transaction given transaction hash.
	 * 	Note that the receipt is not available for pending transactions.
	 *	@param txHash
	 */
	public async fetchEthTransactionReceipt( txHash : string ) : Promise<any>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! TypeUtil.isNotEmptyString( txHash ) )
				{
					return reject( `invalid txHash` );
				}

				//	...
				const params = [ txHash ];
				resolve( await this.fetchEthValue( 'eth_getTransactionReceipt', params ) );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}




	public async fetchEthValue( method : string, params : any = [] ) : Promise<any>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! TypeUtil.isNotEmptyString( method ) )
				{
					return reject( `invalid method` );
				}

				const url = `${ this.endpoint }/${ this.version }/${ infura.apiKey }`;
				const options : FetchOptions = {
					url : url,
					timeout : 5 * 60 * 1000,
					accept : `application/json`,
					headers : [
						//{ key : 'Authorization', value : `Bearer ${ this.apiKey }` }
					],
					body : {
						jsonrpc: '2.0',
						method: method,
						params: params,
						id: 1
					}
				};
				const response : FetchResponse = await FetchUtil.postRequest( options );
				if ( response && response.bodyJson )
				{
					const jsonObject = response.bodyJson;
					if ( TypeUtil.isNotNullObjectWithKeys( jsonObject, [ 'result' ] ) )
					{
						//	0x3b9ac4c1
						const result = jsonObject[ 'result' ];
						return resolve( result );
					}
					if ( TypeUtil.isNotNullObjectWithKeys( jsonObject, [ 'error' ] ) )
					{
						return reject( JSON.stringify( jsonObject.error ) );
					}
				}

				return reject( `invalid response` );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}
}
