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
import {TransactionHistoryResult, TransactionMinimumNeededGas} from "../../models/TransactionModels";
import _ from "lodash";
import {AddressLike} from "ethers/src.ts/address";

/**
 *	Please configure chain/network before using this class.
 * ```ts
 * //	switch chain/network to Eth Sepolia
 * setCurrentChain( 11155111 );
 *
 * //	query currently supported chain/network
 * const supportedChains : Array<number> = new InfuraRpcService( 1 ).supportedChains();
 *
 * //	should return a supported chain list, for example:
 * [ 1, 11155111 ]
 *
 * ```
 */
export class WalletTransaction
{
	constructor()
	{
	}

	/**
	 * 	return default gas limit in wei
	 *
	 * 	@group Transaction Helper
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
	 *
	 * 	@group Transaction Helper
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
	 *
	 * 	@group Transaction Helper
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
	 * 	extract Minimum Needed Gas Limit from error
	 *
	 * 	@group Transaction Helper
	 *	@param errorObject	{any} error object
	 *	@returns {TransactionMinimumNeededGas | null}
	 */
	public extractMinimumNeededGasLimit( errorObject: any ): TransactionMinimumNeededGas | null
	{
		//
		//	InfuraRpcService error:
		//	errorObject.error =
		//	{
		//		code: -32000,
		//		message: 'intrinsic gas too low: gas 21000, minimum needed 21596'
		//	}
		//
		if ( errorObject &&
			errorObject.error &&
			_.isNumber( errorObject.error.code ) &&
			-32000 === errorObject.error.code &&
			_.isString( errorObject.error.message ) &&
			! _.isEmpty( errorObject.error.message ) &&
			errorObject.error.message.includes( `intrinsic gas too low` ) &&
			errorObject.error.message.includes( `minimum needed` ) )
		{
			//	define a regular expression to match the required numbers
			const regex = /intrinsic gas too low: gas (\d+), minimum needed (\d+)/;

			//	use regular expressions to match input strings
			const match = errorObject.error.message.match( regex );
			if ( match &&
				Array.isArray( match ) &&
				match.length > 2 )
			{
				//	extract the matching digits and convert to integers
				const gas = parseInt( match[ 1 ], 10 );
				const minimum = parseInt( match[ 2 ], 10 );

				if ( _.isNumber( gas ) && _.isNumber( minimum ) )
				{
					return { gas: gas, minimum: minimum }
				}
			}
		}

		//
		//	try to match others
		//

		//	none matched
		return null;
	}

	/**
	 * 	get last nonce count
	 *
	 * 	@group Transaction Helper
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
	 * 	sign a transaction of sending native token, before it will be broadcast
	 *
	 * 	@group Send Transaction
	 *	@param wallet		{WalletEntityBaseItem}
	 *	@param toAddress  	{string}	recipient's wallet address
	 *	@param value		{string}	ETH quantity, unit ETH, for example: "0.001" ETH
	 *	@param [nonce]		{number}	The nonce is very important. We can query the current nonce through the Infura API.
	 *	@param [gasLimit] 	{number}	in wei. The gasLimit for sending ETH is fixed at 21,000.
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
				if ( nonce <= 0 )
				{
					nonce = await this.queryNonce( wallet.address );
				}
				if ( nonce <= 0 )
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
	 *	Broadcast a transaction
	 *
	 * 	@example
	 * ```ts
	 * //
	 * //	This is a complete example of how to send a transaction using .signTransaction and .broadcastTransaction
	 * //
	 *
	 * //    switch chain/network to Eth.Sepolia
	 * setCurrentChain( 11155111 );
	 *
	 * //    try to create a wallet from a private key
	 * const publicWalletPrivateKey = '0xc7f832621897e67d973f0f1c497198ed1b89a138f2fe3cc6ce6a59cd3fb7cd4c';
	 * const walletObj = new WalletFactory().createWalletFromPrivateKey( publicWalletPrivateKey );
	 *
	 * //
	 * //    send translation from [oneKey wallet 1] to [oneKey wallet 2]
	 * //
	 * const payeeAddress : string = `0x8B4c0Dc5AA90c322C747c10FDD7cf1759D343573`;
	 * const sendValue1 : string = '0.001124';	//	in ETH
	 *
	 * let singedTx : string = await new WalletTransaction().signTransaction( walletObj, payeeAddress, sendValue1, -1, 100 );
	 * let broadcastResponse : TransactionResponse | undefined = undefined;
	 * try
	 * {
	 *	 broadcastResponse = await new WalletTransaction().broadcastTransaction( singedTx );
	 * }
	 * catch ( err : any )
	 * {
	 *       const minimumNeededGas : TransactionMinimumNeededGas | null = new WalletTransaction().extractMinimumNeededGasLimit( err );
	 *       if ( minimumNeededGas )
	 *       {
	 *             //
	 *             //    The reason for the abnormal transaction is that the gas fee is too low,
	 *             //    and we have successfully extracted the lowest gas fee reminder from the error
	 *             //
	 *             //    Now, let’s try to send this transaction again with more gas fee.
	 *             //
	 * 	       singedTx = await new WalletTransaction().signTransaction( walletObj, payeeAddress, sendValue1, -1, minimumNeededGas.minimum + 100 );
	 * 	       broadcastResponse = await new WalletTransaction().broadcastTransaction( singedTx );
	 *       }
	 *       else
	 *       {
	 *             //    just throw the error again
	 *             throw err;
	 *       }
	 * }
	 * ```
	 *
	 * 	@group Send Transaction
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
	 * 	send a native token
	 *
	 * 	@example
	 * ```ts
	 * //
	 * //	This is a complete example of how to send a native token using .sendToken
	 * //
	 *
	 * //    switch chain/network to Eth.Sepolia
	 * setCurrentChain( 11155111 );
	 *
	 * //    try to create a wallet from a private key
	 * const publicWalletPrivateKey = '0xc7f832621897e67d973f0f1c497198ed1b89a138f2fe3cc6ce6a59cd3fb7cd4c';
	 * const walletObj = new WalletFactory().createWalletFromPrivateKey( publicWalletPrivateKey );
	 *
	 * //
	 * //    send translation from [oneKey wallet 1] to [oneKey wallet 2]
	 * //
	 * const payeeAddress : string = `0x8B4c0Dc5AA90c322C747c10FDD7cf1759D343573`;
	 * const sendValue2 : string = '0.0020010';	//	in ETH
	 * let broadcastResponse : TransactionResponse | undefined = undefined;
	 * try
	 * {
	 *	 broadcastResponse = await new WalletTransaction().sendToken( walletObj, payeeAddress, sendValue2, -1, 100 );
	 * }
	 * catch ( err : any )
	 * {
	 *       const minimumNeededGas : TransactionMinimumNeededGas | null = new WalletTransaction().extractMinimumNeededGasLimit( err );
	 *       if ( minimumNeededGas )
	 *       {
	 *             //
	 *             //    The reason for the abnormal transaction is that the gas fee is too low,
	 *             //    and we have successfully extracted the lowest gas fee reminder from the error
	 *             //
	 *             //    Now, let’s try to send this transaction again with more gas fee.
	 *             //
	 *             broadcastResponse = await new WalletTransaction().sendToken( walletObj, payeeAddress, sendValue2, -1, minimumNeededGas.minimum + 100 );
	 *       }
	 *       else
	 *       {
	 *             //    just throw the error again
	 *             throw err;
	 *       }
	 * }
	 * ```
	 *
	 * 	@group Send Transaction
	 *	@param wallet		{WalletEntityBaseItem} wallet object
	 *	@param to		{string} recipient's wallet address
	 *	@param value		{string} value in ETH. for example: '0.2' ETH
	 *	@param [nonce]		{number} nonce value
	 *	@param [gasLimit]	{number} gas limit value, in wei.
	 *	@returns {Promise<TransactionResponse>}
	 */
	public async sendToken
	(
		wallet : WalletEntityBaseItem,
		to : string,
		value : string,
		nonce : number = -1,
		gasLimit: number = -1
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

				if ( nonce <= 0 )
				{
					nonce = await this.queryNonce( wallet.address );
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
	 * 	Send a derivative token
	 *
	 * 	@example
	 * ```ts
	 * //
	 * //	This is a complete example of how to send a transaction
	 * //
	 *
	 * //    switch chain/network to Eth.Sepolia
	 * setCurrentChain( 11155111 );
	 *
	 * //    try to create a wallet from a private key
	 * const publicWalletPrivateKey = '0xc7f832621897e67d973f0f1c497198ed1b89a138f2fe3cc6ce6a59cd3fb7cd4c';
	 * const walletObj = new WalletFactory().createWalletFromPrivateKey( publicWalletPrivateKey );
	 *
	 * //
	 * //    send translation from [oneKey wallet 1] to [oneKey wallet 2]
	 * //
	 * const payeeAddress : string = `0x8B4c0Dc5AA90c322C747c10FDD7cf1759D343573`;
	 * const usdtContractAddress = '0x271B34781c76fB06bfc54eD9cfE7c817d89f7759';	//    USDT contract address on sepolia
	 * const sendValueUsdt : string = '1.1';	//	in USDT
	 * let broadcastResponse : TransactionResponse | undefined = undefined;
	 * try
	 * {
	 *       broadcastResponse = await new WalletTransaction().sendContractToken
	 *       (
	 *             usdtContractAddress,
	 *             walletObj,
	 *             payeeAddress,
	 *             sendValueUsdt,
	 *             6
	 *       );
	 * }
	 * catch ( err : any )
	 * {
	 *       const minimumNeededGas : TransactionMinimumNeededGas | null = new WalletTransaction().extractMinimumNeededGasLimit( err );
	 *       if ( minimumNeededGas )
	 *       {
	 *             //
	 *             //    The reason for the abnormal transaction is that the gas fee is too low,
	 *             //    and we have successfully extracted the lowest gas fee reminder from the error
	 *             //
	 *             //    Now, let’s try to send this transaction again with more gas fee.
	 *             //
	 *             broadcastResponse = await new WalletTransaction().sendContractToken
	 *             (
	 *                   usdtContractAddress,
	 *                   walletObj,
	 *                   payeeAddress,
	 *                   sendValueUsdt,
	 *                   6,
	 *                   -1,
	 *                   minimumNeededGas.minimum + 100
	 *             );
	 *       }
	 *       else
	 *       {
	 *             //    just throw the error again
	 *             throw err;
	 *       }
	 * }
	 * ```
	 *
	 * 	@group Send Transaction
	 * 	@param contractAddress		{string} contract address
	 * 	@param wallet			{WalletEntityBaseItem} wallet object
	 *	@param toAddress		{string} recipient's wallet address
	 *	@param value			{string} value
	 *	@param decimals			{number} decimals
	 *	@param nonce			{number} nonce value
	 *	@param gasLimit			{number} gas limit value, in wei
	 *	@returns {Promise<TransactionResponse>}
	 */
	public async sendContractToken
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
					return reject( `${ this.constructor.name }.sendContractToken :: invalid nonce` );
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
					return reject( `${ this.constructor.name }.sendContractToken :: invalid gasLimit` );
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
	 * 	@group query Transaction
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
	 * 	@group query Transaction
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
	 * 	@group query Transaction
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
	 * 	@group query Transaction
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
	 * 	@group query Transaction
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
	 * 	@group query Transaction
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
// 	const broadcastResponse : TransactionResponse = await new WalletTransaction().sendContractToken
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
