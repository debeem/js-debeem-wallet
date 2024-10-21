import { describe, expect } from '@jest/globals';
import {
	getCurrentWalletAsync,
	WalletEntityBaseItem,
	WalletEntityItem,
	WalletFactory,
	WalletStorageService
} from "../../../../src";
import { SysUserStorageService } from "../../../../src";
import _ from "lodash";
import { testWalletObjList } from "../../../../src/configs/TestConfig";
import { initWalletAsync, putCurrentWalletAsync } from "../../../../src";
import { VaWalletEntity } from "../../../../src/validators/VaWalletEntity";
import { EtherWallet } from "debeem-id";


/**
 *	unit test
 */
describe( "SysUserStorageService", () =>
{
	beforeAll( async () =>
	{
	} );
	afterAll( async () =>
	{
	} );

	beforeEach( async () =>
	{
		await new SysUserStorageService().clear();
	});


	describe( "Create User", () =>
	{
		const walletObject : WalletEntityBaseItem = testWalletObjList.alice;

		it( "should generate a password by private key", async () =>
		{
			const sysUserStorageService = new SysUserStorageService();
			const password = await sysUserStorageService.generatePassword( walletObject );
			expect( _.isString( password ) ).toBeTruthy();
			expect( !_.isEmpty( password ) ).toBeTruthy();
		} );

		it( "should create a user using .createUser", async () =>
		{
			//
			//	JUST CREATE A USER, NOT AN ACCOUNT
			//
			const sysUserStorageService = new SysUserStorageService();
			const pinCode = `123456`;
			const created : boolean = await sysUserStorageService.createUser( walletObject, pinCode );
			expect( created ).toBeTruthy();

			await putCurrentWalletAsync( walletObject.address );
		} );

		it( "should create a user using initWalletAsync", async () =>
		{
			//
			//	RECOMMENDED WAY TO CREATE AN ACCOUNT
			//
			// const walletObject = EtherWallet.createWalletFromMnemonic();
			// const walletObject = EtherWallet.createWalletFromMnemonic( `electric shoot legal trial crane rib garlic claw armed snow blind advance` );
			// const walletObject = new WalletFactory().createWalletFromPrivateKey( `1111` );
			// const walletObject = new WalletFactory().createWalletFromKeystore( `` );

			//	...
			const walletName = `MyWallet`;
			const chainId = 1;
			const pinCode = `123456`;
			const toBeCreatedWalletItem : WalletEntityItem = {
				...walletObject,
				name: walletName,
				chainId : chainId,
				pinCode: ``
			};
			const created : boolean = await initWalletAsync( toBeCreatedWalletItem, pinCode, true );
			expect( created ).toBeTruthy();

			//
			//	All the following codes are verification codes
			//
			const walletStorageService = new WalletStorageService( pinCode );
			const walletItemByCurrentWallet = walletStorageService.getByCurrentWallet();
			expect( walletItemByCurrentWallet ).not.toBeNull();


			const existByWalletBaseItem = await walletStorageService.existByWalletEntityBaseItem( walletObject );
			expect( existByWalletBaseItem ).toBeTruthy();

			const existByWalletEntityBaseItem = await new SysUserStorageService().existByWalletEntityBaseItem( walletObject );
			expect( existByWalletEntityBaseItem ).toBeTruthy();

			const isValidPinCode = await new SysUserStorageService().isValidPinCode( pinCode );
			expect( isValidPinCode ).toBeTruthy();



			const existByWalletItem = await walletStorageService.existByWalletEntityBaseItem( toBeCreatedWalletItem );
			expect( existByWalletItem ).toBeTruthy();

			const walletKey : string | null = walletStorageService.getKeyByItem( toBeCreatedWalletItem );
			expect( walletKey ).not.toBeNull();
			expect( _.isString( walletKey ) && ! _.isEmpty( walletKey ) ).toBeTruthy();
			if ( walletKey )
			{
				const walletItem : WalletEntityItem | null = await walletStorageService.get( walletKey );
				expect( walletItem ).toBeDefined();
				expect( VaWalletEntity.validateWalletEntityItem( walletItem ) ).toBeNull();
				expect( !! walletItem ).toBeTruthy();
				if ( walletItem )
				{
					expect( walletItem.name ).toBe( walletName );
					expect( walletItem.chainId ).toBe( chainId );
					expect( walletItem.pinCode ).toBe( `` );
				}
			}
		} );

		it( "should recover a user with new PIN code using initWalletAsync", async () =>
		{
			//
			//	RECOMMENDED WAY TO RECOVER AN ACCOUNT
			//
			const walletName = `MyWallet`;
			const chainId = 1;
			const oldPinCode = `123456`;
			const toBeCreatedWalletItem : WalletEntityItem = {
				...walletObject,
				name: walletName,
				chainId : chainId,
				pinCode: ``
			};
			const created : boolean = await initWalletAsync( toBeCreatedWalletItem, oldPinCode );
			expect( created ).toBeTruthy();


			try
			{
				const newPinCode = `888888`;
				const toBeCreatedWalletItem2 : WalletEntityItem = {
					...walletObject,
					name: walletName,
					chainId : chainId,
					pinCode: ``
				};
				const created2 : boolean = await initWalletAsync( toBeCreatedWalletItem2, newPinCode );

				//	should never go here
				expect( created2 ).toBeTruthy();
				expect( false ).toBeTruthy();
			}
			catch ( err )
			{
				const errorText = err as string;
				expect( _.isString( errorText ) ).toBeTruthy();
				expect( errorText && errorText.includes( `user already exists` ) ).toBeTruthy();
			}

			const newPinCode3 = `999999`;
			const toBeCreatedWalletItem3 : WalletEntityItem = {
				...walletObject,
				name: walletName,
				chainId : chainId,
				pinCode: ``
			};
			const created3 : boolean = await initWalletAsync( toBeCreatedWalletItem3, newPinCode3, true );
			expect( created3 ).toBeTruthy();


			//	the old PIN code is no longer valid
			expect( await new SysUserStorageService().isValidPinCode( oldPinCode ) ).toBeFalsy();

			//	the new PIN code is okay
			expect( await new SysUserStorageService().isValidPinCode( newPinCode3 ) ).toBeTruthy();

			//
			//	All the following codes are verification codes
			//

			const existByWalletEntityBaseItem = await new SysUserStorageService().existByWalletEntityBaseItem( walletObject );
			expect( existByWalletEntityBaseItem ).toBeTruthy();

			const walletStorageService = new WalletStorageService( newPinCode3 );
			const existByWalletBaseItem = await walletStorageService.existByWalletEntityBaseItem( walletObject );
			expect( existByWalletBaseItem ).toBeTruthy();

			const existByWalletItem = await walletStorageService.existByWalletEntityBaseItem( toBeCreatedWalletItem );
			expect( existByWalletItem ).toBeTruthy();

			const walletKey : string | null = walletStorageService.getKeyByItem( toBeCreatedWalletItem );
			expect( walletKey ).not.toBeNull();
			expect( _.isString( walletKey ) && ! _.isEmpty( walletKey ) ).toBeTruthy();
			if ( walletKey )
			{
				const walletItem : WalletEntityItem | null = await walletStorageService.get( walletKey );
				expect( walletItem ).toBeDefined();
				expect( VaWalletEntity.validateWalletEntityItem( walletItem ) ).toBeNull();
				expect( !! walletItem ).toBeTruthy();
				if ( walletItem )
				{
					expect( walletItem.name ).toBe( walletName );
					expect( walletItem.chainId ).toBe( chainId );
					expect( walletItem.pinCode ).toBe( `` );
				}
			}

			const walletItemByCurrentWallet = walletStorageService.getByCurrentWallet();
			expect( walletItemByCurrentWallet ).not.toBeNull();
		});

		it( "should recover a user with new PIN code using .createUser", async () =>
		{
			const sysUserStorageService = new SysUserStorageService();
			const pinCode1 = `123456`;
			const created1 : boolean = await sysUserStorageService.createUser( walletObject, pinCode1 );
			expect( created1 ).toBeTruthy();

			try
			{
				const pinCode2 = `345678`;
				await sysUserStorageService.createUser( walletObject, pinCode2 );
			}
			catch ( err )
			{
				const errorText = err as string;
				expect( _.isString( errorText ) ).toBeTruthy();
				expect( errorText && errorText.includes( `user already exists` ) ).toBeTruthy();
			}

			const pinCode3 = `789000`;
			const created3 : boolean = await sysUserStorageService.createUser( walletObject, pinCode3, true );
			expect( created3 ).toBeTruthy();

			const existByWalletEntityBaseItem = await sysUserStorageService.existByWalletEntityBaseItem( walletObject );
			expect( existByWalletEntityBaseItem ).toBeTruthy();

			try
			{
				//	check PIN code
				const isValidPinCode = await sysUserStorageService.isValidPinCode( pinCode3 );
				expect( isValidPinCode ).toBeTruthy();
			}
			catch ( err )
			{
				const errorText = err as string;
				expect( _.isString( errorText ) ).toBeTruthy();
				expect( errorText && errorText.includes( `invalid walletAddress` ) ).toBeTruthy();
			}

			//	check PIN code
			await putCurrentWalletAsync( walletObject.address );
			const isValidPinCode = await sysUserStorageService.isValidPinCode( pinCode3 );
			expect( isValidPinCode ).toBeTruthy();
		} );
	});

	describe( "change PIN code", () =>
	{
		const walletObject : WalletEntityBaseItem = testWalletObjList.alice;

		it( "should change PIN Code from one to another", async () =>
		{
			const walletName = `MyWallet`;
			const chainId = 1;
			const oldPINCode = `123456`;
			const toBeCreatedWalletItem : WalletEntityItem = {
				...walletObject,
				name: walletName,
				chainId : chainId,
				pinCode: ``
			};
			const created : boolean = await initWalletAsync( toBeCreatedWalletItem, oldPINCode, true );
			expect( created ).toBeTruthy();

			//	...
			const newPINCode = '998765';
			const sysUserStorageService = new SysUserStorageService();

			try
			{
				await sysUserStorageService.changePinCode( walletObject, ``, newPINCode );
			}
			catch ( err )
			{
				const errorText = err as string;
				expect( _.isString( errorText ) ).toBeTruthy();
				expect( errorText && errorText.includes( `invalid oldPinCode` ) ).toBeTruthy();
			}

			try
			{
				await sysUserStorageService.changePinCode( walletObject, `1111`, newPINCode );
			}
			catch ( err )
			{
				const errorText = err as string;
				expect( _.isString( errorText ) ).toBeTruthy();
				expect( errorText && errorText.includes( `invalid oldPinCode` ) ).toBeTruthy();
			}

			expect( await sysUserStorageService.isValidPinCode( oldPINCode ) ).toBeTruthy();
			expect( await sysUserStorageService.isValidPinCode( newPINCode ) ).toBeFalsy();

			//	...
			const changed : boolean = await sysUserStorageService.changePinCode( walletObject, oldPINCode, newPINCode );
			expect( changed ).toBeTruthy();

			expect( await sysUserStorageService.isValidPinCode( oldPINCode ) ).toBeFalsy();
			expect( await sysUserStorageService.isValidPinCode( newPINCode ) ).toBeTruthy();
		} );

	} );

	describe( "Switch account, verify PIN Code", () =>
	{
		it( `should verify PIN Code for current user`, async () =>
		{
			const chainId = 1;

			//
			//	step 1
			//	create a wallet for Alice
			//
			const alicePINCode = `123456`;
			const aliceWallet : WalletEntityItem = {
				...testWalletObjList.alice,
				name: `Alice's Wallet`,
				chainId : chainId,
				pinCode: ``
			};
			const aliceCreated : boolean = await initWalletAsync( aliceWallet, alicePINCode, true );
			expect( aliceCreated ).toBeTruthy();

			//	After calling initWalletAsync, the current account automatically switches to Alice
			const alicePinCodeVerificationResult = await new SysUserStorageService().isValidPinCode( alicePINCode );
			expect( alicePinCodeVerificationResult ).toBeTruthy();

			//
			//	step 2
			//	create a wallet for Bob
			//
			const bobPINCode = `789000`;
			const bobWallet : WalletEntityItem = {
				...testWalletObjList.alice,
				name: `Alice's Wallet`,
				chainId : chainId,
				pinCode: ``
			};
			const bobCreated : boolean = await initWalletAsync( bobWallet, bobPINCode, true );
			expect( bobCreated ).toBeTruthy();

			//	After calling initWalletAsync, the current account automatically switches to Bob
			const bobPinCodeVerificationResult = await new SysUserStorageService().isValidPinCode( bobPINCode );
			expect( bobPinCodeVerificationResult ).toBeTruthy();
		} );

		it( `should verify PIN Code for specified user's PIN code`, async () =>
		{
			const chainId = 1;

			//
			//	step 1
			//	create a wallet for Alice
			//
			const alicePINCode = `123456`;
			const aliceWallet : WalletEntityItem = {
				...testWalletObjList.alice,
				name: `Alice's Wallet`,
				chainId : chainId,
				pinCode: ``
			};
			const aliceCreated : boolean = await initWalletAsync( aliceWallet, alicePINCode, true );
			expect( aliceCreated ).toBeTruthy();

			const currentWallet1 = await getCurrentWalletAsync();
			expect( currentWallet1 ).toBe( aliceWallet.address );

			//	After calling initWalletAsync, the current account automatically switches to Alice
			const alicePinCodeVerificationResult = await new SysUserStorageService().isValidPinCode( alicePINCode );
			expect( alicePinCodeVerificationResult ).toBeTruthy();

			//
			//	step 2
			//	create a wallet for Bob
			//
			const bobPINCode = `789000`;
			const bobWallet : WalletEntityItem = {
				...testWalletObjList.bob,
				name: `Bob's Wallet`,
				chainId : chainId,
				pinCode: ``
			};
			const bobCreated : boolean = await initWalletAsync( bobWallet, bobPINCode, true );
			expect( bobCreated ).toBeTruthy();

			const currentWallet2 = await getCurrentWalletAsync();
			expect( currentWallet2 ).toBe( bobWallet.address );

			//	After calling initWalletAsync, the current account automatically switches to Bob
			const bobPinCodeVerificationResult = await new SysUserStorageService().isValidPinCode( bobPINCode );
			expect( bobPinCodeVerificationResult ).toBeTruthy();

			//
			//	KEY DIFFERENCE:
			//	specify Alice's wallet address through the second parameter
			//
			//	console.log( `alicePINCode: ${ alicePINCode }, aliceWallet address: ${ aliceWallet.address }` );
			//	    alicePINCode: 123456, aliceWallet address: 0xc8f60eaf5988ac37a2963ac5fabe97f709d6b357
			const alicePinCodeVerificationResultByWalletAddress =
				await new SysUserStorageService().isValidPinCode( alicePINCode, aliceWallet.address );
			expect( alicePinCodeVerificationResultByWalletAddress ).toBeTruthy();

			//console.log( `bobPINCode: ${ bobPINCode }, bobWallet address: ${ bobWallet.address }` );
			//	    bobPINCode: 789000, bobWallet address: 0xcbb8f66676737f0423bdda7bb1d8b84fc3c257e8
			const bobPinCodeVerificationResultByWalletAddress =
				await new SysUserStorageService().isValidPinCode( bobPINCode, bobWallet.address );
			expect( bobPinCodeVerificationResultByWalletAddress ).toBeTruthy();
		} );
	});
} );
