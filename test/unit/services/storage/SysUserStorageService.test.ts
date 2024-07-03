import { describe, expect } from '@jest/globals';
import { WalletEntityBaseItem, WalletEntityItem, WalletStorageService } from "../../../../src";
import { SysUserStorageService } from "../../../../src";
import _ from "lodash";
import { testWalletObjList } from "../../../../src/configs/TestConfig";
import { initWalletAsync, putCurrentWalletAsync } from "../../../../src";
import { VaWalletEntity } from "../../../../src/validators/VaWalletEntity";


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

			const existByWalletEntityBaseItem = await new SysUserStorageService().existByWalletEntityBaseItem( walletObject );
			expect( existByWalletEntityBaseItem ).toBeTruthy();

			const isValidPinCode = await new SysUserStorageService().isValidPinCode( pinCode );
			expect( isValidPinCode ).toBeTruthy();

			const walletStorageService = new WalletStorageService( pinCode );
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
				expect( errorText && errorText.includes( `invalid currentWallet` ) ).toBeTruthy();
			}

			//	check PIN code
			await putCurrentWalletAsync( walletObject.address );
			const isValidPinCode = await sysUserStorageService.isValidPinCode( pinCode3 );
			expect( isValidPinCode ).toBeTruthy();
		} );
	})

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
} );
