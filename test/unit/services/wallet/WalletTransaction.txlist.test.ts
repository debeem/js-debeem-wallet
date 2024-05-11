import { describe, expect } from '@jest/globals';
import { WalletTransaction } from "../../../../src";
import { FetchListOptions } from "debeem-utils";
import { TypeUtil } from "../../../../src/utils/TypeUtil";
import { TransactionHistoryResult } from "../../../../src/models/Transaction";


/**
 *	WalletTransaction unit test
 */
describe( "WalletTransaction.txlist", () =>
{
	beforeAll( async () =>
	{
	} );
	afterAll( async () =>
	{
	} );

	describe( "Query transaction list", () =>
	{
		const walletAddress = `0x47B506704DA0370840c2992A3d3d301FD3c260D3`;

		it( `should return the number of transactions sent from the address`, async () =>
		{
			const count : bigint = await new WalletTransaction().queryTransactionCountFromAddress( walletAddress );
			expect( count ).toBeGreaterThanOrEqual( 0 );

		}, 90 * 1000 );

		it( `should return all historical transactions by the wallet address`, async () =>
		{
			const fetchOptions : FetchListOptions = {
				sort : 'desc',
				pageSize : 1,
			};
			const txResult : TransactionHistoryResult = await new WalletTransaction().queryTransactionHistory( walletAddress, fetchOptions );
			const txList = txResult.transfers;
			const fromPageKey = txResult?.fromPageKey;
			const toPageKey = txResult?.toPageKey;

			expect( txList ).toBeDefined();
			expect( Array.isArray( txList ) ).toBeTruthy();
			expect( TypeUtil.isNotEmptyString( fromPageKey ) ).toBeTruthy();
			expect( TypeUtil.isNotEmptyString( toPageKey ) ).toBeTruthy();

			if ( Array.isArray( txList ) )
			{
				for ( const tx of txList )
				{
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
					expect( TypeUtil.isNotNullObject( tx.rawContract ) ).toBeTruthy();
					expect( tx.rawContract ).toHaveProperty( 'value' );
					expect( tx.rawContract ).toHaveProperty( 'address' );
					expect( tx.rawContract ).toHaveProperty( 'decimal' );
					expect( tx ).toHaveProperty( 'metadata' );
					expect( TypeUtil.isNotNullObject( tx.metadata ) ).toBeTruthy();
					expect( tx.metadata ).toHaveProperty( 'blockTimestamp' );
				}
			}

			//	should output:
			//	[
			//       {
			//         blockNum: '0x9009d8',
			//         uniqueId: '0x95a6d8898372a5230712fa6efbbda83188ced71418717ec7e653d3a0173419ed:log:1184',
			//         hash: '0x95a6d8898372a5230712fa6efbbda83188ced71418717ec7e653d3a0173419ed',
			//         from: '0x47b506704da0370840c2992a3d3d301fd3c260d3',
			//         to: '0x8b4c0dc5aa90c322c747c10fdd7cf1759d343573',
			//         value: 100,
			//         erc721TokenId: null,
			//         erc1155Metadata: null,
			//         tokenId: null,
			//         asset: 'USDT',
			//         category: 'erc20',
			//         rawContract: {
			//           value: '0x05f5e100',
			//           address: '0x9dc9a9a2a753c13b63526d628b1bf43cabb468fe',
			//           decimal: '0x6'
			//         },
			//         metadata: { blockTimestamp: '2023-07-31T15:29:00.000Z' }
			//       },
			//	 ...
			//	]
			//
			//console.log( txList );

		}, 90 * 1000 );

		it( `should return the transaction detail by the transaction hash`, async () =>
		{
			const fetchOptions : FetchListOptions = {
				sort : 'desc',
			};
			const txResult : TransactionHistoryResult = await new WalletTransaction().queryTransactionHistory( walletAddress, fetchOptions );
			const txList = txResult.transfers;
			expect( txList ).toBeDefined();
			expect( Array.isArray( txList ) ).toBeTruthy();

			if ( Array.isArray( txList ) )
			{
				for ( const tx of txList )
				{
					const txDetail : any = await new WalletTransaction().queryTransactionDetail( tx.hash );
					expect( txDetail ).toBeDefined();
					expect( txDetail ).toHaveProperty( 'accessList' );
					expect( txDetail ).toHaveProperty( 'blockHash' );
					expect( txDetail ).toHaveProperty( 'blockNumber' );
					expect( txDetail ).toHaveProperty( 'chainId' );
					expect( txDetail ).toHaveProperty( 'from' );
					expect( txDetail ).toHaveProperty( 'gas' );
					expect( txDetail ).toHaveProperty( 'gasPrice' );
					expect( txDetail ).toHaveProperty( 'hash' );
					expect( txDetail ).toHaveProperty( 'input' );
					expect( txDetail ).toHaveProperty( 'maxFeePerGas' );
					expect( txDetail ).toHaveProperty( 'maxPriorityFeePerGas' );
					expect( txDetail ).toHaveProperty( 'nonce' );
					expect( txDetail ).toHaveProperty( 'r' );
					expect( txDetail ).toHaveProperty( 's' );
					expect( txDetail ).toHaveProperty( 'v' );
					expect( txDetail ).toHaveProperty( 'type' );
					expect( txDetail ).toHaveProperty( 'value' );
					//
					//	should output:
					//	{
					//       accessList: [],
					//       blockHash: '0xd53fd9c54825d2a56bc1a128dfcdd5efb302143064e3f21457eef06f4ff5bba3',
					//       blockNumber: '0x900177',
					//       chainId: '0x5',
					//       from: '0x3b5ed1724e4cde8c22d2c1fad4625d06a828d7f8',
					//       gas: '0x5208',
					//       gasPrice: '0x73a20d1f',
					//       hash: '0x53a70ce7480eb41ec4a07b62265aaa0d38283ecfa9b10c4a88c561dc5f1d1696',
					//       input: '0x',
					//       maxFeePerGas: '0x73a220bc',
					//       maxPriorityFeePerGas: '0x73a20d00',
					//       nonce: '0x36',
					//       r: '0xdc19507808c73358711120629e56d168702eb8ab73a896dc4f7524067a46440b',
					//       s: '0x66caa560305c285d01abb258f6f341fdcd32fb9d2706fb511ccef4c404ac862f',
					//       to: '0x47b506704da0370840c2992a3d3d301fd3c260d3',
					//       transactionIndex: '0xb',
					//       type: '0x2',
					//       v: '0x1',
					//       value: '0x6f05b59d3b20000'
					//     }
					//
					//console.log( txDetail );
				}
			}

		}, 90 * 1000 );


		it( `should return the transaction receipt by the transaction hash`, async () =>
		{
			const fetchOptions : FetchListOptions = {
				sort : 'desc',
			};
			const txResult : TransactionHistoryResult = await new WalletTransaction().queryTransactionHistory( walletAddress, fetchOptions );
			const txList = txResult.transfers;
			expect( txList ).toBeDefined();
			expect( Array.isArray( txList ) ).toBeTruthy();

			if ( Array.isArray( txList ) )
			{
				for ( const tx of txList )
				{
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
				}
			}

		}, 90 * 1000 );
	} )
} );
