import { describe, expect } from '@jest/globals';
import { BasicStorageService, WalletEntityItem, WalletStorageService } from "../../../../src";
import { SysUserStorageService } from "../../../../src/services/storage/SysUserStorageService";
import _ from "lodash";
import { TypeUtil } from "../../../../src/utils/TypeUtil";


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

	describe( "Basic usage", () =>
	{
		it( "should generate a random password", async () =>
		{
			const sysUserStorageService = new SysUserStorageService();

			const password = sysUserStorageService.generatePassword();
			expect( _.isString( password ) ).toBeTruthy();
			expect( ! _.isEmpty( password ) ).toBeTruthy();
		} );

		//	it.concurrent
		it( "should save a specified password into database", async () =>
		{
			const sysUserStorageService = new SysUserStorageService();

			const password = sysUserStorageService.generatePassword();
			expect( _.isString( password ) ).toBeTruthy();
			expect( ! _.isEmpty( password ) ).toBeTruthy();

			const entityName = `myEntity`;
			const pinCode = '123456';
			const saved = await sysUserStorageService.savePassword( entityName, pinCode, password );

			const extractedPassword = await sysUserStorageService.extractPassword( entityName, pinCode );
			expect( extractedPassword ).toBeDefined();
			expect( extractedPassword ).toBe( password );
		} );

		it( "should save a random password into database", async () =>
		{
			const sysUserStorageService = new SysUserStorageService();

			const entityName = `myEntity`;
			const pinCode = '123456';
			const savedPassword = await sysUserStorageService.savePassword( entityName, pinCode );
			expect( _.isString( savedPassword ) ).toBeTruthy();
			expect( ! _.isEmpty( savedPassword ) ).toBeTruthy();

			//	...
			const extractedPassword = await sysUserStorageService.extractPassword( entityName, pinCode );
			expect( extractedPassword ).toBeDefined();
			expect( extractedPassword ).toBe( savedPassword );
		} );

		it( "should return this is the correct pinCode", async () =>
		{
			const sysUserStorageService = new SysUserStorageService();

			const password = sysUserStorageService.generatePassword();
			expect( _.isString( password ) ).toBeTruthy();
			expect( ! _.isEmpty( password ) ).toBeTruthy();

			const entityName = `myEntity`;
			const pinCode = '123456';
			const savedPassword = await sysUserStorageService.savePassword( entityName, pinCode, password );
			expect( _.isString( savedPassword ) ).toBeTruthy();
			expect( ! _.isEmpty( savedPassword ) ).toBeTruthy();

			//
			//	...
			//
			const isValid = await sysUserStorageService.isValidPinCode( entityName, pinCode );
			expect( isValid ).toBeTruthy();
		} );

		it( "should return this is the correct pinCode in BasicStorageService", async () =>
		{
			await new SysUserStorageService().clear();

			const pinCode = '123456';
			const basicStorageService = new BasicStorageService( pinCode );
			await basicStorageService.init();

			//
			//	...
			//
			const isValid = await basicStorageService.isValidPinCode( pinCode );
			expect( isValid ).toBeTruthy();
		} );

		it( "should change pinCode from one to another", async () =>
		{
			const oldPinCode = '123456';
			const newPinCode = '998765';
			const sysUserStorageService = new SysUserStorageService();

			//
			//
			//
			const entityName = `myEntity`;
			const savedPassword = await sysUserStorageService.savePassword( entityName, oldPinCode );
			expect( _.isString( savedPassword ) ).toBeTruthy();
			expect( ! _.isEmpty( savedPassword ) ).toBeTruthy();

			const isValidOld = await sysUserStorageService.isValidPinCode( entityName, oldPinCode );
			expect( isValidOld ).toBeTruthy();

			const changed = await sysUserStorageService.changePinCode( entityName, oldPinCode, newPinCode );
			expect( changed ).toBeTruthy();

			const isValidNew = await sysUserStorageService.isValidPinCode( entityName, newPinCode );
			expect( isValidNew ).toBeTruthy();
		} );

		it( "should change pinCode of [wallet_entity] from one to another", async () =>
		{
			await new Promise(async ( resolve ) =>
			{
				const oldPinCode = '123456';
				const newPinCode = '998765';
				const sysUserStorageService = new SysUserStorageService();

				//
				//	wallet_entity
				//
				const entityName = `wallet_entity`;
				const savedPassword = await sysUserStorageService.savePassword( entityName, oldPinCode );
				expect( _.isString( savedPassword ) ).toBeTruthy();
				expect( ! _.isEmpty( savedPassword ) ).toBeTruthy();

				const isValidOld = await sysUserStorageService.isValidPinCode( entityName, oldPinCode );
				expect( isValidOld ).toBeTruthy();

				//
				//	saving and querying with WalletStorageService
				//
				const walletStorage = new WalletStorageService( oldPinCode );
				const walletAddress = walletStorage.generateRandomWalletAddress();
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

						expect( saved ).toBe( true );
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

				//
				//	change pinCode
				//
				const changed = await sysUserStorageService.changePinCode( entityName, oldPinCode, newPinCode );
				expect( changed ).toBeTruthy();

				const isValidNew = await sysUserStorageService.isValidPinCode( entityName, newPinCode );
				expect( isValidNew ).toBeTruthy();

				//
				//	querying with old pinCode
				//
				if ( key && TypeUtil.isNotEmptyString( key ) )
				{
					try
					{
						const oldWalletStorage = new WalletStorageService( oldPinCode );
						const fatalValue : WalletEntityItem | null = await oldWalletStorage.get( key );
					}
					catch ( err )
					{
						//console.log( `err: `, err );
						expect( 'string' === typeof err ).toBeTruthy();
						expect( err ).toContain( `invalid pinCode` );
					}
				}


				//
				//	querying with new pinCode
				//
				const newWalletStorage = new WalletStorageService( newPinCode );
				expect( newWalletStorage ).not.toBeNull();
				if ( key && TypeUtil.isNotEmptyString( key ) )
				{
					const value : WalletEntityItem | null = await newWalletStorage.get( key );
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

				resolve( true );
			});
		} );

		it( "should change pinCode of [wallet_entity] from one to another by way 2", async () =>
		{
			await new Promise(async ( resolve ) =>
			{
				const oldPinCode = '998765';
				const newPinCode = '123456';

				//
				//	walletStorage will be initialized with a random strong password encrypted by oldPinCode
				//
				const walletStorage = new WalletStorageService( oldPinCode );

				//	try to save a wallet object into walletStorage
				const walletAddress = walletStorage.generateRandomWalletAddress();
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

						expect( saved ).toBe( true );
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

				//
				//	will try to change pinCode
				//
				const sysUserStorageService = new SysUserStorageService();
				const entityName = `wallet_entity`;

				//	checking old pinCode
				const isValidOld = await sysUserStorageService.isValidPinCode( entityName, oldPinCode );
				expect( isValidOld ).toBeTruthy();

				//
				//	change pinCode
				//
				const changed = await sysUserStorageService.changePinCode( entityName, oldPinCode, newPinCode );
				expect( changed ).toBeTruthy();

				//	checking new pinCode
				const isValidNew = await sysUserStorageService.isValidPinCode( entityName, newPinCode );
				expect( isValidNew ).toBeTruthy();

				//
				//	initialize WalletStorageService using old pinCode
				//	the exception `invalid pinCode` will be thrown
				//
				if ( key && TypeUtil.isNotEmptyString( key ) )
				{
					try
					{
						const oldWalletStorage = new WalletStorageService( oldPinCode );
						const fatalValue : WalletEntityItem | null = await oldWalletStorage.get( key );
					}
					catch ( err )
					{
						//console.log( `err: `, err );
						expect( 'string' === typeof err ).toBeTruthy();
						expect( err ).toContain( `invalid pinCode` );
					}
				}


				//
				//	initialize WalletStorageService using new pinCode
				//	everything will work fine
				//
				const newWalletStorage = new WalletStorageService( newPinCode );
				expect( newWalletStorage ).not.toBeNull();
				if ( key && TypeUtil.isNotEmptyString( key ) )
				{
					const value : WalletEntityItem | null = await newWalletStorage.get( key );
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

				resolve( true );
			});
		} );

		it( "should change pinCode from one to another in BasicStorageService", async () =>
		{
			await new SysUserStorageService().clear();

			const oldPinCode = '123456';
			const newPinCode = '998765';
			const basicStorageService = new BasicStorageService( oldPinCode );
			await basicStorageService.init();

			const isValidOld = await basicStorageService.isValidPinCode( oldPinCode );
			expect( isValidOld ).toBeTruthy();

			const changed = await basicStorageService.changePinCode( oldPinCode, newPinCode );
			expect( changed ).toBeTruthy();

			const isValidNew = await basicStorageService.isValidPinCode( newPinCode );
			expect( isValidNew ).toBeTruthy();
		} );

		it( "should throw an `invalid oldPinCode` exception in BasicStorageService", async () =>
		{
			await new SysUserStorageService().clear();

			const oldPinCode = '123456';
			const newPinCode = '998765';
			const basicStorageService = new BasicStorageService( oldPinCode );
			await basicStorageService.init();

			const isValidOld = await basicStorageService.isValidPinCode( oldPinCode );
			expect( isValidOld ).toBeTruthy();

			try
			{
				await basicStorageService.changePinCode( `333333`, newPinCode );
			}
			catch ( err )
			{
				expect( _.isString( err ) ).toBeTruthy();
				expect( err ).toContain( `incorrect oldPinCode` );
			}
		} );

		it( "should throw an `pinCode no change` exception in BasicStorageService", async () =>
		{
			await new Promise(async ( resolve ) =>
			{
				await new SysUserStorageService().clear();

				const oldPinCode = '123456';
				const newPinCode = '123456';
				const basicStorageService = new BasicStorageService( oldPinCode );
				await basicStorageService.init();

				const isValidOld = await basicStorageService.isValidPinCode( oldPinCode );
				expect( isValidOld ).toBeTruthy();

				try
				{
					await basicStorageService.changePinCode( oldPinCode, newPinCode );
				}
				catch ( err )
				{
					expect( _.isString( err ) ).toBeTruthy();
					expect( err ).toContain( `pinCode no change` );
				}

				resolve( true );
			});
		} );

		it( "should throw an `invalid pinCode` exception in BasicStorageService", async () =>
		{
			await new Promise(async ( resolve ) =>
			{
				await new SysUserStorageService().clear();

				//	...
				const pinCode1 = '123456';
				const pinCode2 = '111111';
				expect( pinCode1 ).not.toBe( pinCode2 );

				const basicStorageService1 = new BasicStorageService( pinCode1 );
				await basicStorageService1.put( `key1`, `value1` );

				try
				{
					const basicStorageService2 = new BasicStorageService( `111111` );
					const value : string | null = await basicStorageService2.get( `key1` );
				}
				catch ( err )
				{
					expect( _.isString( err ) ).toBeTruthy();
					expect( err ).toContain( `invalid pinCode` );
				}

				resolve( true );
			});
		} );
	} );
} );
