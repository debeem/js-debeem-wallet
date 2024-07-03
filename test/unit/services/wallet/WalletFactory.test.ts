import { describe, expect } from '@jest/globals';
import { WalletEntityBaseItem, WalletFactory } from "../../../../src";
import { ethers, isAddress } from "ethers";
import { TypeUtil } from "debeem-utils";
import { EtherWallet } from "debeem-id";

/**
 *	WalletFactory unit test
 */
describe( "WalletFactory", () =>
{
	beforeAll( async () =>
	{
	} );
	afterAll( async () =>
	{
	} );

	describe( "Create Wallet from Mnemonic", () =>
	{
		it( "should create a wallet from a empty mnemonic", async () =>
		{
			// Create a wallet from the mnemonic
			const walletObj = new WalletFactory().createWalletFromMnemonic();
			// console.log( `walletObj :`, walletObj );
			//
			// const derivedWallet = wallet.derivePath( "m/44'/60'/0'/65535/65535" );

			//
			//	{
			//		isHD: true,
			//		mnemonic: 'million butter obtain fuel address truck grunt recall gain rotate debris flee',
			//		password: '',
			//		address: '0x03a06e86556C819199E602851e4453a89718cB36',
			//		publicKey: '0x0384636daeaf2f410f7c4a6749a143096838a0482bcee94e412ca3a683bca3ac00',
			//		privateKey: '0x44dd0864d00e37090622a17e66c0914bd71a1245a3a2e4f88611775854f4eafc',
			//		index: 0,
			//		path: "m/44'/60'/0'/0/0"
			//	}
			//
			//console.log( walletObj );

			expect( walletObj ).not.toBeNull();
			if ( walletObj.mnemonic )
			{
				expect( walletObj.mnemonic.split( " " ).length ).toBe( 12 );
			}
			expect( walletObj.privateKey.startsWith( '0x' ) ).toBe( true );
			expect( walletObj.address.startsWith( '0x' ) ).toBe( true );
		} );

		it( "should create a wallet with a user-specified mnemonic phrase", async () =>
		{
			const mnemonic = 'olympic cradle tragic crucial exit annual silly cloth scale fine gesture ancient';
			const walletObj = new WalletFactory().createWalletFromMnemonic( mnemonic );
			//console.log( walletObj );
			// {
			// 	isHD: true,
			// 		mnemonic: 'olympic cradle tragic crucial exit annual silly cloth scale fine gesture ancient',
			// 	password: '',
			// 	address: '0xC8F60EaF5988aC37a2963aC5Fabe97f709d6b357',
			// 	publicKey: '0x03ed2098910ab9068abd54e1562eb9dee3cb2d9fc1426dfe91541970a89b5aa622',
			// 	privateKey: '0xf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a',
			// 	index: 0,
			// 	path: "m/44'/60'/0'/0/0"
			// }
			expect( walletObj ).not.toBeNull();
			expect( walletObj.mnemonic ).toBe( mnemonic );
			expect( walletObj.privateKey.startsWith( '0x' ) ).toBe( true );
			expect( walletObj.privateKey ).toBe( `0xf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a` );
			expect( walletObj.publicKey ).toBe( `0x03ed2098910ab9068abd54e1562eb9dee3cb2d9fc1426dfe91541970a89b5aa622` );
			expect( walletObj.address.startsWith( '0x' ) ).toBe( true );
			expect( walletObj.address ).toBe( `0xc8f60eaf5988ac37a2963ac5fabe97f709d6b357` );
			expect( walletObj.index ).toBe( 0 );
			expect( walletObj.path ).toBe( ethers.defaultPath );
		} );

		it( "should throw an error if the mnemonic is not valid", async () =>
		{
			try
			{
				new WalletFactory().createWalletFromMnemonic( "input an invalid mnemonic" );
			}
			catch ( error : any )
			{
				// Assert that the error is thrown
				expect( error ).toBeDefined();
				expect( error ).toHaveProperty( 'message' );
				expect( error.message.includes( `invalid mnemonic` ) ).toBeTruthy();
			}
		} );
	} );

	describe( "Create Wallet from Private Key", () =>
	{
		it( "should create a wallet from a empty private key", async () =>
		{

			const walletObj = new WalletFactory().createWalletFromPrivateKey();

			expect( walletObj ).not.toBeNull();
			expect( walletObj.mnemonic ).toBe( '' );
			expect( walletObj.privateKey.startsWith( '0x' ) ).toBe( true );
			expect( walletObj.address.startsWith( '0x' ) ).toBe( true );
			//expect( walletObj.index ).not.toBeDefined();
			expect( walletObj.index ).toBe( 0 );
			expect( walletObj.path ).toBe( null );
		} );

		it( "should create a wallet from a specified private key", async () =>
		{
			// Create a wallet from the specified private key
			const privateKey = "0xf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a".trim().toLowerCase();
			const publicKey = "0x03ed2098910ab9068abd54e1562eb9dee3cb2d9fc1426dfe91541970a89b5aa622".trim().toLowerCase();
			const address = "0xC8F60EaF5988aC37a2963aC5Fabe97f709d6b357".trim().toLowerCase();

			const walletObj = new WalletFactory().createWalletFromPrivateKey( privateKey );
			// console.log( walletObj );
			// {
			// 	isHD: false,
			// 		mnemonic: '',
			// 	password: '',
			// 	address: '0xC8F60EaF5988aC37a2963aC5Fabe97f709d6b357',
			// 	publicKey: '0x03ed2098910ab9068abd54e1562eb9dee3cb2d9fc1426dfe91541970a89b5aa622',
			// 	privateKey: '0xf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a',
			// 	index: 0,
			// 	path: null
			// }


			expect( walletObj ).not.toBeNull();
			expect( walletObj.mnemonic ).toBe( '' );
			expect( walletObj.privateKey ).toEqual( privateKey );
			expect( walletObj.publicKey ).toEqual( publicKey );
			expect( walletObj.address ).toEqual( address );
			expect( walletObj.index ).toBe( 0 );
			expect( walletObj.path ).toBe( null );
		} );

		it( "should throw an error if the private key is not valid", async () =>
		{
			// Try to create a wallet from an invalid private key
			const privateKey = "xxf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a";

			try
			{
				new WalletFactory().createWalletFromPrivateKey( privateKey );
			}
			catch ( error : any )
			{
				// Assert that the error is thrown
				expect( error ).toBeDefined();
				expect( error ).toHaveProperty( 'message' );
				expect( error.message.includes( `invalid format of private key` ) ).toBeTruthy();
			}
		} );
	} );

	describe( "Create Wallet from Keystore", () =>
	{
		it( "should create a wallet from keystore string", async () =>
		{
			//
			//	step 1: create a new wallet from a random private key
			//
			const walletObj = new WalletFactory().createWalletFromPrivateKey();

			expect( walletObj ).not.toBeNull();
			expect( walletObj.mnemonic ).toBe( '' );
			expect( walletObj.privateKey.startsWith( '0x' ) ).toBe( true );
			expect( walletObj.address.startsWith( '0x' ) ).toBe( true );
			expect( walletObj.index ).toBe( 0 );
			expect( walletObj.path ).toBe( null );

			//
			//	step 2: get the keystore string of wallet
			//
			const password : string = '00000000';
			const keystoreJson : string = await new WalletFactory().getKeystoreOfWallet( walletObj, password );
			expect( keystoreJson ).toBeDefined();
			expect( typeof keystoreJson ).toBe( "string" );
			expect( TypeUtil.isNotEmptyString( keystoreJson ) ).toBeTruthy();

			//	should output:
			//	{"address":"d4a9f003c167df8d5b1851c73b42b8c3d6b2276a","id":"ae16f5fc-92d5-45d5-8db0-051ebed0e19b","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"75aa6bfbea37eced7c404f3149739b9e"},"ciphertext":"7cfa38b1e0c9b8bd7afbfbd247b7ac7a71af6788a6c9548762b3cf895626de4c","kdf":"scrypt","kdfparams":{"salt":"457447b29ae32b0470bc97818ceb17383498cf5620b668704134ea40114d2ddd","n":131072,"dklen":32,"p":1,"r":8},"mac":"c63c48b18ead9420a3bd448d99bdf50c6da685aec9092e3c9628817e4e2d40e9"}}
			//console.log( keystoreJson );

			//
			//	step 3: recover the wallet from the keystore json string
			//
			const walletAgain = await new WalletFactory().createWalletFromKeystore( keystoreJson, password );
			expect( walletAgain ).toBeDefined();
			expect( WalletFactory.isValidWalletFactoryData( walletAgain ) ).toBeTruthy();
			expect( isAddress( walletAgain.address ) ).toBeTruthy();
			expect( isAddress( walletObj.address ) ).toBeTruthy();
			expect( EtherWallet.isValidLowercaseHex( walletAgain.address ) ).toBeTruthy();
			expect( EtherWallet.isValidLowercaseHex( walletObj.address ) ).toBeTruthy();
			//expect( TypeUtil.isStringEqualNoCase( walletAgain.address, walletObj.address ) ).toBeTruthy();
			expect( walletAgain.index ).toBe( walletObj.index );
			expect( walletAgain.privateKey ).toBe( walletObj.privateKey );
			expect( walletAgain.publicKey ).toBe( walletObj.publicKey );
			expect( walletAgain.path ).toBe( walletObj.path );
			expect( walletAgain.password ).toBe( walletObj.password );
		});
	} );

	describe( "Create Watch Wallet", () =>
	{
		it( "should throw an error about invalid address", async () =>
		{
			try
			{
				new WalletFactory().createWalletFromAddress( '1' );
			}
			catch ( err : any )
			{
				//	Assert that the error is thrown
				expect( err ).toBeDefined();
				expect( err ).toHaveProperty( 'message' );
				expect( err.message.includes( `invalid address` ) ).toBeTruthy();
			}
		});

		it( "should create a watch wallet from address", async () =>
		{
			//	create a wallet by mnemonic
			const walletObj : WalletEntityBaseItem = new WalletFactory().createWalletFromMnemonic();
			expect( walletObj ).toBeDefined();
			expect( walletObj ).toHaveProperty( 'isHD' );
			expect( walletObj ).toHaveProperty( 'address' );
			expect( walletObj ).toHaveProperty( 'privateKey' );
			expect( walletObj ).toHaveProperty( 'publicKey' );
			expect( walletObj ).toHaveProperty( 'index' );
			expect( walletObj ).toHaveProperty( 'path' );
			expect( isAddress( walletObj.address ) ).toBeTruthy();

			const watchWallet : WalletEntityBaseItem = new WalletFactory().createWalletFromAddress( walletObj.address );
			expect( watchWallet ).toBeDefined();
			expect( watchWallet ).toHaveProperty( 'isHD' );
			expect( watchWallet ).toHaveProperty( 'address' );
			expect( watchWallet ).toHaveProperty( 'privateKey' );
			expect( watchWallet ).toHaveProperty( 'publicKey' );
			expect( watchWallet ).toHaveProperty( 'index' );
			expect( watchWallet ).toHaveProperty( 'path' );
			expect( isAddress( walletObj.address ) ).toBeTruthy();
			expect( walletObj.address ).toBe( walletObj.address );
			expect( watchWallet.isHD ).toBeFalsy();
		});
	} );

	describe( "Create New Address", () =>
	{
		it( "should create a new adderss from a specified HD wallet", async () =>
		{
			const mnemonic = 'olympic cradle tragic crucial exit annual silly cloth scale fine gesture ancient';
			const firstAddress = '0xC8F60EaF5988aC37a2963aC5Fabe97f709d6b357'.trim().toLowerCase();
			const secondAddress = '0x75BaAEc1C767A6A6F076dEEeA665F8642973dafA'.trim().toLowerCase();
			const thirdAddress = '0xE05eCB996dA9D59315d569D65C93Af68bA9AA4a5'.trim().toLowerCase();

			const walletObj = new WalletFactory().createWalletFromMnemonic( mnemonic );
			expect( walletObj.address ).toBe( firstAddress );
			expect( walletObj.index ).toBe( 0 );
			expect( walletObj.path ).toBe( ethers.defaultPath );

			const secondWalletObj = new WalletFactory().createNewAddress( walletObj );
			expect( secondWalletObj.address ).toBe( secondAddress );
			expect( EtherWallet.isValidLowercaseHex( secondWalletObj.address ) ).toBeTruthy();
			expect( secondWalletObj.index ).toBe( 1 );
			expect( secondWalletObj.path ).toBe( ethers.getIndexedAccountPath( 1 ) );

			const thirdWalletObj = new WalletFactory().createNewAddress( secondWalletObj );
			expect( thirdWalletObj.address ).toBe( thirdAddress );
			expect( EtherWallet.isValidLowercaseHex( thirdWalletObj.address ) ).toBeTruthy();
			expect( thirdWalletObj.index ).toBe( 2 );
			expect( thirdWalletObj.path ).toBe( ethers.getIndexedAccountPath( 2 ) );
		} );

		it( "should throw an error if the wallet is not valid", async () =>
		{
			try
			{
				new WalletFactory().createNewAddress( undefined );
			}
			catch ( error : any )
			{
				//	Assert that the error is thrown
				expect( error ).toBeDefined();
				expect( error ).toHaveProperty( 'message' );
				expect( error.message ).toEqual( "wallet not specified" );
			}
		} );
	} )
} );
