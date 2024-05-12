import { describe, expect } from '@jest/globals';
import {getCurrentChain, setCurrentChain, WalletTransaction} from "../../../../src";


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
		//	on Speolia chain
		const txHashs : any = {
			5 : `0x755e2e793bc7c885e0ad7071802700ca695c17b7a0177d3e841b387ca424bb03`,

			//	https://sepolia.etherscan.io/tx/0x9a1c1b08e89d7d6dd80c570a68d67cefe6288995c25b6d723078c5abff40202d
			11155111 : `0x9a1c1b08e89d7d6dd80c570a68d67cefe6288995c25b6d723078c5abff40202d`,
		};
		const txHash = txHashs[ getCurrentChain() ];

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
			//       blobGasPrice: '0x5be3b',
			//       blobGasUsed: '0x20000',
			//       blockHash: '0x7ea68a24849884e7ef384cdb7e90cb1879397471e21d6955666b1a464344d353',
			//       blockNumber: '0x59d017',
			//       contractAddress: null,
			//       cumulativeGasUsed: '0x1a99383',
			//       effectiveGasPrice: '0x12f904c4c1',
			//       from: '0x246e119a5bcc2875161b23e4e602e25cece96e37',
			//       gasUsed: '0x5208',
			//       logs: [],
			//       logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
			//       status: '0x1',
			//       to: '0xff00000000000000000000000000000000004202',
			//       transactionHash: '0x9a1c1b08e89d7d6dd80c570a68d67cefe6288995c25b6d723078c5abff40202d',
			//       transactionIndex: '0x77',
			//       type: '0x3'
			//     }
			//console.log( detail )

		}, 90 * 1000 );

		it( `should return the receipt of a transaction by hash`, async () =>
		{
			const detail : any = await new WalletTransaction().queryTransactionReceipt( txHash );
			console.log( detail )
			expect( detail ).toBeDefined();
			expect( detail ).toHaveProperty( 'blobGasPrice' );
			expect( detail ).toHaveProperty( 'blobGasUsed' );
			expect( detail ).toHaveProperty( 'blockHash' );
			expect( detail ).toHaveProperty( 'blockNumber' );
			expect( detail ).toHaveProperty( 'contractAddress' );
			expect( detail ).toHaveProperty( 'cumulativeGasUsed' );
			expect( detail ).toHaveProperty( 'effectiveGasPrice' );
			expect( detail ).toHaveProperty( 'from' );
			expect( detail ).toHaveProperty( 'gasUsed' );
			expect( detail ).toHaveProperty( 'logs' );
			expect( Array.isArray( detail.logs ) ).toBeTruthy();
			if ( detail.logs.length > 0 )
			{
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
			}
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
