import { describe, expect } from '@jest/globals';
import {OneInchTokenService, setCurrentChain, TokenService} from "../../../../src";
import { getCurrentChain } from "../../../../src";
import _ from "lodash";
import { OneInchTokenLogoItem } from "../../../../src/models/TokenModels";


/**
 *	WalletBasicStorage unit test
 */
describe( "OneInchTokenService", () =>
{
	beforeAll( async () =>
	{
		setCurrentChain( 1 );
	} );
	afterAll( async () =>
	{
	} );

	describe( "Token List", () =>
	{
		it( "should return a token list", async () =>
		{
			const oneInch = new OneInchTokenService( getCurrentChain() );
			const res = await oneInch.fetchTokenMap();
			expect( res ).toBeDefined();
			const keys = _.keys( res );
			expect( Array.isArray( keys ) && keys.length > 0 ).toBeTruthy();
			for ( const key in res )
			{
				expect( OneInchTokenService.isValid1InchTokenItem( res[ key ] ) ).toBeTruthy();
			}
		} );
	} );

	describe( "Token Custom Info", () =>
	{
		it( "should return a custom contract token info", async () =>
		{
			const oneInch = new OneInchTokenService( getCurrentChain() );
			const res = await oneInch.fetchTokenItemInfo( "0x491e136ff7ff03e6ab097e54734697bb5802fc1c" );

			//	{
			//		"id": 385599,
			//		"symbol": "KTN",
			//		"name": "Kattana",
			//		"address": "0x491e136ff7ff03e6ab097e54734697bb5802fc1c",
			//		"decimals": 18,
			//		"logoURI": "https://tokens.1inch.io/0x491e136ff7ff03e6ab097e54734697bb5802fc1c.png",
			//		"rating": 3,
			//		"eip2612": null,
			//		"tags": [
			//			{
			//				"value": "tokens",
			//				"provider": "1inch"
			//			}
			//		],
			//		"providers": [
			//			"1inch",
			//			"Trust Wallet Assets",
			//			"Zapper Token List"
			//		]
			//	}
			//
			//	{
			//		"address": "0x491e136ff7ff03e6ab097e54734697bb5802fc1c",
			//		"decimals": 18,
			//		"eip2612": null,
			//		"logoURI": "https://tokens.1inch.io/0x491e136ff7ff03e6ab097e54734697bb5802fc1c.png",
			//		"name": "Kattana",
			//		"providers": ["Trust Wallet Assets", "Zapper Token List", "1inch"],
			//		"rating": 3,
			//		"symbol":"KTN",
			//		"tags": [{"provider": "1inch", "value": "tokens"}]
			//	}
			//
			expect( res ).toBeDefined();
			expect( res ).toHaveProperty( 'address' );
			expect( res ).toHaveProperty( 'decimals' );
			expect( res ).toHaveProperty( 'name' );
			expect( res ).toHaveProperty( 'symbol' );
		} );

		it( "Should return the url address of the [Tether USD] icon", async () =>
		{
			const logoItem : OneInchTokenLogoItem | null = await new TokenService( 1 ).getItemLogo( "0xdac17f958d2ee523a2206206994597c13d831ec7" );
			//	console.log( `logoItem :`, logoItem );
			//	should output:
			//	logoItem : {
			//       oneInch: 'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png',
			//       metaBeem: 'https://tokens.metabeem.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png',
			//       base64: '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'
			//     }
			expect( logoItem ).toBeDefined();
			expect( OneInchTokenService.isValid1InchTokenLogoItem( logoItem ) ).toBeTruthy();
			expect( logoItem && _.isString( logoItem.oneInch ) ).toBeTruthy();
			expect( logoItem && logoItem.oneInch && logoItem.oneInch.startsWith( 'https://' ) ).toBeTruthy();
			expect( logoItem && _.isString( logoItem.metaBeem ) ).toBeTruthy();
			expect( logoItem && logoItem.metaBeem && logoItem.metaBeem.startsWith( 'https://' ) ).toBeTruthy();
		} );

		// it( "Should return the url address of the [Tether USD] icon by its contract address", async () =>
		// {
		// 	const iconUrl = new TokenService().getIconBySymbol( "USDT" );
		// 	expect( iconUrl ).toBeDefined();
		// 	expect( typeof iconUrl ).toBe( 'string' );
		// 	if ( typeof iconUrl === 'string' )
		// 	{
		// 		expect( iconUrl.length ).toBeGreaterThan( 0 );
		// 		expect( iconUrl.startsWith( 'https://' ) ).toBeTruthy();
		// 	}
		// } );
	} );
} );
