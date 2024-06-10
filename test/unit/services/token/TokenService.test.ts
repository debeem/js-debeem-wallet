import { describe, expect } from '@jest/globals';
import {OneInchTokenService, setCurrentChain, TokenService} from "../../../../src";
import _ from "lodash";
import {RpcSupportedChainMap} from "../../../../src/models/RpcModels";


/**
 *	WalletBasicStorage unit test
 */
describe( "TokenService", () =>
{
	beforeAll( async () =>
	{
	} );
	afterAll( async () =>
	{
	} );

	describe( "Token Services config", () =>
	{
		it( "should return supported chain map", async () =>
		{
			const supportedChains : Array<number> = new TokenService( 1 ).supportedChains;
			//console.log( supportedChains );
			//	should output:
			//	[
			//           1,         10,
			//          56,        100,
			//         137,        250,
			//         324,       8217,
			//        8453,      42161,
			//       43114, 1313161554
			//     ]
			expect( supportedChains ).toBeDefined();
			expect( Array.isArray( supportedChains ) ).toBeTruthy();
			expect( supportedChains.length > 0 ).toBeTruthy();

			const supportedChainMap : RpcSupportedChainMap = new TokenService( 1 ).supportedChainMap;
			expect( supportedChainMap ).toBeDefined();
			expect( _.isObject( supportedChainMap ) ).toBeTruthy();
			expect( _.keys( supportedChainMap ).length > 0 ).toBeTruthy();
			//console.log( `supportedChainMap :`, supportedChainMap );
		} );
	});

	describe( "Token Item on Ethereum mainnet by creating the instance without chainId", () =>
	{
		const currentChainId = 1;
		it( "should return true in checking the native address", async () =>
		{
			setCurrentChain( currentChainId );
			const contractAddress : string = new TokenService().nativeTokenAddress;
			const isETH = new TokenService().isNativeToken( contractAddress );
			expect( isETH ).toBeDefined();
			expect( isETH ).toBeTruthy();
		} );

		it( "should return true in the existing check", async () =>
		{
			setCurrentChain( currentChainId );
			const contractAddress : string = new TokenService().nativeTokenAddress;
			const exist = await new TokenService().exists( contractAddress );
			expect( exist ).toBeDefined();
			expect( exist ).toBeTruthy();
		} );
		it( "should return a token item", async () =>
		{
			setCurrentChain( currentChainId );
			const contractAddress : string = new TokenService().nativeTokenAddress;
			const item = await new TokenService().getItem( contractAddress );
			expect( item ).toBeDefined();
			expect( OneInchTokenService.isValid1InchTokenItem( item ) ).toBeTruthy();
		} );

		it( "should return the decimal value of a token", async () =>
		{
			setCurrentChain( currentChainId );
			const contractAddress : string = new TokenService().nativeTokenAddress;
			const decimals = await new TokenService().getItemDecimals( contractAddress );
			//console.log( `decimals:`, decimals );
			//	should output:
			//	 decimals: 18
			expect( decimals ).toBeDefined();
			expect( _.isNumber( decimals ) ).toBeTruthy();
			expect( decimals ).toBe( 18 );
		} );

		it( "should return the decimal value of the Tether USD", async () =>
		{
			setCurrentChain( currentChainId );

			//	contract address of Tether USD
			const contractAddress : string = `0xdac17f958d2ee523a2206206994597c13d831ec7`;
			const decimals = await new TokenService().getItemDecimals( contractAddress );
			//console.log( `decimals:`, decimals );
			//	should output:
			//	 decimals: 6
			expect( decimals ).toBeDefined();
			expect( _.isNumber( decimals ) ).toBeTruthy();
			expect( decimals ).toBe( 6 );
		} );

		it( "should return the logo url of a token", async () =>
		{
			setCurrentChain( currentChainId );

			const contractAddress : string = new TokenService().nativeTokenAddress;
			const logoUrl = await new TokenService().getItemLogo( contractAddress );
			//console.log( `logoUrl :`, logoUrl );
			//    should output:
			//     logoUrl : https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png
			expect( logoUrl ).toBeDefined();
			expect( _.isString( logoUrl ) || null === logoUrl ).toBeTruthy();
		} );
	} );

	describe( "Token Item on Ethereum mainnet", () =>
	{
		const currentChainId = 1;
		it( "should return true in checking the native address", async () =>
		{
			const contractAddress : string = new TokenService( currentChainId ).nativeTokenAddress;
			const isETH = new TokenService( currentChainId ).isNativeToken( contractAddress );
			expect( isETH ).toBeDefined();
			expect( isETH ).toBeTruthy();
		} );

		it( "should return true in the existing check", async () =>
		{
			const contractAddress : string = new TokenService( currentChainId ).nativeTokenAddress;
			const exist = await new TokenService( currentChainId ).exists( contractAddress );
			expect( exist ).toBeDefined();
			expect( exist ).toBeTruthy();
		} );
		it( "should return a token item", async () =>
		{
			const contractAddress : string = new TokenService( currentChainId ).nativeTokenAddress;
			const item = await new TokenService( currentChainId ).getItem( contractAddress );
			expect( item ).toBeDefined();
			expect( OneInchTokenService.isValid1InchTokenItem( item ) ).toBeTruthy();
		} );

		it( "should return the decimal value of a token", async () =>
		{
			const contractAddress : string = new TokenService( currentChainId ).nativeTokenAddress;
			const decimals = await new TokenService( currentChainId ).getItemDecimals( contractAddress );
			//console.log( `decimals:`, decimals );
			//	should output:
			//	 decimals: 18
			expect( decimals ).toBeDefined();
			expect( _.isNumber( decimals ) ).toBeTruthy();
			expect( decimals ).toBe( 18 );
		} );

		it( "should return the decimal value of the Tether USD", async () =>
		{
			//	contract address of Tether USD
			const contractAddress : string = `0xdac17f958d2ee523a2206206994597c13d831ec7`;
			const decimals = await new TokenService( currentChainId ).getItemDecimals( contractAddress );
			//console.log( `decimals:`, decimals );
			//	should output:
			//	 decimals: 6
			expect( decimals ).toBeDefined();
			expect( _.isNumber( decimals ) ).toBeTruthy();
			expect( decimals ).toBe( 6 );
		} );

		it( "should return the logo url of a token", async () =>
		{
			const contractAddress : string = new TokenService( currentChainId ).nativeTokenAddress;
			const logoUrl = await new TokenService( currentChainId ).getItemLogo( contractAddress );
			//console.log( `logoUrl :`, logoUrl );
			//    should output:
			//     logoUrl : https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png
			expect( logoUrl ).toBeDefined();
			expect( _.isString( logoUrl ) || null === logoUrl ).toBeTruthy();
		} );
	} );

	describe( "Token Item on BNB Smart Chain Mainnet", () =>
	{
		const currentChainId = 56;
		it( "should return true in checking the native address", async () =>
		{
			const contractAddress : string = new TokenService( currentChainId ).nativeTokenAddress;
			const isETH = new TokenService( currentChainId ).isNativeToken( contractAddress );
			expect( isETH ).toBeDefined();
			expect( isETH ).toBeTruthy();
		} );

		it( "should return true in the existing check", async () =>
		{
			const contractAddress : string = new TokenService( currentChainId ).nativeTokenAddress;
			const exist = await new TokenService( currentChainId ).exists( contractAddress );
			expect( exist ).toBeDefined();
			expect( exist ).toBeTruthy();
		} );
		it( "should return a token item", async () =>
		{
			const contractAddress : string = new TokenService( currentChainId ).nativeTokenAddress;
			const item = await new TokenService( currentChainId ).getItem( contractAddress );
			//console.log( `item: `, item );
			//    should output:
			//    item:  {
			//       chainId: 56,
			//       symbol: 'BNB',
			//       name: 'BNB',
			//       address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
			//       decimals: 18,
			//       logoURI: 'https://tokens.1inch.io/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c.png',
			//       providers: [ '1inch', 'Curve Token List' ],
			//       eip2612: false,
			//       tags: [ 'native' ]
			//     }
			expect( item ).toBeDefined();
			expect( OneInchTokenService.isValid1InchTokenItem( item ) ).toBeTruthy();
		} );

		it( "should return the decimal value of a token", async () =>
		{
			const contractAddress : string = new TokenService( currentChainId ).nativeTokenAddress;
			const decimals = await new TokenService( currentChainId ).getItemDecimals( contractAddress );
			expect( decimals ).toBeDefined();
			expect( _.isNumber( decimals ) ).toBeTruthy();
		} );

		it( "should return the logo url of a token", async () =>
		{
			const contractAddress : string = new TokenService( currentChainId ).nativeTokenAddress;
			const logoUrl = await new TokenService( currentChainId ).getItemLogo( contractAddress );
			expect( logoUrl ).toBeDefined();
			expect( _.isString( logoUrl ) || null === logoUrl ).toBeTruthy();
		} );
	} );

	describe( "Token Item on Base", () =>
	{
		const currentChainId = 8453;
		it( "should return true in checking the native address", async () =>
		{
			const contractAddress : string = new TokenService( currentChainId ).nativeTokenAddress;
			const isETH = new TokenService( currentChainId ).isNativeToken( contractAddress );
			expect( isETH ).toBeDefined();
			expect( isETH ).toBeTruthy();
		} );

		it( "should return true in the existing check", async () =>
		{
			const contractAddress : string = new TokenService( currentChainId ).nativeTokenAddress;
			const exist = await new TokenService( currentChainId ).exists( contractAddress );
			expect( exist ).toBeDefined();
			expect( exist ).toBeTruthy();
		} );
		it( "should return a token item", async () =>
		{
			const contractAddress : string = new TokenService( currentChainId ).nativeTokenAddress;
			const item = await new TokenService( currentChainId ).getItem( contractAddress );
			expect( item ).toBeDefined();
			expect( OneInchTokenService.isValid1InchTokenItem( item ) ).toBeTruthy();
		} );

		it( "should return the decimal value of a token", async () =>
		{
			const contractAddress : string = new TokenService( currentChainId ).nativeTokenAddress;
			const decimals = await new TokenService( currentChainId ).getItemDecimals( contractAddress );
			expect( decimals ).toBeDefined();
			expect( _.isNumber( decimals ) ).toBeTruthy();
		} );

		it( "should return the logo url of a token", async () =>
		{
			const contractAddress : string = new TokenService( currentChainId ).nativeTokenAddress;
			const logoUrl = await new TokenService( currentChainId ).getItemLogo( contractAddress );
			expect( logoUrl ).toBeDefined();
			expect( _.isString( logoUrl ) || null === logoUrl ).toBeTruthy();
		} );
	} );
} );
