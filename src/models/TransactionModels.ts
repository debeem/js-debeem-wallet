/**
 * 	@category Data Models
 * 	@module TransactionModels
 */
export type TransactionHistoryResult =
{
	//	transfer list
	transfers ?: Array<any>;

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
