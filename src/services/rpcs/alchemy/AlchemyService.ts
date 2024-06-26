/**
 * 	@category Rpc Services
 * 	@module AlchemyService
 */
import { isAddress } from "ethers";
import { AbstractRpcService } from "../AbstractRpcService";
import {
	alchemy
} from "../../../config";
import { FetchUtil, FetchListOptions, FetchOptions } from "debeem-utils";
import { FetchResponse } from "ethers";
import { NetworkModels } from "../../../models/NetworkModels";
import { TypeUtil } from "debeem-utils";
import { IRpcService } from "../IRpcService";
import {ContractTokenBalanceItem, OneInchTokenItem} from "../../../models/TokenModels";
import { TokenService } from "../../token/TokenService";
import { MathUtil } from "debeem-utils";
import {
	EnumTransactionTransferTypes,
	TransactionHistoryFetchOptions, TransactionHistoryItem,
	TransactionHistoryQueryOptions,
	TransactionHistoryResult
} from "../../../models/TransactionModels";
import _ from "lodash";
import {VaTokenItem} from "../../../validators/VaTokenItem";
import { defaultTokens } from "../../../constants/ConstantToken";



/**
 * 	class of AlchemyService
 */
export class AlchemyService extends AbstractRpcService implements IRpcService
{
	public static pageKeySplitter : string = `|M|`;
	public static enumPageKeyTypes = {
		from : 0,
		to : 1
	};


	/**
	 *	@param [chainId] 	{number} the chainId number. defaults to getCurrentChain()
	 */
	constructor( chainId ?: number )
	{
		super( chainId );
		this.setChainMap( {
			1 : 'eth-mainnet',
			//5 : 'eth-goerli',		//	not supported @202405
			11155111 : 'eth-sepolia',
			137 : 'polygon-mainnet',	//	Polygon Mainnet
			80001 : 'polygon-mumbai',	//	Polygon Testnet Mumbai
			42161 : 'arb-mainnet',		//	Arbitrum One / arb-mainnet
			421613 : 'arb-goerli',		//	Arbitrum Goerli / Arbitrum Goerli Rollup Testnet
			10 : 'opt-mainnet',		//	OP Mainnet
			420 : 'opt-goerli',		//	Optimism Goerli Testnet
		} );

		//	load config
		//	it will check whether the network specified by chainId can be supported
		this._config = this.cloneConfig( alchemy );

		//	...
		this.setEndpoint( this.getEndpointByChainId() );
		this.setVersion( "v2" );
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
	 * 	@param [chainId] 	{number} the chainId number
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

		return `https://${ network }.g.alchemy.com`;
	}

	/**
	 * 	get default transfer types
	 *
	 * 	@param [chainId]	{number} the chainId number
	 * 	@returns {Array<string>}
	 */
	public getDefaultTransferTypes( chainId ?: number ) : Array<string>
	{
		chainId = _.isNumber( chainId ) ? chainId : this.chainId;
		switch ( chainId )
		{
			case 1 :		//	eth-mainnet
			//case 5 :		//	eth-goerli
			case 11155111 :		//	eth-sepolia
			case 137 :		//	polygon-mainnet
				return [
					EnumTransactionTransferTypes.external,
					EnumTransactionTransferTypes.internal,
					EnumTransactionTransferTypes.erc20,
					EnumTransactionTransferTypes.erc721,
					EnumTransactionTransferTypes.erc1155,
					EnumTransactionTransferTypes.specialnft,
				];

			case 80001 :		//	polygon-mumbai
			case 42161 :		//	arb-mainnet
			case 421613 :		//	arb-goerli
			case 10 :		//	opt-mainnet
			case 420 :		//	opt-goerli
				return [
					EnumTransactionTransferTypes.external,
					EnumTransactionTransferTypes.erc20,
					EnumTransactionTransferTypes.erc721,
					EnumTransactionTransferTypes.erc1155,
					EnumTransactionTransferTypes.specialnft,
				];
		}

		return [];
	}

	/**
	 * 	get default contract addresses
	 *
	 * 	@param [chainId]	{number} the chainId number
	 * 	@returns {Array<string>}
	 */
	public getDefaultContractAddresses( chainId ?: number ) : Array<string>
	{
		chainId = _.isNumber( chainId ) ? chainId : this.chainId;
		switch ( chainId )
		{
			case 1 :		//	eth-mainnet
				return defaultTokens[ 1 ].map( item => item.address );
			//case 5 :		//	eth-goerli
			//	return defaultEthereumTokensGoerli;
			case 11155111 :
				return defaultTokens[ 11155111 ].map( item => item.address );
			case 137 :		//	polygon-mainnet
			case 80001 :		//	polygon-mumbai
			case 42161 :		//	arb-mainnet
			case 421613 :		//	arb-goerli
			case 10 :		//	opt-mainnet
			case 420 :		//	opt-goerli
				return [];
		}

		return [];
	}

	/**
	 * 	query all transaction list from/to the special address
	 *
	 *	@param address			{string} wallet address
	 *	@param [queryOptions]		{TransactionHistoryQueryOptions}
	 *	@param [fetchOptions]		{TransactionHistoryFetchOptions}
	 *					.fromPageKey and .toPageKey can be defined as:
	 *					- undefined : will start querying from the first page.
	 *					- empty string : no query request will be sent.
	 *	@returns {Promise<TransactionHistoryResult>}
	 */
	public async queryTransactions(
		address : string,
		queryOptions ?: TransactionHistoryQueryOptions,
		fetchOptions? : TransactionHistoryFetchOptions ) : Promise<TransactionHistoryResult>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const resultByFromAddress : TransactionHistoryResult = await this.queryTransactionsByFromAddress( address, queryOptions, fetchOptions );
				const resultByToAddress : TransactionHistoryResult = await this.queryTransactionsByToAddress( address, queryOptions, fetchOptions );

				let transactionsByFromAddress : Array<TransactionHistoryItem> | undefined = resultByFromAddress?.transfers;
				let transactionsByToAddress : Array<TransactionHistoryItem> | undefined = resultByToAddress?.transfers;
				if ( ! Array.isArray( transactionsByFromAddress ) )
				{
					transactionsByFromAddress = [];
				}
				if ( ! Array.isArray( transactionsByToAddress ) )
				{
					transactionsByToAddress = [];
				}
				const mergedArray = transactionsByFromAddress.concat( transactionsByToAddress );
				const sort = FetchUtil.getSafeSort( fetchOptions?.sort );

				//	Sort the merged array based on the sortField
				const sortField = 'blockNum';
				if ( 'asc' === sort.trim().toLowerCase() )
				{
					mergedArray.sort( ( a: TransactionHistoryItem, b: TransactionHistoryItem ) =>
					{
						return a[ sortField ].localeCompare( b[ sortField ] );
					} );
				}
				else
				{
					mergedArray.sort( ( a: TransactionHistoryItem, b: TransactionHistoryItem ) =>
					{
						return b[ sortField ].localeCompare( a[ sortField ] );
					} );
				}

				//
				//	.pageKey RETURNED FROM THE SERVER
				//		if there is no more result available for the next request,
				//		resultByFromAddress?.pageKey or resultByToAddress?.pageKey will be undefined
				//
				//	FOR THE NEXT REQUEST
				//		If the values of the variables fromPageKey and toPageKey are empty strings,
				//		indicating that there is no more item available and is no need to send the next request.
				//
				const fromPageKey = _.isString( resultByFromAddress?.pageKey ) ? resultByFromAddress?.pageKey : ``;	//	defaults to ``
				const toPageKey = _.isString( resultByToAddress?.pageKey ) ? resultByToAddress?.pageKey : ``;		//	defaults to ``
				const pageKey = `${ fromPageKey }${ AlchemyService.pageKeySplitter }${ toPageKey }`.trim();
				const result : TransactionHistoryResult = {
					//	transfer list
					transfers : mergedArray,

					//	fromPageKey and toPageKey
					//	`` : there is no more item available and is no need to send the next request.
					pageKey : AlchemyService.pageKeySplitter !== pageKey ? pageKey : ``,
				};

				//	...
				resolve( result );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 * 	query transaction list filter by fromAddress
	 *
	 * 	@remark
	 * 	https://docs.alchemy.com/reference/alchemy-getassettransfers
	 *
	 *	@param fromAddress		{string} payer's wallet address
	 *	@param [queryOptions]		{TransactionHistoryQueryOptions}
	 *	@param [fetchOptions]		{TransactionHistoryFetchOptions}
	 *	@returns {Promise<TransactionHistoryResult>}
	 */
	public async queryTransactionsByFromAddress(
		fromAddress : string,
		queryOptions ?: TransactionHistoryQueryOptions,
		fetchOptions? : TransactionHistoryFetchOptions ) : Promise<TransactionHistoryResult>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! _.isString( fromAddress ) || _.isEmpty( fromAddress ) )
				{
					return reject( `${ this.constructor.name }.queryTransactionsFromAddress :: invalid fromAddress` );
				}


				let pageKey = this.extractTransactionHistoryFetchOptionsPageKey( 0, fetchOptions );
				const upFetchOptions = { ...fetchOptions, pageKey : pageKey };
				const transactionParam = [
					{
						...this.buildQueryingTransactionsCommonParameters( queryOptions, fetchOptions ),
						fromAddress : fromAddress,
					}
				];
				const result = await this.queryTransactionsByParameter( transactionParam, fetchOptions );
				resolve( result );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 * 	query transaction list filter by toAddress
	 *
	 * 	@remark
	 * 	https://docs.alchemy.com/reference/alchemy-getassettransfers
	 *
	 *	@param toAddress		{string} the recipient's wallet address
	 *	@param [queryOptions]		{TransactionHistoryQueryOptions}
	 *	@param [fetchOptions]		{TransactionHistoryFetchOptions}
	 *	@returns {Promise<TransactionHistoryResult>}
	 */
	public async queryTransactionsByToAddress(
		toAddress : string,
		queryOptions ?: TransactionHistoryQueryOptions,
		fetchOptions? : TransactionHistoryFetchOptions ) : Promise<TransactionHistoryResult>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! _.isString( toAddress ) || _.isEmpty( toAddress ) )
				{
					return reject( `${ this.constructor.name }.queryTransactionsToAddress :: invalid toAddress` );
				}

				let pageKey = this.extractTransactionHistoryFetchOptionsPageKey( 1, fetchOptions );
				const upFetchOptions = { ...fetchOptions, pageKey : pageKey };
				const transactionParam = [
					{
						...this.buildQueryingTransactionsCommonParameters( queryOptions, upFetchOptions ),
						toAddress : toAddress
					}
				];
				const result = await this.queryTransactionsByParameter( transactionParam, fetchOptions );
				resolve( result );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 * 	extract pageKey from fetchOptions
	 *	@param pageKeyType		{number}
	 *	@param [fetchOptions]		{TransactionHistoryFetchOptions}
	 *	@private
	 */
	private extractTransactionHistoryFetchOptionsPageKey( pageKeyType : number, fetchOptions? : TransactionHistoryFetchOptions ) : string | undefined
	{
		if ( AlchemyService.enumPageKeyTypes.from !== pageKeyType &&
			AlchemyService.enumPageKeyTypes.to !== pageKeyType )
		{
			//
			//	0	- fromPageKey
			//	1	- toPageKey
			//
			return undefined;
		}

		let pageKey = undefined;
		if ( _.isString( fetchOptions?.pageKey ) )
		{
			if ( fetchOptions?.pageKey.includes( AlchemyService.pageKeySplitter ) )
			{
				//
				//	`{fromPageKey}|M|{toPageKey}`
				//	`59c5c02f-f661-403b-acf1-fafbdb782cdc|M|59c5c02f-f661-403b-acf1-fafbdb782cdc`
				//	`|M|59c5c02f-f661-403b-acf1-fafbdb782cdc`
				//	`59c5c02f-f661-403b-acf1-fafbdb782cdc|M|`
				//
				const arr : string[] = fetchOptions?.pageKey.split( AlchemyService.pageKeySplitter ).map( item => item.trim() );
				if ( Array.isArray( arr ) && 2 === arr.length )
				{
					pageKey = arr[ pageKeyType ];
				}
			}
			else
			{
				pageKey = fetchOptions?.pageKey;
			}
		}

		return pageKey;
	}

	/**
	 *	build the common parameters for querying transactions
	 *
	 *	@param [queryOptions]	{TransactionHistoryQueryOptions}
	 *	@param [fetchOptions]	{FetchListOptions}
	 *	@return {object}
	 * 	@private
	 */
	private buildQueryingTransactionsCommonParameters( queryOptions ?: TransactionHistoryQueryOptions, fetchOptions? : FetchListOptions ) : object
	{
		let contractAddresses = this.getDefaultContractAddresses();
		if ( Array.isArray( queryOptions?.contractAddresses ) )
		{
			contractAddresses = queryOptions?.contractAddresses;
		}

		let fromBlock = `0x0`;
		if ( _.isString( queryOptions?.fromBlock ) && ! _.isEmpty( queryOptions?.fromBlock ) )
		{
			fromBlock = queryOptions?.fromBlock;
		}

		let toBlock = `latest`;
		if ( _.isString( queryOptions?.toBlock ) && ! _.isEmpty( queryOptions?.toBlock ) )
		{
			toBlock = queryOptions?.toBlock;
		}

		let category = this.getDefaultTransferTypes();
		if ( Array.isArray( queryOptions?.category ) )
		{
			category = queryOptions?.category;
		}

		const withMetadata = _.isBoolean( queryOptions?.withMetadata ) ? queryOptions?.withMetadata : false;
		const excludeZeroValue = _.isBoolean( queryOptions?.excludeZeroValue ) ? queryOptions?.excludeZeroValue : true;

		const sort = FetchUtil.getSafeSort( fetchOptions?.sort );
		let maxCount = `0x3e8`;
		if ( _.isNumber( fetchOptions?.pageSize ) && fetchOptions?.pageSize > 0 )
		{
			const pageSize = FetchUtil.getSafePageSize( fetchOptions?.pageSize, 100 );

			//	100 = "0x64", 1000 = "0x3e8"
			const maxCountHex = MathUtil.hexFromInt( pageSize );
			if ( _.isString( maxCountHex ) )
			{
				maxCount = maxCountHex;
			}
		}

		let pageKey = undefined;
		if ( _.isString( fetchOptions?.pageKey ) )
		{
			//	undefined	: first request
			//	empty string	: no more items available
			pageKey = fetchOptions?.pageKey;
		}

		return {
			contractAddresses : contractAddresses,
			fromBlock : fromBlock,
			toBlock : toBlock,
			category : category,
			order : sort,
			withMetadata : withMetadata,
			excludeZeroValue : excludeZeroValue,
			maxCount : maxCount,
			pageKey : pageKey,
		};
	}


	/**
	 * 	query balance of native token, ETH
	 *
	 *	@param address	{string} wallet address
	 *	@return {Promise<bigint>}
	 */
	public async queryBalance( address : string ) : Promise<bigint>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! isAddress( address ) )
				{
					return reject( `${ this.constructor.name }.queryBalance :: invalid address` );
				}
				const paramData = [
					address,
					"latest"
				];
				const result = await this.queryByParameter( "eth_getBalance", paramData );
				//
				//	result should be:
				//	"0x7f49b9052e509c"
				//
				if ( TypeUtil.isNotEmptyString( result ) )
				{
					return resolve( MathUtil.bigintFromHex( result ) );
				}

				return resolve( BigInt( 0 ) );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	query token balance by token contract address
	 *
	 *	@param address		{string} wallet address
	 *	@param tokens		{Array<ContractTokenBalanceItem>}
	 *	@param [options]	{FetchListOptions}
	 *	@return {Promise<Array<ContractTokenBalanceItem>>}
	 */
	public async queryTokenBalances( address : string, tokens : Array<ContractTokenBalanceItem>, options? : FetchListOptions ) : Promise<Array<ContractTokenBalanceItem>>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! TypeUtil.isNotEmptyString( address ) )
				{
					return reject( `${ this.constructor.name }.queryTokenBalances :: invalid address` );
				}
				if ( !Array.isArray( tokens ) )
				{
					return reject( `${ this.constructor.name }.queryTokenBalances :: invalid contractAddresses` );
				}
				for ( const token of tokens )
				{
					const errorItem = VaTokenItem.validateContractTokenBalanceItem( token );
					if ( null !== errorItem )
					{
						return reject( `${ this.constructor.name }.queryTokenBalances :: ${ errorItem }` );
					}
				}

				const contractAddresses : Array<string> = tokens.map( item => item.contractAddress );
				const paramData = [
					address,
					contractAddresses
				];
				const result = await this.queryByParameter( 'alchemy_getTokenBalances', paramData, options );
				// 	{
				// 		"address": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
				// 		"tokenBalances":
				// 		[
				// 			{
				// 				"contractAddress": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
				// 				"tokenBalance": "0x0000000000000000000000000000000000000000000000000000000004c83670"
				// 			},
				// 			{
				// 				"contractAddress": "0x003f410709f77b9078ce2d2468868ee5b1bd6848",
				// 				"tokenBalance": "0x0000000000000000000000000000000000000000000000000000000000000000"
				// 			}
				// 		]
				// 	}
				if ( !TypeUtil.isNotNullObjectWithKeys( result, [ 'address', 'tokenBalances' ] ) )
				{
					return reject( `${ this.constructor.name }.queryTokenBalances :: invalid response for TokenBalances` );
				}
				if ( !Array.isArray( result.tokenBalances ) )
				{
					return reject( `${ this.constructor.name }.queryTokenBalances :: invalid response for TokenBalances` );
				}

				const tokenService = new TokenService( this.chainId );
				let tokenBalances : Array<ContractTokenBalanceItem> = [];
				for ( let item of result.tokenBalances )
				{
					if ( !TypeUtil.isNotNullObjectWithKeys( item, [ 'contractAddress', 'tokenBalance' ] ) ||
						!TypeUtil.isString( item.contractAddress ) ||
						!TypeUtil.isString( item.tokenBalance ) )
					{
						return reject( `${ this.constructor.name }.queryTokenBalances :: invalid response for TokenBalances` );
					}

					//	...
					let tokenBalance : bigint = MathUtil.bigintFromHex( item.tokenBalance );

					//
					//	try to query the balance of native token
					//	for ETH mainnet, it's ETH
					//	for BNB Smart Chain Mainnet, it's BNB
					//	...
					//
					if ( item.contractAddress.trim().toLowerCase() === tokenService.nativeTokenAddress.trim().toLowerCase() )
					{
						if ( tokenBalance <= 0 )
						{
							tokenBalance = await this.queryBalance( address );
						}
					}

					//	find more info
					let find : ContractTokenBalanceItem | undefined = await this.queryTokenBalancesFindMoreInfo( tokens, item.contractAddress );
					if ( ! find )
					{
						return reject( `${ this.constructor.name }.queryTokenBalances :: invalid response for TokenBalances` );
					}

					const balance : ContractTokenBalanceItem = {
						pair : find.pair,
						decimals : find.decimals,
						contractAddress : item.contractAddress,
						tokenBalance : tokenBalance,
					};
					tokenBalances.push( balance );
				}

				//	...
				resolve( tokenBalances );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 *	An extension function of queryTokenBalances
	 *	that queries more information about a specified token through TokenService by contractAddress.
	 *
	 *	@param tokens	{Array<ContractTokenBalanceItem>} token list
	 *	@param contractAddress	{string} the contract address of a token
	 *	@returns {Promise< ContractTokenBalanceItem | undefined >}
	 *	@private
	 */
	private async queryTokenBalancesFindMoreInfo(
		tokens : Array<ContractTokenBalanceItem>,
		contractAddress : string ) : Promise< ContractTokenBalanceItem | undefined >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! Array.isArray( tokens ) || 0 === tokens.length )
				{
					return resolve( undefined );
				}

				//	...
				const tokenService = new TokenService( this.chainId );
				contractAddress = contractAddress.trim().toLowerCase();
				let find : ContractTokenBalanceItem | undefined = tokens.find(
					( f : ContractTokenBalanceItem ) => f.contractAddress.trim().toLowerCase() === contractAddress
				);
				if ( find )
				{
					if ( ! VaTokenItem.validateContractTokenBalanceItemDecimals( find.decimals ) || find.decimals <= 0 )
					{
						//	try to find the value of decimals from TokenService on Ethereum Mainnet
						const tokenSrvItem : OneInchTokenItem | null = await tokenService.getItem( contractAddress );
						if ( _.isObject( tokenSrvItem ) &&
							_.isNumber( tokenSrvItem.decimals ) &&
							tokenSrvItem.decimals > 0 )
						{
							find.decimals = tokenSrvItem.decimals;
						}
					}
				}

				//	...
				resolve( find );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}


	/**
	 * 	query transaction list by param
	 *
	 *	@param transactionParam		{Array<any>}
	 *	@param [fetchOptions]		{FetchListOptions}
	 *	@return {Promise< Array<any> | null >}
	 */
	public async queryTransactionsByParameter( transactionParam : Array<any>, fetchOptions? : FetchListOptions ) : Promise<TransactionHistoryResult>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( `` === fetchOptions?.pageKey || `-` === fetchOptions?.pageKey )
				{
					//	no more items available
					return resolve( {} );
				}

				//	transfers, pageKey
				const result = await this.queryByParameter( 'alchemy_getAssetTransfers', transactionParam, fetchOptions );
				if ( ! result || ! Array.isArray( result.transfers ) )
				{
					return resolve( {} );
					//return reject( `${ this.constructor.name }.queryTransactionsByParameter :: invalid response transfers` );
				}

				//
				//	console.log( `result : `, result );
				//	result :  {
				//       transfers: [
				//         {
				//           blockNum: '0x90030d',
				//           uniqueId: '0xb81f0ad81089faca286ab60a9903900b5c72822cf427ad40f86b89ce94bfd9b3:external',
				//           hash: '0xb81f0ad81089faca286ab60a9903900b5c72822cf427ad40f86b89ce94bfd9b3',
				//           from: '0x6b29b8af9af126170513ae6524395e09025b214e',
				//           to: '0x47b506704da0370840c2992a3d3d301fd3c260d3',
				//           value: 1,
				//           erc721TokenId: null,
				//           erc1155Metadata: null,
				//           tokenId: null,
				//           asset: 'ETH',
				//           category: 'external',
				//           rawContract: [Object],
				//           metadata: [Object]
				//         }
				//       ],
				//       pageKey: 'e78062fc-ece2-445f-9381-27c12ce0ae82'
				//     }
				//
				let txList : Array<TransactionHistoryItem> = [];
				for ( const transfer of result.transfers )
				{
					txList.push({
						...transfer,
						blockNum: transfer.blockNum,
						uniqueId: transfer.uniqueId,
						hash: transfer.hash,
						from: transfer.from,
						to: transfer.to,
						value: transfer.value,
						erc721TokenId: transfer.erc721TokenId,
						erc1155Metadata: transfer.erc1155Metadata,
						tokenId: transfer.tokenId,
						asset: transfer.asset,
						category: transfer.category,
						rawContract: transfer.rawContract,
						metadata: transfer.metadata,
					});
				}
				result.transfers = txList;

				//	...
				resolve( result );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 * 	query transaction list by param
	 *
	 *	@param method		{string}
	 *	@param paramData	{any}
	 *	@param [options]	{FetchListOptions}
	 *	@return {Promise<any>}
	 */
	private async queryByParameter( method : string, paramData : any, options? : FetchListOptions ) : Promise<any>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( !TypeUtil.isNotEmptyString( method ) )
				{
					return reject( `${ this.constructor.name }.queryByParameter :: invalid method` );
				}

				//	...
				const url = `${ this.endpoint }/${ this.version }/${ this.apiKey }`;
				//const pageKey : string = options?.pageKey;
				const fetchOptions : FetchOptions = {
					url : url,
					timeout : 5 * 60 * 1000,
					accept : `application/json`,
					headers : [
						{
							key : 'User-Agent',
							value : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
						},
					],
					body : {
						id : 1,
						jsonrpc : "2.0",
						method : method,
						params : paramData
					}
				};
				const response : FetchResponse = await FetchUtil.postRequest( fetchOptions );
				if ( response && response.bodyJson )
				{
					const jsonObject = response.bodyJson;
					if ( TypeUtil.isNotNullObjectWithKeys( jsonObject, [ 'jsonrpc', 'id', 'result' ] ) )
					{
						//	[
						//		{
						//			"blockNum": "0x900177",
						//         		"uniqueId": "0x53a70ce7480eb41ec4a07b62265aaa0d38283ecfa9b10c4a88c561dc5f1d1696:external",
						//         		"hash": "0x53a70ce7480eb41ec4a07b62265aaa0d38283ecfa9b10c4a88c561dc5f1d1696",
						//         		"from": "0x3b5ed1724e4cde8c22d2c1fad4625d06a828d7f8",
						//         		"to": "0x47b506704da0370840c2992a3d3d301fd3c260d3",
						//         		"value": 0.5,
						//         		"erc721TokenId": null,
						//         		"erc1155Metadata": null,
						//         		"tokenId": null,
						//         		"asset": "ETH",
						//         		"category": "external",
						//         		"rawContract": {
						//           			"value": "0x6f05b59d3b20000",
						//           			"address": null,
						//           			"decimal": "0x12"
						//         		},
						//         		"metadata": {
						//           			"blockTimestamp": "2023-07-31T06:24:12.000Z"
						//         		}
						//       	}
						//	]
						return resolve( jsonObject.result );
					}
				}

				resolve( null );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 * 	https://docs.alchemy.com/reference/getnfts
	 *	@param address		{string}	wallet Address for NFT owner (can be in ENS format on mainnet).
	 *	@param [options]	{FetchListOptions}
	 */
	public async queryNFTs( address : string, options? : FetchListOptions ) : Promise<Array<any> | null>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				//	curl --request GET \
				//      --url 'https://eth-goerli.g.alchemy.com/nft/v2/oQilV7SCeUMQMb9b49wnCDFcxvE3UZ3E/getNFTs?owner=0x683279542eD04d7C60DC56E4EA230fe621eDD4Ca&withMetadata=true&orderBy=null' \
				//      --header 'accept: application/json' | jq .
				const url = `${ this.endpoint }/${ this.version }/${ this.apiKey }/getNFTs?owner=${ address }&withMetadata=true&orderBy=transferTime`;
				const fetchOptions : FetchOptions = {
					url : url,
					timeout : 5 * 60 * 1000,
					accept : `application/json`,
					headers : [
						{
							key : 'User-Agent',
							value : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
						},
					]
				};
				const response : FetchResponse = await FetchUtil.getRequest( fetchOptions );
				if ( response && response.bodyJson )
				{
					const jsonObject = response.bodyJson;
					if ( TypeUtil.isNotNullObjectWithKeys( jsonObject, [ 'ownedNfts', 'totalCount', 'blockHash' ] ) &&
						Array.isArray( jsonObject.ownedNfts ) )
					{
						//	[
						//	{
						//       "contract": {
						//         "address": "0xf5de760f2e916647fd766b4ad9e85ff943ce3a2b"
						//       },
						//       "id": {
						//         "tokenId": "0x00000000000000000000000000000000000000000000000000000000002cf1b9",
						//         "tokenMetadata": {
						//           "tokenType": "ERC721"
						//         }
						//       },
						//       "balance": "1",
						//       "title": "MultiFaucet Test NFT",
						//       "description": "A test NFT dispensed from faucet.paradigm.xyz.",
						//       "tokenUri": {
						//         "gateway": "https://alchemy.mypinata.cloud/ipfs/bafybeiezeds576kygarlq672cnjtimbsrspx5b3tr3gct2lhqud6abjgiu",
						//         "raw": "https://ipfs.io/ipfs/bafybeiezeds576kygarlq672cnjtimbsrspx5b3tr3gct2lhqud6abjgiu"
						//       },
						//       "media": [
						//         {
						//           "gateway": "https://nft-cdn.alchemy.com/eth-goerli/293d99c504a8f0d59ac7d2a7df768f35",
						//           "thumbnail": "https://res.cloudinary.com/alchemyapi/image/upload/thumbnailv2/eth-goerli/293d99c504a8f0d59ac7d2a7df768f35",
						//           "raw": "https://ipfs.io/ipfs/bafybeifvwitulq6elvka2hoqhwixfhgb42l4aiukmtrw335osetikviuuu",
						//           "format": "png",
						//           "bytes": 27452
						//         }
						//       ],
						//       "metadata": {
						//         "name": "MultiFaucet Test NFT",
						//         "description": "A test NFT dispensed from faucet.paradigm.xyz.",
						//         "image": "https://ipfs.io/ipfs/bafybeifvwitulq6elvka2hoqhwixfhgb42l4aiukmtrw335osetikviuuu"
						//       },
						//       "timeLastUpdated": "2023-02-26T08:19:44.735Z",
						//       "contractMetadata": {
						//         "name": "MultiFaucet NFT",
						//         "symbol": "MFNFT",
						//         "tokenType": "ERC721",
						//         "contractDeployer": "0xbc19ffef966bff35cb0fee54741fef4f1a33662a",
						//         "deployedBlockNumber": 5872707,
						//         "openSea": {
						//           "lastIngestedAt": "2023-07-31T20:01:39.000Z"
						//         }
						//       }
						//     },
						//	...
						//	]
						return resolve( jsonObject.ownedNfts );
					}
				}

				resolve( null );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}
}
