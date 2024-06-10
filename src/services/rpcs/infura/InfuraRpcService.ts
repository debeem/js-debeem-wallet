/**
 * 	@category Rpc Services
 * 	@module InfuraRpcService
 */
import lodash from 'lodash';
import { FetchUtil, FetchOptions } from "debeem-utils";
import { FetchResponse } from "ethers";
import { AbstractRpcService } from "../AbstractRpcService";
import { infura } from "../../../config";
import { TypeUtil } from "debeem-utils";
import { TransactionRequest } from "ethers/src.ts";
import { NetworkModels } from "../../../models/NetworkModels";
import { IRpcService } from "../IRpcService";
import _ from "lodash";


export class InfuraRpcService extends AbstractRpcService implements IRpcService
{
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
				if ( ! _.isObject( transactionRequest ) || ! _.has( transactionRequest, `to` ) )
				{
					return reject( `${ this.constructor.name }.fetchEthEstimatedGasLimit :: invalid transactionRequest` );
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
	 *	fetch information about a transaction for a given hash.
	 *	@param txHash
	 */
	public async fetchEthTransactionByHash( txHash : string ) : Promise<any>
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
				resolve( await this.fetchEthValue( 'eth_getTransactionByHash', params ) );
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
