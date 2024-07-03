import { describe, expect } from '@jest/globals';
import { WalletStorageService } from "../../../../src";
import { WalletEntityItem } from "../../../../src";
import { testUserList, testWalletObjList } from "../../../../src/configs/TestConfig";
import _ from "lodash";
import { getCurrentWalletAsync, initWalletAsync, putCurrentWalletAsync } from "../../../../src";
import { TWalletBaseItem } from "debeem-id";


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
				expect( errorText ).toBe( `SysUserStorageService.extractPassword :: invalid currentWallet` );
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
				expect( errorText ).toBe( `WalletStorageService :: invalid pinCode` );
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
				expect( errorText ).toBe( `WalletStorageService :: invalid pinCode` );
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
				expect( errorText ).toBe( `WalletStorageService :: invalid pinCode` );
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

} );
