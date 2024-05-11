import { describe, expect } from '@jest/globals';
import { BasicStorageService } from "../../../../src";
import { TypeUtil } from "../../../../src/utils/TypeUtil";
import { SysUserStorageService } from "../../../../src/services/storage/SysUserStorageService";


/**
 *	unit test
 */
describe( "BasicStorageService", () =>
{
	beforeAll( async () =>
	{
	} );
	afterAll( async () =>
	{
	} );

	describe( "Save string values", () =>
	{
		it( "should save a string value to indexedDB database", async () =>
		{
			await new SysUserStorageService().clear();

			const basicStorageService = new BasicStorageService();
			await basicStorageService.clear();

			const valueSaving : string = 'value1';
			const saved : boolean = await basicStorageService.put( 'key1', valueSaving );
			expect( saved ).toBe( true );

			const count : number = await basicStorageService.count();
			expect( count ).toBe( 1 );

			const value : string | null = await basicStorageService.get( 'key1' );
			expect( value ).toEqual( valueSaving );
			expect( basicStorageService.isValidItem( value ) ).toBeTruthy();
		} );

		it( "should return all of storage keys in indexedDB database", async () =>
		{
			await new SysUserStorageService().clear();

			const basicStorageService = new BasicStorageService( `who basic password` );
			await basicStorageService.clear();

			const keyString : string = 'key1';
			const valueSaving : string = 'value1';
			const saved : boolean = await basicStorageService.put( keyString, valueSaving );
			const value : string | null = await basicStorageService.get( keyString );

			expect( saved ).toBe( true );
			expect( value ).toEqual( valueSaving );
			expect( basicStorageService.isValidItem( value ) ).toBeTruthy();

			//	load all keys
			const keys : Array<string> | null = await basicStorageService.getAllKeys();
			expect( Array.isArray( keys ) ).toBeTruthy();
			if ( Array.isArray( keys ) )
			{
				expect( keys.length ).toBe( 1 );
				expect( keys[ 0 ] ).toBe( keyString );
				for ( const key of keys )
				{
					expect( TypeUtil.isNotEmptyString( key ) ).toBeTruthy();
				}
			}
		} );

		it( "should return all of items in indexedDB database", async () =>
		{
			await new SysUserStorageService().clear();

			const basicStorageService = new BasicStorageService( `my basic password` );
			await basicStorageService.clear();

			const keyString : string = 'key1';
			const valueSaving : string = 'value1';
			const saved : boolean = await basicStorageService.put( keyString, valueSaving );
			const value : string | null = await basicStorageService.get( keyString );

			expect( saved ).toBe( true );
			expect( value ).toEqual( valueSaving );
			expect( basicStorageService.isValidItem( value ) ).toBeTruthy();

			//	load all keys
			const items : Array<string | null> | null = await basicStorageService.getAll();
			expect( Array.isArray( items ) ).toBeTruthy();
			if ( Array.isArray( items ) )
			{
				expect( items.length ).toBe( 1 );
				expect( items[ 0 ] ).toBe( valueSaving );
			}
		} );

		it( "should delete a item from indexedDB database", async () =>
		{
			await new SysUserStorageService().clear();

			const basicStorageService = new BasicStorageService( `my basic password` );
			await basicStorageService.clear();

			const keyString : string = 'key1';
			const valueSaving : string = 'value1';
			const saved : boolean = await basicStorageService.put( keyString, valueSaving );
			const value : string | null = await basicStorageService.get( keyString );

			expect( saved ).toBe( true );
			expect( value ).toEqual( valueSaving );
			expect( basicStorageService.isValidItem( value ) ).toBeTruthy();

			//	load all keys
			const deleted : boolean = await basicStorageService.delete( keyString );
			expect( deleted ).toBeTruthy();
			const keys : Array<string> | null = await basicStorageService.getAllKeys();
			expect( Array.isArray( keys ) ).toBeTruthy();
			if ( Array.isArray( keys ) )
			{
				expect( keys.length ).toBe( 0 );
			}
		} );
	} );
} );
