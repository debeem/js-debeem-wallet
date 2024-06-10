import { describe, expect } from '@jest/globals';
import { ChainEntityItem, ChainStorageService } from "../../../../src";
import { TypeUtil } from "../../../../src/utils/TypeUtil";
import { SysUserStorageService } from "../../../../src/services/storage/SysUserStorageService";


/**
 *	unit test
 */
describe( "ChainStorageService", () =>
{
	beforeAll( async () =>
	{
	});
	afterAll( async () =>
	{
	});

	describe( "Testing default chain list", () =>
	{
		it( "should return a default chain list", async () =>
		{
			await new SysUserStorageService().clear();

			const chainStorageService = new ChainStorageService( `111111` );
			const defaultChainList : Array<ChainEntityItem> = chainStorageService.getDefault();
			expect( Array.isArray( defaultChainList ) ).toBeTruthy();
			expect( defaultChainList.length ).toBeGreaterThan( 0 );

			//
			//	should output:
			//	[
			//       {
			//         name: 'Ethereum Mainnet',
			//         chainId: 1,
			//         token: 'ETH',
			//         rpcs: [ [Object] ],
			//         explorers: [ 'https://etherscan.io' ]
			//       },
			//       {
			//         name: 'Ethereum Testnet Goerli',
			//         chainId: 5,
			//         token: 'ETH',
			//         rpcs: [ [Object] ],
			//         explorers: [ 'https://goerli.etherscan.io' ]
			//       },
			//       {
			//         name: 'Ethereum Testnet Sepolia',
			//         chainId: 11155111,
			//         token: 'ETH',
			//         rpcs: [ [Object] ],
			//         explorers: [ 'https://sepolia.etherscan.io' ]
			//       }
			//     ]
			//
			//console.log( defaultChainList );

			for ( const chain of defaultChainList )
			{
				expect( chainStorageService.isValidItem( chain ) ).toBeTruthy();
			}
		});

		it( "should flush default chain list into database", async () =>
		{
			await new SysUserStorageService().clear();

			const chainStorageService = new ChainStorageService( `my password` );

			//	clear all items in database and flush the default chains into database
			await chainStorageService.clear();
			await chainStorageService.flushDefault();

			//	load default chain list
			const defaultChainList : Array<ChainEntityItem> = chainStorageService.getDefault();
			expect( Array.isArray( defaultChainList ) ).toBeTruthy();
			expect( defaultChainList.length ).toBeGreaterThan( 0 );

			//	query all items
			const chainList : Array<ChainEntityItem | null > | null = await chainStorageService.getAll();
			//console.log( `chainList :`, chainList );
			//	should output:
			//	chainList : [
			//       {
			//         name: 'Ethereum Mainnet',
			//         chainId: 1,
			//         token: 'ETH',
			//         rpcs: [ [Object] ],
			//         explorers: [ 'https://etherscan.io' ]
			//       },
			//       {
			//         name: 'Ethereum Testnet Sepolia',
			//         chainId: 11155111,
			//         token: 'ETH',
			//         rpcs: [ [Object] ],
			//         explorers: [ 'https://sepolia.etherscan.io' ]
			//       }
			//     ]
			//
			expect( Array.isArray( chainList ) ).toBeTruthy();
			if ( Array.isArray( chainList ) )
			{
				expect( chainList.length ).toBeGreaterThan( 0 );

				//	compare the length of two arrays
				expect( chainList.length ).toBe( defaultChainList.length );

				for ( const chain of chainList )
				{
					expect( chainStorageService.isValidItem( chain ) ).toBeTruthy();
				}
			}
		});

		it( "should return a storage key by item object", async () =>
		{
			await new SysUserStorageService().clear();

			const chainStorageService = new ChainStorageService( `my password` );

			//	load default chain list
			const defaultChainList : Array<ChainEntityItem> = chainStorageService.getDefault();
			expect( Array.isArray( defaultChainList ) ).toBeTruthy();
			expect( defaultChainList.length ).toBeGreaterThan( 0 );

			for ( const chain of defaultChainList )
			{
				const storageKey : string | null = chainStorageService.getKeyByItem( chain );
				expect( typeof storageKey ).toBe( "string" );
				if ( 'string' === typeof storageKey )
				{
					expect( storageKey.length ).toBeGreaterThan( 0 );
					expect( storageKey.startsWith( "chain-" ) ).toBeTruthy();
				}
			}
		});

		it( "should return a storage key by chainId", async () =>
		{
			await new SysUserStorageService().clear();

			const chainStorageService = new ChainStorageService();

			//	load default chain list
			const defaultChainList : Array<ChainEntityItem> = chainStorageService.getDefault();
			expect( Array.isArray( defaultChainList ) ).toBeTruthy();
			expect( defaultChainList.length ).toBeGreaterThan( 0 );

			for ( const chain of defaultChainList )
			{
				const storageKey : string = chainStorageService.getKeyByChainId( chain.chainId );
				expect( typeof storageKey ).toBe( "string" );
				expect( storageKey.length ).toBeGreaterThan( 0 );
				expect( storageKey.startsWith( "chain-" ) ).toBeTruthy();
			}
		});

		it( "should put items into database and load them back from database", async () =>
		{
			await new SysUserStorageService().clear();

			const chainStorageService = new ChainStorageService();
			await chainStorageService.clear();

			//	load default chain list
			const defaultChainList : Array<ChainEntityItem> = chainStorageService.getDefault();
			expect( Array.isArray( defaultChainList ) ).toBeTruthy();
			expect( defaultChainList.length ).toBeGreaterThan( 0 );

			for ( const chain of defaultChainList )
			{
				const key : string | null = chainStorageService.getKeyByItem( chain );
				if ( 'string' === typeof key )
				{
					const saved : boolean = await chainStorageService.put( key, chain );
					expect( saved ).toBeTruthy();

					const storageKey : string | null = chainStorageService.getKeyByItem( chain );
					if ( 'string' === storageKey )
					{
						const readItem : ChainEntityItem | null = await chainStorageService.get( storageKey );
						expect( typeof readItem ).toBe( "object" );
						expect( chainStorageService.isValidItem( readItem ) ).toBeTruthy();
					}
				}
			}
		});

		test( "should load the first item from database", async () =>
		{
			await new SysUserStorageService().clear();

			const chainStorageService = new ChainStorageService();

			//	clear all items in database and flush the default chains into database
			await chainStorageService.clear();
			await chainStorageService.flushDefault();

			//	load the first item
			const readItem : ChainEntityItem | null = await chainStorageService.getFirst();
			expect( typeof readItem ).toBe( "object" );
			expect( chainStorageService.isValidItem( readItem ) ).toBeTruthy();

			//	Wait for all timers to complete
			// jest.runOnlyPendingTimers();
		});

		it( "should load item by chainId from database", async () =>
		{
			await new SysUserStorageService().clear();

			const chainStorageService = new ChainStorageService();

			//	clear all items in database and flush the default chains into database
			await chainStorageService.clear();
			await chainStorageService.flushDefault();

			//	query all items
			const chainList : Array<ChainEntityItem | null> | null = await chainStorageService.getAll();
			expect( Array.isArray( chainList ) ).toBeTruthy();
			if ( Array.isArray( chainList ) )
			{
				expect( chainList.length ).toBeGreaterThan( 0 );

				for ( const chain of chainList )
				{
					expect( chainStorageService.isValidItem( chain ) ).toBeTruthy();
					if ( chain && chainStorageService.isValidItem( chain ) )
					{
						const chainId : number = chain.chainId;

						//	load item by chain id
						// const key : string = chainStorageService.getKeyByItem( chain );
						const readItem : ChainEntityItem | null = await chainStorageService.getByChainId( chainId );
						expect( typeof readItem ).toBe( "object" );
						expect( chainStorageService.isValidItem( readItem ) ).toBeTruthy();
					}
				}
			}

			//	Wait for all timers to complete
			// jest.runOnlyPendingTimers();
		});

		it( "should load item by key from database", async () =>
		{
			await new SysUserStorageService().clear();

			const chainStorageService = new ChainStorageService();

			//	clear all items in database and flush the default chains into database
			await chainStorageService.clear();
			await chainStorageService.flushDefault();

			//	query all items
			const keys : Array<string> | null = await chainStorageService.getAllKeys();
			expect( Array.isArray( keys ) ).toBeTruthy();
			if ( Array.isArray( keys ) )
			{
				expect( keys.length ).toBeGreaterThan( 0 );

				for ( const key of keys )
				{
					//	load item by key
					const readItem : ChainEntityItem | null = await chainStorageService.get( key );
					expect( typeof readItem ).toBe( "object" );
					expect( chainStorageService.isValidItem( readItem ) ).toBeTruthy();
				}
			}

			//	Wait for all timers to complete
			// jest.runOnlyPendingTimers();
		});

		it( "should delete items from database", async () =>
		{
			await new SysUserStorageService().clear();

			const chainStorageService = new ChainStorageService();

			//	clear all items in database and flush the default chains into database
			await chainStorageService.clear();
			await chainStorageService.flushDefault();

			//	query all items
			const keys : Array<string> | null = await chainStorageService.getAllKeys();
			expect( Array.isArray( keys ) ).toBeTruthy();
			if ( Array.isArray( keys ) )
			{
				expect( keys.length ).toBeGreaterThan( 0 );

				for ( const key of keys )
				{
					//	load item by key
					const deleted : boolean = await chainStorageService.delete( key );
					expect( deleted ).toBeTruthy();

					const readItem : ChainEntityItem | null = await chainStorageService.get( key );
					expect( readItem ).toBe( null );
				}
			}

			//	Wait for all timers to complete
			// jest.runOnlyPendingTimers();
		});

		it( "should return error about invalid item", async () =>
		{
			await new SysUserStorageService().clear();

			const chainStorageService = new ChainStorageService();
			let item : ChainEntityItem = {
				name: '',
				chainId: 0,
				token: 'ETH',
				rpcs: [
					{
						name : 'browser 1',
						url : 'https://www.abc.com/',
						selected : false,
					}
				],
				explorers: [],
			};
			let errorDesc : string | null = ``;
			let valid : boolean = chainStorageService.isValidItem( item, ( desc ) =>
			{
				errorDesc = desc;
			});
			expect( valid ).toBeFalsy();
			expect( TypeUtil.isNotEmptyString( errorDesc ) ).toBeTruthy();
			expect( errorDesc ).toBe( `empty .name` );

			const key : string | null = chainStorageService.getKeyByItem( item );
			expect( key ).toBe( null );


			//
			//	2
			//
			item.name = `ABC`;
			errorDesc = ``;
			valid = chainStorageService.isValidItem( item, ( desc ) =>
			{
				errorDesc = desc;
			});
			expect( valid ).toBeFalsy();
			expect( TypeUtil.isNotEmptyString( errorDesc ) ).toBeTruthy();
			expect( errorDesc ).toBe( `invalid .chainId` );

			//
			//	3
			//
			item.name 	= `ABC`;
			item.chainId	= 5;
			item.rpcs = [
				{
					name : ``,
					url : 'https://www.abc.com/',
					selected : false,
				}
			];
			errorDesc = ``;
			valid = chainStorageService.isValidItem( item, ( desc ) =>
			{
				errorDesc = desc;
			});
			expect( valid ).toBeFalsy();
			expect( TypeUtil.isNotEmptyString( errorDesc ) ).toBeTruthy();
			expect( errorDesc ).toBe( `invalid .rpcs[0] : empty .name` );

			//
			//	4
			//
			item.name 	= `ABC`;
			item.chainId	= 5;
			item.rpcs = [
				{
					name : `abc brwoser`,
					url : '',
					selected : false,
				}
			];
			errorDesc = ``;
			valid = chainStorageService.isValidItem( item, ( desc ) =>
			{
				errorDesc = desc;
			});
			expect( valid ).toBeFalsy();
			expect( TypeUtil.isNotEmptyString( errorDesc ) ).toBeTruthy();
			expect( errorDesc ).toBe( `invalid .rpcs[0] : empty .url` );

			//
			//	5
			//
			item.name 	= `ABC`;
			item.chainId	= 5;
			item.rpcs = [
				{
					name : `abc brwoser`,
					url : 'http://',
					selected : false,
				}
			];
			errorDesc = ``;
			valid = chainStorageService.isValidItem( item, ( desc ) =>
			{
				errorDesc = desc;
			});
			expect( valid ).toBeFalsy();
			expect( TypeUtil.isNotEmptyString( errorDesc ) ).toBeTruthy();
			expect( errorDesc ).toBe( `invalid .rpcs[0] : invalid .url` );
			//
			//	should output:
			//	invalid .rpcs[0] : invalid .url
			//
			//console.log( errorDesc );

			//	Wait for all timers to complete
			// jest.runOnlyPendingTimers();
		});
	} );
} );
