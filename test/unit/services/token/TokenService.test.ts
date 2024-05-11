import { describe, expect } from '@jest/globals';
import { OneInchTokenService, TokenService } from "../../../../src";
import { getCurrentChain } from "../../../../src";



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

	describe( "Token Custom Info", () =>
	{
		it( "should return a custom contract token info", async () =>
		{
			const oneInch = new OneInchTokenService( getCurrentChain() );
			const res = await oneInch.fetchTokenCustomInfo( 1,"0x491e136ff7ff03e6ab097e54734697bb5802fc1c" );

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

		it( "Should return the url address of the [Tether USD] icon by its contract address", async () =>
		{
			const iconUrl = new TokenService().getIconByContract( "0xdac17f958d2ee523a2206206994597c13d831ec7" );
			expect( iconUrl ).toBeDefined();
			expect( typeof iconUrl ).toBe( 'string' );
			if ( typeof iconUrl === 'string' )
			{
				expect( iconUrl.length ).toBeGreaterThan( 0 );
				expect( iconUrl.startsWith( 'https://' ) ).toBeTruthy();
			}
		} );

		it( "Should return the url address of the [Tether USD] icon by its contract address", async () =>
		{
			const iconUrl = new TokenService().getIconBySymbol( "USDT" );
			expect( iconUrl ).toBeDefined();
			expect( typeof iconUrl ).toBe( 'string' );
			if ( typeof iconUrl === 'string' )
			{
				expect( iconUrl.length ).toBeGreaterThan( 0 );
				expect( iconUrl.startsWith( 'https://' ) ).toBeTruthy();
			}
		} );
	} );
} );
