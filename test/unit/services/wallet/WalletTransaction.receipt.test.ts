import { describe, expect } from '@jest/globals';
import {setCurrentChain, WalletTransaction} from "../../../../src";


/**
 *	WalletTransaction unit test
 */
describe( "WalletTransaction.receipt", () =>
{
	beforeAll( async () =>
	{
	} );
	afterAll( async () =>
	{
	} );

	beforeEach(() =>
	{
		//	switch chain/network to Eth.Sepolia
		setCurrentChain( 11155111 );
	});

	describe( "Query transaction list", () =>
	{
		//	on Goerli chain
		const txHash = `0x755e2e793bc7c885e0ad7071802700ca695c17b7a0177d3e841b387ca424bb03`;
		it( `should return the detail of a transaction by hash`, async () =>
		{
			const detail : any = await new WalletTransaction().queryTransactionDetail( txHash );
			expect( detail ).toBeDefined();
			expect( detail ).toHaveProperty( 'blockHash' );
			expect( detail ).toHaveProperty( 'blockNumber' );
			expect( detail ).toHaveProperty( 'chainId' );
			expect( detail ).toHaveProperty( 'from' );
			expect( detail ).toHaveProperty( 'gas' );
			expect( detail ).toHaveProperty( 'gasPrice' );
			expect( detail ).toHaveProperty( 'hash' );
			expect( detail ).toHaveProperty( 'input' );
			expect( detail ).toHaveProperty( 'nonce' );
			expect( detail ).toHaveProperty( 'r' );
			expect( detail ).toHaveProperty( 's' );
			expect( detail ).toHaveProperty( 'to' );
			expect( detail ).toHaveProperty( 'to' );
			expect( detail ).toHaveProperty( 'transactionIndex' );
			expect( detail ).toHaveProperty( 'type' );
			expect( detail ).toHaveProperty( 'v' );
			expect( detail ).toHaveProperty( 'value' );

			//	should output:
			//	{
			//       accessList: [],
			//       blockHash: '0x3a6f46e5d278756519f749890fb57406fea36e87a09dfd309b4cdb33903f7fe5',
			//       blockNumber: '0x3cdcfc',
			//       chainId: '0xaa36a7',
			//       from: '0xe92e18605c8309a6f191ea1c851d2ed4d3b37334',
			//       gas: '0xb40e',
			//       gasPrice: '0x3b9abbac',
			//       hash: '0xbd1b76c2a4939488a5f8a1d73f2c1d0fba334e30c8e166e2c04161a8db314b35',
			//       input: '0xa9059cbb00000000000000000000000047b506704da0370840c2992a3d3d301fd3c260d3000000000000000000000000000000000000000000000000000000000010c8e0',
			//       nonce: '0x4b',
			//       r: '0x9c0fbf24cd30c9ef4157ebe6c7e47430d0b283f79a8180a133420b90a599eccf',
			//       s: '0x382c83b81a5cd39f5f12c708b7a688cc4cb01b7da9ccf993bd4a9b89e7f50644',
			//       to: '0x9e15898acf36c544b6f4547269ca8385ce6304d8',
			//       transactionIndex: '0x3f',
			//       type: '0x1',
			//       v: '0x0',
			//       value: '0x0'
			//     }
			//console.log( detail )

		}, 90 * 1000 );

		it( `should return the receipt of a transaction by hash`, async () =>
		{
			const detail : any = await new WalletTransaction().queryTransactionReceipt( txHash );
			expect( detail ).toBeDefined();
			expect( detail ).toHaveProperty( 'blockHash' );
			expect( detail ).toHaveProperty( 'blockNumber' );
			expect( detail ).toHaveProperty( 'cumulativeGasUsed' );
			expect( detail ).toHaveProperty( 'effectiveGasPrice' );
			expect( detail ).toHaveProperty( 'from' );
			expect( detail ).toHaveProperty( 'gasUsed' );
			expect( detail ).toHaveProperty( 'logs' );
			expect( Array.isArray( detail.logs ) ).toBeTruthy();
			expect( detail.logs.length ).toBeGreaterThan( 0 );
			expect( detail.logs[ 0 ] ).toHaveProperty( 'address' );
			expect( detail.logs[ 0 ] ).toHaveProperty( 'blockHash' );
			expect( detail.logs[ 0 ] ).toHaveProperty( 'blockNumber' );
			expect( detail.logs[ 0 ] ).toHaveProperty( 'data' );
			expect( detail.logs[ 0 ] ).toHaveProperty( 'logIndex' );
			expect( detail.logs[ 0 ] ).toHaveProperty( 'removed' );
			expect( detail.logs[ 0 ] ).toHaveProperty( 'topics' );
			expect( detail.logs[ 0 ] ).toHaveProperty( 'transactionHash' );
			expect( detail.logs[ 0 ] ).toHaveProperty( 'transactionIndex' );
			expect( detail ).toHaveProperty( 'logsBloom' );
			expect( detail ).toHaveProperty( 'status' );
			expect( detail ).toHaveProperty( 'to' );
			expect( detail ).toHaveProperty( 'transactionHash' );
			expect( detail ).toHaveProperty( 'transactionIndex' );
			expect( detail ).toHaveProperty( 'type' );

			//	should output:
			//	{
			//       blockHash: '0x3a6f46e5d278756519f749890fb57406fea36e87a09dfd309b4cdb33903f7fe5',
			//       blockNumber: '0x3cdcfc',
			//       contractAddress: null,
			//       cumulativeGasUsed: '0xbbea43',
			//       effectiveGasPrice: '0x3b9abbac',
			//       from: '0xe92e18605c8309a6f191ea1c851d2ed4d3b37334',
			//       gasUsed: '0xb40e',
			//       logs: [
			//         {
			//           address: '0x9e15898acf36c544b6f4547269ca8385ce6304d8',
			//           blockHash: '0x3a6f46e5d278756519f749890fb57406fea36e87a09dfd309b4cdb33903f7fe5',
			//           blockNumber: '0x3cdcfc',
			//           data: '0x000000000000000000000000000000000000000000000000000000000010c8e0',
			//           logIndex: '0x801',
			//           removed: false,
			//           topics: [Array],
			//           transactionHash: '0xbd1b76c2a4939488a5f8a1d73f2c1d0fba334e30c8e166e2c04161a8db314b35',
			//           transactionIndex: '0x3f'
			//         }
			//       ],
			//       logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000008000000000000000000000080000000000000000000000000000001000000000000000000000000000000000000000010000000000000000000000101000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000001000800000000000000000000000000000000000000000000000000000000000000000004000000',
			//       status: '0x1',
			//       to: '0x9e15898acf36c544b6f4547269ca8385ce6304d8',
			//       transactionHash: '0xbd1b76c2a4939488a5f8a1d73f2c1d0fba334e30c8e166e2c04161a8db314b35',
			//       transactionIndex: '0x3f',
			//       type: '0x1'
			//     }
			//console.log( detail );

		}, 90 * 1000 );

	} )
} );
