import { describe, expect } from '@jest/globals';
import { getDefaultChain, WalletEntityItem, WalletStorageService } from "../../../src";
import { SysConfigStorageService } from "../../../src/services/storage/SysConfigStorageService";
import {
	getCurrentChainAsync,
	getCurrentWalletAsync, initWalletAsync,
	putCurrentChainAsync,
	putCurrentWalletAsync
} from "../../../src/config";
import { testWalletObjList } from "../../../src/configs/TestConfig";
import _ from "lodash";
import { SysUserStorageService } from "../../../src/services/storage/SysUserStorageService";
import { VaWalletEntity } from "../../../src/validators/VaWalletEntity";


/**
 *	unit test
 */
describe( "config", () =>
{
	beforeAll( async () =>
	{
	} );
	afterAll( async () =>
	{
	} );

	beforeEach( async () =>
	{
		await new SysConfigStorageService().clear();
		await new SysUserStorageService().clear();
	});


	describe( "CurrentChain", () =>
	{
		it( "should return undefined on first call", async () =>
		{
			const currentChain : number | undefined = await getCurrentChainAsync();
			expect( currentChain ).toBe( undefined );
		} );

		it( "should return the defaultChain", async () =>
		{
			const defaultChain : number = getDefaultChain();
			const savedDefault : boolean = await putCurrentChainAsync( defaultChain );
			expect( savedDefault ).toBeTruthy();

			const currentChain : number | undefined = await getCurrentChainAsync();
			expect( currentChain ).toBe( defaultChain );
		} );

		it( "should return the value of the chainId just saved", async () =>
		{
			const chainId : number = 1;
			const savedDefault : boolean = await putCurrentChainAsync( chainId );
			expect( savedDefault ).toBeTruthy();

			const currentChain : number | undefined = await getCurrentChainAsync();
			expect( currentChain ).toBe( chainId );
		} );
	} );


	describe( "CurrentWallet", () =>
	{
		it( "should return undefined on first call", async () =>
		{
			const currentWallet : string | undefined = await getCurrentWalletAsync();
			expect( currentWallet ).toBe( undefined );
		} );

		it( "should return the value of the wallet just saved", async () =>
		{
			const walletAddress : string = `0x8B4c0Dc5AA90c322C747c10FDD7cf1759D343573`;
			const saved : boolean = await putCurrentWalletAsync( walletAddress );
			expect( saved ).toBeTruthy();

			const currentWallet : string | undefined = await getCurrentWalletAsync();
			expect( currentWallet ).toBe( walletAddress.trim().toLowerCase() );
		} );

		it( "should create a user using initWalletAsync", async () =>
		{
			//
			//	RECOMMENDED WAY TO RECOVER AN ACCOUNT
			//
			const walletObject = testWalletObjList.alice;
			const walletName = `MyWallet`;
			const chainId = 1;
			const oldPinCode = `123456`;
			const toBeCreatedWalletItem : WalletEntityItem = {
				...walletObject,
				name: walletName,
				chainId : chainId,
				pinCode: ``
			};
			const created : boolean = await initWalletAsync( toBeCreatedWalletItem, oldPinCode, true );
			expect( created ).toBeTruthy();
		});

		it( "should recover a user with new PIN code using initWalletAsync", async () =>
		{
			//
			//	RECOMMENDED WAY TO RECOVER AN ACCOUNT
			//
			const walletObject = testWalletObjList.alice;
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


			//	recover a user
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
	} );
} );
