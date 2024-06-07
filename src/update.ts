import {OneInchTokenService} from "./services/rpcs/oneInchToken/OneInchTokenService";
import {getCurrentChain} from "./config";
import _ from "lodash";
import path from "path";
import fs from "fs";
import {OneInchTokenMap} from "./models/TokenModels";


async function updateOneInchTokenResources( chainId : number )
{
	return new Promise( async ( resolve, reject ) =>
	{
		try
		{
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

			const tsContent = `import { OneInchTokenMap } from "../models/TokenModels";\n\n
export const ethereumTokens : OneInchTokenMap = ${ JSON.stringify( res, null, 4 ) };`;

			const outputPath = path.join(__dirname, `resources/oneInchTokenMap.${ chainId }.ts` );
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
			const chainIdList = new OneInchTokenService( 1 ).supportedChains;
			console.log( `chainIdList :`, chainIdList );
			console.log( `` );
			for ( let i = 0; i < chainIdList.length; i ++ )
			{
				console.log( `>>> ${ i + 1 }/${ chainIdList.length }` );
				const chainId = chainIdList[ i ];
				await updateOneInchTokenResources( chainId );
			}

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