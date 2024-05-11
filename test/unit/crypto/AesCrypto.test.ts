import { describe, expect } from '@jest/globals';
import { AesHex } from "debeem-crypto"

/**
 *	AesCrypt unit test
 */
describe( "AesCrypt", () =>
{
	beforeAll( async () =>
	{
	} );
	afterAll( async () =>
	{
	} );

	describe( "AesCrypt", () =>
	{
		it( "should return base64 encoded encrypted string", async () =>
		{
			const message = `should return base64 encoded encrypted string`;
			const password = `1234Wadfawervvdfe`;
			const encryptedBase64 = AesHex.encryptAES( message, password );
			const decodedString = AesHex.decryptAES( encryptedBase64, password );
			expect( decodedString ).toEqual( message );
		} );
	} );
} );
