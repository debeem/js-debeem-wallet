import { describe, expect } from '@jest/globals';
import { ChainService } from "../../../../src";



/**
 *	unit test
 */
describe( "ChainService", () =>
{
	beforeAll( async () =>
	{
	} );
	afterAll( async () =>
	{
	} );

	describe( "Checking", () =>
	{
		it( "should return already exists by chain id", async () =>
		{
			const chainService = new ChainService();
			const exists : boolean = chainService.exists( 1 );
			expect( exists ).toBeTruthy();
		} );

		it( "should return does not exist by a non-existent chain id", async () =>
		{
			const chainService = new ChainService();
			const exists : boolean = chainService.exists( 10000000 );
			expect( exists ).toBeFalsy();
		} );

		it( "should return a chain item by chain id", async () =>
		{
			const chainService = new ChainService();
			const chainObj : Object | null = chainService.getItem( 1 );
			expect( chainObj ).toBeDefined();
			//console.log( `chainObj: `, chainObj );
			//	should output:
			//	{
			//       name: 'Ethereum Mainnet',
			//       chain: 'ETH',
			//       icon: 'ethereum',
			//       rpc: [
			//         'https://mainnet.infura.io/v3/${INFURA_API_KEY}',
			//         'wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}',
			//         'https://api.mycryptoapi.com/eth',
			//         'https://cloudflare-eth.com',
			//         'https://ethereum.publicnode.com'
			//       ],
			//       features: [ { name: 'EIP155' }, { name: 'EIP1559' } ],
			//       faucets: [],
			//       nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
			//       infoURL: 'https://ethereum.org',
			//       shortName: 'eth',
			//       chainId: 1,
			//       networkId: 1,
			//       slip44: 60,
			//       ens: { registry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e' },
			//       explorers: [
			//         {
			//           name: 'etherscan',
			//           url: 'https://etherscan.io',
			//           standard: 'EIP3091'
			//         }
			//       ]
			//     }
			expect( chainObj ).toHaveProperty( 'name' );
			expect( chainObj ).toHaveProperty( 'chain' );
			expect( chainObj ).toHaveProperty( 'chainId' );
		} );
	} );
} );
