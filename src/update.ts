import {OneInchTokenService} from "./services/rpcs/oneInchToken/OneInchTokenService";
import _ from "lodash";
import path from "path";
import fs from "fs";


async function updateOneInchTokenResources()
{
	return new Promise( async ( resolve, reject ) =>
	{
		try
		{
			const chainIdList = new OneInchTokenService( 1 ).supportedChains;
			console.log( `chainIdList :`, chainIdList );

			let tsContent = `` +
			`import { OneInchTokenMap } from "../models/TokenModels";\n\n` +
			`export const oneInchTokens : { [ key : number ] : OneInchTokenMap } = {\n`;

			for ( let i = 0; i < chainIdList.length; i ++ )
			{
				console.log( `>>> ${ i + 1 }/${ chainIdList.length }` );
				const chainId = chainIdList[ i ];

				console.log( `will update token resources for chain: ${ chainId }` );
				const oneInch = new OneInchTokenService( chainId );
				const res = await oneInch.fetchTokenMap();
				if ( ! _.isObject( res ) )
				{
					return reject( `invalid res` );
				}

				const keys = _.keys( res );
				if ( ! Array.isArray( keys ) || 0 === keys.length )
				{
					return reject( `invalid res, empty` );
				}

				tsContent += `${ chainId } : ${ JSON.stringify( res, null, 4 ) },\n`;
			}

			tsContent += `};`;

			const outputPath = path.join(__dirname, `resources/oneInchTokens.ts` );
			fs.writeFileSync( outputPath, tsContent, 'utf8' );
			console.log( `Object written to ${outputPath}` );
			console.log( `` );

			resolve( true );
		}
		catch ( err )
		{
			reject( err );
		}
	});
}


async function main()
{
	return new Promise( async ( resolve, reject ) =>
	{
		try
		{
			//
			//	1, update oneInch Tokens
			//
			await updateOneInchTokenResources();

			//	...
			resolve( true );
		}
		catch ( err )
		{
			reject( err );
		}
	});
}

main().then( res => console.log( `Done!` ) ).catch( err => console.error( err ) );