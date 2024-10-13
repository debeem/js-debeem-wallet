import { describe, expect } from '@jest/globals';
import {TokenService, TokenStorageService, WalletFactory} from "../../../../src";
import { ethers } from "ethers";
import { WalletAccount } from "../../../../src";
import {TypeUtil, TestUtil, MathUtil} from "debeem-utils";
import { setCurrentChain } from "../../../../src";
import { revertToDefaultChain } from "../../../../src";
import {
	ContractTokenBalanceItem,
	ContractTokenValueItem,
	TokenValueItem,
	TotalValues
} from "../../../../src/models/TokenModels";
import { ChainLinkPriceResult } from "../../../../src/services/rpcs/chainLink/ChainLinkService";
import _ from "lodash";
import { getCurrentChain } from "../../../../src";


/**
 *	WalletTransaction unit test
 */
describe( "WalletTransaction.account", () =>
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



	describe( "Query Account Balance", () =>
	{
		it( "should return the Ether balance", async () =>
		{
			const address = '0x47B506704DA0370840c2992A3d3d301FD3c260D3';

			const balance = await new WalletAccount().queryBalance( address );
			//console.log( `balance :`, balance );
			//	balance : 2553243637330105070n
			expect( balance ).toBeGreaterThan( 0 );
			expect( TypeUtil.isNotEmptyString( ethers.formatEther( balance ) ) ).toBeTruthy();

			await TestUtil.sleep(3 * 1000 );

		}, 20 * 1000 );

		it( "should return the Ether balance in my wallet zero", async () =>
		{
			const address = '0x30560B6A2214858Caf6C17c75732A8309049BfAC';

			const balance = await new WalletAccount().queryBalance( address );
			expect( ethers.formatEther( balance ) ).toBe( "0.0" );

			await TestUtil.sleep(3 * 1000 );

		}, 20 * 1000 );

		it( "Should return the balance of a derived token", async () =>
		{
			//
			//	on Ethereum Sepolia Testnet
			//	Wallet : SPubUSDT100
			//	This account permanently stores 100 USDT
			//
			const address = '0x30560B6A2214858Caf6C17c75732A8309049BfAC';

			//	mint USDT/USD:
			//	https://sepolia.etherscan.io/token/0x271b34781c76fb06bfc54ed9cfe7c817d89f7759#writeContract
			//
			//	Transfers:
			//	https://sepolia.etherscan.io/token/0x271b34781c76fb06bfc54ed9cfe7c817d89f7759?a=0x47b506704da0370840c2992a3d3d301fd3c260d3
			const tokens : Array<ContractTokenBalanceItem> = [
				{
					pair : "USDT/USD",
					contractAddress : '0x271B34781c76fB06bfc54eD9cfE7c817d89f7759',
					decimals : 6,
					tokenBalance : BigInt( 0 )
				}
			];
			const balances = await new WalletAccount().queryTokenBalances( address, tokens );
			//	should output:
			//	balances :  [
			//       {
			//         pair: 'USDT/USD',
			//         decimals: undefined,
			//         contractAddress: '0x271B34781c76fB06bfc54eD9cfE7c817d89f7759',
			//         tokenBalance: 100000000n
			//       }
			//     ]
			//console.log( `balances : `, balances );

			expect( balances ).toBeDefined();
			expect( Array.isArray( balances ) ).toBeTruthy();
			if ( balances )
			{
				for ( const balance of balances )
				{
					//console.log( balance );
					//	should output:
					//	{
					//       pair: 'USDT/USD',
					//       decimals: 6,
					//       contractAddress: '0x271B34781c76fB06bfc54eD9cfE7c817d89f7759',
					//       tokenBalance: 100000000n
					//     }
					expect( balance ).toBeDefined();
					expect( typeof balance.pair ).toBe( `string` );
					expect( _.isNumber( balance.decimals ) ).toBeTruthy();
					expect( _.isString( balance.contractAddress ) && ! _.isEmpty( balance.contractAddress ) ).toBeTruthy();
					expect( typeof balance.tokenBalance ).toBe( `bigint` );
					expect( balance.tokenBalance ).toBe( BigInt( 100000000 ) );	//	100000000 / 1e6 = 100

					//	decimals
					let find : ContractTokenBalanceItem | undefined = tokens.find(
						( f : ContractTokenBalanceItem ) => f.contractAddress.trim().toLowerCase() === balance.contractAddress.trim().toLowerCase()
					);
					expect( find ).toBeDefined();
					expect( find && _.isString( find.contractAddress ) ).toBeTruthy();
					expect( find && find.contractAddress.trim().toLowerCase() === balance.contractAddress.trim().toLowerCase() ).toBeTruthy();
					expect( find && find.decimals > 0 ).toBeTruthy();
					expect( find && find.decimals === balance.decimals ).toBeTruthy();
				}
			}

			await TestUtil.sleep(3 * 1000 );

		}, 40 * 1000 );

		it( "should throw an error if the address is invalid", async () =>
		{
			try
			{
				await new WalletAccount().queryBalance( "" );
			}
			catch ( error )
			{
				// Assert that the error is thrown
				expect( error ).toBeDefined();
				expect( error ).toEqual( "WalletAccount.queryBalance :: wallet address not specified" );
			}

			try
			{
				await new WalletAccount().queryTokenBalances( "", [] );
			}
			catch ( error )
			{
				// Assert that the error is thrown
				expect( error ).toBeDefined();
				expect( error ).toEqual( "WalletAccount.queryTokenBalances :: invalid address" );
			}

			await TestUtil.sleep(3 * 1000 );

		}, 20 * 1000 );

		it( "should throw an error if the token ABI is not valid", async () =>
		{
			const address = '0xC8F60EaF5988aC37a2963aC5Fabe97f709d6b357';
			try
			{
				await new WalletAccount().queryTokenBalances( address, [] );
			}
			catch ( error )
			{
				// Assert that the error is thrown
				expect( error ).toBeDefined();
				expect( error ).toEqual( "WalletAccount.queryTokenBalances :: invalid contractAddresses" );
			}

			await TestUtil.sleep(3 * 1000 );

		}, 20 * 1000 );

		it( "should recover a wallet from the backup mnemonic", async () =>
		{
			const mnemonic = 'lab ball helmet sure replace gauge size rescue radar cluster remember twenty';
			const walletObj = new WalletFactory().createWalletFromMnemonic( mnemonic );

			expect( walletObj ).not.toBeNull();
			expect( walletObj.mnemonic ).toBe( mnemonic );
			expect( walletObj.privateKey.startsWith( '0x' ) ).toBe( true );
			expect( walletObj.address.startsWith( '0x' ) ).toBe( true );
			expect( walletObj.index ).toBe( 0 );
			expect( walletObj.path ).toBe( ethers.defaultPath );

			//	wei, 18 decimal places
			const balance : bigint = await new WalletAccount().queryBalance( walletObj.address );
			const balanceStr : string = ethers.formatEther( balance );

			//	will output: 191529955215828684n
			//console.log( balance );

			//	will output: "0.191529955215828684"
			//console.log( balanceStr );

			//	...
			expect( balance ).toBe( BigInt( `191529955215828684` ) );
			expect( balanceStr ).toBeDefined();
			expect( balanceStr ).toBe( "0.191529955215828684" );

			await TestUtil.sleep(3 * 1000 );

		}, 20 * 1000 );

	} );

	describe( "Query Token Prices", () =>
	{
		it( "should return the live price of BTC/USD ETH/USD ... on Ethereum mainnet", async () =>
		{
			//	switch chain/network to Eth.Sepolia
			const previousChain = getCurrentChain();
			setCurrentChain( 1 );

			//
			//	https://docs.chain.link/data-feeds/price-feeds/addresses?network=ethereum&page=1
			//
			const arr = [ `BTC/USD`, `ETH/USD`, `BNB/USD`,
				`1INCH/USD`, `AAVE/USD`, `APE/USD`, `ARB/USD`, `AVAX/USD`, `BAL/USD`,
				`COMP/USD`, `CRV/USD`, `CVX/USD` ];
			for ( const pair of arr )
			{
				//console.log( `pair :`, pair );
				const priceObj : ChainLinkPriceResult | null = await new WalletAccount().queryPairPrice( pair );
				//console.log( `priceObj :`, priceObj );
				//    should output:
				//    priceObj : {
				//       chainLink: {
				//         roundId: 18446744073709566541n,
				//         answer: 5916613855044n,
				//         startedAt: 1723874712n,
				//         updatedAt: 1723874712n,
				//         answeredInRound: 18446744073709566541n,
				//         address: '0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43',
				//         decimals: 8
				//       },
				//       price: 5916613855044n,
				//       floatPrice: 59166.13855044
				//     }
				//
				//    priceObj : {
				//       chainLink: {
				//         roundId: 18446744073709566855n,
				//         answer: 260136339126n,
				//         startedAt: 1723875000n,
				//         updatedAt: 1723875000n,
				//         answeredInRound: 18446744073709566855n,
				//         address: '0x694AA1769357215DE4FAC081bf1f309aDC325306',
				//         decimals: 8
				//       },
				//       price: 260136339126n,
				//       floatPrice: 2601.36339126
				//     }
				//
				expect( priceObj ).toBeDefined();
				expect( priceObj ).toHaveProperty( 'chainLink' );
				expect( priceObj ).toHaveProperty( 'price' );
				expect( priceObj ).toHaveProperty( 'floatPrice' );
				if ( priceObj )
				{
					expect( TypeUtil.isBigint( priceObj.price ) ).toBeTruthy();
					expect( priceObj.price ).toBeGreaterThan( BigInt( 0 ) );
					expect( priceObj.floatPrice ).toBeGreaterThan( 0.0 );

					expect( priceObj.chainLink ).toHaveProperty( 'roundId' );
					expect( priceObj.chainLink ).toHaveProperty( 'answer' );
					expect( priceObj.chainLink ).toHaveProperty( 'startedAt' );
					expect( priceObj.chainLink ).toHaveProperty( 'updatedAt' );
					expect( priceObj.chainLink ).toHaveProperty( 'answeredInRound' );
					expect( priceObj.chainLink ).toHaveProperty( 'address' );
					expect( priceObj.chainLink ).toHaveProperty( 'decimals' );

					expect( priceObj.price ).toBeGreaterThan( 0.0 );
				}

				//	...
				await TestUtil.sleep(1 * 1e3 );
			}

			//	...
			setCurrentChain( previousChain );

		}, 90 * 1000 );


		it( "should return the live price of BTC/USD ETH/USD on Ethereum Sepolia", async () =>
		{
			//	switch chain/network to Eth.Sepolia
			setCurrentChain( 11155111 );

			//
			//	https://docs.chain.link/data-feeds/price-feeds/addresses?network=ethereum&page=1
			//
			const arr = [ `BTC/USD`, `ETH/USD` ];
			for ( const pair of arr )
			{
				//console.log( `pair :`, pair );
				const priceObj : ChainLinkPriceResult | null = await new WalletAccount().queryPairPrice( pair );
				//console.log( `priceObj :`, priceObj );
				//    should output:
				//    priceObj : {
				//       chainLink: {
				//         roundId: 18446744073709566541n,
				//         answer: 5916613855044n,
				//         startedAt: 1723874712n,
				//         updatedAt: 1723874712n,
				//         answeredInRound: 18446744073709566541n,
				//         address: '0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43',
				//         decimals: 8
				//       },
				//       price: 5916613855044n,
				//       floatPrice: 59166.13855044
				//     }
				//
				//    priceObj : {
				//       chainLink: {
				//         roundId: 18446744073709566855n,
				//         answer: 260136339126n,
				//         startedAt: 1723875000n,
				//         updatedAt: 1723875000n,
				//         answeredInRound: 18446744073709566855n,
				//         address: '0x694AA1769357215DE4FAC081bf1f309aDC325306',
				//         decimals: 8
				//       },
				//       price: 260136339126n,
				//       floatPrice: 2601.36339126
				//     }
				//
				expect( priceObj ).toBeDefined();
				expect( priceObj ).toHaveProperty( 'chainLink' );
				expect( priceObj ).toHaveProperty( 'price' );
				expect( priceObj ).toHaveProperty( 'floatPrice' );
				if ( priceObj )
				{
					expect( TypeUtil.isBigint( priceObj.price ) ).toBeTruthy();
					expect( priceObj.price ).toBeGreaterThan( BigInt( 0 ) );
					expect( priceObj.floatPrice ).toBeGreaterThan( 0.0 );

					expect( priceObj.chainLink ).toHaveProperty( 'roundId' );
					expect( priceObj.chainLink ).toHaveProperty( 'answer' );
					expect( priceObj.chainLink ).toHaveProperty( 'startedAt' );
					expect( priceObj.chainLink ).toHaveProperty( 'updatedAt' );
					expect( priceObj.chainLink ).toHaveProperty( 'answeredInRound' );
					expect( priceObj.chainLink ).toHaveProperty( 'address' );
					expect( priceObj.chainLink ).toHaveProperty( 'decimals' );

					expect( priceObj.price ).toBeGreaterThan( 0.0 );
				}

				//	...
				await TestUtil.sleep(1 * 1e3 );
			}

		}, 90 * 1000 );

		it( "should return the live price of USDC/USD on Ethereum Sepolia", async () =>
		{
			//	switch chain/network to Eth.Sepolia
			setCurrentChain( 11155111 );

			//
			//	https://docs.chain.link/data-feeds/price-feeds/addresses?network=ethereum&page=1
			//
			const pair : string = `USDC/USD`;
			const priceObj : ChainLinkPriceResult | null = await new WalletAccount().queryPairPrice( pair );
			//console.log( priceObj );
			//	should output:
			//	{
			//       chainLink: {
			//         roundId: 18446744073709552307n,
			//         answer: 99996913n,
			//         startedAt: 1723860036n,
			//         updatedAt: 1723860036n,
			//         answeredInRound: 18446744073709552307n,
			//         address: '0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E',
			//         decimals: 8
			//       },
			//       price: 99996913n,
			//       floatPrice: 0.99996913
			//     }
			//
			expect( priceObj ).toBeDefined();
			expect( priceObj ).toHaveProperty( 'chainLink' );
			expect( priceObj ).toHaveProperty( 'price' );
			if ( priceObj )
			{
				expect( priceObj.chainLink ).toHaveProperty( 'roundId' );
				expect( priceObj.chainLink ).toHaveProperty( 'answer' );
				expect( priceObj.chainLink ).toHaveProperty( 'startedAt' );
				expect( priceObj.chainLink ).toHaveProperty( 'updatedAt' );
				expect( priceObj.chainLink ).toHaveProperty( 'answeredInRound' );
				expect( priceObj.chainLink ).toHaveProperty( 'address' );
				expect( priceObj.chainLink ).toHaveProperty( 'decimals' );

				expect( priceObj.price ).toBeGreaterThan( 0.0 );
			}

			await TestUtil.sleep(3 * 1e3 );

		}, 20 * 1000 );

		it( "should return the live price of USDT/USD on Ethereum Mainnet", async () =>
		{
			//	switch chain/network to Eth.Mainnet
			const previousChain = getCurrentChain();
			setCurrentChain( 1 );

			//
			//	https://docs.chain.link/data-feeds/price-feeds/addresses?network=ethereum&page=1
			//
			const pair : string = `USDT/USD`;
			const priceObj : ChainLinkPriceResult | null = await new WalletAccount().queryPairPrice( pair );
			//console.log( priceObj );
			//	should output:
			//	{
			//       chainLink: {
			//         roundId: 55340232221128654885n,
			//         answer: 100021294n,
			//         startedAt: 1723874303n,
			//         updatedAt: 1723874327n,
			//         answeredInRound: 55340232221128654885n,
			//         address: '0x3E7d1eAB13ad0104d2750B8863b489D65364e32D',
			//         decimals: 8
			//       },
			//       price: 100021294n,
			//       floatPrice: 1.00021294
			//     }
			//
			expect( priceObj ).toBeDefined();
			expect( priceObj ).toHaveProperty( 'chainLink' );
			expect( priceObj ).toHaveProperty( 'price' );
			if ( priceObj )
			{
				expect( priceObj.chainLink ).toHaveProperty( 'roundId' );
				expect( priceObj.chainLink ).toHaveProperty( 'answer' );
				expect( priceObj.chainLink ).toHaveProperty( 'startedAt' );
				expect( priceObj.chainLink ).toHaveProperty( 'updatedAt' );
				expect( priceObj.chainLink ).toHaveProperty( 'answeredInRound' );
				expect( priceObj.chainLink ).toHaveProperty( 'address' );
				expect( priceObj.chainLink ).toHaveProperty( 'decimals' );

				expect( priceObj.price ).toBeGreaterThan( 0.0 );
			}

			//	...
			setCurrentChain( previousChain );

			//	...
			await TestUtil.sleep(3 * 1e3 );

		}, 20 * 1000 );
	});


	describe( "Query Token Values", () =>
	{
		it( "should return the ETH balance and value in USD using .queryValue", async () =>
		{
			//const address = '0x47B506704DA0370840c2992A3d3d301FD3c260D3';
			const address = '0xd352928173460a1c21bb690bd8aedc5e94b80cc8';
			const pair : string	= `ETH/USD`;
			const value : TokenValueItem = await new WalletAccount().queryValue( address, pair );
			//console.log( `value :`, value );
			//
			//	should output:
			//	    value : {
			//       balance: 10000000000n,
			//       balanceDecimals: 18,
			//       floatBalance: 1e-8,
			//       stringBalance: '0.00000001',
			//       value: 2440430000000000000000n,
			//       valueDecimals: 26,
			//       floatValue: 0.0000244043,
			//       stringValue: '0.0000244043'
			//     }
			//
			expect( value ).toBeDefined();
			if ( value )
			{
				expect( typeof value.balance ).toBe( 'bigint' );
				expect( typeof value.floatBalance ).toBe( 'number' );
				expect( value.balance ).toBeGreaterThan( 0 );
				expect( value.floatBalance ).toBeGreaterThan( 0 );
				expect( _.isEmpty( value.stringBalance ) ).toBeFalsy();

				expect( typeof value.value ).toBe( 'bigint' );
				expect( typeof value.floatValue ).toBe( 'number' );
				expect( value.value ).toBeGreaterThan( 0 );
				expect( value.floatValue ).toBeGreaterThan( 0 );
				expect( _.isEmpty( value.stringValue ) ).toBeFalsy();

				const calcFloatBalance = MathUtil.floatValueFromBigint( value.balance, value.balanceDecimals );
				const calcFloatValue = MathUtil.floatValueFromBigint( value.value, value.valueDecimals );
				expect( calcFloatBalance ).toBe( value.floatBalance );
				expect( calcFloatValue ).toBe( value.floatValue );
			}

			await TestUtil.sleep(3 * 1000 );

		}, 20 * 1000 );

		it( "should return the ETH balance and value in USD using .queryTokenValues", async () =>
		{
			const address = '0x47B506704DA0370840c2992A3d3d301FD3c260D3';
			const tokens : Array<ContractTokenBalanceItem> = [
				{
					pair : "ETH/USD",
					contractAddress : new TokenService().nativeTokenAddress,
					decimals : 18,
					tokenBalance : BigInt( 0 )
				}
			];
			const values : Array<ContractTokenValueItem> = await new WalletAccount().queryTokenValues( address, tokens );
			//console.log( `values`, values );
			//	should output:
			//	    values [
			//       {
			//         pair: 'ETH/USD',
			//         contractAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
			//         balance: 2752601976690597070n,
			//         balanceDecimals: 18,
			//         floatBalance: 2.7526019766905967,
			//         stringBalance: '2.75260197669059707',
			//         value: 671753244197503380754010000000n,
			//         valueDecimals: 26,
			//         floatValue: 6717.532441975035,
			//         stringValue: '6717.5324419750338075401'
			//       }
			//     ]
			//
			expect( values ).toBeDefined();
			expect( Array.isArray( values ) ).toBeTruthy();
			if ( values )
			{
				for ( const value of values )
				{
					expect( value ).toBeDefined();
					if ( values )
					{
						expect( typeof value.pair ).toBe( 'string' );
						expect( typeof value.contractAddress ).toBe( 'string' );

						expect( typeof value.balance ).toBe( 'bigint' );
						expect( typeof value.balanceDecimals ).toBe( 'number' );
						expect( typeof value.floatBalance ).toBe( 'number' );
						expect( value.balance ).toBeGreaterThanOrEqual( 0 );
						expect( value.balanceDecimals ).toBeGreaterThanOrEqual( 0 );
						expect( value.floatBalance ).toBeGreaterThanOrEqual( 0 );
						expect( _.isEmpty( value.stringBalance ) ).toBeFalsy();

						expect( typeof value.value ).toBe( 'bigint' );
						expect( typeof value.valueDecimals ).toBe( 'number' );
						expect( typeof value.floatValue ).toBe( 'number' );
						expect( value.value ).toBeGreaterThanOrEqual( 0 );
						expect( value.valueDecimals ).toBeGreaterThanOrEqual( 0 );
						expect( value.floatValue ).toBeGreaterThanOrEqual( 0 );
						expect( _.isEmpty( value.stringValue ) ).toBeFalsy();

						const calcFloatBalance = MathUtil.floatValueFromBigint( value.balance, value.balanceDecimals );
						const calcFloatValue = MathUtil.floatValueFromBigint( value.value, value.valueDecimals );
						expect( calcFloatBalance ).toBe( value.floatBalance );
						expect( calcFloatValue ).toBe( value.floatValue );
					}
				}
			}

			await TestUtil.sleep(3 * 1000 );

		}, 20 * 1000 );


		it( "should return the USDT value in USD using .queryTokenValues on Ethereum MainNet", async () =>
		{
			//
			//	test on Ethereum MainNet
			//
			setCurrentChain( 1 );
			//console.log( `getCurrentChain() : `, getCurrentChain() )

			//	vitalik.eth
			//	https://etherscan.io/address/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045#tokentxns
			const address : string		= '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';

			//	https://etherscan.io/token/0xdac17f958d2ee523a2206206994597c13d831ec7?a=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
			const tokens : Array<ContractTokenBalanceItem> = [
				{
					pair : "USDT/USD",
					contractAddress : '0xdAC17F958D2ee523a2206206994597C13D831ec7',
					decimals : 6,
					tokenBalance : BigInt( 0 )
				}
			];
			const values : Array<ContractTokenValueItem> = await new WalletAccount().queryTokenValues( address, tokens );
			//console.log( values );
			//
			//	should output:
			//	[
			//       {
			//         pair: 'USDT/USD',
			//         contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
			//         balance: 919083658n,
			//         balanceDecimals: 6,
			//         floatBalance: 919.083658,
			//         value: 91927936767413452n,
			//         valueDecimals: 14,
			//         floatValue: 919.2793676741345
			//       }
			//     ]
			//
			//     8012963227000000n / ( 10 ** 8 ) / ( 10 ** 6 ) = 80.12963227000000
			//
			expect( values ).toBeDefined();
			expect( Array.isArray( values ) ).toBeTruthy();
			if ( values )
			{
				for ( const value of values )
				{
					expect( value ).toBeDefined();
					if ( values )
					{
						expect( typeof value.pair ).toBe( 'string' );
						expect( typeof value.contractAddress ).toBe( 'string' );

						expect( typeof value.balance ).toBe( 'bigint' );
						expect( typeof value.floatBalance ).toBe( 'number' );
						expect( value.balance ).toBeGreaterThanOrEqual( 0 );
						expect( value.floatBalance ).toBeGreaterThanOrEqual( 0 );

						expect( typeof value.value ).toBe( 'bigint' );
						expect( typeof value.floatValue ).toBe( 'number' );
						expect( value.value ).toBeGreaterThanOrEqual( 0 );
						expect( value.floatValue ).toBeGreaterThanOrEqual( 0 );

						const calcFloatBalance = MathUtil.floatValueFromBigint( value.balance, value.balanceDecimals );
						const calcFloatValue = MathUtil.floatValueFromBigint( value.value, value.valueDecimals );
						expect( calcFloatBalance ).toBe( value.floatBalance );
						expect( calcFloatValue ).toBe( value.floatValue );
					}
				}
			}

			//
			//	revert to default chain
			//
			revertToDefaultChain();

			//	...
			await TestUtil.sleep(3 * 1000 );

		}, 20 * 1000 );


		it( "should return total values in USD", async () =>
		{
			//
			//	test on Ethereum MainNet
			//
			setCurrentChain( 1 );
			//console.log( `getCurrentChain() : `, getCurrentChain() )

			//	vitalik.eth
			//	https://etherscan.io/address/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045#tokentxns
			const walletAddress : string		= '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';

			//	...
			const tokenStorageService = new TokenStorageService();

			//	clear all items in database and flush the default chains into database
			await tokenStorageService.clearByWallet( walletAddress );
			await tokenStorageService.flushDefault( walletAddress );
			const count1 : number = await tokenStorageService.countByWallet( walletAddress );
			expect( count1 ).toBeGreaterThan( 0 );

			const totalValues : TotalValues | null = await new WalletAccount().queryTotalValues( walletAddress );
			//console.log( totalValues );
			//	should output:
			//	    {
			//       total: {
			//         balance: 0n,
			//         balanceDecimals: 0,
			//         floatBalance: 0,
			//         value: 7700586143264672009257523999227n,
			//         valueDecimals: 0,
			//         floatValue: 77925.830845488
			//       },
			//       values: [
			//         {
			//           pair: 'USDC/USD',
			//           contractAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			//           balance: 690075n,
			//           balanceDecimals: 6,
			//           floatBalance: 0.690075,
			//           value: 69004516805775n,
			//           valueDecimals: 14,
			//           floatValue: 0.69004516805775
			//         },
			//         {
			//           pair: 'USDT/USD',
			//           contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
			//           balance: 919083658n,
			//           balanceDecimals: 6,
			//           floatBalance: 919.083658,
			//           value: 91927936767413452n,
			//           valueDecimals: 14,
			//           floatValue: 919.2793676741345
			//         },
			//         {
			//           pair: 'ETH/USD',
			//           contractAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
			//           balance: 29598602557480454349n,
			//           balanceDecimals: 18,
			//           floatBalance: 29.598602557480458,
			//           value: 7700586143264580012316239780000n,
			//           valueDecimals: 26,
			//           floatValue: 77005.8614326458
			//         }
			//       ]
			//     }
			//
			expect( totalValues ).toBeDefined();
			expect( totalValues ).toHaveProperty( 'total' );
			if ( totalValues )
			{
				expect( totalValues.total ).toHaveProperty( 'balance' );
				expect( totalValues.total ).toHaveProperty( 'floatBalance' );
				expect( totalValues.total.balance ).toBe( BigInt( 0 ) );
				expect( totalValues.total.floatBalance ).toBe( 0.00 );

				expect( totalValues.total ).toHaveProperty( 'value' );
				expect( totalValues.total ).toHaveProperty( 'floatValue' );
				expect( totalValues.total.value ).toBeGreaterThanOrEqual( 0 );
				expect( totalValues.total.floatValue ).toBeGreaterThanOrEqual( 0 );

				expect( totalValues ).toHaveProperty( 'values' );
				expect( Array.isArray( totalValues.values ) ).toBeTruthy();

				let calcTotalValue : bigint = BigInt( 0 );
				let calcTotalFloatValue : number = 0.0;
				for ( const value of totalValues.values )
				{
					expect( value ).toBeDefined();
					expect( value ).toHaveProperty( 'pair' );
					expect( value ).toHaveProperty( 'contractAddress' );
					expect( value ).toHaveProperty( 'value' );
					expect( value ).toHaveProperty( 'floatValue' );
					expect( typeof value.pair ).toBe( 'string' );
					expect( typeof value.contractAddress ).toBe( 'string' );

					expect( typeof value.balance ).toBe( 'bigint' );
					expect( typeof value.floatBalance ).toBe( 'number' );
					expect( value.balance ).toBeGreaterThanOrEqual( 0 );
					expect( value.floatBalance ).toBeGreaterThanOrEqual( 0 );

					expect( typeof value.value ).toBe( 'bigint' );
					expect( typeof value.floatValue ).toBe( 'number' );
					expect( value.value ).toBeGreaterThanOrEqual( 0 );
					expect( value.floatValue ).toBeGreaterThanOrEqual( 0 );

					//	...
					const calcFloatBalance = MathUtil.floatValueFromBigint( value.balance, value.balanceDecimals );
					const calcFloatValue = MathUtil.floatValueFromBigint( value.value, value.valueDecimals );
					expect( calcFloatBalance ).toBe( value.floatBalance );
					expect( calcFloatValue ).toBe( value.floatValue );

					//	...
					calcTotalValue += value.value;
					calcTotalFloatValue += value.floatValue;
				}

				//	check total values
				expect( totalValues.total.value ).toBeGreaterThanOrEqual( calcTotalValue );
				expect( totalValues.total.floatValue ).toBeGreaterThanOrEqual( calcTotalFloatValue );
			}

			//
			//	revert to default chain
			//
			revertToDefaultChain();

			//	...
			await TestUtil.sleep(3 * 1000 );

		}, 20 * 1000 );
	});
} );
