import { describe, expect } from '@jest/globals';
import {OneInchTokenService, setCurrentChain, TokenService} from "../../../../src";
import _ from "lodash";
import {RpcSupportedChainMap} from "../../../../src/models/RpcModels";
import { OneInchTokenLogoItem } from "../../../../src/models/TokenModels";


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

		it( "should return the logo url of ETH", async () =>
		{
			setCurrentChain( currentChainId );

			const contractAddress : string = new TokenService().nativeTokenAddress;
			const logoItem : OneInchTokenLogoItem | null = await new TokenService().getItemLogo( contractAddress );
			//console.log( `logoItem :`, logoItem );
			//	should output:
			//	logoItem : {
			//       oneInch: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
			//       metaBeem: 'https://tokens.metabeem.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
			//       base64: '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'
			//     }
			expect( logoItem ).toBeDefined();
			expect( OneInchTokenService.isValid1InchTokenLogoItem( logoItem ) ).toBeTruthy();
			expect( logoItem && _.isString( logoItem.oneInch ) ).toBeTruthy();
			expect( logoItem && logoItem.oneInch.startsWith( 'https://' ) ).toBeTruthy();
			expect( logoItem && _.isString( logoItem.metaBeem ) ).toBeTruthy();
			expect( logoItem && logoItem.metaBeem.startsWith( 'https://' ) ).toBeTruthy();
		} );

		it( "should return the logo url of Tether USD on chain 1", async () =>
		{
			setCurrentChain( 1 );

			const contractAddress : string = `0xdac17f958d2ee523a2206206994597c13d831ec7`;
			const logoItem : OneInchTokenLogoItem | null = await new TokenService().getItemLogo( contractAddress );
			//console.log( `logoItem :`, logoItem );
			//	should output:
			//	logoItem : {
			//       oneInch: 'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png',
			//       metaBeem: 'https://tokens.metabeem.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png',
			//       base64: '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'
			//     }
			expect( logoItem ).toBeDefined();
			expect( OneInchTokenService.isValid1InchTokenLogoItem( logoItem ) ).toBeTruthy();
			expect( logoItem && _.isString( logoItem.oneInch ) ).toBeTruthy();
			expect( logoItem && logoItem.oneInch.startsWith( 'https://' ) ).toBeTruthy();
			expect( logoItem && _.isString( logoItem.metaBeem ) ).toBeTruthy();
			expect( logoItem && logoItem.metaBeem.startsWith( 'https://' ) ).toBeTruthy();

			setCurrentChain( currentChainId );
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
			const logoItem : OneInchTokenLogoItem | null = await new TokenService().getItemLogo( contractAddress );
			//console.log( `logoItem :`, logoItem );
			//	should output:
			//	logoItem : {
			//       oneInch: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
			//       metaBeem: 'https://tokens.metabeem.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
			//       base64: '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'
			//     }
			expect( logoItem ).toBeDefined();
			expect( OneInchTokenService.isValid1InchTokenLogoItem( logoItem ) ).toBeTruthy();
			expect( logoItem && _.isString( logoItem.oneInch ) ).toBeTruthy();
			expect( logoItem && logoItem.oneInch.startsWith( 'https://' ) ).toBeTruthy();
			expect( logoItem && _.isString( logoItem.metaBeem ) ).toBeTruthy();
			expect( logoItem && logoItem.metaBeem.startsWith( 'https://' ) ).toBeTruthy();
		} );
	} );

	describe( "Token Item on Ethereum Sepolia", () =>
	{
		const currentChainId = 11155111;
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
			const contractAddress : string = `0x271b34781c76fb06bfc54ed9cfe7c817d89f7759`;
			const decimals = await new TokenService( currentChainId ).getItemDecimals( contractAddress );
			//console.log( `decimals:`, decimals );
			//	should output:
			//	 decimals: 6
			expect( decimals ).toBeDefined();
			expect( _.isNumber( decimals ) ).toBeTruthy();
			expect( decimals ).toBe( 6 );
		} );

		it( "should return the ETH logo item", async () =>
		{
			setCurrentChain( currentChainId );
			const contractAddress : string = new TokenService().nativeTokenAddress;
			const logoItem : OneInchTokenLogoItem | null = await new TokenService( currentChainId ).getItemLogo( contractAddress );
			//console.log( `logoItem :`, logoItem );
			//	should output:
			//	logoItem : {
			//       oneInch: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
			//       metaBeem: 'https://tokens.metabeem.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
			//       base64: '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'
			//     }
			expect( logoItem ).toBeDefined();
			expect( OneInchTokenService.isValid1InchTokenLogoItem( logoItem ) ).toBeTruthy();
			expect( logoItem && _.isString( logoItem.oneInch ) ).toBeTruthy();
			expect( logoItem && logoItem.oneInch.startsWith( 'https://' ) ).toBeTruthy();
			expect( logoItem && _.isString( logoItem.metaBeem ) ).toBeTruthy();
			expect( logoItem && logoItem.metaBeem.startsWith( 'https://' ) ).toBeTruthy();
		} );

		it( "should return the USDT logo item", async () =>
		{
			setCurrentChain( currentChainId );
			const contractAddress : string = `0x271B34781c76fB06bfc54eD9cfE7c817d89f7759`;
			const logoItem : OneInchTokenLogoItem | null = await new TokenService( currentChainId ).getItemLogo( contractAddress );
			//console.log( `logoItem :`, logoItem );
			//	should output:
			//	logoItem : {
			//       oneInch: 'https://tokens.1inch.io/0x271b34781c76fb06bfc54ed9cfe7c817d89f7759.png',
			//       metaBeem: 'https://tokens.metabeem.io/0x271b34781c76fb06bfc54ed9cfe7c817d89f7759.png',
			//       base64: 'data:image/png;base64,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'
			//     }
			expect( logoItem ).toBeDefined();
			expect( OneInchTokenService.isValid1InchTokenLogoItem( logoItem ) ).toBeTruthy();
			expect( logoItem && _.isString( logoItem.oneInch ) ).toBeTruthy();
			expect( logoItem && logoItem.oneInch.startsWith( 'https://' ) ).toBeTruthy();
			expect( logoItem && _.isString( logoItem.metaBeem ) ).toBeTruthy();
			expect( logoItem && logoItem.metaBeem.startsWith( 'https://' ) ).toBeTruthy();
			expect( logoItem && _.isString( logoItem.base64 ) && ! _.isEmpty( logoItem.base64 ) ).toBeTruthy();
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
			const logoItem : OneInchTokenLogoItem | null = await new TokenService().getItemLogo( contractAddress );
			//console.log( `logoItem :`, logoItem );
			//	should output:
			//	logoItem : {
			//       oneInch: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
			//       metaBeem: 'https://tokens.metabeem.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
			//       base64: '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'
			//     }
			expect( logoItem ).toBeDefined();
			expect( OneInchTokenService.isValid1InchTokenLogoItem( logoItem ) ).toBeTruthy();
			expect( logoItem && _.isString( logoItem.oneInch ) ).toBeTruthy();
			expect( logoItem && logoItem.oneInch.startsWith( 'https://' ) ).toBeTruthy();
			expect( logoItem && _.isString( logoItem.metaBeem ) ).toBeTruthy();
			expect( logoItem && logoItem.metaBeem.startsWith( 'https://' ) ).toBeTruthy();
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

		it( "should return the logo item of a token", async () =>
		{
			setCurrentChain( 1 );
			const contractAddress : string = new TokenService( 1 ).nativeTokenAddress;
			const logoItem : OneInchTokenLogoItem | null = await new TokenService( 1 ).getItemLogo( contractAddress );
			//console.log( `logoItem :`, logoItem );
			//	should output:
			//	logoItem : {
			//       oneInch: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
			//       metaBeem: 'https://tokens.metabeem.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
			//       base64: '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'
			//     }
			expect( logoItem ).toBeDefined();
			expect( OneInchTokenService.isValid1InchTokenLogoItem( logoItem ) ).toBeTruthy();
			expect( logoItem && _.isString( logoItem.oneInch ) ).toBeTruthy();
			expect( logoItem && logoItem.oneInch.startsWith( 'https://' ) ).toBeTruthy();
			expect( logoItem && _.isString( logoItem.metaBeem ) ).toBeTruthy();
			expect( logoItem && logoItem.metaBeem.startsWith( 'https://' ) ).toBeTruthy();
		} );
	} );
} );
