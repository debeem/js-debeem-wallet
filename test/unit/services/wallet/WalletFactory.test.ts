import { describe, expect } from '@jest/globals';
import { WalletEntityBaseItem, WalletFactory } from "../../../../src";
import { ethers, isAddress } from "ethers";
import { TypeUtil } from "debeem-utils";
import { EtherWallet, Web3Digester, Web3Signer, Web3Validator } from "debeem-id";
import { AesCrypto } from "debeem-cipher";
import { testMnemonicList } from "../../../../src/configs/TestConfig";

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
		it( "should create a wallet from Alice's mnemonic", async () =>
		{
			const walletObj = new WalletFactory().createWalletFromMnemonic( testMnemonicList.alice );
			//console.log( `walletObj :`, walletObj );
			//	walletObj : {
			//       isHD: true,
			//       mnemonic: 'olympic cradle tragic crucial exit annual silly cloth scale fine gesture ancient',
			//       password: '',
			//       address: '0xc8f60eaf5988ac37a2963ac5fabe97f709d6b357',
			//       publicKey: '0x03ed2098910ab9068abd54e1562eb9dee3cb2d9fc1426dfe91541970a89b5aa622',
			//       privateKey: '0xf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a',
			//       index: 0,
			//       path: "m/44'/60'/0'/0/0"
			//     }
			expect( walletObj ).not.toBeNull();
			expect( walletObj.isHD ).toBe( true );
			expect( walletObj.mnemonic ).toBe( `olympic cradle tragic crucial exit annual silly cloth scale fine gesture ancient` );
			expect( walletObj.privateKey ).toBe( `0xf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a` );
			expect( walletObj.publicKey ).toBe( `0x03ed2098910ab9068abd54e1562eb9dee3cb2d9fc1426dfe91541970a89b5aa622` );
			expect( walletObj.address ).toBe( `0xc8f60eaf5988ac37a2963ac5fabe97f709d6b357` );
			expect( walletObj.index ).toBe( 0 );
			expect( walletObj.path ).toBe( `m/44'/60'/0'/0/0` );
		} );

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

			const secondWalletObj = new WalletFactory().deriveNextWallet( walletObj );
			expect( secondWalletObj.address ).toBe( secondAddress );
			expect( EtherWallet.isValidLowercaseHex( secondWalletObj.address ) ).toBeTruthy();
			expect( secondWalletObj.index ).toBe( 1 );
			expect( secondWalletObj.path ).toBe( ethers.getIndexedAccountPath( 1 ) );

			const thirdWalletObj = new WalletFactory().deriveNextWallet( secondWalletObj );
			expect( thirdWalletObj.address ).toBe( thirdAddress );
			expect( EtherWallet.isValidLowercaseHex( thirdWalletObj.address ) ).toBeTruthy();
			expect( thirdWalletObj.index ).toBe( 2 );
			expect( thirdWalletObj.path ).toBe( ethers.getIndexedAccountPath( 2 ) );
		} );
	} );

	describe( "Derive Chat Wallet", () =>
	{
		it( "should derive a chat wallet from a HD wallet", async () =>
		{
			const mnemonic = 'olympic cradle tragic crucial exit annual silly cloth scale fine gesture ancient';

			const walletObj = new WalletFactory().createWalletFromMnemonic( mnemonic );
			//console.log( `walletObj :`, walletObj );
			//	    walletObj : {
			//       isHD: true,
			//       mnemonic: 'olympic cradle tragic crucial exit annual silly cloth scale fine gesture ancient',
			//       password: '',
			//       address: '0xc8f60eaf5988ac37a2963ac5fabe97f709d6b357',
			//       publicKey: '0x03ed2098910ab9068abd54e1562eb9dee3cb2d9fc1426dfe91541970a89b5aa622',
			//       privateKey: '0xf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a',
			//       index: 0,
			//       path: "m/44'/60'/0'/0/0"
			//     }
			expect( walletObj ).not.toBeNull();
			expect( walletObj.isHD ).toBe( true );
			expect( walletObj.mnemonic ).toBe( mnemonic );
			expect( walletObj.address ).toBe( `0xc8f60eaf5988ac37a2963ac5fabe97f709d6b357` );
			expect( walletObj.publicKey ).toBe( `0x03ed2098910ab9068abd54e1562eb9dee3cb2d9fc1426dfe91541970a89b5aa622` );
			expect( walletObj.privateKey ).toBe( `0xf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a` );
			expect( walletObj.index ).toBe( 0 );
			expect( walletObj.path ).toBe( ethers.defaultPath );

			const chatWallet = new WalletFactory().deriveBusinessWallet( walletObj );
			//console.log( `chatWallet :`, chatWallet );
			//	    chatWallet : {
			//       isHD: true,
			//       mnemonic: 'olympic cradle tragic crucial exit annual silly cloth scale fine gesture ancient',
			//       password: '',
			//       address: '0xc2678a12d5c8b0508d375de67fbeb78afde5bb28',
			//       publicKey: '0x035eb821f1b718419956d9d1d628ecd1359cc320c513e6953d18cb414d36a5c5b4',
			//       privateKey: '0x7c0c63567803e67d74b59217f7cab9cb44a8747847585f52f317e72f092e5361',
			//       index: 23041601,
			//       path: "m/44'/60'/0'/0/23041601"
			//     }
			expect( chatWallet ).not.toBeNull();
			expect( chatWallet.isHD ).toBe( true );
			expect( chatWallet.mnemonic ).toBe( mnemonic );
			expect( chatWallet.address ).toBe( `0xc2678a12d5c8b0508d375de67fbeb78afde5bb28` );
			expect( chatWallet.publicKey ).toBe( `0x035eb821f1b718419956d9d1d628ecd1359cc320c513e6953d18cb414d36a5c5b4` );
			expect( chatWallet.privateKey ).toBe( `0x7c0c63567803e67d74b59217f7cab9cb44a8747847585f52f317e72f092e5361` );
			expect( chatWallet.index ).toBe( 23041601 );
			expect( chatWallet.path ).toBe( "m/44'/60'/0'/0/23041601" );

			//
			//	sign and validate a data
			//
			let post = {
				timestamp : new Date().getTime(),
				hash : '',
				version : '1.0.0',
				wallet : chatWallet.address,
				sig : ``,
				body : 'Hello 1'
			};
			post.sig = await Web3Signer.signObject( chatWallet.privateKey, post );
			post.hash = await Web3Digester.hashObject( post );
			expect( post.sig ).toBeDefined();
			expect( typeof post.sig ).toBe( 'string' );
			expect( post.sig.length ).toBeGreaterThanOrEqual( 0 );
			expect( post.hash ).toBeDefined();
			expect( typeof post.hash ).toBe( 'string' );
			expect( post.hash.length ).toBeGreaterThanOrEqual( 0 );

			const validatedSig : boolean = await Web3Validator.validateObject( post.wallet, post, post.sig );
			expect( validatedSig ).toBeTruthy();
			//console.log( `post :`, post );
			//	    post : {
			//       timestamp: 1720226832393,
			//       hash: '0xe82c12b3f3c21317f7b7c825686fe164c16432d6c7f95366ce33083e567f8aba',
			//       version: '1.0.0',
			//       wallet: '0xc2678a12d5c8b0508d375de67fbeb78afde5bb28',
			//       sig: '0x6893995c8f570a8532911c9340057c12bb09c2c1621a0088b57cd68c523cb8967d7ad0860042e089d6aefce1f02703c9b6d59c09a1b59606f3ba01f04dea07741b',
			//       body: 'Hello 1'
			//     }
			//
		});

		it( "should derive a chat wallet from a private key", async () =>
		{
			const privateKey = `0xf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a`;
			const walletObj = new WalletFactory().createWalletFromPrivateKey( privateKey );
			//console.log( `walletObj :`, walletObj );
			//	    walletObj : {
			//       isHD: false,
			//       mnemonic: '',
			//       password: '',
			//       address: '0xc8f60eaf5988ac37a2963ac5fabe97f709d6b357',
			//       publicKey: '0x03ed2098910ab9068abd54e1562eb9dee3cb2d9fc1426dfe91541970a89b5aa622',
			//       privateKey: '0xf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a',
			//       index: 0,
			//       path: null
			//     }
			expect( walletObj ).not.toBeNull();
			expect( walletObj.isHD ).toBe( false );
			expect( walletObj.mnemonic ).toBe( `` );
			expect( walletObj.password ).toBe( `` );
			expect( walletObj.address ).toBe( `0xc8f60eaf5988ac37a2963ac5fabe97f709d6b357` );
			expect( walletObj.publicKey ).toBe( `0x03ed2098910ab9068abd54e1562eb9dee3cb2d9fc1426dfe91541970a89b5aa622` );
			expect( walletObj.privateKey ).toBe( `0xf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a` );
			expect( walletObj.index ).toBe( 0 );
			expect( walletObj.path ).toBe( null );

			const chatWallet = new WalletFactory().deriveBusinessWallet( walletObj );
			//console.log( `chatWallet :`, chatWallet );
			//	    chatWallet : {
			//       isHD: false,
			//       mnemonic: '',
			//       password: '',
			//       address: '0xc8f60eaf5988ac37a2963ac5fabe97f709d6b357',
			//       publicKey: '0x03ed2098910ab9068abd54e1562eb9dee3cb2d9fc1426dfe91541970a89b5aa622',
			//       privateKey: '0xf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a',
			//       index: 0,
			//       path: null
			//     }
			expect( chatWallet ).not.toBeNull();
			expect( chatWallet.isHD ).toBe( false );
			//expect( chatWallet.mnemonic ).toBe( mnemonic );
			expect( chatWallet.address ).toBe( `0xc8f60eaf5988ac37a2963ac5fabe97f709d6b357` );
			expect( chatWallet.publicKey ).toBe( `0x03ed2098910ab9068abd54e1562eb9dee3cb2d9fc1426dfe91541970a89b5aa622` );
			expect( chatWallet.privateKey ).toBe( `0xf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a` );
			expect( chatWallet.index ).toBe( 0 );
			expect( chatWallet.path ).toBe( null );

			//	chatWallet should be exactly the same as walletObj
			expect( chatWallet ).toBe( walletObj );
			expect( chatWallet.isHD ).toBe( walletObj.isHD );
			expect( chatWallet.mnemonic ).toBe( walletObj.mnemonic );
			expect( chatWallet.address ).toBe( walletObj.address );
			expect( chatWallet.publicKey ).toBe( walletObj.publicKey );
			expect( chatWallet.privateKey ).toBe( walletObj.privateKey );
			expect( chatWallet.index ).toBe( walletObj.index );
			expect( chatWallet.path ).toBe( walletObj.path );

			//
			//	sign and validate a data
			//
			let post = {
				timestamp : new Date().getTime(),
				hash : '',
				version : '1.0.0',
				wallet : chatWallet.address,
				sig : ``,
				body : 'Hello 1'
			};
			post.sig = await Web3Signer.signObject( chatWallet.privateKey, post );
			post.hash = await Web3Digester.hashObject( post );
			expect( post.sig ).toBeDefined();
			expect( typeof post.sig ).toBe( 'string' );
			expect( post.sig.length ).toBeGreaterThanOrEqual( 0 );
			expect( post.hash ).toBeDefined();
			expect( typeof post.hash ).toBe( 'string' );
			expect( post.hash.length ).toBeGreaterThanOrEqual( 0 );

			const validatedSig : boolean = await Web3Validator.validateObject( post.wallet, post, post.sig );
			expect( validatedSig ).toBeTruthy();
			//console.log( `post :`, post );
			//	    post : {
			//       timestamp: 1720226681992,
			//       hash: '0x98f62e6c8acc24ec2a2301f019593ff351923109f919b4d64ef38706984d78ac',
			//       version: '1.0.0',
			//       wallet: '0xc8f60eaf5988ac37a2963ac5fabe97f709d6b357',
			//       sig: '0xaae223d81c0459e92e91263d625dcd022e680c0a766b57a350c4a3ce38e0fe5141a9dd01336b95c2f1c44889c73a45bf911073e07823005318a6205b1718ec3b1c',
			//       body: 'Hello 1'
			//     }
			//
		});

		it( "should send an encrypted message to Bob from Alice by the derived keys been created from mnemonics", async () =>
		{
			const mnemonicAlice = 'olympic cradle tragic crucial exit annual silly cloth scale fine gesture ancient';
			const mnemonicBob = 'retire inflict prevent believe question pipe rebel state visit little bind accuse';

			const walletObjAlice = new WalletFactory().createWalletFromMnemonic( mnemonicAlice );
			const walletObjBob = new WalletFactory().createWalletFromMnemonic( mnemonicBob );
			expect( walletObjAlice ).not.toBeNull();
			//console.log( `walletObjAlice :`, walletObjAlice );
			//	    walletObjAlice : {
			//       isHD: true,
			//       mnemonic: 'olympic cradle tragic crucial exit annual silly cloth scale fine gesture ancient',
			//       password: '',
			//       address: '0xc8f60eaf5988ac37a2963ac5fabe97f709d6b357',
			//       publicKey: '0x03ed2098910ab9068abd54e1562eb9dee3cb2d9fc1426dfe91541970a89b5aa622',
			//       privateKey: '0xf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a',
			//       index: 0,
			//       path: "m/44'/60'/0'/0/0"
			//     }
			expect( walletObjAlice.isHD ).toBe( true );
			expect( walletObjAlice.address ).toBe( `0xc8f60eaf5988ac37a2963ac5fabe97f709d6b357` );
			expect( walletObjAlice.publicKey ).toBe( `0x03ed2098910ab9068abd54e1562eb9dee3cb2d9fc1426dfe91541970a89b5aa622` );
			expect( walletObjAlice.privateKey ).toBe( `0xf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a` );

			expect( walletObjBob ).not.toBeNull();
			//console.log( `walletObjBob :`, walletObjBob );
			//	    walletObjBob : {
			//       isHD: true,
			//       mnemonic: 'retire inflict prevent believe question pipe rebel state visit little bind accuse',
			//       password: '',
			//       address: '0x95a93fb72a160a2c8c9181eefa3b56273600758a',
			//       publicKey: '0x0223e552b65526b686e92f0f8e8af7ef13fc66a7691eaa9864433e7c7b767f94a9',
			//       privateKey: '0x794b0319ec5bececa8ca5d1ee2e07198aebb4cc6f3257069b739a86bb7edde8b',
			//       index: 0,
			//       path: "m/44'/60'/0'/0/0"
			//     }
			//
			expect( walletObjBob.isHD ).toBe( true );
			expect( walletObjBob.isHD ).toBe( true );
			expect( walletObjBob.address ).toBe( `0x95a93fb72a160a2c8c9181eefa3b56273600758a` );
			expect( walletObjBob.publicKey ).toBe( `0x0223e552b65526b686e92f0f8e8af7ef13fc66a7691eaa9864433e7c7b767f94a9` );
			expect( walletObjBob.privateKey ).toBe( `0x794b0319ec5bececa8ca5d1ee2e07198aebb4cc6f3257069b739a86bb7edde8b` );

			const chatWalletAlice = new WalletFactory().deriveBusinessWallet( walletObjAlice );
			const chatWalletBob = new WalletFactory().deriveBusinessWallet( walletObjBob );

			expect( chatWalletAlice ).not.toBeNull();
			//console.log( `chatWalletAlice :`, chatWalletAlice );
			//	    chatWalletAlice : {
			//       isHD: true,
			//       mnemonic: 'olympic cradle tragic crucial exit annual silly cloth scale fine gesture ancient',
			//       password: '',
			//       address: '0xc2678a12d5c8b0508d375de67fbeb78afde5bb28',
			//       publicKey: '0x035eb821f1b718419956d9d1d628ecd1359cc320c513e6953d18cb414d36a5c5b4',
			//       privateKey: '0x7c0c63567803e67d74b59217f7cab9cb44a8747847585f52f317e72f092e5361',
			//       index: 23041601,
			//       path: "m/44'/60'/0'/0/23041601"
			//     }
			expect( chatWalletAlice.isHD ).toBe( true );
			expect( chatWalletAlice.isHD ).toBe( true );
			expect( chatWalletAlice.address ).toBe( `0xc2678a12d5c8b0508d375de67fbeb78afde5bb28` );
			expect( chatWalletAlice.publicKey ).toBe( `0x035eb821f1b718419956d9d1d628ecd1359cc320c513e6953d18cb414d36a5c5b4` );
			expect( chatWalletAlice.privateKey ).toBe( `0x7c0c63567803e67d74b59217f7cab9cb44a8747847585f52f317e72f092e5361` );
			expect( chatWalletAlice.index ).toBe( 23041601 );
			expect( chatWalletAlice.path ).toBe( `m/44'/60'/0'/0/23041601` );

			expect( chatWalletBob ).not.toBeNull();
			//console.log( `chatWalletBob :`, chatWalletBob );
			//	    chatWalletBob : {
			//       isHD: true,
			//       mnemonic: 'retire inflict prevent believe question pipe rebel state visit little bind accuse',
			//       password: '',
			//       address: '0x36c87231ca15c85d1c22c9825654fb220449890f',
			//       publicKey: '0x02abb4068049ee215869217b322d5f4c505d345304574324a844cb71a33e8ae57b',
			//       privateKey: '0xcceab048c0c711adfaa105f686b0155242db537efa7f7989c358c2cebc9f12da',
			//       index: 23041601,
			//       path: "m/44'/60'/0'/0/23041601"
			//     }
			expect( chatWalletBob.isHD ).toBe( true );
			expect( chatWalletBob.isHD ).toBe( true );
			expect( chatWalletBob.address ).toBe( `0x36c87231ca15c85d1c22c9825654fb220449890f` );
			expect( chatWalletBob.publicKey ).toBe( `0x02abb4068049ee215869217b322d5f4c505d345304574324a844cb71a33e8ae57b` );
			expect( chatWalletBob.privateKey ).toBe( `0xcceab048c0c711adfaa105f686b0155242db537efa7f7989c358c2cebc9f12da` );
			expect( chatWalletBob.index ).toBe( 23041601 );
			expect( chatWalletBob.path ).toBe( `m/44'/60'/0'/0/23041601` );


			//
			//	send an encrypted message to Bob from Alice
			//
			const fromPrivateKey = chatWalletAlice.privateKey;
			const toPublicKey = chatWalletBob.publicKey;

			//	ECDH
			//	a key secure key exchange algorithm
			const signingKey = new ethers.SigningKey( fromPrivateKey );
			expect( signingKey ).not.toBeNull();

			const sharedSecret = signingKey.computeSharedSecret( toPublicKey );
			expect( sharedSecret ).toBe( `0x04ce426b7f7e8ba3f905880e17395e56b93670802a2328d0357239cc70c844675143ec18c32310820eb134d9bd6bb7557c84c6da20319c5c04a04a9703335f608f` )
			//console.log( `fromPrivateKey: `, fromPrivateKey );
			//	    fromPrivateKey:  0x7c0c63567803e67d74b59217f7cab9cb44a8747847585f52f317e72f092e5361
			//
			//console.log( `toPublicKey: `, toPublicKey );
			//	    toPublicKey:  0x02abb4068049ee215869217b322d5f4c505d345304574324a844cb71a33e8ae57b
			//
			//console.log( `sharedSecret: `, sharedSecret );
			//	    sharedSecret:  0x04ce426b7f7e8ba3f905880e17395e56b93670802a2328d0357239cc70c844675143ec18c32310820eb134d9bd6bb7557c84c6da20319c5c04a04a9703335f608f
			//

			const message = `hi, this is a greeting message from Alice.`;
			const encrypted : string = new AesCrypto().encrypt( message, sharedSecret );
			expect( encrypted ).toBe( `9dc9cca0fec4706922d00a9ab68fa12172529d46ba6dd9ff70f6422a71051cee795756dc30404dc79fac8303436dd436` );
			//console.log( `encrypted :`, encrypted );
			//	    encrypted : 9dc9cca0fec4706922d00a9ab68fa12172529d46ba6dd9ff70f6422a71051cee795756dc30404dc79fac8303436dd436
			//

			const decrypted : string = new AesCrypto().decrypt( encrypted, sharedSecret );
			expect( decrypted ).toBe( message );
		});

		it( "should send an encrypted message to Bob from Alice by the derived keys been created from private keys", async () =>
		{
			const privateKeyAlice = '0xf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a';
			const privateKeyBob = '0x794b0319ec5bececa8ca5d1ee2e07198aebb4cc6f3257069b739a86bb7edde8b';

			const walletObjAlice = new WalletFactory().createWalletFromPrivateKey( privateKeyAlice );
			const walletObjBob = new WalletFactory().createWalletFromPrivateKey( privateKeyBob );
			expect( walletObjAlice ).not.toBeNull();
			//console.log( `walletObjAlice :`, walletObjAlice );
			//	    walletObjAlice : {
			//       isHD: false,
			//       mnemonic: '',
			//       password: '',
			//       address: '0xc8f60eaf5988ac37a2963ac5fabe97f709d6b357',
			//       publicKey: '0x03ed2098910ab9068abd54e1562eb9dee3cb2d9fc1426dfe91541970a89b5aa622',
			//       privateKey: '0xf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a',
			//       index: 0,
			//       path: null
			//     }
			expect( walletObjAlice.isHD ).toBe( false );
			expect( walletObjAlice.address ).toBe( `0xc8f60eaf5988ac37a2963ac5fabe97f709d6b357` );
			expect( walletObjAlice.publicKey ).toBe( `0x03ed2098910ab9068abd54e1562eb9dee3cb2d9fc1426dfe91541970a89b5aa622` );
			expect( walletObjAlice.privateKey ).toBe( `0xf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a` );

			expect( walletObjBob ).not.toBeNull();
			//console.log( `walletObjBob :`, walletObjBob );
			//	    walletObjBob : {
			//       isHD: false,
			//       mnemonic: '',
			//       password: '',
			//       address: '0x95a93fb72a160a2c8c9181eefa3b56273600758a',
			//       publicKey: '0x0223e552b65526b686e92f0f8e8af7ef13fc66a7691eaa9864433e7c7b767f94a9',
			//       privateKey: '0x794b0319ec5bececa8ca5d1ee2e07198aebb4cc6f3257069b739a86bb7edde8b',
			//       index: 0,
			//       path: null
			//     }
			//
			expect( walletObjBob.isHD ).toBe( false );
			expect( walletObjBob.address ).toBe( `0x95a93fb72a160a2c8c9181eefa3b56273600758a` );
			expect( walletObjBob.publicKey ).toBe( `0x0223e552b65526b686e92f0f8e8af7ef13fc66a7691eaa9864433e7c7b767f94a9` );
			expect( walletObjBob.privateKey ).toBe( `0x794b0319ec5bececa8ca5d1ee2e07198aebb4cc6f3257069b739a86bb7edde8b` );

			const chatWalletAlice = new WalletFactory().deriveBusinessWallet( walletObjAlice );
			const chatWalletBob = new WalletFactory().deriveBusinessWallet( walletObjBob );

			expect( chatWalletAlice ).not.toBeNull();
			//console.log( `chatWalletAlice :`, chatWalletAlice );
			//	    chatWalletAlice : {
			//       isHD: false,
			//       mnemonic: '',
			//       password: '',
			//       address: '0xc8f60eaf5988ac37a2963ac5fabe97f709d6b357',
			//       publicKey: '0x03ed2098910ab9068abd54e1562eb9dee3cb2d9fc1426dfe91541970a89b5aa622',
			//       privateKey: '0xf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a',
			//       index: 0,
			//       path: null
			//     }
			expect( chatWalletAlice.isHD ).toBe( false );
			expect( chatWalletAlice.address ).toBe( `0xc8f60eaf5988ac37a2963ac5fabe97f709d6b357` );
			expect( chatWalletAlice.publicKey ).toBe( `0x03ed2098910ab9068abd54e1562eb9dee3cb2d9fc1426dfe91541970a89b5aa622` );
			expect( chatWalletAlice.privateKey ).toBe( `0xf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a` );
			expect( chatWalletAlice.index ).toBe( 0 );
			expect( chatWalletAlice.path ).toBe( null );

			expect( chatWalletBob ).not.toBeNull();
			//console.log( `chatWalletBob :`, chatWalletBob );
			//	    chatWalletBob : {
			//       isHD: false,
			//       mnemonic: '',
			//       password: '',
			//       address: '0x95a93fb72a160a2c8c9181eefa3b56273600758a',
			//       publicKey: '0x0223e552b65526b686e92f0f8e8af7ef13fc66a7691eaa9864433e7c7b767f94a9',
			//       privateKey: '0x794b0319ec5bececa8ca5d1ee2e07198aebb4cc6f3257069b739a86bb7edde8b',
			//       index: 0,
			//       path: null
			//     }
			//
			expect( chatWalletBob.isHD ).toBe( false );
			expect( chatWalletBob.address ).toBe( `0x95a93fb72a160a2c8c9181eefa3b56273600758a` );
			expect( chatWalletBob.publicKey ).toBe( `0x0223e552b65526b686e92f0f8e8af7ef13fc66a7691eaa9864433e7c7b767f94a9` );
			expect( chatWalletBob.privateKey ).toBe( `0x794b0319ec5bececa8ca5d1ee2e07198aebb4cc6f3257069b739a86bb7edde8b` );
			expect( chatWalletBob.index ).toBe( 0 );
			expect( chatWalletBob.path ).toBe( null );


			//
			//	send an encrypted message to Bob from Alice
			//
			const fromPrivateKey = chatWalletAlice.privateKey;
			const toPublicKey = chatWalletBob.publicKey;

			//	ECDH
			//	a key secure key exchange algorithm
			const signingKey = new ethers.SigningKey( fromPrivateKey );
			expect( signingKey ).not.toBeNull();

			const sharedSecret = signingKey.computeSharedSecret( toPublicKey );
			expect( sharedSecret ).toBe( `0x048a2a24d4d53dedc0080737207a104c09b65e82e0b456eef137543d0297fa8a984b1965eb0bb3398096ea569b1e79fe79c616b7e8f926ce072f03b7b64c05eca3` )
			//console.log( `fromPrivateKey: `, fromPrivateKey );
			//	    fromPrivateKey:  0xf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a
			//
			//console.log( `toPublicKey: `, toPublicKey );
			//	    toPublicKey:  0x0223e552b65526b686e92f0f8e8af7ef13fc66a7691eaa9864433e7c7b767f94a9
			//
			//console.log( `sharedSecret: `, sharedSecret );
			//	    sharedSecret:  0x048a2a24d4d53dedc0080737207a104c09b65e82e0b456eef137543d0297fa8a984b1965eb0bb3398096ea569b1e79fe79c616b7e8f926ce072f03b7b64c05eca3
			//

			const message = `hi, this is a greeting message from Alice.`;
			const encrypted : string = new AesCrypto().encrypt( message, sharedSecret );
			expect( encrypted ).toBe( `fb17b47f475794114a47bd44538b191d3d758ca746ea2cc021cb722d8a7b878ff8a229e23d0c31a1f6301d7a8961e126` );
			//console.log( `encrypted :`, encrypted );
			//	    encrypted : fb17b47f475794114a47bd44538b191d3d758ca746ea2cc021cb722d8a7b878ff8a229e23d0c31a1f6301d7a8961e126
			//

			const decrypted : string = new AesCrypto().decrypt( encrypted, sharedSecret );
			expect( decrypted ).toBe( message );
		});
	});
} );
