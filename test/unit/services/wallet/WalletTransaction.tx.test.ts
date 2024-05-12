import { describe, expect } from '@jest/globals';
import { ethers } from "ethers";
import {setCurrentChain, WalletFactory, WalletTransaction} from "../../../../src";
import { TransactionResponse } from "ethers";
import { TestUtil } from "debeem-utils";
import { WalletAccount } from "../../../../src";


/**
 *	WalletTransaction unit test
 */
describe( "WalletTransaction.tx", () =>
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

	describe( "Send transaction", () =>
	{
		const sendValue1 : string = '0.001124';	//	in ETH
		const publicWalletPrivateKey = 'c7f832621897e67d973f0f1c497198ed1b89a138f2fe3cc6ce6a59cd3fb7cd4c'.trim().toLowerCase();
		const publicWalletAddress : string = '0xcC361BDf821563d2a8aC5B57A9e34EC5cA48C5F3'.trim().toLowerCase();
		const payeeAddress : string = `0x8B4c0Dc5AA90c322C747c10FDD7cf1759D343573`.trim().toLowerCase();

		it( `should send ${ sendValue1 }ETH from one account to other by .sign and .broadcast`, async () =>
		{
			//	wallet public
			const walletObj = new WalletFactory().createWalletFromPrivateKey( publicWalletPrivateKey );

			expect( walletObj ).not.toBeNull();
			expect( walletObj.privateKey.startsWith( '0x' ) ).toBe( true );
			expect( walletObj.privateKey ).toBe( publicWalletPrivateKey );
			expect( walletObj.address ).toBe( publicWalletAddress );
			expect( walletObj.index ).toBe( 0 );
			expect( walletObj.path ).toBe( null );

			//
			//	should output:
			//	{
			//       isHD: false,
			//       mnemonic: '',
			//       password: '',
			//       address: '0x8B4c0Dc5AA90c322C747c10FDD7cf1759D343573',
			//       publicKey: '0x0203e70364e42205e9d1ab8b437bfe7f1277a4061942abdb146e6e1828d48d24aa',
			//       privateKey: '0x948427c37d662bde57c4d52116b63a87083186149ac6040b976a3ebb3398fc98',
			//       index: 0,
			//       path: null
			//     }
			//
			//console.log( walletObj );

			//	wei, 18 decimal places
			const balance : bigint = await new WalletAccount().ethQueryBalance( walletObj.address );
			const balanceStr : string = ethers.formatEther( balance );

			//	will output: 19926499999559000n
			//console.log( balance );

			//	will output: "0.019926499999559"
			//console.log( balanceStr );

			//	...
			expect( balance ).toBeGreaterThan( 0 );
			expect( balanceStr ).toBeDefined();
			expect( balanceStr ).toContain( "0." );

			//
			//	send translation from [oneKey wallet 1] to [oneKey wallet 2]
			//
			const singedTx : string = await new WalletTransaction().signTransaction( walletObj, payeeAddress, sendValue1 );
			expect( singedTx ).toBeDefined();
			expect( typeof singedTx ).toBe( "string" );
			expect( singedTx.length ).toBeGreaterThan( 0 );

			const broadcastResponse : TransactionResponse = await new WalletTransaction().broadcastTransaction( singedTx );
			expect( broadcastResponse ).toBeDefined();
			expect( typeof broadcastResponse ).toBe( "object" );
			expect( broadcastResponse ).toHaveProperty( 'provider' );
			expect( broadcastResponse ).toHaveProperty( 'blockNumber' );
			expect( broadcastResponse ).toHaveProperty( 'blockHash' );
			expect( broadcastResponse ).toHaveProperty( 'index' );
			expect( broadcastResponse ).toHaveProperty( 'hash' );
			expect( broadcastResponse ).toHaveProperty( 'type' );
			expect( broadcastResponse ).toHaveProperty( 'to' );
			expect( broadcastResponse ).toHaveProperty( 'from' );
			expect( broadcastResponse ).toHaveProperty( 'nonce' );
			expect( broadcastResponse.nonce ).toBeGreaterThan( 0 );
			expect( broadcastResponse ).toHaveProperty( 'gasLimit' );
			expect( broadcastResponse ).toHaveProperty( 'gasPrice' );
			expect( broadcastResponse ).toHaveProperty( 'maxPriorityFeePerGas' );
			expect( broadcastResponse ).toHaveProperty( 'maxFeePerGas' );
			expect( broadcastResponse ).toHaveProperty( 'data' );
			expect( broadcastResponse ).toHaveProperty( 'value' );
			expect( broadcastResponse ).toHaveProperty( 'chainId' );
			expect( broadcastResponse ).toHaveProperty( 'signature' );
			expect( broadcastResponse.signature ).toHaveProperty( 'r' );
			expect( broadcastResponse.signature ).toHaveProperty( 's' );
			expect( broadcastResponse ).toHaveProperty( 'accessList' );

			//	...
			//console.log( broadcastResponse );

			//	wait for a while
			await TestUtil.sleep(40 * 1000 );
		}, 90 * 1000 );


		const sendValue2 : string = '0.0020010';	//	in ETH
		it( `should send ${ sendValue2 }ETH from one account to other by method .send`, async () =>
		{
			//	wallet public
			const walletObj = new WalletFactory().createWalletFromPrivateKey( publicWalletPrivateKey );

			expect( walletObj ).not.toBeNull();
			expect( walletObj.privateKey.startsWith( '0x' ) ).toBe( true );
			expect( walletObj.privateKey ).toBe( publicWalletPrivateKey );
			expect( walletObj.address ).toBe( publicWalletAddress );
			expect( walletObj.index ).toBe( 0 );
			expect( walletObj.path ).toBe( null );

			//	wei, 18 decimal places
			const balance : bigint = await new WalletAccount().ethQueryBalance( walletObj.address );
			const balanceStr : string = ethers.formatEther( balance );

			//	will output: 19926499999559000n
			//console.log( balance );

			//	will output: "0.019926499999559"
			//console.log( balanceStr );

			//	...
			expect( balance ).toBeGreaterThan( 0 );
			expect( balanceStr ).toBeDefined();
			expect( balanceStr ).toContain( "0." );

			//
			//	send translation from [oneKey wallet 1] to [oneKey wallet 2]
			//
			const broadcastResponse : TransactionResponse = await new WalletTransaction().send( walletObj, payeeAddress, sendValue2 );
			expect( broadcastResponse ).toBeDefined();
			expect( typeof broadcastResponse ).toBe( "object" );
			expect( broadcastResponse ).toHaveProperty( 'provider' );
			expect( broadcastResponse ).toHaveProperty( 'blockNumber' );
			expect( broadcastResponse ).toHaveProperty( 'blockHash' );
			expect( broadcastResponse ).toHaveProperty( 'index' );
			expect( broadcastResponse ).toHaveProperty( 'hash' );
			expect( broadcastResponse ).toHaveProperty( 'type' );
			expect( broadcastResponse ).toHaveProperty( 'to' );
			expect( broadcastResponse ).toHaveProperty( 'from' );
			expect( broadcastResponse ).toHaveProperty( 'nonce' );
			expect( broadcastResponse.nonce ).toBeGreaterThan( 0 );
			expect( broadcastResponse ).toHaveProperty( 'gasLimit' );
			expect( broadcastResponse ).toHaveProperty( 'gasPrice' );
			expect( broadcastResponse ).toHaveProperty( 'maxPriorityFeePerGas' );
			expect( broadcastResponse ).toHaveProperty( 'maxFeePerGas' );
			expect( broadcastResponse ).toHaveProperty( 'data' );
			expect( broadcastResponse ).toHaveProperty( 'value' );
			expect( broadcastResponse ).toHaveProperty( 'chainId' );
			expect( broadcastResponse ).toHaveProperty( 'signature' );
			expect( broadcastResponse.signature ).toHaveProperty( 'r' );
			expect( broadcastResponse.signature ).toHaveProperty( 's' );
			expect( broadcastResponse ).toHaveProperty( 'accessList' );

			//	...
			//console.log( broadcastResponse );

			//	wait for a while
			await TestUtil.sleep(40 * 1000 );
		}, 90 * 1000 );


		const sendValueUsdt : string = '1.1';	//	in USDT
		it( `should send ${ sendValueUsdt }USDT from one account to other by method .sendContractTransaction`, async () =>
		{
			//	wallet public
			const walletObj = new WalletFactory().createWalletFromPrivateKey( publicWalletPrivateKey );

			expect( walletObj ).not.toBeNull();
			expect( walletObj.privateKey.startsWith( '0x' ) ).toBe( true );
			expect( walletObj.privateKey ).toBe( publicWalletPrivateKey );
			expect( walletObj.address ).toBe( publicWalletAddress );
			expect( walletObj.index ).toBe( 0 );
			expect( walletObj.path ).toBe( null );

			//	wei, 18 decimal places
			const balance : bigint = await new WalletAccount().ethQueryBalance( walletObj.address );
			const balanceStr : string = ethers.formatEther( balance );

			//	will output: 19926499999559000n
			//console.log( balance );

			//	will output: "0.019926499999559"
			//console.log( balanceStr );

			//	...
			expect( balance ).toBeGreaterThan( 0 );
			expect( balanceStr ).toBeDefined();
			expect( balanceStr ).toContain( "0." );

			//
			//	send translation from [oneKey wallet 1] to [oneKey wallet 2]
			//
			//	this is USDT contract address on sepolia
			const usdtContractAddress = '0x9e15898acf36C544B6f4547269Ca8385Ce6304d8';
			const broadcastResponse : TransactionResponse = await new WalletTransaction().sendContractTransaction
			(
				usdtContractAddress,
				walletObj,
				payeeAddress,
				sendValueUsdt,
				6
			);
			expect( broadcastResponse ).toBeDefined();
			expect( typeof broadcastResponse ).toBe( "object" );
			expect( broadcastResponse ).toHaveProperty( 'provider' );
			expect( broadcastResponse ).toHaveProperty( 'blockNumber' );
			expect( broadcastResponse ).toHaveProperty( 'blockHash' );
			expect( broadcastResponse ).toHaveProperty( 'index' );
			expect( broadcastResponse ).toHaveProperty( 'hash' );
			expect( broadcastResponse ).toHaveProperty( 'type' );
			expect( broadcastResponse ).toHaveProperty( 'to' );
			expect( broadcastResponse ).toHaveProperty( 'from' );
			expect( broadcastResponse ).toHaveProperty( 'nonce' );
			expect( broadcastResponse.nonce ).toBeGreaterThan( 0 );
			expect( broadcastResponse ).toHaveProperty( 'gasLimit' );
			expect( broadcastResponse ).toHaveProperty( 'gasPrice' );
			expect( broadcastResponse ).toHaveProperty( 'maxPriorityFeePerGas' );
			expect( broadcastResponse ).toHaveProperty( 'maxFeePerGas' );
			expect( broadcastResponse ).toHaveProperty( 'data' );
			expect( broadcastResponse ).toHaveProperty( 'value' );
			expect( broadcastResponse ).toHaveProperty( 'chainId' );
			expect( broadcastResponse ).toHaveProperty( 'signature' );
			expect( broadcastResponse.signature ).toHaveProperty( 'r' );
			expect( broadcastResponse.signature ).toHaveProperty( 's' );
			expect( broadcastResponse ).toHaveProperty( 'accessList' );

			//	...
			//console.log( broadcastResponse );

			//	wait for a while
			await TestUtil.sleep(30 * 1000 );
		}, 90 * 1000 );
	} )
} );
