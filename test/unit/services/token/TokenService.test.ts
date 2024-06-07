import { describe, expect } from '@jest/globals';
import {OneInchTokenService, setCurrentChain, TokenService} from "../../../../src";
import { getCurrentChain } from "../../../../src";
import _ from "lodash";


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

	describe( "Token Item on Ethereum mainnet", () =>
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
			expect( decimals ).toBeDefined();
			expect( _.isNumber( decimals ) ).toBeTruthy();
		} );

		it( "should return the logo url of a token", async () =>
		{
			setCurrentChain( currentChainId );
			const contractAddress : string = new TokenService().nativeTokenAddress;
			const logoUrl = await new TokenService().getItemLogo( contractAddress );
			expect( logoUrl ).toBeDefined();
			expect( _.isString( logoUrl ) || null === logoUrl ).toBeTruthy();
		} );
	} );

	describe( "Token Item on BNB Smart Chain Mainnet", () =>
	{
		const currentChainId = 56;
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
			expect( decimals ).toBeDefined();
			expect( _.isNumber( decimals ) ).toBeTruthy();
		} );

		it( "should return the logo url of a token", async () =>
		{
			setCurrentChain( currentChainId );
			const contractAddress : string = new TokenService().nativeTokenAddress;
			const logoUrl = await new TokenService().getItemLogo( contractAddress );
			expect( logoUrl ).toBeDefined();
			expect( _.isString( logoUrl ) || null === logoUrl ).toBeTruthy();
		} );
	} );

	describe( "Token Item on Base", () =>
	{
		const currentChainId = 8453;
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
			expect( decimals ).toBeDefined();
			expect( _.isNumber( decimals ) ).toBeTruthy();
		} );

		it( "should return the logo url of a token", async () =>
		{
			setCurrentChain( currentChainId );
			const contractAddress : string = new TokenService().nativeTokenAddress;
			const logoUrl = await new TokenService().getItemLogo( contractAddress );
			expect( logoUrl ).toBeDefined();
			expect( _.isString( logoUrl ) || null === logoUrl ).toBeTruthy();
		} );
	} );
} );
