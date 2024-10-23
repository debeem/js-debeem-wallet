/**
 * 	@category Data Models
 *
 * 	@module TransactionModels
 * 	@interface
 */
import { FetchListOptions } from "debeem-utils";
import { TransactionLike } from 'ethers';


/**
 * 	@category Data Models
 * 	@module TransactionModels
 *
 * 	transfer types
 * 	https://docs.alchemy.com/reference/transfers-api-quickstart#1-external-eth-transfers
 */
export enum EnumTransactionTransferTypes
{
	/**
	 * 	These are top level transactions that occur with a from address being an external (user created) address.
	 * 	External addresses have private keys and are accessed by users.
	 */
	external = `external`,

	/**
	 * 	These are transfers that occur where the fromAddress is an internal (smart contract) address.
	 * 	(ex: a smart contract calling another smart contract or smart contract calling another external address).
	 * 	For a full deep dive into internal transfers check out this article on :
	 * 	https://docs.alchemy.com/docs/what-are-internal-transactions
	 */
	internal = `internal`,

	/**
	 * 	Event logs for ERC20 transfers.
	 */
	erc20 = `erc20`,

	/**
	 * 	Event logs for ERC721 transfers.
	 */
	erc721 = `erc721`,

	/**
	 * 	These are event logs for ERC1155 transfers.
	 */
	erc1155 = `erc1155`,

	/**
	 * 	Special NFT Transfers
	 * 	The special NFT endpoint allows users to query for NFTs that don't follow any ERC standards.
	 * 	The 2 included NFTs currently are CryptoPunks and CryptoKitties, which both predate current NFT standards.
	 */
	specialnft = `specialnft`,
}


/**
 * 	@category Data Models
 * 	@module TransactionModels
 */
export type TransactionHistoryQueryOptions =
{
	/**
	 * 	Inclusive from block (hex string, int, latest, or indexed). Defaults to 0x0
	 */
	fromBlock ?: string;

	/**
	 * 	Inclusive to block (hex string, int, latest, or indexed). Defaults to latest.
	 * 	Read more about block tags:
	 * 	https://docs.alchemy.com/reference/transfers-api-quickstart#what-are-the-different-types-of-block-tags
	 */
	toBlock ?: string;

	/**
	 * 	List of contract addresses (hex strings) to filter for
	 * 	- only applies to "erc20", "erc721", "erc1155" transfers.
	 * 	Default wildcard - any address
	 */
	contractAddresses ?: Array<string>;

	/**
	 * 	Array of categories, can be any of the following:
	 * 	"external", "internal", "erc20", "erc721", "erc1155", or "specialnft".
	 *
	 * 	See the table above for supported categories on each network:
	 * 	https://docs.alchemy.com/reference/alchemy-getassettransfers
	 */
	category ?: Array<string>;

	/**
	 *	Whether to include additional metadata about each transfer event.
	 *	Defaults to false.
	 */
	withMetadata ?: boolean;

	/**
	 * 	A boolean to exclude transfers with zero value - zero value is not the same as null value.
	 * 	Defaults to true.
	 */
	excludeZeroValue ?: boolean;

	/**
	 *	UUID for pagination.
	 *	If more results are available, an uuid pageKey will be returned in the response.
	 *	Pass that uuid into pageKey to fetch the next request.
	 */
	pageKey ?: string;
};

/**
 * 	@category Data Models
 * 	@module TransactionModels
 */
export type TransactionHistoryFetchOptions = FetchListOptions &
{
}


/**
 * 	@category Data Models
 * 	@module TransactionModels
 */
export type TransactionHistoryItemRawContract =
{
	/**
	 * 	'0x71be61e321000'
	 */
	value: string,

	/**
	 * 	'0x271b34781c76fb06bfc54ed9cfe7c817d89f7759' | null
	 */
	address: string | null,

	/**
	 * 	'0x12' | null
	 */
	decimal: string | null,
};

/**
 * 	@category Data Models
 * 	@module TransactionModels
 */
export type TransactionHistoryItemMetadata =
{
	/**
	 * 	'2023-07-27T12:00:24.000Z'
	 */
	blockTimestamp : string,
};

/**
 * 	@category Data Models
 * 	@module TransactionModels
 */
export type TransactionHistoryItem =
{
	/**
	 * 	'0x5dcff7'
	 */
	blockNum: string,

	/**
	 * 	'0x27cc43ddb6e4d369d262bd56780abba6441747d408855ad26fb3c550250a902c:external'
	 */
	uniqueId: string,

	/**
	 * 	'0x27cc43ddb6e4d369d262bd56780abba6441747d408855ad26fb3c550250a902c'
	 */
	hash: string,

	/**
	 * 	'0x47b506704da0370840c2992a3d3d301fd3c260d3'
	 */
	from: string,

	/**
	 * 	'0x3a62dffe13529d981f2155f764d8e109772a0566'
	 */
	to: string,

	/**
	 * 	0.01
	 */
	value: number | null,

	/**
	 * 	`0.01`
	 */
	stringValue : string | null;

	/**
	 *
	 */
	erc721TokenId: string | null,

	/**
	 *
	 */
	erc1155Metadata: string | null,

	/**
	 *
	 */
	tokenId: string | null,

	/**
	 * 	'ETH'
	 */
	asset: string | null,

	/**
	 * 	'external'
	 */
	category: string,

	/**
	 * 	@type {TransactionHistoryItemRawContract}
	 */
	rawContract: TransactionHistoryItemRawContract,

	/**
	 * 	@type {TransactionHistoryItemMetadata}
	 */
	metadata: TransactionHistoryItemMetadata
};


/**
 * 	@category Data Models
 * 	@module TransactionModels
 */
export type TransactionHistoryResult =
{
	//	transfer list
	transfers ?: Array<TransactionHistoryItem>;

	//	pageKey
	pageKey ?: string;

	//	pageKey of fromAddress list
	fromPageKey ?: string;

	//	pageKey of toAddress list
	toPageKey ?: string;
};


/**
 *	Minimum Needed Gas Limit from InfuraRpcService error
 *
 * 	@category Data Models
 * 	@module TransactionModels
 */
export type TransactionMinimumNeededGas =
{
	gas: number;
	minimum: number;
};



/**
 * 	@category Data Models
 * 	@module TransactionModels
 */
export type TransactionDetailItem = TransactionLike &
{
	/**
	 * 	inherited from TransactionLike
	 * 	https://docs.ethers.org/v6/api/transaction/#TransactionLike
	 *
	 * 	accessList⇒ null | AccessListish
	 * 	accessList: [],
	 * 	An array containing addresses and storage keys that the transaction plans to access.
	 * 	It is used for gas optimization in EIP-2930 transactions. Here, it is empty.
	 * 	https://eips.ethereum.org/EIPS/eip-2930
	 *
	 * 	chainId⇒ null | BigNumberish
	 * 	chainId: '0xaa36a7',
	 * 	The unique identifier for the Ethereum network (chain). It helps to prevent replay attacks on different chains.
	 *	Decimal: 0xaa36a7 converts to 11155111.
	 *
	 * 	from⇒ null | A
	 * 	from: '0x47b506704da0370840c2992a3d3d301fd3c260d3',
	 * 	The address of the sender of the transaction.
	 *
	 * 	to⇒ null | A
	 *	to: '0x3a62dffe13529d981f2155f764d8e109772a0566',
	 *	The recipient address of the transaction.
	 *
	 * 	gasPrice⇒ null | BigNumberish
	 * 	gasPrice: '0x60d781ab',
	 * 	The price per gas unit in wei that the sender is willing to pay.
	 * 	Decimal: 0x60d781ab converts to 1623482283 wei.
	 *
	 * 	hash⇒ null | string
	 * 	hash: '0x27cc43ddb6e4d369d262bd56780abba6441747d408855ad26fb3c550250a902c',
	 * 	The hash of the transaction, which uniquely identifies it.
	 *
	 * 	maxFeePerGas⇒ null | BigNumberish
	 * 	The maximum total fee per gas for london transactions.
	 * 	The maximum fee per gas that the sender is willing to pay (for EIP-1559 transactions).
	 * 	maxFeePerGas: '0x62f63262',
	 *	Decimal: 0x62f63262 converts to 1657783650 wei.
	 *
	 * 	maxPriorityFeePerGas⇒ null | BigNumberish
	 * 	The maximum priority fee per gas for london transactions.
	 * 	The maximum priority fee per gas (tip) that the sender is willing to pay.
	 * 	maxPriorityFeePerGas: '0x59682f00',
	 * 	Decimal: 0x59682f00 converts to 1500000000 wei.
	 *
	 * 	nonce⇒ null | number
	 * 	The number of transactions sent from the sender's address.
	 * 	nonce: '0xc',
	 * 	Decimal: 0xc converts to 12.
	 *
	 * 	type⇒ null | number
	 * 	The type of the transaction.
	 * 	0x2 indicates it is an EIP-1559 (London hard fork) transaction.
	 * 	type: '0x2',
	 *
	 * 	value⇒ null | BigNumberish
	 * 	The amount of Ether (in wei) being transferred.
	 * 	value: '0x2386f26fc10000',
	 * 	Decimal: 0x2386f26fc10000 converts to 10000000000000000 wei, which is 0.01 Ether.
	 */


	/**
	 * 	The hash of the block containing this transaction. It is a unique identifier for the block.
	 * 	'0xb891060f7ef8d1c9d25520c80596881ad8b3076eafb29ba22bb31a8b6468822b'
	 */
	blockHash: string,

	/**
	 * 	The number of the block containing this transaction.
	 * 	original : '0x5dcff7'
	 * 	Decimal: 0x5dcff7 converts to 6147063.
	 */
	blockNumber: number,

	/**
	 * 	the amount of limit gas
	 *
	 * 	query by calling InfuraRpcService.fetchEthEstimatedGasLimit
	 */
	gasLimit : number,

	/**
	 * 	the amount of used gas by the transaction
	 *
	 * 	the maximum amount of gas in wei units that the transaction can consume.
	 * 	original : '0x5208'
	 * 	Decimal: 0x5208 converts to 21000.
	 */
	gas : number,

	/**
	 * 	Total gas fee, in wei
	 * 	{ gas price } * { gas }
	 */
	totalGasFee : bigint,

	/**
	 * 	float value in Ether from the bigint .totalGasFee in wei
	 */
	floatTotalGasFee : number,

	/**
	 * 	float value in Ether from the bigint .value in wei
	 */
	floatValue : number,

	/**
	 * 	total value in wei
	 * 	{ value } + { totalGasFee }
	 */
	total : bigint,

	/**
	 * 	float value in Ether from the bigint .total in wei
	 */
	floatTotal : number,

	/**
	 * 	the input data sent with the transaction. Here it is empty, indicating no additional data.
	 *
	 * 	@remark
	 * 	The content of the input field depends on the type and purpose of the transaction.
	 * 	For regular Ethereum transfer transactions, it is typically empty.
	 * 	For transactions involving contract invocation or contract creation, it contains operation-related data,
	 * 	usually formatted and parsed using ABI encoding.
	 *
	 * 	original : '0x'
	 */
	input: any,

	/**
	 * 	the r value of the transaction signature.
	 * 	'0x87566c86db24a5a3182177960fadf00ca9365d8b05d099b7cddfbfcadd40c923'
	 */
	r: string,

	/**
	 * 	the s value of the transaction signature.
	 * 	'0x1ef1f5470f4f67120db7ddd49f84df24c1ad57ea45e7ef22fed1d6d9198c1df7'
	 */
	s: string,

	/**
	 * 	the recovery id of the transaction signature.
	 * 	'0x1'
	 */
	v: number,

	/**
	 * 	the index of the transaction in the block.
	 * 	'0xd'
	 * 	Decimal: 0xd converts to 13.
	 */
	transactionIndex: number,

	/**
	 * 	the parity bit for the v value in EIP-1559 transactions,
	 * 	indicating the y-coordinate of the curve point for the public key recovery.
	 * 	'0x1'
	 */
	yParity: number
};
