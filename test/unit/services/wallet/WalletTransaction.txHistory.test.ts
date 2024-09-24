import { describe, expect } from '@jest/globals';
import { BlockItem, setCurrentChain, TokenService, WalletTransaction } from "../../../../src";
import { TypeUtil } from "../../../../src/utils/TypeUtil";
import {
	EnumTransactionTransferTypes,
	TransactionHistoryFetchOptions,
	TransactionHistoryQueryOptions,
	TransactionHistoryResult
} from "../../../../src/models/TransactionModels";
import _ from "lodash";
import { isAddress } from "ethers";
import { MathUtil, TestUtil } from "debeem-utils";


/**
 *	WalletTransaction unit test
 */
describe( "WalletTransaction.txHistory", () =>
{
	beforeAll( async () =>
	{
	} );
	afterAll( async () =>
	{
	} );

	beforeEach( () =>
	{
		//	switch chain/network to Eth.Sepolia
		setCurrentChain( 11155111 );
	} );

	describe( "Transaction List", () =>
	{
		//	0xcC361BDf821563d2a8aC5B57A9e34EC5cA48C5F3
		//	0x47B506704DA0370840c2992A3d3d301FD3c260D3
		const walletAddress = `0x47B506704DA0370840c2992A3d3d301FD3c260D3`;

		it( `should return the number of transactions sent from the address`, async () =>
		{
			const count : bigint = await new WalletTransaction().queryTransactionCountFromAddress( walletAddress );
			expect( count ).toBeGreaterThanOrEqual( 0 );

		}, 90 * 1000 );


		it( `should return all transactions for all tokens by a wallet address`, async () =>
		{
			let totalItem : number = 0;
			let nextPageKey : string | undefined = undefined;

			while( true )
			{
				const queryOptions : TransactionHistoryQueryOptions = {
					withMetadata : true,
					excludeZeroValue : false,
					// contractAddresses : [
					// 	new TokenService().nativeTokenAddress,
					// ],
					category : [
						//	user created transactions
						EnumTransactionTransferTypes.external,

						//	ERC20 transfers
						EnumTransactionTransferTypes.erc20,
					],
				};
				const fetchOptions : TransactionHistoryFetchOptions = {
					sort : 'desc',
					pageSize : 10,
					pageKey : nextPageKey,
				};
				//console.log( `will query:`, fetchOptions );
				const txResult : TransactionHistoryResult =
					await new WalletTransaction().queryTransactionHistory( walletAddress, queryOptions, fetchOptions );
				//console.log( `txResult :`, txResult );
				//    txResult : {
				//	transfers: [
				//         {
				//           blockNum: '0x5dcff7',
				//           uniqueId: '0x27cc43ddb6e4d369d262bd56780abba6441747d408855ad26fb3c550250a902c:external',
				//           hash: '0x27cc43ddb6e4d369d262bd56780abba6441747d408855ad26fb3c550250a902c',
				//           from: '0x47b506704da0370840c2992a3d3d301fd3c260d3',
				//           to: '0x3a62dffe13529d981f2155f764d8e109772a0566',
				//           value: 0.01,
				//           erc721TokenId: null,
				//           erc1155Metadata: null,
				//           tokenId: null,
				//           asset: 'ETH',
				//           category: 'external',
				//           rawContract: [Object],
				//           metadata: [Object]
				//         },
				//         {
				//           blockNum: '0x5dc9c3',
				//           uniqueId: '0xaeac7eea528092c8b35063fba37c473effc76d6dd1b081e59dc7cf6d206aaf97:external',
				//           hash: '0xaeac7eea528092c8b35063fba37c473effc76d6dd1b081e59dc7cf6d206aaf97',
				//           from: '0x47b506704da0370840c2992a3d3d301fd3c260d3',
				//           to: '0x9e15898acf36c544b6f4547269ca8385ce6304d8',
				//           value: 0,
				//           erc721TokenId: null,
				//           erc1155Metadata: null,
				//           tokenId: null,
				//           asset: 'ETH',
				//           category: 'external',
				//           rawContract: [Object],
				//           metadata: [Object]
				//         },
				//	],
				//	pageKey: '433864cf-d090-40b9-a3b1-a8147300dba7|M|1df5eb30-8509-40ea-bea5-6e6024f9ec2c'
				//    }
				//
				expect( txResult ).toBeDefined();
				expect( txResult ).toHaveProperty( `transfers` );
				expect( txResult ).toHaveProperty( `pageKey` );

				const txList = txResult.transfers;
				const pageKey = txResult?.pageKey;
				expect( txList ).toBeDefined();
				expect( Array.isArray( txList ) ).toBeTruthy();
				expect( _.isString( pageKey ) ).toBeTruthy();

				if ( Array.isArray( txList ) )
				{
					for ( const tx of txList )
					{
						totalItem ++;

						//console.log( `tx`, tx );
						//	should output:
						//	tx {
						//       blockNum: '0x5dd736',
						//       uniqueId: '0x8d77e8f76c2578fa2e943db5e16925b8ce7e13b6f693e94ce97cd278c4b4e6a0:external',
						//       hash: '0x8d77e8f76c2578fa2e943db5e16925b8ce7e13b6f693e94ce97cd278c4b4e6a0',
						//       from: '0xcc361bdf821563d2a8ac5b57a9e34ec5ca48c5f3',
						//       to: '0x8b4c0dc5aa90c322c747c10fdd7cf1759d343573',
						//       value: 0.002001,
						//       erc721TokenId: null,
						//       erc1155Metadata: null,
						//       tokenId: null,
						//       asset: 'ETH',
						//       category: 'external',
						//       rawContract: { value: '0x71be61e321000', address: null, decimal: '0x12' },
						//	 metadata: { blockTimestamp: '2024-06-20T20:29:00.000Z' }		//	if ( true === queryOptions.withMetadata )
						//     }
						//
						expect( tx ).toBeDefined();
						expect( tx ).toHaveProperty( 'blockNum' );
						expect( tx ).toHaveProperty( 'uniqueId' );
						expect( tx ).toHaveProperty( 'hash' );
						expect( tx ).toHaveProperty( 'from' );
						expect( tx ).toHaveProperty( 'to' );
						expect( tx ).toHaveProperty( 'value' );
						expect( tx ).toHaveProperty( 'erc721TokenId' );
						expect( tx ).toHaveProperty( 'erc1155Metadata' );
						expect( tx ).toHaveProperty( 'tokenId' );
						expect( tx ).toHaveProperty( 'asset' );
						expect( tx ).toHaveProperty( 'category' );
						expect( tx ).toHaveProperty( 'rawContract' );

						expect( isAddress( tx.from ) ).toBeTruthy();
						expect( isAddress( tx.to ) ).toBeTruthy();

						expect( TypeUtil.isNotNullObject( tx.rawContract ) ).toBeTruthy();
						expect( tx.rawContract ).toHaveProperty( 'value' );
						expect( tx.rawContract ).toHaveProperty( 'address' );
						expect( tx.rawContract ).toHaveProperty( 'decimal' );
						expect( _.startsWith( tx.rawContract.value, `0x` ) ).toBeTruthy();
						expect( null === tx.rawContract.decimal || _.startsWith( tx.rawContract.decimal, `0x` ) ).toBeTruthy();
						expect( null === tx.rawContract.address || isAddress( tx.rawContract.address ) ).toBeTruthy();

						if ( true === queryOptions.withMetadata )
						{
							expect( tx ).toHaveProperty( 'metadata' );
							expect( TypeUtil.isNotNullObject( tx.metadata ) ).toBeTruthy();
							expect( tx.metadata ).toHaveProperty( 'blockTimestamp' );
						}
					}
				}

				//console.log( `pageKey`, pageKey );

				//	...
				nextPageKey = pageKey;
				if ( `` === nextPageKey )
				{
					break;
				}
			}

			//console.log( `totalItem :`, totalItem );

		}, 90 * 1000 );

		it( `should return all transactions for the ETH by a wallet address`, async () =>
		{
			let totalItem : number = 0;
			let nextPageKey : string | undefined = undefined;

			while( true )
			{
				const queryOptions : TransactionHistoryQueryOptions = {
					withMetadata : true,
					excludeZeroValue : false,
					contractAddresses : [
						new TokenService().nativeTokenAddress,	//	ETH native
					],
					category : [
						EnumTransactionTransferTypes.external
					],
				};
				const fetchOptions : TransactionHistoryFetchOptions = {
					sort : 'desc',
					pageSize : 10,
					pageKey : nextPageKey,
				};
				//console.log( `will query:`, fetchOptions );
				const txResult : TransactionHistoryResult =
					await new WalletTransaction().queryTransactionHistory( walletAddress, queryOptions, fetchOptions );
				//console.log( `txResult :`, txResult );
				//    txResult : {
				//	transfers: [
				//         {
				//           blockNum: '0x5dcff7',
				//           uniqueId: '0x27cc43ddb6e4d369d262bd56780abba6441747d408855ad26fb3c550250a902c:external',
				//           hash: '0x27cc43ddb6e4d369d262bd56780abba6441747d408855ad26fb3c550250a902c',
				//           from: '0x47b506704da0370840c2992a3d3d301fd3c260d3',
				//           to: '0x3a62dffe13529d981f2155f764d8e109772a0566',
				//           value: 0.01,
				//           erc721TokenId: null,
				//           erc1155Metadata: null,
				//           tokenId: null,
				//           asset: 'ETH',
				//           category: 'external',
				//           rawContract: [Object],
				//           metadata: [Object]
				//         },
				//         {
				//           blockNum: '0x5dc9c3',
				//           uniqueId: '0xaeac7eea528092c8b35063fba37c473effc76d6dd1b081e59dc7cf6d206aaf97:external',
				//           hash: '0xaeac7eea528092c8b35063fba37c473effc76d6dd1b081e59dc7cf6d206aaf97',
				//           from: '0x47b506704da0370840c2992a3d3d301fd3c260d3',
				//           to: '0x9e15898acf36c544b6f4547269ca8385ce6304d8',
				//           value: 0,
				//           erc721TokenId: null,
				//           erc1155Metadata: null,
				//           tokenId: null,
				//           asset: 'ETH',
				//           category: 'external',
				//           rawContract: [Object],
				//           metadata: [Object]
				//         },
				//	],
				//	pageKey: '433864cf-d090-40b9-a3b1-a8147300dba7|M|1df5eb30-8509-40ea-bea5-6e6024f9ec2c'
				//    }
				//
				expect( txResult ).toBeDefined();
				expect( txResult ).toHaveProperty( `transfers` );
				expect( txResult ).toHaveProperty( `pageKey` );

				const txList = txResult.transfers;
				const pageKey = txResult?.pageKey;
				expect( txList ).toBeDefined();
				expect( Array.isArray( txList ) ).toBeTruthy();
				expect( _.isString( pageKey ) ).toBeTruthy();

				if ( Array.isArray( txList ) )
				{
					for ( const tx of txList )
					{
						totalItem ++;

						//console.log( `tx`, tx );
						//
						//	should output:
						//	tx {
						//       blockNum: '0x5dd736',
						//       uniqueId: '0x8d77e8f76c2578fa2e943db5e16925b8ce7e13b6f693e94ce97cd278c4b4e6a0:external',
						//       hash: '0x8d77e8f76c2578fa2e943db5e16925b8ce7e13b6f693e94ce97cd278c4b4e6a0',
						//       from: '0xcc361bdf821563d2a8ac5b57a9e34ec5ca48c5f3',
						//       to: '0x8b4c0dc5aa90c322c747c10fdd7cf1759d343573',
						//       value: 0.002001,
						//       erc721TokenId: null,
						//       erc1155Metadata: null,
						//       tokenId: null,
						//       asset: 'ETH',
						//       category: 'external',
						//       rawContract: { value: '0x71be61e321000', address: null, decimal: '0x12' },
						//	 metadata: { blockTimestamp: '2024-06-20T20:29:00.000Z' }		//	if ( true === queryOptions.withMetadata )
						//     }
						//
						expect( tx ).toBeDefined();
						expect( tx ).toHaveProperty( 'blockNum' );
						expect( tx ).toHaveProperty( 'uniqueId' );
						expect( tx ).toHaveProperty( 'hash' );
						expect( tx ).toHaveProperty( 'from' );
						expect( tx ).toHaveProperty( 'to' );
						expect( tx ).toHaveProperty( 'value' );
						expect( tx ).toHaveProperty( 'erc721TokenId' );
						expect( tx ).toHaveProperty( 'erc1155Metadata' );
						expect( tx ).toHaveProperty( 'tokenId' );
						expect( tx ).toHaveProperty( 'asset' );
						expect( tx ).toHaveProperty( 'category' );
						expect( tx ).toHaveProperty( 'rawContract' );

						expect( isAddress( tx.from ) ).toBeTruthy();
						expect( isAddress( tx.to ) ).toBeTruthy();

						expect( TypeUtil.isNotNullObject( tx.rawContract ) ).toBeTruthy();
						expect( tx.rawContract ).toHaveProperty( 'value' );
						expect( tx.rawContract ).toHaveProperty( 'address' );
						expect( tx.rawContract ).toHaveProperty( 'decimal' );
						expect( _.startsWith( tx.rawContract.value, `0x` ) ).toBeTruthy();
						expect( null === tx.rawContract.decimal || _.startsWith( tx.rawContract.decimal, `0x` ) ).toBeTruthy();
						expect( null === tx.rawContract.address || isAddress( tx.rawContract.address ) ).toBeTruthy();

						if ( true === queryOptions.withMetadata )
						{
							expect( tx ).toHaveProperty( 'metadata' );
							expect( TypeUtil.isNotNullObject( tx.metadata ) ).toBeTruthy();
							expect( tx.metadata ).toHaveProperty( 'blockTimestamp' );
						}
					}
				}

				//console.log( `pageKey`, pageKey );

				//	...
				nextPageKey = pageKey;
				if ( `` === nextPageKey )
				{
					break;
				}
			}

			//console.log( `totalItem :`, totalItem );

		}, 90 * 1000 );


		it( `should return all transactions for the USDT by a wallet address`, async () =>
		{
			let totalItem : number = 0;
			let nextPageKey : string | undefined = undefined;

			while( true )
			{
				const queryOptions : TransactionHistoryQueryOptions = {
					withMetadata : true,
					excludeZeroValue : false,
					contractAddresses : [
						//	https://sepolia.etherscan.io/tx/0x4d32cdec5db0d388ce1cf2b6df64457b4d8d0902e28fd209602361df497aa32f
						//	https://sepolia.etherscan.io/token/0x271b34781c76fb06bfc54ed9cfe7c817d89f7759
						`0x271B34781c76fB06bfc54eD9cfE7c817d89f7759`,	//	Tether USD(USDT)
					],
					category : [
						EnumTransactionTransferTypes.erc20
					],
				};
				const fetchOptions : TransactionHistoryFetchOptions = {
					sort : 'desc',
					pageSize : 10,
					pageKey : nextPageKey,
				};
				//console.log( `will query:`, fetchOptions );
				const txResult : TransactionHistoryResult =
					await new WalletTransaction().queryTransactionHistory( walletAddress, queryOptions, fetchOptions );
				//console.log( `txResult :`, txResult );
				//    txResult : {
				//	transfers: [
				//         {
				//           blockNum: '0x5dcff7',
				//           uniqueId: '0x27cc43ddb6e4d369d262bd56780abba6441747d408855ad26fb3c550250a902c:external',
				//           hash: '0x27cc43ddb6e4d369d262bd56780abba6441747d408855ad26fb3c550250a902c',
				//           from: '0x47b506704da0370840c2992a3d3d301fd3c260d3',
				//           to: '0x3a62dffe13529d981f2155f764d8e109772a0566',
				//           value: 0.01,
				//           erc721TokenId: null,
				//           erc1155Metadata: null,
				//           tokenId: null,
				//           asset: 'ETH',
				//           category: 'external',
				//           rawContract: [Object],
				//           metadata: [Object]
				//         },
				//         {
				//           blockNum: '0x5dc9c3',
				//           uniqueId: '0xaeac7eea528092c8b35063fba37c473effc76d6dd1b081e59dc7cf6d206aaf97:external',
				//           hash: '0xaeac7eea528092c8b35063fba37c473effc76d6dd1b081e59dc7cf6d206aaf97',
				//           from: '0x47b506704da0370840c2992a3d3d301fd3c260d3',
				//           to: '0x9e15898acf36c544b6f4547269ca8385ce6304d8',
				//           value: 0,
				//           erc721TokenId: null,
				//           erc1155Metadata: null,
				//           tokenId: null,
				//           asset: 'ETH',
				//           category: 'external',
				//           rawContract: [Object],
				//           metadata: [Object]
				//         },
				//	],
				//	pageKey: '433864cf-d090-40b9-a3b1-a8147300dba7|M|1df5eb30-8509-40ea-bea5-6e6024f9ec2c'
				//    }
				//
				expect( txResult ).toBeDefined();
				expect( txResult ).toHaveProperty( `transfers` );
				expect( txResult ).toHaveProperty( `pageKey` );

				const txList = txResult.transfers;
				const pageKey = txResult?.pageKey;
				expect( txList ).toBeDefined();
				expect( Array.isArray( txList ) ).toBeTruthy();
				expect( _.isString( pageKey ) ).toBeTruthy();

				if ( Array.isArray( txList ) )
				{
					for ( const tx of txList )
					{
						totalItem ++;

						//console.log( `tx`, tx );
						//
						//	should output:
						//	tx {
						//       blockNum: '0x5dd736',
						//       uniqueId: '0x8d77e8f76c2578fa2e943db5e16925b8ce7e13b6f693e94ce97cd278c4b4e6a0:external',
						//       hash: '0x8d77e8f76c2578fa2e943db5e16925b8ce7e13b6f693e94ce97cd278c4b4e6a0',
						//       from: '0xcc361bdf821563d2a8ac5b57a9e34ec5ca48c5f3',
						//       to: '0x8b4c0dc5aa90c322c747c10fdd7cf1759d343573',
						//       value: 0.002001,
						//       erc721TokenId: null,
						//       erc1155Metadata: null,
						//       tokenId: null,
						//       asset: 'ETH',
						//       category: 'external',
						//       rawContract: { value: '0x71be61e321000', address: null, decimal: '0x12' },
						//	 metadata: { blockTimestamp: '2024-06-20T20:29:00.000Z' }		//	if ( true === queryOptions.withMetadata )
						//     }
						//
						expect( tx ).toBeDefined();
						expect( tx ).toHaveProperty( 'blockNum' );
						expect( tx ).toHaveProperty( 'uniqueId' );
						expect( tx ).toHaveProperty( 'hash' );
						expect( tx ).toHaveProperty( 'from' );
						expect( tx ).toHaveProperty( 'to' );
						expect( tx ).toHaveProperty( 'value' );
						expect( tx ).toHaveProperty( 'erc721TokenId' );
						expect( tx ).toHaveProperty( 'erc1155Metadata' );
						expect( tx ).toHaveProperty( 'tokenId' );
						expect( tx ).toHaveProperty( 'asset' );
						expect( tx ).toHaveProperty( 'category' );
						expect( tx ).toHaveProperty( 'rawContract' );

						expect( isAddress( tx.from ) ).toBeTruthy();
						expect( isAddress( tx.to ) ).toBeTruthy();

						expect( TypeUtil.isNotNullObject( tx.rawContract ) ).toBeTruthy();
						expect( tx.rawContract ).toHaveProperty( 'value' );
						expect( tx.rawContract ).toHaveProperty( 'address' );
						expect( tx.rawContract ).toHaveProperty( 'decimal' );
						expect( _.startsWith( tx.rawContract.value, `0x` ) ).toBeTruthy();
						expect( null === tx.rawContract.decimal || _.startsWith( tx.rawContract.decimal, `0x` ) ).toBeTruthy();
						expect( null === tx.rawContract.address || isAddress( tx.rawContract.address ) ).toBeTruthy();

						if ( true === queryOptions.withMetadata )
						{
							expect( tx ).toHaveProperty( 'metadata' );
							expect( TypeUtil.isNotNullObject( tx.metadata ) ).toBeTruthy();
							expect( tx.metadata ).toHaveProperty( 'blockTimestamp' );
						}
					}
				}

				//console.log( `pageKey`, pageKey );

				//	...
				nextPageKey = pageKey;
				if ( `` === nextPageKey )
				{
					break;
				}
			}

			//console.log( `totalItem :`, totalItem );

		}, 90 * 1000 );
	} );


	describe( "Transaction Details", () =>
	{
		//	0xcC361BDf821563d2a8aC5B57A9e34EC5cA48C5F3
		//	0x47B506704DA0370840c2992A3d3d301FD3c260D3
		const walletAddress = `0x47B506704DA0370840c2992A3d3d301FD3c260D3`;

		it( `should return the transaction detail by the transaction hash`, async () =>
		{
			const queryOptions : TransactionHistoryQueryOptions = {};
			const fetchOptions : TransactionHistoryFetchOptions = {
				sort : 'desc',
			};
			const txResult : TransactionHistoryResult = await new WalletTransaction().queryTransactionHistory( walletAddress, queryOptions, fetchOptions );
			const txList = txResult.transfers;
			expect( txList ).toBeDefined();
			expect( Array.isArray( txList ) ).toBeTruthy();

			if ( Array.isArray( txList ) )
			{
				let maxRequests = 3;
				for ( const tx of txList )
				{
					//	should output:
					//	tx : {
					//       blockNum: '0x59d179',
					//       uniqueId: '0xdfea059e0fa92f4e91f27c0c32a87dc8939fe2a52ef6da8f5b58066b5b8981ce:log:10',
					//       hash: '0xdfea059e0fa92f4e91f27c0c32a87dc8939fe2a52ef6da8f5b58066b5b8981ce',
					//       from: '0xcc361bdf821563d2a8ac5b57a9e34ec5ca48c5f3',
					//       to: '0x8b4c0dc5aa90c322c747c10fdd7cf1759d343573',
					//       value: 1.1,
					//       erc721TokenId: null,
					//       erc1155Metadata: null,
					//       tokenId: null,
					//       asset: 'USDT',
					//       category: 'erc20',
					//       rawContract: {
					//         value: '0x10c8e0',
					//         address: '0x271b34781c76fb06bfc54ed9cfe7c817d89f7759',
					//         decimal: '0x6'
					//       },
					//       metadata: { blockTimestamp: '2024-05-12T08:00:12.000Z' }
					//     }
					//console.log( `tx :`, tx );
					expect( tx ).toBeDefined();
					expect( tx ).toHaveProperty( 'blockNum' );
					expect( tx ).toHaveProperty( 'uniqueId' );
					expect( tx ).toHaveProperty( 'hash' );
					expect( _.isString( tx.hash ) ).toBeTruthy();
					expect( _.isEmpty( tx.hash ) ).toBeFalsy();
					expect( _.startsWith( tx.hash, `0x` ) ).toBeTruthy();

					//
					//	...
					//
					const txDetail : any = await new WalletTransaction().queryTransactionDetail( tx.hash );
					//	should output:
					//	txDetail : {
					//       accessList: [],
					//       chainId: 11155111,
					//       from: '0x47b506704da0370840c2992a3d3d301fd3c260d3',
					//       to: '0x3a62dffe13529d981f2155f764d8e109772a0566',
					//       gasPrice: 1624736171,
					//       hash: '0x27cc43ddb6e4d369d262bd56780abba6441747d408855ad26fb3c550250a902c',
					//       maxFeePerGas: 1660301922,
					//       maxPriorityFeePerGas: 1500000000,
					//       nonce: 12,
					//       type: 2,
					//       value: 10000000000000000n,
					//       floatValue: 0.01,
					//       blockHash: '0xb891060f7ef8d1c9d25520c80596881ad8b3076eafb29ba22bb31a8b6468822b',
					//       blockNumber: 6148087,
					//       gasLimit: 21000,
					//       gas: 21000,
					//       totalGasFee: 34119459591000n,
					//       floatTotalGasFee: 0,
					//       total: 10034119459591000n,
					//       floatTotal: 0.01,
					//       input: '0x',
					//       r: '0x87566c86db24a5a3182177960fadf00ca9365d8b05d099b7cddfbfcadd40c923',
					//       s: '0x1ef1f5470f4f67120db7ddd49f84df24c1ad57ea45e7ef22fed1d6d9198c1df7',
					//       v: 1,
					//       transactionIndex: 13,
					//       yParity: 1
					//     }
					//console.log( `txDetail :`, txDetail );

					expect( txDetail ).toBeDefined();
					expect( txDetail ).toHaveProperty( 'accessList' );
					expect( txDetail ).toHaveProperty( 'blockHash' );
					expect( txDetail ).toHaveProperty( 'blockNumber' );
					expect( txDetail ).toHaveProperty( 'chainId' );
					expect( txDetail ).toHaveProperty( 'from' );
					expect( txDetail ).toHaveProperty( 'to' );
					expect( txDetail ).toHaveProperty( 'gasLimit' );
					expect( txDetail ).toHaveProperty( 'gas' );
					expect( txDetail ).toHaveProperty( 'gasPrice' );
					expect( txDetail ).toHaveProperty( 'totalGasFee' );
					expect( txDetail ).toHaveProperty( 'floatTotalGasFee' );
					expect( txDetail ).toHaveProperty( 'total' );
					expect( txDetail ).toHaveProperty( 'floatTotal' );
					expect( txDetail ).toHaveProperty( 'hash' );
					expect( txDetail ).toHaveProperty( 'input' );
					expect( txDetail ).toHaveProperty( 'maxFeePerGas' );
					expect( txDetail ).toHaveProperty( 'maxPriorityFeePerGas' );
					expect( txDetail ).toHaveProperty( 'nonce' );
					expect( txDetail ).toHaveProperty( 'r' );
					expect( txDetail ).toHaveProperty( 's' );
					expect( txDetail ).toHaveProperty( 'v' );
					expect( txDetail ).toHaveProperty( 'transactionIndex' );
					expect( txDetail ).toHaveProperty( 'type' );
					expect( txDetail ).toHaveProperty( 'value' );
					expect( txDetail ).toHaveProperty( 'floatValue' );
					expect( txDetail ).toHaveProperty( 'yParity' );

					//console.log( `txDetail :`, txDetail, typeof txDetail.accessList );
					expect( undefined === txDetail.accessList || Array.isArray( txDetail.accessList ) ).toBeTruthy();
					expect( _.isNumber( txDetail.chainId ) && txDetail.chainId > 0 ).toBeTruthy();
					expect( _.isString( txDetail.from ) && ! _.isEmpty( txDetail.from ) ).toBeTruthy();
					expect( _.isString( txDetail.to ) && ! _.isEmpty( txDetail.to ) ).toBeTruthy();
					expect( _.isNumber( txDetail.gasPrice ) && txDetail.gasPrice > 0 ).toBeTruthy();
					expect( _.isString( txDetail.hash ) && ! _.isEmpty( txDetail.hash ) ).toBeTruthy();
					expect( _.isNumber( txDetail.maxFeePerGas ) ).toBeTruthy();
					expect( _.isNumber( txDetail.maxPriorityFeePerGas ) ).toBeTruthy();
					expect( _.isNumber( txDetail.nonce ) ).toBeTruthy();
					expect( _.isNumber( txDetail.type ) ).toBeTruthy();

					expect( typeof txDetail.value ).toBe( `bigint` );
					expect( _.isNumber( txDetail.floatValue ) ).toBeTruthy();
					expect( MathUtil.floatValueFromBigint( txDetail.value, 18 ) ).toBe( txDetail.floatValue )

					expect( _.isString( txDetail.blockHash ) && ! _.isEmpty( txDetail.blockHash ) ).toBeTruthy();
					expect( _.isNumber( txDetail.blockNumber ) && txDetail.blockNumber > 0 ).toBeTruthy();
					expect( _.isNumber( txDetail.gasLimit ) && txDetail.gasLimit > 0 ).toBeTruthy();
					expect( _.isNumber( txDetail.gas ) && txDetail.gas > 0 ).toBeTruthy();

					expect( _.isString( txDetail.r ) && ! _.isEmpty( txDetail.r ) ).toBeTruthy();
					expect( _.isString( txDetail.s ) && ! _.isEmpty( txDetail.s ) ).toBeTruthy();
					expect( _.isNumber( txDetail.v ) ).toBeTruthy();
					expect( _.isNumber( txDetail.transactionIndex ) ).toBeTruthy();
					expect( _.isNumber( txDetail.yParity ) ).toBeTruthy();

					expect( typeof txDetail.totalGasFee ).toBe( `bigint` );
					expect( _.isNumber( txDetail.floatTotalGasFee ) ).toBeTruthy();
					expect( typeof txDetail.total ).toBe( `bigint` );
					expect( _.isNumber( txDetail.floatTotal ) ).toBeTruthy();

					//	bigint string
					const totalGasFeeFloatString : string = MathUtil.floatStringFromBigint( txDetail.totalGasFee, 18 );
					const totalFloatString : string = MathUtil.floatStringFromBigint( txDetail.total, 18 );
					expect( _.isString( totalGasFeeFloatString ) && ! _.isEmpty( totalGasFeeFloatString ) ).toBeTruthy();
					expect( _.isString( totalFloatString ) && ! _.isEmpty( totalFloatString ) ).toBeTruthy();

					//
					//	Nonce			: txDetail.nonce
					//	Amount			: txDetail.floatValue
					//	Gas Limit (Units)	: txDetail.gasLimit
					//	Gas Used (Units)	: txDetail.gas
					//	Priority fee (WEI)	: txDetail.maxPriorityFeePerGas
					//		1 Gwei = 1,000,000,000 Wei
					//	Priority fee (GWEI)	: txDetail.maxPriorityFeePerGas / 1000000000
					//	Total gas fee		: totalGasFeeFloatString
					//	Total			: totalFloatString
					//

					if ( -- maxRequests <= 0 )
					{
						break;
					}

					await TestUtil.sleep( 100 );
				}
			}

		}, 90 * 1000 );


		it( `should return the transaction receipt by the transaction hash`, async () =>
		{
			const queryOptions : TransactionHistoryQueryOptions = {};
			const fetchOptions : TransactionHistoryFetchOptions = {
				sort : 'desc',
			};
			const walletAddress = `0xd526a2216196bef034eac4de568127cdbedba538`;
			const txResult : TransactionHistoryResult = await new WalletTransaction().queryTransactionHistory( walletAddress, queryOptions, fetchOptions );
			const txList = txResult.transfers;
			expect( txList ).toBeDefined();
			expect( Array.isArray( txList ) ).toBeTruthy();

			if ( Array.isArray( txList ) )
			{
				let maxRequests = 3;
				let blockObjects : Record< string, BlockItem > = {};
				for ( const tx of txList )
				{
					console.log( `tx :`, tx );
					expect( tx ).toBeDefined();
					expect( tx ).toHaveProperty( 'blockNum' );
					expect( tx ).toHaveProperty( 'uniqueId' );
					expect( tx ).toHaveProperty( 'hash' );
					expect( _.isString( tx.blockNum ) ).toBeTruthy();
					expect( _.isEmpty( tx.blockNum ) ).toBeFalsy();
					expect( _.isString( tx.hash ) ).toBeTruthy();
					expect( _.isEmpty( tx.hash ) ).toBeFalsy();
					expect( _.startsWith( tx.hash, `0x` ) ).toBeTruthy();

					if ( ! blockObjects.hasOwnProperty( tx.blockNum ) )
					{
						blockObjects[ tx.blockNum ] = await new WalletTransaction().queryBlockByNumber( tx.blockNum );
					}
					//console.log( `blockObjects[ tx.blockNum ] :`, blockObjects[ tx.blockNum ] );
					//blockObjects[ tx.blockNum ] : {
					//       baseFeePerGas: '0x6c3d436c4',
					//       blobGasUsed: '0xc0000',
					//       difficulty: '0x0',
					//       excessBlobGas: '0x40000',
					//       extraData: '0x496c6c756d696e61746520446d6f63726174697a6520447374726962757465',
					//       gasLimit: '0x1c9c380',
					//       gasUsed: '0x9193c2',
					//       hash: '0x98e86e42e604d8bea43ad60d13d0352119a01b793edee8d3025b46af6b0aa376',
					//       logsBloom: '0x4420000000014000001004c284002044000900200005c08800040808068082080008800000202000324084000016c1a05400008226050890110430040024200000045000000500005400204a846096800420400202062460408008800840a2000c1802009288690208a0002080018d80942800c40008428800114410000960044220012408a0000021d000500a0100500000580820030000800104084444000102080004438113000010c1841002a008200000480090484000b0650aa0824888000010820000500000016300880300d480248120c14800001004001021006001001000000100202020602040200c003001010100689104000401288084110004',
					//       miner: '0x13cb6ae34a13a0977f4d7101ebc24b87bb23f0d5',
					//       mixHash: '0x595c074cfb143bd170cd2486a19617a47842833d347c8d558cefd428a114b042',
					//       nonce: '0x0000000000000000',
					//       number: '0x670412',
					//       parentBeaconBlockRoot: '0x52f2d973b5b568d7b8b0e2fb85d7b86749778fc541f3f4090ffb33498d307293',
					//       parentHash: '0x6ef71cd50e96f3066dc69dbf9a5cbfab04affa12d775520b58faf8aa648b7ac4',
					//       receiptsRoot: '0x9c3e70ca6a5292283993d696e5320752291c7bcdd780433e53df407c7ffcda76',
					//       sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
					//       size: '0x241b2',
					//       stateRoot: '0x69db64947f3d966bc25acb68b9881d3669051d57f8472e48399a8575ea6d9c63',
					//       timestamp: '0x66f2ba64',
					//       totalDifficulty: '0x3c656d23029ab0',
					//       transactions: [
					//         '0xb3633639131f8d8f045321cb5bf9b66d1394756c73da1421672bf658f83d78b9',
					//         '0x3fe2dc313f96e8eea3ef1209ba8b8d13778fa86bca3d2abaa46d9bd2bb5eb33d',
					//	   ...
					//       ],
					//       transactionsRoot: '0x8afe86df6de320bc49ad7b2e42ce1475ded1605ab6feeab2aa4e47f6f8455d8e',
					//       uncles: [],
					//       withdrawals: [
					//         {
					//           address: '0x25c4a76e7d118705e7ea2e9b7d8c59930d8acd3b',
					//           amount: '0x2e1b5',
					//           index: '0x395ec09',
					//           validatorIndex: '0x1bf'
					//         },
					//         ...
					//       ],
					//       withdrawalsRoot: '0xdcaf9edf9f747ad30dd913164b9590c33174d747577ebde0fb8a507411c855d7',
					//       timestampInSecond: 1727183460
					//     }
					const blockInfo = blockObjects[ tx.blockNum ];
					expect( blockInfo ).toBeDefined();
					expect( blockInfo ).not.toBeNull();
					expect( blockInfo ).toHaveProperty( 'timestampInSecond' );
					expect( _.isNumber( blockInfo.timestampInSecond ) ).toBeTruthy();
					expect( blockInfo.timestampInSecond ).toBeGreaterThan( 0 );
					const blockDate = new Date( blockInfo.timestampInSecond * 1000 );
					console.log( `blockDate :`, blockDate.toLocaleString() );
					//	blockDate : 9/24/2024, 9:33:36 PM
					//	blockDate : 9/24/2024, 9:11:00 PM


					//	...
					const txReceipt : any = await new WalletTransaction().queryTransactionReceipt( tx.hash );
					expect( txReceipt ).toBeDefined();
					expect( txReceipt ).toHaveProperty( 'blockHash' );
					expect( txReceipt ).toHaveProperty( 'blockNumber' );
					expect( txReceipt ).toHaveProperty( 'contractAddress' );
					expect( txReceipt ).toHaveProperty( 'cumulativeGasUsed' );
					expect( txReceipt ).toHaveProperty( 'effectiveGasPrice' );
					expect( txReceipt ).toHaveProperty( 'from' );
					expect( txReceipt ).toHaveProperty( 'gasUsed' );
					expect( txReceipt ).toHaveProperty( 'logs' );
					expect( Array.isArray( txReceipt.logs ) ).toBeTruthy();
					expect( txReceipt ).toHaveProperty( 'logsBloom' );
					expect( txReceipt ).toHaveProperty( 'status' );
					expect( txReceipt ).toHaveProperty( 'to' );
					expect( txReceipt ).toHaveProperty( 'transactionHash' );
					expect( txReceipt ).toHaveProperty( 'transactionIndex' );
					expect( txReceipt ).toHaveProperty( 'type' );
					//
					//	should output:
					//	{
					//       blockHash: '0x706ba1e3d5ef80221095cc8b7ca56653f042f25027a68d2355eff8d6818a9ed3',
					//       blockNumber: '0x900302',
					//       contractAddress: null,
					//       cumulativeGasUsed: '0x473ff8',
					//       effectiveGasPrice: '0x5968331b',
					//       from: '0x3b5ed1724e4cde8c22d2c1fad4625d06a828d7f8',
					//       gasUsed: '0xf6e6',
					//       logs: [
					//         {
					//           address: '0x9dc9a9a2a753c13b63526d628b1bf43cabb468fe',
					//           blockHash: '0x706ba1e3d5ef80221095cc8b7ca56653f042f25027a68d2355eff8d6818a9ed3',
					//           blockNumber: '0x900302',
					//           data: '0x000000000000000000000000000000000000000000000000000000174876e800',
					//           logIndex: '0x6a',
					//           removed: false,
					//           topics: [Array],
					//           transactionHash: '0x9cda2184ed0ed83c53b8912c68bfe0fa179e9f8e4b44a79d3a5ef1628f5f4b17',
					//           transactionIndex: '0x22'
					//         }
					//       ],
					//       logsBloom: '0x02000000000000000000000000000000000000000000000000000000000000000000000000000000100000020000000000000000000000000000000000000000000000000000000000000048000000000000000000002080000000000000000000000000000001000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000002000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000',
					//       status: '0x1',
					//       to: '0x9dc9a9a2a753c13b63526d628b1bf43cabb468fe',
					//       transactionHash: '0x9cda2184ed0ed83c53b8912c68bfe0fa179e9f8e4b44a79d3a5ef1628f5f4b17',
					//       transactionIndex: '0x22',
					//       type: '0x2'
					//     }
					//
					//console.log( txReceipt );

					if ( -- maxRequests <= 0 )
					{
						break;
					}

					await TestUtil.sleep( 500 );
				}
			}

		}, 90 * 1000 );
	} )
} );
