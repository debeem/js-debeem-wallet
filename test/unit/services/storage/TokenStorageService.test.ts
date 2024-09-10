import { describe, expect } from '@jest/globals';
import {
	BasicStorageService,
	getCurrentChain, getCurrentChainAsync,
	setCurrentChain,
	TokenEntityItem,
	TokenStorageService
} from "../../../../src";
import { TypeUtil } from "../../../../src/utils/TypeUtil";
import { SysUserStorageService } from "../../../../src";


/**
 *	unit test
 */
describe( "TokenStorageService", () =>
{
	beforeAll( async () =>
	{
	} );
	afterAll( async () =>
	{
	} );

	beforeEach( () =>
	{
		//	switch chain/network to Eth.Sepolia
		setCurrentChain( 11155111 );
	} );


	describe( "Token list on mainnet", () =>
	{
		const walletAddress = `0x47B506704DA0370840c2992A3d3d301FD3c260D3`;

		it( "should return items by wallet address", async () =>
		{
			const previousChain = getCurrentChain();
			const currentChain = 1;
			setCurrentChain( currentChain );

			//await new SysUserStorageService().clear();
			const tokenStorageService = new TokenStorageService();

			//	clear all items in database and flush the default chains into database
			await tokenStorageService.clearByWallet( walletAddress );

			//	get default tokens
			const defaultTokens = tokenStorageService.getDefault( walletAddress );
			expect( Array.isArray( defaultTokens ) && defaultTokens.length > 0 ).toBeTruthy();

			//	flush the default tokens into database
			await tokenStorageService.flushDefault( walletAddress );
			const count1 : number = await tokenStorageService.countByWallet( walletAddress );
			expect( count1 ).toBe( defaultTokens.length );


			//	unique key: chainId + wallet + address
			const walletAddress2 = `0x8B4c0Dc5AA90c322C747c10FDD7cf1759D343573`;
			const token2 : TokenEntityItem = {
				wallet : walletAddress2,
				name : 'XTOKEN',
				chainId : getCurrentChain(),
				address : `0xdac17f958d2ee523a2206206994597c131111111`,
				symbol : `XTOKEN`,
				decimals : 18
			};
			const key2 : string | null = tokenStorageService.getKeyByItem( token2 );
			if ( key2 )
			{
				await tokenStorageService.put( key2, token2 );
			}
			const count2 : number = await tokenStorageService.countByWallet( walletAddress2 );
			expect( count2 ).toBe( 1 );

			//	tokens 1
			const tokens1 : Array<TokenEntityItem> | null = await tokenStorageService.getAllByWallet( walletAddress );
			//console.log( `tokens1 :`, tokens1 );
			expect( Array.isArray( tokens1 ) && tokens1.length === count1 ).toBeTruthy();
			if ( tokens1 )
			{
				for ( const token of tokens1 )
				{
					expect( token ).toBeDefined();
					expect( token.chainId ).toBe( getCurrentChain() );
					expect( token.wallet.trim().toLowerCase() ).toBe( walletAddress.trim().toLowerCase() );
				}
			}

			//	tokens 2
			const tokens2 : Array<TokenEntityItem> | null = await tokenStorageService.getAllByWallet( walletAddress2 );
			expect( Array.isArray( tokens2 ) && tokens2.length === count2 ).toBeTruthy();
			if ( tokens2 )
			{
				for ( const token of tokens2 )
				{
					expect( token ).toBeDefined();
					expect( token.chainId ).toBe( getCurrentChain() );
					expect( token.wallet.trim().toLowerCase() ).toBe( walletAddress2.trim().toLowerCase() );
				}
			}

			//	...
			await tokenStorageService.clearByWallet( walletAddress );
			expect( await tokenStorageService.countByWallet( walletAddress ) ).toBe( 0 );
			expect( await tokenStorageService.countByWallet( walletAddress2 ) ).toBe( count2 );

			//	...
			await tokenStorageService.clearByWallet( walletAddress2 );
			expect( await tokenStorageService.countByWallet( walletAddress ) ).toBe( 0 );
			expect( await tokenStorageService.countByWallet( walletAddress2 ) ).toBe( 0 );

			//	...
			setCurrentChain( previousChain );
		} );
	} );

	describe( "Token list on Sepolia", () =>
	{
		const walletAddress = `0x47B506704DA0370840c2992A3d3d301FD3c260D3`;

		it( "should return a default token list", async () =>
		{
			await new SysUserStorageService().clear();

			const tokenStorageService = new TokenStorageService();
			const defaultTokenList : Array<TokenEntityItem> = tokenStorageService.getDefault( walletAddress );
			expect( Array.isArray( defaultTokenList ) ).toBeTruthy();
			expect( defaultTokenList.length ).toBeGreaterThan( 0 );

			for ( const token of defaultTokenList )
			{
				expect( tokenStorageService.isValidItem( token ) ).toBeTruthy();
			}
		} );
		it( "should flush default token list into database", async () =>
		{
			//await new SysUserStorageService().clear();

			const tokenStorageService = new TokenStorageService();

			//	clear all items in database and flush the default chains into database
			await tokenStorageService.clearByWallet( walletAddress );
			await tokenStorageService.flushDefault( walletAddress );

			//	load default chain list
			const defaultTokenList : Array<TokenEntityItem> = tokenStorageService.getDefault( walletAddress );
			expect( Array.isArray( defaultTokenList ) ).toBeTruthy();
			expect( defaultTokenList.length ).toBeGreaterThan( 0 );

			//	query all items
			const chainList : Array<TokenEntityItem | null> | null = await tokenStorageService.getAllByWallet( walletAddress );
			expect( Array.isArray( chainList ) ).toBeTruthy();
			if ( Array.isArray( chainList ) )
			{
				expect( chainList.length ).toBeGreaterThan( 0 );

				//	compare the length of two arrays
				expect( chainList.length ).toBe( defaultTokenList.length );
				for ( const chain of chainList )
				{
					expect( tokenStorageService.isValidItem( chain ) ).toBeTruthy();
				}
			}
		} );

		it( "should return a storage key by item object", async () =>
		{
			//await new SysUserStorageService().clear();

			const tokenStorageService = new TokenStorageService();

			//	load default chain list
			const defaultTokens : Array<TokenEntityItem> = tokenStorageService.getDefault( walletAddress );
			expect( Array.isArray( defaultTokens ) ).toBeTruthy();
			expect( defaultTokens.length ).toBeGreaterThan( 0 );

			for ( const tokenItem of defaultTokens )
			{
				const storageKey : string | null = tokenStorageService.getKeyByItem( tokenItem );
				expect( typeof storageKey ).toBe( "string" );
				if ( typeof storageKey === 'string' )
				{
					expect( storageKey.length ).toBeGreaterThan( 0 );

					//	does not contain uppercase letters
					expect( /[A-Z]/.test( storageKey ) ).toBeFalsy();

					const expectPrefix : string = `chain-${ getCurrentChain() }-wallet-`;
					const itemPrefix : string = `chain-${ tokenItem.chainId }-wallet-`;
					expect( itemPrefix ).toBe( expectPrefix );
				}
			}
		} );

		it( "should put items into database and load them back from database", async () =>
		{
			//await new SysUserStorageService().clear();

			const tokenStorageService = new TokenStorageService();
			await tokenStorageService.clearByWallet( walletAddress );

			//	load default chain list
			const defaultTokenList : Array<TokenEntityItem> = tokenStorageService.getDefault( walletAddress );
			expect( Array.isArray( defaultTokenList ) ).toBeTruthy();
			expect( defaultTokenList.length ).toBeGreaterThan( 0 );

			for ( const tokenItem of defaultTokenList )
			{
				const key : string | null = tokenStorageService.getKeyByItem( tokenItem );
				expect( TypeUtil.isNotEmptyString( key ) ).toBeTruthy();
				if ( key && TypeUtil.isNotEmptyString( key ) )
				{
					const saved : boolean = await tokenStorageService.put( key, tokenItem );
					expect( saved ).toBeTruthy();

					const storageKey : string | null = tokenStorageService.getKeyByItem( tokenItem );
					expect( TypeUtil.isNotEmptyString( storageKey ) ).toBeTruthy();
					if ( storageKey && TypeUtil.isNotEmptyString( storageKey ) )
					{
						const readItem : TokenEntityItem | null = await tokenStorageService.get( storageKey );
						expect( typeof readItem ).toBe( "object" );
						expect( tokenStorageService.isValidItem( readItem ) ).toBeTruthy();
					}
				}
			}
		} );

		it( "should load the first item from database", async () =>
		{
			//await new SysUserStorageService().clear();
			const tokenStorageService = new TokenStorageService();

			//	clear all items in database and flush the default chains into the database
			await tokenStorageService.clearByWallet( walletAddress );
			await tokenStorageService.flushDefault( walletAddress );

			//	load the first item
			const readItem : TokenEntityItem | null = await tokenStorageService.getFirstByWallet( walletAddress );
			//console.log( `readItem`, readItem )
			expect( typeof readItem ).toBe( "object" );
			expect( tokenStorageService.isValidItem( readItem ) ).toBeTruthy();
		} );

		it( "should load all the storage keys from database", async () =>
		{
			//await new SysUserStorageService().clear();

			//
			//	...
			//
			const basicStorageService = new BasicStorageService();
			await basicStorageService.clear();

			const saved : boolean = await basicStorageService.put( 'key1', `value1` );
			expect( saved ).toBe( true );

			//
			//	...
			//
			const tokenStorageService = new TokenStorageService();

			//	clear all items in database and flush the default chains into database
			await tokenStorageService.clearByWallet( walletAddress );
			await tokenStorageService.flushDefault( walletAddress );

			//	query all items
			const keys : Array<string> | null = await tokenStorageService.getAllKeysByWallet( walletAddress );
			expect( Array.isArray( keys ) ).toBeTruthy();
			if ( Array.isArray( keys ) )
			{
				expect( keys.length ).toBeGreaterThan( 0 );

				for ( const key of keys )
				{
					//	load item by key
					const readItem : TokenEntityItem | null = await tokenStorageService.get( key );
					expect( typeof readItem ).toBe( "object" );
					expect( tokenStorageService.isValidItem( readItem ) ).toBeTruthy();
				}
			}
		} );

		it( "should delete items from database", async () =>
		{
			//await new SysUserStorageService().clear();

			const tokenStorageService = new TokenStorageService();

			//	clear all items in database and flush the default chains into database
			await tokenStorageService.clearByWallet( walletAddress );
			await tokenStorageService.flushDefault( walletAddress );

			//	query all items
			const keys : Array<string> | null = await tokenStorageService.getAllKeysByWallet( walletAddress );
			expect( Array.isArray( keys ) ).toBeTruthy();
			if ( Array.isArray( keys ) )
			{
				expect( keys.length ).toBeGreaterThan( 0 );

				for ( const key of keys )
				{
					//	load item by key
					const deleted : boolean = await tokenStorageService.delete( key );
					expect( deleted ).toBeTruthy();

					const readItem : TokenEntityItem | null = await tokenStorageService.get( key );
					expect( readItem ).toBe( null );
				}
			}
		} );

		it( "should return items by wallet address", async () =>
		{
			//await new SysUserStorageService().clear();

			//await new SysUserStorageService().clear();
			const tokenStorageService = new TokenStorageService();

			//	clear all items in database and flush the default chains into database
			await tokenStorageService.clearByWallet( walletAddress );

			//	get default tokens
			const defaultTokens = tokenStorageService.getDefault( walletAddress );
			expect( Array.isArray( defaultTokens ) && defaultTokens.length > 0 ).toBeTruthy();

			//	flush the default tokens into database
			await tokenStorageService.flushDefault( walletAddress );
			const count1 : number = await tokenStorageService.countByWallet( walletAddress );
			expect( count1 ).toBe( defaultTokens.length );

			//	unique key: chainId + wallet + address
			const walletAddress2 = `0x8B4c0Dc5AA90c322C747c10FDD7cf1759D343573`;
			const token2 : TokenEntityItem = {
				wallet : walletAddress2,
				name : 'XTOKEN',
				chainId : getCurrentChain(),
				address : `0xdac17f958d2ee523a2206206994597c131111111`,
				symbol : `XTOKEN`,
				decimals : 18
			};
			const key2 : string | null = tokenStorageService.getKeyByItem( token2 );
			if ( key2 )
			{
				await tokenStorageService.put( key2, token2 );
			}
			const count2 : number = await tokenStorageService.countByWallet( walletAddress2 );
			expect( count2 ).toBe( 1 );

			//	tokens 1
			const tokens1 : Array<TokenEntityItem> | null = await tokenStorageService.getAllByWallet( walletAddress );
			expect( Array.isArray( tokens1 ) && tokens1.length === count1 ).toBeTruthy();
			if ( tokens1 )
			{
				for ( const token of tokens1 )
				{
					expect( token ).toBeDefined();
					expect( token.chainId ).toBe( getCurrentChain() );
					expect( token.wallet.trim().toLowerCase() ).toBe( walletAddress.trim().toLowerCase() );
				}
			}

			//	tokens 2
			const tokens2 : Array<TokenEntityItem> | null = await tokenStorageService.getAllByWallet( walletAddress2 );
			expect( Array.isArray( tokens2 ) && tokens2.length === count2 ).toBeTruthy();
			if ( tokens2 )
			{
				for ( const token of tokens2 )
				{
					expect( token ).toBeDefined();
					expect( token.chainId ).toBe( getCurrentChain() );
					expect( token.wallet.trim().toLowerCase() ).toBe( walletAddress2.trim().toLowerCase() );
				}
			}

			//	...
			await tokenStorageService.clearByWallet( walletAddress );
			expect( await tokenStorageService.countByWallet( walletAddress ) ).toBe( 0 );
			expect( await tokenStorageService.countByWallet( walletAddress2 ) ).toBe( count2 );

			//	...
			await tokenStorageService.clearByWallet( walletAddress2 );
			expect( await tokenStorageService.countByWallet( walletAddress ) ).toBe( 0 );
			expect( await tokenStorageService.countByWallet( walletAddress2 ) ).toBe( 0 );
		} );
	} );
} );
