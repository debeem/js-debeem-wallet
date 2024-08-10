import { describe, expect } from '@jest/globals';
import { SysUserItem, SysUserStorageService, WalletStorageService } from "../../../../src";
import { WalletEntityItem } from "../../../../src";
import { testUserList, testWalletObjList } from "../../../../src/configs/TestConfig";
import _ from "lodash";
import { getCurrentWalletAsync, initWalletAsync, putCurrentWalletAsync } from "../../../../src";
import { EtherWallet, TWalletBaseItem } from "debeem-id";
import { VaWalletEntity } from "../../../../src/validators/VaWalletEntity";
import { EncryptedStorageOptions } from "../../../../src/models/StorageModels";


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

	describe( "WalletEntity Items", () =>
	{
		it ( "should return true for a complete object", async () =>
		{
			const valid : string | null = VaWalletEntity.validateWalletEntityBaseItem( testWalletObjList.alice );
			expect( valid ).toBeNull();
		});

		it ( "should return true, by checking .mnemonic", async () =>
		{
			//
			//	{
			// 		isHD : true,
			// 		mnemonic : walletObj?.mnemonic?.phrase,
			// 		password : '',
			// 		address : walletObj?.address,
			// 		publicKey : walletObj?.publicKey,
			// 		privateKey : walletObj?.privateKey,
			// 		index : walletObj?.index,
			// 		path : walletObj?.path
			// 	}
			//
			expect( VaWalletEntity.validateWalletEntityBaseItem( {
				...testWalletObjList.alice,
				mnemonic : undefined
			} ) ).toBeNull();
			expect( VaWalletEntity.validateWalletEntityBaseItem( {
				...testWalletObjList.alice,
				mnemonic : ``
			} ) ).toBeNull();

			const error1 : string | null = VaWalletEntity.validateWalletEntityBaseItem( {
				...testWalletObjList.alice,
				mnemonic : null
			} );
			expect( error1 ).toBe( `invalid walletEntityBaseItem.mnemonic` );
		});

		it ( "should return true, by checking .password", async () =>
		{
			//
			//	{
			// 		isHD : true,
			// 		mnemonic : walletObj?.mnemonic?.phrase,
			// 		password : '',
			// 		address : walletObj?.address,
			// 		publicKey : walletObj?.publicKey,
			// 		privateKey : walletObj?.privateKey,
			// 		index : walletObj?.index,
			// 		path : walletObj?.path
			// 	}
			//
			const error1 : string | null = VaWalletEntity.validateWalletEntityBaseItem( {
				...testWalletObjList.alice,
				password : undefined
			} );
			expect( error1 ).toBe( `invalid walletEntityBaseItem.password` );

			const error2 : string | null = VaWalletEntity.validateWalletEntityBaseItem( {
				...testWalletObjList.alice,
				password : null
			} );
			expect( error2 ).toBe( `invalid walletEntityBaseItem.password` );

			const error3 : string | null = VaWalletEntity.validateWalletEntityBaseItem( {
				...testWalletObjList.alice,
				password : ``
			} );
			expect( error3 ).toBe( null );
		});
	});

	describe( "Test getting and saving one object", () =>
	{
		const walletObject = testWalletObjList.alice;
		const pinCode = `123456`;

		it( "should throw `invalid currentWallet`", async () =>
		{
			try
			{
				const walletStorage = new WalletStorageService( pinCode );
				const item : WalletEntityItem = {
					...walletObject,
					name: 'My-First-Wallet',
					chainId: 1,
					pinCode: ``,
				};
				const key : string | null = walletStorage.getKeyByItem( item );
				expect( key ).toBeDefined();
				expect( _.isString( key ) ).toBeTruthy();
				expect( ! _.isEmpty( key ) ).toBeTruthy();
				if ( key )
				{
					await walletStorage.put( key, item );
				}

				//	do not go here
				expect( true ).toBeFalsy();
			}
			catch ( err )
			{
				//console.log( err )
				const errorText = err as string;
				expect( _.isString( errorText ) ).toBeTruthy();
				expect( errorText ).toBe( `SysUserStorageService.extractPassword :: invalid wallet address` );
			}
		});

		it( "should throw `invalid pinCode`", async () =>
		{
			try
			{
				await putCurrentWalletAsync( walletObject.address );
				const walletStorage = new WalletStorageService( pinCode );
				const item : WalletEntityItem = {
					...walletObject,
					name: 'My-First-Wallet',
					chainId: 1,
					pinCode: ``,
				};
				const key : string | null = walletStorage.getKeyByItem( item );
				expect( key ).toBeDefined();
				expect( _.isString( key ) ).toBeTruthy();
				expect( ! _.isEmpty( key ) ).toBeTruthy();
				if ( key )
				{
					await walletStorage.put( key, item );
				}

				//	do not go here
				expect( true ).toBeFalsy();
			}
			catch ( err )
			{
				const errorText = err as string;
				expect( _.isString( errorText ) ).toBeTruthy();
				expect( errorText ).toBe( `WalletStorageService :: invalid pinCode or privateKey` );
			}
		});

		it( "should create a user using initWalletAsync", async () =>
		{
			const walletName = `MyWallet`;
			const chainId = 1;
			const toBeCreatedWalletItem : WalletEntityItem = {
				...walletObject,
				name : walletName,
				chainId : chainId,
				pinCode : ``
			};
			const created : boolean = await initWalletAsync( toBeCreatedWalletItem, pinCode, true );
			expect( created ).toBeTruthy();

			//
			//	query info
			//
			const walletStorage = new WalletStorageService( pinCode );
			const itemKey : string | null = walletStorage.getKeyByItem( walletObject );
			expect( itemKey ).toBeDefined();
			expect( _.isString( itemKey ) ).toBeTruthy();
			expect( ! _.isEmpty( itemKey ) ).toBeTruthy();
			if ( itemKey )
			{
				const value : WalletEntityItem | null = await walletStorage.get( itemKey );
				expect( value ).not.toBeNull();
				expect( value ).toHaveProperty( 'name' );
				expect( value?.name ).toBe( toBeCreatedWalletItem.name );
				expect( value?.address ).toBe( toBeCreatedWalletItem.address );
				expect( value?.chainId ).toBe( toBeCreatedWalletItem.chainId );
				expect( value?.pinCode ).toBe( toBeCreatedWalletItem.pinCode );
				expect( value?.privateKey ).toBe( toBeCreatedWalletItem.privateKey );
				expect( value?.publicKey ).toBe( toBeCreatedWalletItem.publicKey );
				expect( value?.mnemonic ).toBe( toBeCreatedWalletItem.mnemonic );
				expect( value?.isHD ).toBe( toBeCreatedWalletItem.isHD );
				expect( value?.password ).toBe( toBeCreatedWalletItem.password );
				expect( value?.index ).toBe( toBeCreatedWalletItem.index );
				expect( value?.path ).toBe( toBeCreatedWalletItem.path );
			}
		});


		it( "should fail to obtain wallet info by a incorrect PIN Code ", async () =>
		{
			const walletName = `MyWallet`;
			const chainId = 1;
			const toBeCreatedWalletItem : WalletEntityItem = {
				...walletObject,
				name : walletName,
				chainId : chainId,
				pinCode : ``
			};
			const created : boolean = await initWalletAsync( toBeCreatedWalletItem, pinCode, true );
			expect( created ).toBeTruthy();

			try
			{
				//
				//	query info
				//
				const incorrectPinCode = `889999`;
				const walletStorage = new WalletStorageService( incorrectPinCode );
				const itemKey : string | null = walletStorage.getKeyByItem( walletObject );
				expect( itemKey ).toBeDefined();
				expect( _.isString( itemKey ) ).toBeTruthy();
				expect( ! _.isEmpty( itemKey ) ).toBeTruthy();
				if ( itemKey )
				{
					//	exception thrown here
					const value : WalletEntityItem | null = await walletStorage.get( itemKey );

					//	not go here
					expect( value ).not.toBeNull();
				}
			}
			catch ( err )
			{
				const errorText = err as string;
				expect( _.isString( errorText ) ).toBeTruthy();
				expect( errorText ).toBe( `WalletStorageService :: invalid pinCode or privateKey` );
			}
		});

		it( "should save a WalletEntityItem using initWalletAsync", async () =>
		{
			const walletName = `MyWallet`;
			const chainId = 1;
			const toBeCreatedWalletItem : WalletEntityItem = {
				...walletObject,
				name : walletName,
				chainId : chainId,
				pinCode : ``
			};
			const created : boolean = await initWalletAsync( toBeCreatedWalletItem, pinCode, true );
			expect( created ).toBeTruthy();

			//
			//	query info
			//
			const walletStorage = new WalletStorageService( pinCode );
			const itemKey : string | null = walletStorage.getKeyByItem( walletObject );
			expect( itemKey ).toBeDefined();
			expect( _.isString( itemKey ) ).toBeTruthy();
			expect( ! _.isEmpty( itemKey ) ).toBeTruthy();
			if ( itemKey )
			{
				const value : WalletEntityItem | null = await walletStorage.get( itemKey );
				expect( value ).not.toBeNull();
				expect( value ).toHaveProperty( 'name' );
				expect( value?.name ).toBe( toBeCreatedWalletItem.name );
				expect( value?.address ).toBe( toBeCreatedWalletItem.address );
				expect( value?.chainId ).toBe( toBeCreatedWalletItem.chainId );
				expect( value?.pinCode ).toBe( toBeCreatedWalletItem.pinCode );
				expect( value?.privateKey ).toBe( toBeCreatedWalletItem.privateKey );
				expect( value?.publicKey ).toBe( toBeCreatedWalletItem.publicKey );
				expect( value?.mnemonic ).toBe( toBeCreatedWalletItem.mnemonic );
				expect( value?.isHD ).toBe( toBeCreatedWalletItem.isHD );
				expect( value?.password ).toBe( toBeCreatedWalletItem.password );
				expect( value?.index ).toBe( toBeCreatedWalletItem.index );
				expect( value?.path ).toBe( toBeCreatedWalletItem.path );
			}
		});


		it( "should delete a WalletEntityItem just saved", async () =>
		{
			const walletName = `MyWallet`;
			const chainId = 1;
			const toBeCreatedWalletItem : WalletEntityItem = {
				...walletObject,
				name : walletName,
				chainId : chainId,
				pinCode : ``
			};
			const created : boolean = await initWalletAsync( toBeCreatedWalletItem, pinCode, true );
			expect( created ).toBeTruthy();

			const walletStorage = new WalletStorageService( pinCode );
			const itemKey : string | null = walletStorage.getKeyByItem( walletObject );
			expect( itemKey ).toBeDefined();
			expect( _.isString( itemKey ) ).toBeTruthy();
			expect( ! _.isEmpty( itemKey ) ).toBeTruthy();
			if ( itemKey )
			{
				const deleted : boolean = await walletStorage.delete( itemKey );
				expect( deleted ).toBeTruthy();

				const value : WalletEntityItem | null = await walletStorage.get( itemKey );
				expect( value ).toBeNull();
			}
			else
			{
				//	not go here
				expect( true ).toBeFalsy();
			}
		});
	} );

	describe( "Test multiple objects", () =>
	{
		const pinCode = `123456`;
		let walletStorage !: WalletStorageService;

		let lastWalletObject !: TWalletBaseItem;
		let lastPinCode = ``;

		it( "should clear all users", async () =>
		{
			const walletObject = testWalletObjList.alice;
			const walletName = `MyWallet`;
			const chainId = 1;
			const toBeCreatedWalletItem : WalletEntityItem = {
				...walletObject,
				name : walletName,
				chainId : chainId,
				pinCode : ``
			};
			const created : boolean = await initWalletAsync( toBeCreatedWalletItem, pinCode, true );
			expect( created ).toBeTruthy();

			walletStorage = new WalletStorageService( pinCode );
			const allKeys1 : Array<string> = await walletStorage.getAllKeys();
			expect( Array.isArray( allKeys1 ) ).toBeTruthy();
			expect( allKeys1.length ).toBeGreaterThan( 0 );

			//	should clear all users
			await walletStorage.clear();

			const allKeys2 : Array<string> = await walletStorage.getAllKeys();
			expect( Array.isArray( allKeys2 ) ).toBeTruthy();
			expect( allKeys2.length ).toBe( 0 );
		});

		it( "should create Bob and Mary", async () =>
		{
			//	create 2 users
			expect( testUserList.length ).toBeGreaterThan( 0 );
			for ( let i = 1; i < testUserList.length; i ++ )
			{
				const testUser = testUserList[ i ];
				lastWalletObject = testUser.walletObj;
				lastPinCode = `12345${ i }`;
				const walletName = `MyWallet`;
				const chainId = 1;
				const toBeCreatedWalletItem : WalletEntityItem = {
					...lastWalletObject,
					name : walletName,
					chainId : chainId,
					pinCode : ``
				};
				const created : boolean = await initWalletAsync( toBeCreatedWalletItem, lastPinCode, true );
				expect( created ).toBeTruthy();

				const loopWalletStorage = new WalletStorageService( lastPinCode );
				const itemKey : string | null = loopWalletStorage.getKeyByItem( lastWalletObject );
				expect( itemKey ).not.toBeNull();
				expect( _.isString( itemKey ) ).toBeTruthy();
				expect( ! _.isEmpty( itemKey ) ).toBeTruthy();
				if ( itemKey )
				{
					const value : WalletEntityItem | null = await loopWalletStorage.get( itemKey );
					expect( value ).not.toBeNull();
				}
				else
				{
					//	not go here
					expect( true ).toBeFalsy();
				}
			}
		});

		it( "should unable to read wallets encrypted by other private keys", async () =>
		{
			const allKeys3 : Array<string> = await walletStorage.getAllKeys();
			//console.log( `allKeys3 :`, allKeys3 );
			expect( Array.isArray( allKeys3 ) ).toBeTruthy();
			expect( allKeys3.length ).toBeGreaterThan( 0 );
			for ( const wKey of allKeys3 )
			{
				const value : WalletEntityItem | null = await walletStorage.get( wKey );
				expect( value ).toBeNull();
			}
		});

		it( "should return the walletItem with lastWalletObject and lastPinCode", async () =>
		{
			//	should return the last user
			const lastWalletStorage = new WalletStorageService( lastPinCode );
			const lastKey = lastWalletStorage.getKeyByItem( lastWalletObject );
			expect( lastKey ).not.toBeNull();
			if ( lastKey )
			{
				const lastSavedWalletItem = await lastWalletStorage.get( lastKey );
				expect( lastSavedWalletItem ).not.toBeNull();
				//console.log( `lastSavedWalletItem`, lastSavedWalletItem )
			}
		});

		it( "should return the walletItem by .getByCurrentWallet", async () =>
		{
			//	...
			const walletItemByCurrentWallet = await new WalletStorageService( lastPinCode ).getByCurrentWallet();
			expect( walletItemByCurrentWallet ).not.toBeNull();
			//console.log( walletItemByCurrentWallet )
			//	{
			//       isHD: true,
			//       mnemonic: 'electric shoot legal trial crane rib garlic claw armed snow blind advance',
			//       password: '',
			//       address: '0xc4321e386bbc48692b49ec4230034ea78d2a5b55',
			//       publicKey: '0x031e3440eb90788bedd955398a039d75ee3ade799d13a48eafe5f20b009cd8bace',
			//       privateKey: '0xd449e4bb488ca6050beb042f4478214a0fc063aa9ea7c0d865c3813367805e1e',
			//       index: 0,
			//       path: "m/44'/60'/0'/0/0",
			//       name: 'MyWallet',
			//       chainId: 1,
			//       pinCode: ''
			//     }
		});

		it( "should delete the walletItem with a key given by .getByCurrentWallet", async () =>
		{
			const currentWallet = await getCurrentWalletAsync();
			expect( currentWallet ).not.toBeNull();

			//	...
			const walletStorage = new WalletStorageService( lastPinCode );

			//	...
			const walletItemByCurrentWallet = await walletStorage.getByCurrentWallet();
			expect( walletItemByCurrentWallet ).not.toBeNull();

			if ( currentWallet )
			{
				await walletStorage.delete( currentWallet );
			}

			const walletItemByCurrentWallet2 = await walletStorage.getByCurrentWallet();
			expect( walletItemByCurrentWallet2 ).toBeNull();
		});
	});

	describe( "Switching between multiple wallets", () =>
	{
		const pinCodeAlice = `123456`;
		const walletNameAlice = `Alice's Wallet`;

		const pinCodeBob = `888888`;
		const walletNameBob = `Bob's Wallet`;


		it( "should create a wallet for Alice", async () =>
		{
			const walletObject = testWalletObjList.alice;
			const chainId = 1;
			const walletItem : WalletEntityItem = {
				...walletObject,
				name : walletNameAlice,
				chainId : chainId,
				pinCode : ``
			};
			const created : boolean = await initWalletAsync( walletItem, pinCodeAlice, true );
			expect( created ).toBeTruthy();
		});

		it( "should create a wallet for Bob", async () =>
		{
			const walletObject = testWalletObjList.bob;
			const chainId = 1;
			const walletItem : WalletEntityItem = {
				...walletObject,
				name : walletNameBob,
				chainId : chainId,
				pinCode : ``
			};
			const created : boolean = await initWalletAsync( walletItem, pinCodeBob, true );
			expect( created ).toBeTruthy();
		});

		it( "should return Alice's wallet object, after switching to", async () =>
		{
			await putCurrentWalletAsync( testWalletObjList.alice.address );

			const walletStorage = new WalletStorageService( pinCodeAlice );
			const walletItem = await walletStorage.getByCurrentWallet();
			//console.log( walletItem );
			//	{
			//       isHD: true,
			//       mnemonic: 'olympic cradle tragic crucial exit annual silly cloth scale fine gesture ancient',
			//       password: '',
			//       address: '0xc8f60eaf5988ac37a2963ac5fabe97f709d6b357',
			//       publicKey: '0x03ed2098910ab9068abd54e1562eb9dee3cb2d9fc1426dfe91541970a89b5aa622',
			//       privateKey: '0xf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a',
			//       index: 0,
			//       path: "m/44'/60'/0'/0/0",
			//       name: "Alice's Wallet",
			//       chainId: 1,
			//       pinCode: ''
			//     }
			expect( walletItem ).not.toBeNull();
			if ( walletItem )
			{
				expect( walletItem.address ).toBe( testWalletObjList.alice.address.trim().toLowerCase() );
				expect( walletItem.mnemonic ).toBe( testWalletObjList.alice.mnemonic );
				expect( walletItem.privateKey ).toBe( testWalletObjList.alice.privateKey );
				expect( walletItem.publicKey ).toBe( testWalletObjList.alice.publicKey );
				expect( walletItem.name ).toBe( walletNameAlice );
				expect( walletItem.pinCode ).toBe( `` );
			}
		});

		it( "should throw `invalid pinCode` while reading Bob's wallet with Alice's PIN code", async () =>
		{
			await putCurrentWalletAsync( testWalletObjList.bob.address );

			try
			{
				const walletStorage = new WalletStorageService( pinCodeAlice );
				const walletItem = await walletStorage.getByCurrentWallet();
				expect( walletItem ).not.toBeNull();
				expect( true ).toBeFalsy();
			}
			catch ( err )
			{
				const errorText = err as string;
				expect( _.isString( errorText ) ).toBeTruthy();
				expect( errorText ).toBe( `WalletStorageService :: invalid pinCode or privateKey` );
			}
		});

		it( "should return Bob's wallet object, after switching to", async () =>
		{
			await putCurrentWalletAsync( testWalletObjList.bob.address );

			const walletStorage = new WalletStorageService( pinCodeBob );
			const walletItem = await walletStorage.getByCurrentWallet();
			//console.log( walletItem );
			//	{
			//       isHD: true,
			//       mnemonic: 'evidence cement snap basket genre fantasy degree ability sunset pistol palace target',
			//       password: '',
			//       address: '0xcbb8f66676737f0423bdda7bb1d8b84fc3c257e8',
			//       publicKey: '0x02fc39345f9e415b421bd06c02f648be13c334b3ec4ab33b2d2437a00d6d7b01cc',
			//       privateKey: '0x2f246e9d20d984e51800e758def8d99f314f6d1c680277dcc2c0060e4b43dfa3',
			//       index: 0,
			//       path: "m/44'/60'/0'/0/0",
			//       name: "Bob's Wallet",
			//       chainId: 1,
			//       pinCode: ''
			//     }
			expect( walletItem ).not.toBeNull();
			if ( walletItem )
			{
				expect( walletItem.address ).toBe( testWalletObjList.bob.address.trim().toLowerCase() );
				expect( walletItem.mnemonic ).toBe( testWalletObjList.bob.mnemonic );
				expect( walletItem.privateKey ).toBe( testWalletObjList.bob.privateKey );
				expect( walletItem.publicKey ).toBe( testWalletObjList.bob.publicKey );
				expect( walletItem.name ).toBe( walletNameBob );
				expect( walletItem.pinCode ).toBe( `` );
			}
		});

	});

	describe( "Decrypt wallet item using privateKey", () =>
	{
		it( "should decrypt an encrypted wallet data using privateKey", async () =>
		{
			//
			//	step 1
			//	create an account and save it into the local database
			//
			const walletObject = testWalletObjList.alice;
			const walletName = `MyWallet`;
			const pinCode = `123456`;
			const chainId = 1;
			const toBeCreatedWalletItem : WalletEntityItem = {
				...walletObject,
				name : walletName,
				chainId : chainId,
				pinCode : ``
			};
			const created : boolean = await initWalletAsync( toBeCreatedWalletItem, pinCode, true );
			expect( created ).toBeTruthy();

			//
			//	step 2
			//	instantiate an encrypted wallet storage using private key
			//
			const encryptedStorageOptions1 : EncryptedStorageOptions = {
				address : walletObject.address,
				privateKey : walletObject.privateKey
			};
			const walletStorage : WalletStorageService = new WalletStorageService( undefined, encryptedStorageOptions1 );
			const allKeys1 : Array<string> = await walletStorage.getAllKeys();
			expect( Array.isArray( allKeys1 ) ).toBeTruthy();
			expect( allKeys1.length ).toBeGreaterThan( 0 );

			//
			//	step 3
			//	query wallet object by a wallet address
			//
			const encryptedWalletObj : WalletEntityItem | null = await walletStorage.getByWallet( toBeCreatedWalletItem.address );
			expect( encryptedWalletObj ).not.toBeNull();
			expect( EtherWallet.isValidWalletFactoryData( encryptedWalletObj ) ).toBeTruthy();
			expect( encryptedWalletObj ).toHaveProperty( 'name' );
			expect( encryptedWalletObj?.name ).toBe( toBeCreatedWalletItem.name );
			expect( encryptedWalletObj?.address ).toBe( toBeCreatedWalletItem.address );
			expect( encryptedWalletObj?.chainId ).toBe( toBeCreatedWalletItem.chainId );
			expect( encryptedWalletObj?.pinCode ).toBe( toBeCreatedWalletItem.pinCode );
			expect( encryptedWalletObj?.privateKey ).toBe( toBeCreatedWalletItem.privateKey );
			expect( encryptedWalletObj?.publicKey ).toBe( toBeCreatedWalletItem.publicKey );
			expect( encryptedWalletObj?.mnemonic ).toBe( toBeCreatedWalletItem.mnemonic );
			expect( encryptedWalletObj?.isHD ).toBe( toBeCreatedWalletItem.isHD );
			expect( encryptedWalletObj?.password ).toBe( toBeCreatedWalletItem.password );
			expect( encryptedWalletObj?.index ).toBe( toBeCreatedWalletItem.index );
			expect( encryptedWalletObj?.path ).toBe( toBeCreatedWalletItem.path );
		});
	});

	describe( "List all wallets, modify wallet names", () =>
	{
		it( "should return all encrypted wallets", async () =>
		{
			//
			//	create two accounts, Alice and Bob
			//
			const pinCode = `123456`;
			const chainId = 1;
			const walletItemAlice : WalletEntityItem = {
				...testWalletObjList.alice,
				name : `AliceWallet`,
				chainId : chainId,
				pinCode : ``
			};
			const createdAlice : boolean = await initWalletAsync( walletItemAlice, pinCode, true );
			expect( createdAlice ).toBeTruthy();

			//	...
			const walletItemBob : WalletEntityItem = {
				...testWalletObjList.bob,
				name : `BobWallet`,
				chainId : chainId,
				pinCode : ``
			};
			const createdBob : boolean = await initWalletAsync( walletItemBob, pinCode, true );
			expect( createdBob ).toBeTruthy();

			//
			//	read all users
			//
			const sysUserStorageService = new SysUserStorageService();
			const allUsers : Array<SysUserItem | null> = await sysUserStorageService.getAll();
			expect( Array.isArray( allUsers ) ).toBeTruthy();
			expect( allUsers.length ).toBeGreaterThanOrEqual( 2 );
			//console.log( `allUsers :`, allUsers );
			//	allUsers : [
			//       {
			//         timestamp: 1723281491439,
			//         name: 'AliceWallet',
			//         wallet: '0xc8f60eaf5988ac37a2963ac5fabe97f709d6b357',
			//         password: 'f9758a2200a6d69b3137ba4510c425538862a81e98b271de1081f8dd9223b7a8c6df182fb9d641432f2a1499f6cb6c32f65150bd571abb31efada5fa317406b45d01b666f41a9b99db8a91f28a34a7e3',
			//         hash: '0x7669c6b6c5d1be59f06d327caf5eb09a3001e1ff721cf1e31cf78ad690347bb6',
			//         sig: '0x4e40434b91cd84da8f78be631ae926f881d6ad6963d19d8ba1e996041de411711e2fabff12d06d52cb45dfe9bc216c605084b76e39a81cf08a9467585d4d670a1b'
			//       },
			//       {
			//         timestamp: 1723281491462,
			//         name: 'BobWallet',
			//         wallet: '0xcbb8f66676737f0423bdda7bb1d8b84fc3c257e8',
			//         password: '0be2c6800757688d691edd7d3e810a026f5050483175e173b321283d556fddc27441d791a8885d4beb5780b8cdd37c9cb731dbe157b89a31cf8d7638e7279c8e1432845785bb9f4102f9bbd09c7cb69f',
			//         hash: '0xdf5f2a2bf6db43daed54279849f243d32aca5d3967f64c2483b5ac6c9317ea89',
			//         sig: '0x92576fd500ec825e085312219891c87ac365464e211e4146c1ba66d6f0f95e7f25c9bc2053b5d10cd19090ae7f1d43d8f24c117c97f164553ce4b8c921091d251b'
			//       }
			//     ]
			for ( const user of allUsers )
			{
				expect( sysUserStorageService.isValidItem( user ) ).toBeTruthy();
			}

			//
			//	read all wallet keys
			//
			const walletStorage : WalletStorageService = new WalletStorageService( pinCode );
			const allKeys : Array<string> = await walletStorage.getAllKeys();
			//console.log( `allKeys :`, allKeys );
			//    allKeys : [
			//       '0xc8f60eaf5988ac37a2963ac5fabe97f709d6b357',
			//       '0xcbb8f66676737f0423bdda7bb1d8b84fc3c257e8'
			//     ]
			expect( Array.isArray( allKeys ) ).toBeTruthy();
			expect( allKeys.length ).toBeGreaterThanOrEqual( 2 );

			const walletKeys = await walletStorage.getAllKeys();
			//console.log( `walletKeys :`, walletKeys );
			//    walletKeys : [
			//       '0xc8f60eaf5988ac37a2963ac5fabe97f709d6b357',
			//       '0xcbb8f66676737f0423bdda7bb1d8b84fc3c257e8'
			//     ]
			expect( Array.isArray( walletKeys ) ).toBeTruthy();
			expect( walletKeys.length ).toBeGreaterThanOrEqual( 2 );

			//
			//	read Alice's wallet
			//
			const encryptedStorageOptionsAlice : EncryptedStorageOptions = {
				address : walletItemAlice.address
			};
			const walletStorageAlice : WalletStorageService = new WalletStorageService( pinCode, encryptedStorageOptionsAlice );
			const encryptedAliceWalletObj : WalletEntityItem | null = await walletStorageAlice.getByWallet( walletItemAlice.address );
			expect( encryptedAliceWalletObj ).not.toBeNull();
			expect( EtherWallet.isValidWalletFactoryData( encryptedAliceWalletObj ) ).toBeTruthy();

			//
			//	read Bob's wallet
			//
			const encryptedStorageOptionsBob : EncryptedStorageOptions = {
				address : walletItemBob.address
			};
			const walletStorageBob : WalletStorageService = new WalletStorageService( pinCode, encryptedStorageOptionsBob );
			const encryptedBobWalletObj : WalletEntityItem | null = await walletStorageBob.getByWallet( walletItemBob.address );
			expect( encryptedBobWalletObj ).not.toBeNull();
			expect( EtherWallet.isValidWalletFactoryData( encryptedBobWalletObj ) ).toBeTruthy();
		});

		it( "should list all wallet addresses and names", async () =>
		{
			//
			//	step 1
			//	create an account and save it into the local database
			//
			const pinCode = `123456`;
			const chainId = 1;
			const walletItemAlice : WalletEntityItem = {
				...testWalletObjList.alice,
				name : `AliceWallet`,
				chainId : chainId,
				pinCode : ``
			};
			const createdAlice : boolean = await initWalletAsync( walletItemAlice, pinCode, true );
			expect( createdAlice ).toBeTruthy();

			//	...
			const walletItemBob : WalletEntityItem = {
				...testWalletObjList.bob,
				name : `BobWallet`,
				chainId : chainId,
				pinCode : ``
			};
			const createdBob : boolean = await initWalletAsync( walletItemBob, pinCode, true );
			expect( createdBob ).toBeTruthy();

			const sysUserStorageService = new SysUserStorageService();
			const allUsers : Array<SysUserItem | null> = await sysUserStorageService.getAll();
			expect( Array.isArray( allUsers ) ).toBeTruthy();
			expect( allUsers.length ).toBeGreaterThanOrEqual( 2 );
			//console.log( `allUsers :`, allUsers );
			//	allUsers : [
			//       {
			//         timestamp: 1723281491439,
			//         name: 'AliceWallet',
			//         wallet: '0xc8f60eaf5988ac37a2963ac5fabe97f709d6b357',
			//         password: 'f9758a2200a6d69b3137ba4510c425538862a81e98b271de1081f8dd9223b7a8c6df182fb9d641432f2a1499f6cb6c32f65150bd571abb31efada5fa317406b45d01b666f41a9b99db8a91f28a34a7e3',
			//         hash: '0x7669c6b6c5d1be59f06d327caf5eb09a3001e1ff721cf1e31cf78ad690347bb6',
			//         sig: '0x4e40434b91cd84da8f78be631ae926f881d6ad6963d19d8ba1e996041de411711e2fabff12d06d52cb45dfe9bc216c605084b76e39a81cf08a9467585d4d670a1b'
			//       },
			//       {
			//         timestamp: 1723281491462,
			//         name: 'BobWallet',
			//         wallet: '0xcbb8f66676737f0423bdda7bb1d8b84fc3c257e8',
			//         password: '0be2c6800757688d691edd7d3e810a026f5050483175e173b321283d556fddc27441d791a8885d4beb5780b8cdd37c9cb731dbe157b89a31cf8d7638e7279c8e1432845785bb9f4102f9bbd09c7cb69f',
			//         hash: '0xdf5f2a2bf6db43daed54279849f243d32aca5d3967f64c2483b5ac6c9317ea89',
			//         sig: '0x92576fd500ec825e085312219891c87ac365464e211e4146c1ba66d6f0f95e7f25c9bc2053b5d10cd19090ae7f1d43d8f24c117c97f164553ce4b8c921091d251b'
			//       }
			//     ]
			for ( const user of allUsers )
			{
				expect( user ).not.toBeNull();
				expect( sysUserStorageService.isValidItem( user ) ).toBeTruthy();
				expect( user ).toHaveProperty( `timestamp` );
				expect( user ).toHaveProperty( `name` );
				expect( user ).toHaveProperty( `wallet` );
				expect( user ).toHaveProperty( `password` );
				expect( user ).toHaveProperty( `hash` );
				expect( user ).toHaveProperty( `sig` );

				if ( ! user )
				{
					continue;
				}
				if ( walletItemAlice.address.trim().toLowerCase() === user.wallet )
				{
					expect( user.name ).toBe( walletItemAlice.name );
				}
				if ( walletItemBob.address.trim().toLowerCase() === user.wallet )
				{
					expect( user.name ).toBe( walletItemBob.name );
				}
			}
		});

		it( "should change wallet name", async () =>
		{
			//
			//	step 1
			//	create an account and save it into the local database
			//
			const pinCode = `123456`;
			const chainId = 1;
			const walletItemAlice : WalletEntityItem = {
				...testWalletObjList.alice,
				name : `AliceWallet`,
				chainId : chainId,
				pinCode : ``
			};
			const createdAlice : boolean = await initWalletAsync( walletItemAlice, pinCode, true );
			expect( createdAlice ).toBeTruthy();

			//	...
			const walletItemBob : WalletEntityItem = {
				...testWalletObjList.bob,
				name : `BobWallet`,
				chainId : chainId,
				pinCode : ``
			};
			const createdBob : boolean = await initWalletAsync( walletItemBob, pinCode, true );
			expect( createdBob ).toBeTruthy();

			//
			//	read Alice's wallet
			//
			const encryptedStorageOptionsAlice : EncryptedStorageOptions = {
				address : walletItemAlice.address
			};
			const walletStorageAlice : WalletStorageService = new WalletStorageService( pinCode, encryptedStorageOptionsAlice );
			const encryptedAliceWalletObj1 : WalletEntityItem | null = await walletStorageAlice.getByWallet( walletItemAlice.address );
			expect( encryptedAliceWalletObj1 ).not.toBeNull();
			expect( EtherWallet.isValidWalletFactoryData( encryptedAliceWalletObj1 ) ).toBeTruthy();

			const newNameAlice = `New Alice's Wallet`;
			const key : string | null = walletStorageAlice.getKeyByAddress( walletItemAlice.address );
			expect( key ).not.toBeNull();
			expect( _.isString( key ) && ! _.isEmpty( key ) ).toBeTruthy();
			if ( key && encryptedAliceWalletObj1 )
			{
				await walletStorageAlice.put( key, {
					...encryptedAliceWalletObj1,
					name : newNameAlice,
				} );
			}

			//
			//	query the modified wallet data
			//
			const encryptedAliceWalletObj2 : WalletEntityItem | null = await walletStorageAlice.getByWallet( walletItemAlice.address );
			//console.log( `encryptedAliceWalletObj2 :`, encryptedAliceWalletObj2 );
			//	encryptedAliceWalletObj2 : {
			//       isHD: true,
			//       mnemonic: 'olympic cradle tragic crucial exit annual silly cloth scale fine gesture ancient',
			//       password: '',
			//       address: '0xc8f60eaf5988ac37a2963ac5fabe97f709d6b357',
			//       publicKey: '0x03ed2098910ab9068abd54e1562eb9dee3cb2d9fc1426dfe91541970a89b5aa622',
			//       privateKey: '0xf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a',
			//       index: 0,
			//       path: "m/44'/60'/0'/0/0",
			//       name: "New Alice's Wallet",
			//       chainId: 1,
			//       pinCode: ''
			//     }
			expect( encryptedAliceWalletObj2 ).not.toBeNull();
			expect( EtherWallet.isValidWalletFactoryData( encryptedAliceWalletObj2 ) ).toBeTruthy();
			expect( encryptedAliceWalletObj2 && encryptedAliceWalletObj2.name === newNameAlice ).toBeTruthy();

			//
			//	query the modified sysUser data
			//
			const sysUserStorageService = new SysUserStorageService();
			const sysUserKey : string | null = sysUserStorageService.getKeyByAddress( walletItemAlice.address );
			expect( sysUserKey ).not.toBeNull();
			expect( _.isString( sysUserKey ) && ! _.isEmpty( sysUserKey ) ).toBeTruthy();
			if ( sysUserKey )
			{
				const sysUserItem : SysUserItem | null = await sysUserStorageService.get( sysUserKey );
				//console.log( `sysUserItem :`, sysUserItem );
				//	sysUserItem : {
				//       timestamp: 1723301059567,
				//       name: "New Alice's Wallet",
				//       wallet: '0xc8f60eaf5988ac37a2963ac5fabe97f709d6b357',
				//       password: 'f9758a2200a6d69b3137ba4510c425538862a81e98b271de1081f8dd9223b7a8c6df182fb9d641432f2a1499f6cb6c32f65150bd571abb31efada5fa317406b45d01b666f41a9b99db8a91f28a34a7e3',
				//       hash: '0xd987f117a11628f4e6a68494faa85daeff5590a88f003eca27e0d623f907426e',
				//       sig: '0x60af2205ce7dc6951c39202ee3246e97221c0f71c4eee6bd00f14ebac176be0f62e95d4382419657076cb6c841373526f8abd257c57eccc63e0f2435e1f3af471b'
				//     }
				expect( sysUserItem ).not.toBeNull();
				expect( sysUserStorageService.isValidItem( sysUserItem ) ).toBeTruthy();
				expect( sysUserItem && sysUserItem.name === newNameAlice ).toBeTruthy();
			}
		});
	});
} );
