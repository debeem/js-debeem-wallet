import { describe, expect } from '@jest/globals';
import { FetchListOptions } from "debeem-utils";
import { TypeUtil } from "../../../../src/utils/TypeUtil";
import {setCurrentChain, WalletNFT} from "../../../../src";


/**
 *	WalletTransaction unit test
 */
describe( "WalletTransaction.NFT", () =>
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
		//
		//	found here:
		//	https://goerli.etherscan.io/tx/0xb57820a5c927a9fdd7482e427bc3fd10a676e76b9088fdbac34bba4d8f792780
		//
		const walletAddress : string = `0x47B506704DA0370840c2992A3d3d301FD3c260D3`;	//0x683279542eD04d7C60DC56E4EA230fe621eDD4Ca`;
		it( `should return all NTFs owned by the wallet address`, async () =>
		{
			const fetchOptions : FetchListOptions = {};
			const NFTList : Array< any > | null = await new WalletNFT().queryNFTs( walletAddress, fetchOptions );
			expect( NFTList ).toBeDefined();
			expect( Array.isArray( NFTList ) ).toBeTruthy();

			if ( Array.isArray( NFTList ) )
			{
				for ( const item of NFTList )
				{
					expect( item ).toBeDefined();
					expect( item ).toHaveProperty( 'contract' );
					expect( TypeUtil.isNotNullObject( item.contract ) ).toBeTruthy();
					expect( item.contract ).toHaveProperty( 'address' );
					expect( item ).toHaveProperty( 'id' );
					expect( item ).toHaveProperty( 'balance' );
					expect( item ).toHaveProperty( 'title' );
					expect( item ).toHaveProperty( 'description' );
					expect( item ).toHaveProperty( 'tokenUri' );
					expect( item ).toHaveProperty( 'media' );
					expect( item ).toHaveProperty( 'metadata' );
					//expect( item.metadata ).toHaveProperty( 'name' );
					//expect( item.metadata ).toHaveProperty( 'image' );
					expect( item ).toHaveProperty( 'timeLastUpdated' );
					expect( item ).toHaveProperty( 'contractMetadata' );

					//
					//	should output:
					//	console.log( item )
					//
					//	{
					//       "contract": {
					//         "address": "0x317a8fe0f1c7102e7674ab231441e485c64c178a"
					//       },
					//       "id": {
					//         "tokenId": "0x000000000000000000000000000000000000000000000000000000000003a785",
					//         "tokenMetadata": {
					//           "tokenType": "ERC721"
					//         }
					//       },
					//       "balance": "1",
					//       "title": "Splashing Kiki",
					//       "description": "You want HAVAH to invest? Then you will have to convince me… It won't be easy, of course.",
					//       "tokenUri": {
					//         "gateway": "https://ipfs.io/ipfs/bafkreiacj42t6ux5vcxn3ewtmxxo5dj75ova5vgkn56o4hceiwnyucd26i",
					//         "raw": "ipfs://bafkreiacj42t6ux5vcxn3ewtmxxo5dj75ova5vgkn56o4hceiwnyucd26i"
					//       },
					//       "media": [
					//         {
					//           "gateway": "https://nft-cdn.alchemy.com/eth-goerli/f293a3f91e1d3e4523b391a2e87547b6",
					//           "thumbnail": "https://res.cloudinary.com/alchemyapi/image/upload/thumbnailv2/eth-goerli/f293a3f91e1d3e4523b391a2e87547b6",
					//           "raw": "ipfs://bafkreiabs4ehrd4rp4evj6fpjda7siq6tp3dw63edipfss75fvbay7apdm",
					//           "format": "png",
					//           "bytes": 87741
					//         }
					//       ],
					//       "metadata": {
					//         "name": "Splashing Kiki",
					//         "description": "You want HAVAH to invest? Then you will have to convince me… It won't be easy, of course.",
					//         "image": "ipfs://bafkreiabs4ehrd4rp4evj6fpjda7siq6tp3dw63edipfss75fvbay7apdm"
					//       },
					//       "timeLastUpdated": "2023-01-03T23:39:16.905Z",
					//       "contractMetadata": {
					//         "name": "HAVAH Friends",
					//         "symbol": "hHVHF",
					//         "tokenType": "ERC721",
					//         "contractDeployer": "0x82148231d76dfc18a4d1c4063e694c179b7911ed",
					//         "deployedBlockNumber": 8143848,
					//         "openSea": {
					//           "lastIngestedAt": "2023-07-25T09:58:03.000Z"
					//         }
					//       }
					//     },
					//

				}
			}

		}, 90 * 1000 );

	} )
} );
