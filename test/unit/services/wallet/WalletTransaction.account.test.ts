import { describe, expect } from '@jest/globals';
import { TokenStorageService, WalletFactory } from "../../../../src";
import { ethers } from "ethers";
import { WalletAccount } from "../../../../src";
import { TypeUtil, TestUtil } from "debeem-utils";
import { setCurrentChain } from "../../../../src";
import { revertToDefaultChain } from "../../../../src";
import {
	ContractTokenBalanceItem,
	ContractTokenValueItem,
	TokenValueItem,
	TotalValues
} from "../../../../src/models/TokenModels";
import { ChainLinkPriceResult } from "../../../../src/services/rpcs/chainLink/ChainLinkService";


/**
 *	WalletTransaction unit test
 */
describe( "WalletTransaction.balance", () =>
{
	beforeAll( async () =>
	{
	} );
	afterAll( async () =>
	{
	} );

	describe( "Query Account Balance", () =>
	{
		it( "should return the Ether balance in the mainnet address", async () =>
		{
			const address = '0x47B506704DA0370840c2992A3d3d301FD3c260D3';

			const balance = await new WalletAccount().ethQueryBalance( address );
			expect( balance ).toBeGreaterThan( 0 );
			expect( TypeUtil.isNotEmptyString( ethers.formatEther( balance ) ) ).toBeTruthy();

			await TestUtil.sleep(3 * 1000 );

		}, 20 * 1000 );

		it( "should return the Ether balance in the specified address", async () =>
		{
			const address = '0x47B506704DA0370840c2992A3d3d301FD3c260D3';

			const balance = await new WalletAccount().ethQueryBalance( address );
			expect( balance ).toBeGreaterThan( 0 );
			expect( TypeUtil.isNotEmptyString( ethers.formatEther( balance ) ) ).toBeTruthy();

			await TestUtil.sleep(3 * 1000 );

		}, 20 * 1000 );

		it( "should return the Ether balance in my wallet zero", async () =>
		{
			const address = '0x30560B6A2214858Caf6C17c75732A8309049BfAC';

			const balance = await new WalletAccount().ethQueryBalance( address );
			expect( ethers.formatEther( balance ) ).toBe( "0.0" );

			await TestUtil.sleep(3 * 1000 );

		}, 20 * 1000 );

		it( "Should return the balance of a derived contract token in the specified address", async () =>
		{
			//
			//	on Ethereum Goerli Testnet
			//	This account permanently stores 100 USDT
			//
			const address = '0xd56f36DbA1D212e51952C4f69785f114D3Dd2A6A';
			const tokens : Array<ContractTokenBalanceItem> = [
				{
					pair : "USDT/USD",
					contractAddress : '0x9DC9a9a2a753c13b63526d628B1Bf43CabB468Fe',
					tokenBalance : BigInt( 0 )
				}
			];
			const balances = await new WalletAccount().queryTokenBalances( address, tokens );
			//	should output:
			//	balances :  [
			//       {
			//         pair: 'USDT/USD',
			//         decimals: undefined,
			//         contractAddress: '0x9DC9a9a2a753c13b63526d628B1Bf43CabB468Fe',
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
					expect( balance ).toBeDefined();
					expect( typeof balance.pair ).toBe( `string` );
					expect( typeof balance.decimals ).toBe( `undefined` );
					expect( typeof balance.contractAddress ).toBe( `string` );
					expect( typeof balance.tokenBalance ).toBe( `bigint` );
					expect( balance.tokenBalance ).toBe( BigInt( 100000000 ) );	//	100000000 / 1e6 = 100
				}
			}

			await TestUtil.sleep(3 * 1000 );

		}, 20 * 1000 );

		it( "should throw an error if the address is invalid", async () =>
		{
			try
			{
				await new WalletAccount().ethQueryBalance( "" );
			}
			catch ( error )
			{
				// Assert that the error is thrown
				expect( error ).toBeDefined();
				expect( error ).toEqual( "wallet address not specified" );
			}

			try
			{
				await new WalletAccount().queryTokenBalances( "", [] );
			}
			catch ( error )
			{
				// Assert that the error is thrown
				expect( error ).toBeDefined();
				expect( error ).toEqual( "invalid address" );
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
				expect( error ).toEqual( "invalid contractAddresses" );
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
			const balance : bigint = await new WalletAccount().ethQueryBalance( walletObj.address );
			const balanceStr : string = ethers.formatEther( balance );

			//	will output: 0n
			//console.log( balance );

			//	will output: "0.0"
			//console.log( balanceStr );

			//	...
			expect( balance ).toBe( BigInt( 0 ) );
			expect( balanceStr ).toBeDefined();
			expect( balanceStr ).toBe( "0.0" );

			await TestUtil.sleep(3 * 1000 );

		}, 20 * 1000 );

	} );

	describe( "Query Token Prices", () =>
	{
		it( "should return the live price of BTC/USD, ETH/USD", async () =>
		{
			const arr = [ `BTC/USD`, `ETH/USD` ];
			for ( const pair of arr )
			{
				const priceObj : ChainLinkPriceResult | null = await new WalletAccount().queryPairPrice( pair );
				//
				//console.log( `priceObj :`, priceObj );
				//    should output:
				//    priceObj : {
				//       chainLink: {
				//         roundId: 110680464442257317867n,
				//         answer: 207587000000n,
				//         startedAt: 1700788631n,
				//         updatedAt: 1700788631n,
				//         answeredInRound: 110680464442257317867n,
				//         address: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
				//         decimals: 8
				//       },
				//       price: 207587000000n,
				//       floatPrice: 2075.87
				//    }
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
				await TestUtil.sleep(2 * 1e3 );
			}

		}, 20 * 1000 );

		it( "should return the live price of USDT on Ethereum in USD", async () =>
		{
			const pair : string		= `USDT/USD`;
			const priceObj : ChainLinkPriceResult | null = await new WalletAccount().queryPairPrice( pair );
			//
			//	should output:
			// 	{
			// 		chainLink: {
			// 			roundId: 36893488147419104247n,
			// 			answer: 99874900n,
			// 			startedAt: 1692203003n,
			// 			updatedAt: 1692203003n,
			// 			answeredInRound: 36893488147419104247n,
			// 			address: '0x3E7d1eAB13ad0104d2750B8863b489D65364e32D',
			// 			decimals: 8
			// 		},
			// 		price: 0.99
			// 	}
			//console.log( priceObj );
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
	});


	describe( "Query Token Values", () =>
	{
		it( "should return the value in USD of the ETH in the specified wallet", async () =>
		{
			const address = '0x47B506704DA0370840c2992A3d3d301FD3c260D3';
			const pair : string	= `ETH/USD`;
			const value : TokenValueItem = await new WalletAccount().queryValue( address, pair );
			//
			//	should output:
			//    {
			//       balance: 1199778463286275302n,
			//       floatBalance: 1.19,
			//       value: 198131415427095503372280000000n,
			//       floatValue: 1981.31
			//     }
			//
			//	202760040760607624859865800000n
			//	$2027.6 = 202760040760607624859865800000n / ( 10 ** 18 ) / ( 10 ** 8 )
			//
			//console.log( value );
			expect( value ).toBeDefined();
			if ( value )
			{
				expect( typeof value.balance ).toBe( 'bigint' );
				expect( typeof value.floatBalance ).toBe( 'number' );
				expect( value.balance ).toBeGreaterThan( 0 );
				expect( value.floatBalance ).toBeGreaterThan( 0 );

				expect( typeof value.value ).toBe( 'bigint' );
				expect( typeof value.floatValue ).toBe( 'number' );
				expect( value.value ).toBeGreaterThan( 0 );
				expect( value.floatValue ).toBeGreaterThan( 0 );
			}

			await TestUtil.sleep(3 * 1000 );

		}, 20 * 1000 );

		it( "should return the value in USD of the USDT in the specified wallet", async () =>
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
					tokenBalance : BigInt( 0 )
				}
			];
			const values : Array<ContractTokenValueItem> = await new WalletAccount().queryTokenValues( address, tokens );
			//
			//	should output:
			//    [
			//       {
			//         pair: 'USDT/USD',
			//         contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
			//         balance: 80230000n,
			//         floatBalance: 80.23,
			//         value: 8018426890000000n,
			//         floatValue: 80.18
			//       }
			//     ]
			//
			//     8012963227000000n / ( 10 ** 8 ) / ( 10 ** 6 ) = 80.12963227000000
			//
			//console.log( values );
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


		it( "should return total values in USD in the specified wallet", async () =>
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

			const totalValues : TotalValues | null = await new WalletAccount().queryTotalValues( walletAddress, '' );
			//console.log( totalValues );
			//	should output:
			//	{
			//       total: {
			//         balance: 3933800246759461826841n,
			//         floatBalance: 4014.03,
			//         value: 646382387546267795103355805000000n,
			//         floatValue: 6463904.05
			//       },
			//       values: [
			//         {
			//           pair: 'USDC/USD',
			//           contractAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			//           balance: 0n,
			//           floatBalance: 0,
			//           value: 0n,
			//           floatValue: 0
			//         },
			//         {
			//           pair: 'USDT/USD',
			//           contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
			//           balance: 80230000n,
			//           floatBalance: 80.23,
			//           value: 8018426890000000n,
			//           floatValue: 80.18
			//         },
			//         {
			//           pair: 'ETH/USD',
			//           contractAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
			//           balance: 3933800246759381596841n,
			//           floatBalance: 3933.8,
			//           value: 646382387546267787084928915000000n,
			//           floatValue: 6463823.87
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
				}
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
