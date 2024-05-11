import { describe, expect } from '@jest/globals';
import { WalletStorageService } from "../../../../src";
import { WalletEntityItem } from "../../../../src";
import { TypeUtil } from "../../../../src/utils/TypeUtil";
import { SysUserStorageService } from "../../../../src/services/storage/SysUserStorageService";


/**
 *	unit test
 */
describe( "WalletStorageService", () =>
{
	beforeAll( async () =>
	{
	});
	afterAll( async () =>
	{
	});

	describe( "Test getting and saving one object", () =>
	{
		const walletStorage = new WalletStorageService( `my password` );
		let walletAddress = walletStorage.generateRandomWalletAddress();
		//
		//	should output:
		//	walletAddress: 0x74F00069E4940a4009A6eF28890D6D877bb0E2a3
		//
		//console.log( `walletAddress: ${ walletAddress }` );

		//	will output: 0xPZ465gonNLd5VGMbRpgpT2ptzd3Ff5Udh7i6cXQUMY8hfTwTD
		//console.log( walletAddress );

		it( "should save a WalletEntityItem object to indexedDB database", async () =>
		{
			const item : WalletEntityItem = {
				name: 'My-First-Wallet',
				address: walletAddress,	//	address of wallet
				chainId: 5,		//	Ethereum Goerli Testnet
				pinCode: '1234',
				privateKey: '0x948427c37d662bde57c4d8765da63a87083186149ac6040b976a3ebb99876533',
				publicKey: 'public key',
				mnemonic: 'lab ball helmet sure replace gauge size rescue radar cluster remember twenty',
				isHD: false,		//	HD wallet?
				password: '11111',	//	The password of the wallet, used to encrypt mnemonic and privateKey. If password is not empty, mnemonic and privateKey should be ciphertext
				index: 0,		//	The index of the generated wallet address. For non-HD wallets, the index will always be 0
				path: '',		//	Wallet path. For non-HD wallets, the path is empty
			};
			const key : string | null = walletStorage.getKeyByItem( item );
			expect( key ).toBeDefined();
			expect( TypeUtil.isNotEmptyString( key ) ).toBeTruthy();
			if ( key && TypeUtil.isNotEmptyString( key ) )
			{
				const saved : boolean = await walletStorage.put( key, item );
				const itemKey : string | null = walletStorage.getKeyByItem( item );
				expect( itemKey ).toBeDefined();
				expect( TypeUtil.isNotEmptyString( itemKey ) ).toBeTruthy();
				if ( itemKey && TypeUtil.isNotEmptyString( itemKey ) )
				{
					const value : WalletEntityItem | null = await walletStorage.get( itemKey );
					expect( value ).not.toBeNull();
					expect( value ).toHaveProperty( 'name' );
					expect( value?.name ).toBe( item.name );
					expect( value?.address ).toBe( item.address );
					expect( value?.chainId ).toBe( item.chainId );
					expect( value?.pinCode ).toBe( item.pinCode );
					expect( value?.privateKey ).toBe( item.privateKey );
					expect( value?.publicKey ).toBe( item.publicKey );
					expect( value?.mnemonic ).toBe( item.mnemonic );
					expect( value?.isHD ).toBe( item.isHD );
					expect( value?.password ).toBe( item.password );
					expect( value?.index ).toBe( item.index );
					expect( value?.path ).toBe( item.path );
				}
			}
		});
		it( "should delete the object just saved", async () =>
		{
			const deleted : boolean = await walletStorage.delete( walletAddress );

			expect( deleted ).toBeTruthy();
		});
	} );

	describe( "Test multiple objects", () =>
	{
		const walletStorage = new WalletStorageService( `my password` );
		let walletAddress : Array<string> = [];
		for ( let i = 0; i < 5; i ++ )
		{
			walletAddress.push( walletStorage.generateRandomWalletAddress() );
		}

		it( "should save multiple WalletEntityItem objects to indexedDB database", async () =>
		{
			await walletStorage.clear();

			for ( let i = 0; i < walletAddress.length; i ++ )
			{
				const item : WalletEntityItem = {
					name: `My-First-Wallet-${ i }`,
					address: walletAddress[ i ],	//	address of wallet
					chainId: 5,		//	Ethereum Goerli Testnet
					pinCode: '1234',
					privateKey: 'private key',
					publicKey: 'public key',
					mnemonic: 'lab ball helmet sure replace gauge size rescue radar cluster remember twenty',
					isHD: false,		//	HD wallet?
					password: '11111',	//	The password of the wallet, used to encrypt mnemonic and privateKey. If password is not empty, mnemonic and privateKey should be ciphertext
					index: 0,		//	The index of the generated wallet address. For non-HD wallets, the index will always be 0
					path: '',		//	Wallet path. For non-HD wallets, the path is empty
				};
				const key : string | null = walletStorage.getKeyByItem( item );
				expect( key ).toBeDefined();
				expect( TypeUtil.isNotEmptyString( key ) ).toBeTruthy();
				if ( key && TypeUtil.isNotEmptyString( key ) )
				{
					const saved : boolean = await walletStorage.put( key, item );
					expect( saved ).toBeDefined();
				}
			}
		});

		it( "should query the first WalletEntityItem objects from indexedDB database", async () =>
		{
			await walletStorage.clear();

			for ( let i = 0; i < walletAddress.length; i ++ )
			{
				const item : WalletEntityItem = {
					name: `My-First-Wallet-${ i }`,
					address: walletAddress[ i ],	//	address of wallet
					chainId: 5,		//	Ethereum Goerli Testnet
					pinCode: '1234',
					privateKey: 'private key',
					publicKey: 'public key',
					mnemonic: 'lab ball helmet sure replace gauge size rescue radar cluster remember twenty',
					isHD: false,		//	HD wallet?
					password: '11111',	//	The password of the wallet, used to encrypt mnemonic and privateKey. If password is not empty, mnemonic and privateKey should be ciphertext
					index: 0,		//	The index of the generated wallet address. For non-HD wallets, the index will always be 0
					path: '',		//	Wallet path. For non-HD wallets, the path is empty
				};
				const key : string | null = walletStorage.getKeyByItem( item );
				expect( key ).toBeDefined();
				expect( TypeUtil.isNotEmptyString( key ) ).toBeTruthy();
				if ( key && TypeUtil.isNotEmptyString( key ) )
				{
					const saved : boolean = await walletStorage.put( key, item );
					expect( saved ).toBeDefined();
				}
			}

			//	...
			const value : WalletEntityItem | null = await walletStorage.getFirst();
			expect( value ).toHaveProperty( 'name' );
			expect( value ).toHaveProperty( 'address' );
			expect( value ).toHaveProperty( 'chainId' );
			expect( value ).toHaveProperty( 'pinCode' );
			expect( value ).toHaveProperty( 'privateKey' );
			expect( value ).toHaveProperty( 'publicKey' );
			expect( value ).toHaveProperty( 'mnemonic' );
		});

		it( "should query all the key of WalletEntityItem objects from indexedDB database", async () =>
		{
			await walletStorage.clear();

			for ( let i = 0; i < walletAddress.length; i ++ )
			{
				const item : WalletEntityItem = {
					name: `My-First-Wallet-${ i }`,
					address: walletAddress[ i ],	//	address of wallet
					chainId: 5,		//	Ethereum Goerli Testnet
					pinCode: '1234',
					privateKey: 'private key',
					publicKey: 'public key',
					mnemonic: 'lab ball helmet sure replace gauge size rescue radar cluster remember twenty',
					isHD: false,		//	HD wallet?
					password: '11111',	//	The password of the wallet, used to encrypt mnemonic and privateKey. If password is not empty, mnemonic and privateKey should be ciphertext
					index: 0,		//	The index of the generated wallet address. For non-HD wallets, the index will always be 0
					path: '',		//	Wallet path. For non-HD wallets, the path is empty
				};
				const key : string | null = walletStorage.getKeyByItem( item );
				expect( key ).toBeDefined();
				expect( TypeUtil.isNotEmptyString( key ) ).toBeTruthy();
				if ( key && TypeUtil.isNotEmptyString( key ) )
				{
					const saved : boolean = await walletStorage.put( key, item );
					expect( saved ).toBeDefined();
				}
			}

			//	...
			const queryKeys : Array<string> | null = await walletStorage.getAllKeys();

			expect( Array.isArray( queryKeys ) ).toBeTruthy();
			expect( queryKeys ).toHaveLength( walletAddress.length );
			if ( queryKeys )
			{
				for ( const key of queryKeys )
				{
					expect( walletAddress.includes( key ) ).toBeTruthy();
				}
			}
		});

		it( "should query all WalletEntityItem objects from indexedDB database", async () =>
		{
			await walletStorage.clear();

			for ( let i = 0; i < walletAddress.length; i ++ )
			{
				const item : WalletEntityItem = {
					isHD: false,			//	HD wallet?
					mnemonic: 'lab ball helmet sure replace gauge size rescue radar cluster remember twenty',
					password: '123123',		//	The password of the wallet, used to encrypt mnemonic and privateKey. If password is not empty, mnemonic and privateKey should be ciphertext
					address: walletAddress[ i ],	//	address of wallet
					privateKey: 'private key',
					publicKey: 'public key',
					index: 0,		//	The index of the generated wallet address. For non-HD wallets, the index will always be 0
					path: '',		//	Wallet path. For non-HD wallets, the path is empty
					depth: 0,
					fingerprint: '',
					parentFingerprint: '',
					chainCode: '',
					name: `My-First-Wallet-${ i }`,
					chainId: 5,		//	Ethereum Goerli Testnet
					pinCode: '1234',
					remark: '',
					avatar: 'https://sss',
					freePayment: false,
				};
				const key : string | null = walletStorage.getKeyByItem( item );
				expect( key ).toBeDefined();
				expect( TypeUtil.isNotEmptyString( key ) ).toBeTruthy();
				if ( key && TypeUtil.isNotEmptyString( key ) )
				{
					const saved : boolean = await walletStorage.put( key, item );
					expect( saved ).toBeDefined();
				}
			}

			//	...
			const items : Array<WalletEntityItem | null> | null = await walletStorage.getAll();
			expect( Array.isArray( items ) ).toBeTruthy();
			expect( items ).toHaveLength( 5 );
			if ( Array.isArray( items ) )
			{
				for ( let i = 0; i < items.length; i ++ )
				{
					expect( items[ i ] ).toHaveProperty( 'isHD' );
					expect( items[ i ] ).toHaveProperty( 'mnemonic' );
					expect( items[ i ] ).toHaveProperty( 'password' );
					expect( items[ i ] ).toHaveProperty( 'address' );
					expect( items[ i ] ).toHaveProperty( 'privateKey' );
					expect( items[ i ] ).toHaveProperty( 'publicKey' );
					expect( items[ i ] ).toHaveProperty( 'index' );
					expect( items[ i ] ).toHaveProperty( 'path' );
					expect( items[ i ] ).toHaveProperty( 'depth' );
					expect( items[ i ] ).toHaveProperty( 'fingerprint' );
					expect( items[ i ] ).toHaveProperty( 'parentFingerprint' );
					expect( items[ i ] ).toHaveProperty( 'chainCode' );
					expect( items[ i ] ).toHaveProperty( 'name' );
					expect( items[ i ] ).toHaveProperty( 'chainId' );
					expect( items[ i ] ).toHaveProperty( 'pinCode' );
					expect( items[ i ] ).toHaveProperty( 'remark' );
					expect( items[ i ] ).toHaveProperty( 'avatar' );
					expect( items[ i ] ).toHaveProperty( 'freePayment' );
				}
			}
		});
	});
} );
