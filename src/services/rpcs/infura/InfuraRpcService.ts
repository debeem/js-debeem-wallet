import lodash from 'lodash';
import { FetchUtil, FetchOptions } from "debeem-utils";
import { FetchResponse } from "ethers";
import { AbstractRpcService } from "../AbstractRpcService";
import { infura } from "../../../config";
import { TypeUtil } from "debeem-utils";
import { TransactionRequest } from "ethers/src.ts";
import { EthersNetworkProvider } from "../../../models/EthersNetworkProvider";
import { IRpcService } from "../IRpcService";


export class InfuraRpcService extends AbstractRpcService implements IRpcService
{
	constructor( chainId : number )
	{
		super( chainId );
		this.setChainMap({
			1 : "mainnet",		//	Ethereum mainnet
			11155111 : "sepolia",	//	Ethereum Testnet Sepolia
			5 : "goerli",		//	Ethereum Testnet Goerli
		});

		//	load config
		//	it will check whether the network specified by chainId can be supported
		this._config = this.loadConfig( infura );

		//	...
		this.setEndpoint( this.getEndpointByNetwork( this._config.network ) );
		this.setVersion( "v3" );
		this.setApiKey( this._config.apiKey );
	}

	public get config() : EthersNetworkProvider
	{
		return this._config;
	}

	public getEndpointByNetwork( network : string ) : string
	{
		if ( ! this.supportedNetworks.includes( network ) )
		{
			throw new Error( 'invalid network' );
		}

		// case "mainnet":
		// 	return "mainnet.infura.io";
		// case "goerli":
		// 	return "goerli.infura.io";
		// case "sepolia":
		// 	return "sepolia.infura.io";
		//
		// case "arbitrum":
		// 	return "arbitrum-mainnet.infura.io";
		// case "arbitrum-goerli":
		// 	return "arbitrum-goerli.infura.io";
		// case "matic":
		// 	return "polygon-mainnet.infura.io";
		// case "matic-mumbai":
		// 	return "polygon-mumbai.infura.io";
		// case "optimism":
		// 	return "optimism-mainnet.infura.io";
		// case "optimism-goerli":
		// 	return "optimism-goerli.infura.io";

		//	...
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
	 * 	https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_estimategas
	 */
	public async fetchEthEstimateGas( transactionRequest : TransactionRequest ) : Promise<bigint>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! TypeUtil.isNotNullObject( transactionRequest ) )
				{
					return reject( `invalid transactionRequest` );
				}

				//	...
				const params = [ this.wrapTransactionRequest( transactionRequest ) ];
				const result = await this.fetchEthValue( 'eth_estimateGas', params );
				resolve( BigInt( result ) );
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
