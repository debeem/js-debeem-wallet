/**
 * 	send and receive Ethereum native token and derivative tokens,
 * 	estimate transaction gas fee in real time, and query transaction history, details and receipt
 *
 * 	@category Wallet Services
 * 	@module WalletTransaction
 */
import { ethers, isAddress } from "ethers";
import { TypeUtil } from "debeem-utils";
import { NetworkModels } from "../../models/NetworkModels";
import { usdtABI } from "../../resources/usdtABI";
import { getCurrentChain } from "../../config";
import { InfuraRpcService } from "../rpcs/infura/InfuraRpcService";
import { TransactionResponse } from "ethers/lib.commonjs/providers/provider";
import { TransactionRequest } from "ethers/src.ts";
import { WalletAccount } from "./WalletAccount";
import { FetchListOptions } from "debeem-utils";
import { AlchemyService } from "../rpcs/alchemy/AlchemyService";
import { WalletEntityBaseItem } from "../../entities/WalletEntity";
import { TransactionHistoryResult } from "../../models/TransactionModels";
import _ from "lodash";
import {AddressLike} from "ethers/src.ts/address";

/**
 * 	@class
 */
export class WalletTransaction
{
	constructor()
	{
	}

	/**
	 * 	return default gas limit
	 *
	 * 	@returns {number}
	 */
	public getDefaultGasLimit() : number
	{
		return 31000;
	}

	/**
	 * 	estimate gas limit by recipient's wallet address
	 *
	 * ```ts
	 * //
	 * //    estimate gas limit by transaction request object
	 * //
	 * const payeeAddress : string = `0x8B4c0Dc5AA90c322C747c10FDD7cf1759D343573`;
	 * const gasLimit = await new WalletTransaction().estimateEthGasLimitByToAddress( payeeAddress );
	 * //
	 * //    should return:
	 * //        gasLimit : 21000
	 * //
	 * ```
	 *	@param toAddress {AddressLike} recipient's wallet address
	 * 	@returns {Promise<number>} gas limit in wei.
	 */
	public estimateEthGasLimitByToAddress( toAddress : AddressLike )  : Promise<number>
	{
		return new Promise( async ( resolve, reject) =>
		{
			try
			{
				if ( ! _.isString( toAddress ) || ! isAddress( toAddress ) )
				{
					return reject( `${ this.constructor.name }.estimateEthGasLimitByToAddress :: invalid toAddress` );
				}

				const transactionRequest : TransactionRequest = {
					to : toAddress,
				};
				resolve( await this.estimateEthGasLimit( transactionRequest ) );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	estimate gas limit by transaction request object
	 *
	 * ```ts
	 * //
	 * //    estimate gas limit by transaction request object
	 * //
	 * const payeeAddress : string = `0x8B4c0Dc5AA90c322C747c10FDD7cf1759D343573`;
	 * const transactionRequest : TransactionRequest = {
	 *       to : payeeAddress,
	 * };
	 * const gasLimit = await new WalletTransaction().estimateEthGasLimit( transactionRequest );
	 * //
	 * //    should return:
	 * //        gasLimit : 21000
	 * //
	 * ```
	 *	@param transactionRequest {TransactionRequest} transaction request object
	 * 	@returns {Promise<number>} gas limit in wei.
	 */
	public estimateEthGasLimit( transactionRequest : TransactionRequest )  : Promise<number>
	{
		return new Promise( async ( resolve, reject) =>
		{
			try
			{
				//
				//	@documentation
				//	https://docs.infura.io/api/networks/ethereum/json-rpc-methods/eth_estimategas
				//
				if ( ! _.isObject( transactionRequest ) || ! _.has( transactionRequest, `to` ) )
				{
					return reject( `${ this.constructor.name }.estimateEthGasLimit :: invalid transactionRequest` );
				}

				const gasLimit : number = await new InfuraRpcService( getCurrentChain() ).fetchEthEstimatedGasLimit( transactionRequest );
				resolve( gasLimit );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	get last nonce count
	 *
	 *	@param address {string} wallet address
	 *	@returns {Promise<number>}
	 */
	public async queryNonce( address : string ) : Promise<number>
	{
		return new Promise( async ( resolve, reject) =>
		{
			try
			{
				if ( ! TypeUtil.isNotEmptyString( address ) )
				{
					return reject( `${ this.constructor.name }.queryNonce :: invalid address` );
				}

				const config : NetworkModels = new InfuraRpcService( getCurrentChain() ).config;
				const provider = new ethers.InfuraProvider( config.network, config.apiKey );

				//
				//	https://docs.ethers.org/v6/api/providers/#Provider-getTransactionCount
				//	Get the number of transactions ever sent for address,
				//	which is used as the nonce when sending a transaction.
				//	If blockTag is specified and the node supports archive access for that blockTag, the transaction count is as of that BlockTag.
				//
				const nonce : number = await provider.getTransactionCount( address );
				resolve( nonce );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	send ETH/native token
	 *
	 *	@param wallet		{WalletEntityBaseItem} wallet object
	 *	@param to		{string} recipient's wallet address
	 *	@param value		{string} value in ETH. for example: '0.2' ETH
	 *	@param [nonce]		{number} nonce value
	 *	@param [gasLimit]	{number} gas limit value
	 *	@returns {Promise<TransactionResponse>}
	 */
	public async send
	(
		wallet : WalletEntityBaseItem,
		to : string,
		value : string,
		nonce : number = -1,
		gasLimit: number = 0
	) : Promise<TransactionResponse>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! wallet )
				{
					return reject( `${ this.constructor.name }.send :: invalid wallet` );
				}
				if ( ! _.isString( wallet.privateKey ) || _.isEmpty( wallet.privateKey ) )
				{
					return reject( `${ this.constructor.name }.send :: invalid wallet.privateKey` );
				}
				if ( ! isAddress( wallet.address ) )
				{
					return reject( `${ this.constructor.name }.send :: invalid wallet.address` );
				}

				const signedTx : string = await this.signTransaction( wallet, to, value, nonce, gasLimit );
				const res : TransactionResponse = await this.broadcastTransaction( signedTx );
				resolve( res );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	sign a transaction before it will be broadcast
	 *
	 *	@param wallet		{WalletEntityBaseItem}
	 *	@param toAddress  	{string}	recipient's wallet address
	 *	@param value		{string}	ETH quantity, unit ETH, for example: "0.001" ETH
	 *	@param [nonce]		{number}	The nonce is very important. We can query the current nonce through the Infura API.
	 *	@param [gasLimit] 	{number}	The gasLimit for sending ETH is fixed at 21,000.
	 *						Transactions calling other contracts need to estimate the gasLimit in advance.
	 *	@returns {Promise<string>}
	 */
	public async signTransaction
	(
		wallet : WalletEntityBaseItem,
		toAddress : string,
		value : string,
		nonce : number = -1,
		gasLimit: number = 0
	) : Promise<string>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! wallet )
				{
					return reject( `${ this.constructor.name }.signTransaction :: invalid wallet` );
				}
				if ( ! _.isString( wallet.privateKey ) || _.isEmpty( wallet.privateKey ) )
				{
					return reject( `${ this.constructor.name }.signTransaction :: invalid wallet.privateKey` );
				}
				if ( ! isAddress( wallet.address ) )
				{
					return reject( `${ this.constructor.name }.signTransaction :: invalid wallet.address` );
				}

				//
				//	Calculate nonce
				//
				if ( -1 === nonce )
				{
					nonce = await this.queryNonce( wallet.address );
				}
				if ( nonce < 0 )
				{
					return reject( `${ this.constructor.name }.signTransaction :: invalid nonce` );
				}

				//
				//	Calculate gasLimit
				//
				if ( gasLimit <= 0 )
				{
					gasLimit = await this.estimateEthGasLimitByToAddress( toAddress );
					if ( gasLimit <= 0 )
					{
						gasLimit = this.getDefaultGasLimit();
					}
				}
				if ( gasLimit <= 0 )
				{
					return reject( `${ this.constructor.name }.signTransaction :: invalid gasLimit` );
				}


				const sendValue : bigint = ethers.parseEther( value );

				//	get current balance of sender
				const balanceOfSender : bigint = await new WalletAccount().queryBalance( wallet.address );
				//console.log( `wallet.address : `, wallet.address );
				//console.log( `balanceOfSender : `, balanceOfSender );
				//console.log( `sendValue : `, sendValue );
				if ( balanceOfSender < sendValue )
				{
					return reject( `${ this.constructor.name }.signTransaction :: insufficient funds` );
				}

				const gasPrice : bigint = await new InfuraRpcService( getCurrentChain() ).fetchEthGasPrice();

				//	sign now
				const config : NetworkModels = new InfuraRpcService( getCurrentChain() ).config;
				const privateKey = wallet.privateKey;
				const signWallet = new ethers.Wallet( privateKey );
				const chain = ethers.Network.from( config.network );

				const transaction : TransactionRequest = {
					to: toAddress,
					value: sendValue,
					chainId: chain.chainId,
					nonce: nonce,
					gasLimit: gasLimit,
					gasPrice: BigInt( gasPrice ),
				}

				const bigGasLimit : bigint = BigInt( gasLimit );
				const totalCost : bigint = bigGasLimit * gasPrice + sendValue;
				if ( totalCost > balanceOfSender )
				{
					//	send have not enough money to perform this transaction
					return reject( `${ this.constructor.name }.signTransaction :: insufficient funds for intrinsic transaction cost` );
				}

				const signedTransaction : string = await signWallet.signTransaction( transaction );
				resolve( signedTransaction );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 *	Broadcast transaction
	 *
	 *	@param signedTx		{string} the string of the signed transaction object
	 *	@returns {Promise<TransactionResponse>}
	 */
	public async broadcastTransaction( signedTx : string ) : Promise<TransactionResponse>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! TypeUtil.isNotEmptyString( signedTx ) )
				{
					return reject(`${ this.constructor.name }.broadcastTransaction :: invalid signature of transaction` );
				}

				//	...
				const config : NetworkModels = new InfuraRpcService( getCurrentChain() ).config;
				const provider = new ethers.InfuraProvider( config.network, config.apiKey );
				const response : TransactionResponse = await provider.broadcastTransaction( signedTx );

				//	...
				resolve( response );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	Send derivative token
	 *
	 * 	@param contractAddress		{string} contract address
	 * 	@param wallet			{WalletEntityBaseItem} wallet object
	 *	@param toAddress		{string} recipient's wallet address
	 *	@param value			{string} value
	 *	@param decimals			{number} decimals
	 *	@param nonce			{number} nonce value
	 *	@param gasLimit			{number} gas limit value
	 *	@returns {Promise<TransactionResponse>}
	 */
	public async sendContractTransaction
	(
		contractAddress : string,
		wallet : WalletEntityBaseItem,
		toAddress : string,
		value : string,
		decimals : number = 18,
		nonce : number = -1,
		gasLimit: number = 0
	) : Promise<TransactionResponse>
	{
		return new Promise( async ( resolve, reject) =>
		{
			try
			{
				if ( -1 === nonce )
				{
					nonce = await this.queryNonce( wallet.address );
				}
				if ( nonce < 0 )
				{
					return reject( `${ this.constructor.name }.sendContractTransaction :: invalid nonce` );
				}

				if ( gasLimit <= 0 )
				{
					gasLimit = await this.estimateEthGasLimitByToAddress( toAddress );
					if ( gasLimit <= 0 )
					{
						gasLimit = this.getDefaultGasLimit();
					}
				}
				if ( gasLimit <= 0 )
				{
					return reject( `${ this.constructor.name }.sendContractTransaction :: invalid gasLimit` );
				}

				const config : NetworkModels = new InfuraRpcService( getCurrentChain() ).config;
				//	Amount of derivative token to send (in the smallest unit, i.e., wei)
				const sendValue = ethers.parseUnits( value, decimals );

				//	Create a new provider (Infura) and a new wallet using the private key
				const provider = new ethers.InfuraProvider( config.network, config.apiKey );
				const signWallet = new ethers.Wallet( wallet.privateKey, provider );
				const chain = ethers.Network.from( config.network );

				//	Get the contract instance using the contract address and ABI
				const contractObj = new ethers.Contract( contractAddress, usdtABI, signWallet );

				//	Prepare the data of
				//	calling the `transfer` method of the token contract
				const transferData = contractObj.interface.encodeFunctionData("transfer", [ toAddress, sendValue ] );

				//	Get the current gas price
				const gasPrice : bigint = await new InfuraRpcService( getCurrentChain() ).fetchEthGasPrice();
				//const bigGasLimit : bigint = BigInt( gasLimit + 300000 );
				//const totalCost : bigint = bigGasLimit * gasPrice + sendValue;

				//	build the transaction object and sign it
				const transactionRequest : TransactionRequest = {
					from : wallet.address,
					to: contractAddress,
					value: 0,
					chainId: chain.chainId,
					nonce: nonce,
					gasLimit: gasLimit,
					gasPrice: BigInt( gasPrice ),
					data: transferData,
				};

				//console.log( transactionRequest );
				const signedTx = await signWallet.signTransaction( transactionRequest );

				//	Broadcast the transaction
				const response : TransactionResponse = await provider.broadcastTransaction( signedTx );
				resolve( response );
			}
			catch ( err )
			{
				reject( err )
			}
		});
	}

	/**
	 * 	Query all transaction history of a wallet
	 *
	 *	@param address	{string} wallet address
	 *	@param options	{FetchListOptions} fetch options
	 *	@returns {Promise<TransactionHistoryResult>}
	 */
	public async queryTransactionHistory( address : string, options? : FetchListOptions ) : Promise<TransactionHistoryResult>
	{
		return new AlchemyService( getCurrentChain() ).queryTransactions( address, options );
	}

	/**
	 * 	Query the transactions of a wallet by fromAddress
	 *
	 *	@param address	{string} wallet address
	 *	@param options	{FetchListOptions} fetch options
	 *	@returns {Promise<TransactionHistoryResult>}
	 */
	public async queryTransactionHistoryFromAddress( address : string, options? : FetchListOptions ) : Promise<TransactionHistoryResult>
	{
		return new AlchemyService( getCurrentChain() ).queryTransactionsFromAddress( address, options );
	}

	/**
	 * 	Query the transactions of a wallet by toAddress
	 *
	 *	@param address	{string} wallet address
	 *	@param options	{FetchListOptions} fetch options
	 *	@returns {Promise<TransactionHistoryResult>}
	 */
	public async queryTransactionHistoryToAddress( address : string, options? : FetchListOptions ) : Promise<TransactionHistoryResult>
	{
		return new AlchemyService( getCurrentChain() ).queryTransactionsToAddress( address, options );
	}


	/**
	 * 	Query the number of transactions sent from the address
	 *
	 *	@param address	{string} wallet address
	 *	@returns {Promise<bigint>}
	 */
	public async queryTransactionCountFromAddress( address : string ) : Promise<bigint>
	{
		return new InfuraRpcService( getCurrentChain() ).fetchEthTransactionCountFromAddress( address );
	}

	/**
	 * 	Query the details of a transaction
	 *
	 *	@param txHash	{string} transaction hash value
	 *	@returns {Promise<any>}
	 */
	public async queryTransactionDetail( txHash : string ) : Promise<any>
	{
		return new InfuraRpcService( getCurrentChain() ).fetchEthTransactionByHash( txHash );
	}

	/**
	 * 	Query the receipt of a transaction
	 *
	 * 	@param txHash	{string} transaction hash value
	 * 	@returns {Promise<any>}
	 */
	public async queryTransactionReceipt( txHash : string ) : Promise<any>
	{
		return new InfuraRpcService( getCurrentChain() ).fetchEthTransactionReceipt( txHash );
	}
}



// async function main()
// {
// 	//	oneKey wallet 1
// 	const mnemonic = 'lab ball helmet sure replace gauge size rescue radar cluster remember twenty';
// 	const walletObj = new WalletFactory().createWalletFromMnemonic( mnemonic );
// 	console.log( walletObj );
//
// 	//	wei, 18 decimal places
// 	const balance : bigint = await new WalletTransaction().getAccountBalance( walletObj.address );
// 	const balanceStr : string = ethers.formatEther( balance );
//
// 	//	will output: 19926499999559000n
// 	console.log( balance );
//
// 	//	will output: "0.019926499999559"
// 	console.log( balanceStr );
//
//
// 	//
// 	//	send translation from [oneKey wallet 1] to [oneKey wallet 2]
// 	//
// 	const usdtContractAddress = '0x9e15898acf36C544B6f4547269Ca8385Ce6304d8';
// 	const sendValueUsdt : string = '1.1';	//	in USDT
// 	const broadcastResponse : TransactionResponse = await new WalletTransaction().sendContractTransaction
// 	(
// 		usdtContractAddress,
// 		walletObj,
// 		'0x1c33566D0e191a1FCe9885470362e85A757d9aBA',
// 		sendValueUsdt,
// 		6
// 	);
// 	console.log( broadcastResponse )
//
// 	// const toAddress : string = '0x1c33566D0e191a1FCe9885470362e85A757d9aBA';	//	oneKey wallet 2
// 	// const txValue : string = '0.001';
// 	// const singedTx : string = await new WalletTransaction().signTransaction( walletObj, toAddress, txValue );
// 	// console.log( singedTx );
// 	//
// 	// const broadcastResponse : TransactionResponse = await new WalletTransaction().broadcastTransaction( singedTx );
// 	// console.log( broadcastResponse );
// }
//
// main().then();
