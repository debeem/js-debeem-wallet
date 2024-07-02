import { describe, expect } from '@jest/globals';
import { BasicStorageService, getDefaultChain } from "../../../src";
import { TypeUtil } from "../../../src/utils/TypeUtil";
import { SysUserStorageService } from "../../../src/services/storage/SysUserStorageService";
import { SysConfigStorageService } from "../../../src/services/storage/SysConfigStorageService";
import {
	getCurrentChainAsync,
	getCurrentWalletAsync,
	putCurrentChainAsync,
	putCurrentWalletAsync
} from "../../../src/config";


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
			expect( currentWallet ).toBe( walletAddress );
		} );
	} );
} );
