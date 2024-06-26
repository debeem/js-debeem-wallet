import { OneInchTokenService } from "./services/rpcs/oneInchToken/OneInchTokenService";
import _ from "lodash";
import axios from "axios";
import path from "path";
import fs from "fs";
import { defaultOneInchTokenLogoItem, OneInchTokenLogoImageItem } from "./models/TokenModels";


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

			for ( let i = 0; i < chainIdList.length; i++ )
			{
				console.log( `>>> ${ i + 1 }/${ chainIdList.length }` );
				const chainId = chainIdList[ i ];

				console.log( `will update token resources for chain: ${ chainId }` );
				const oneInch = new OneInchTokenService( chainId );
				let res = await oneInch.fetchTokenMap();
				if ( !_.isObject( res ) )
				{
					return reject( `invalid res` );
				}

				const keys = _.keys( res );
				if ( !Array.isArray( keys ) || 0 === keys.length )
				{
					return reject( `invalid res, empty` );
				}

				for ( const address of keys )
				{
					res[ address ][ `logo` ] = defaultOneInchTokenLogoItem;

					//console.log( `res[ address ]`, res[ address ] );

					// //
					// //	download icons
					// //
					// const logoURI : string = `https://tokens.1inch.io/${ address }.png`;
					// const logoURIOutputPath = path.join( __dirname, `resources/tokenIcons/${ address }.png` );
					// console.log( `download file: ${ logoURI }` );
					//
					// try
					// {
					// 	if ( ! fileExists( logoURIOutputPath ) )
					// 	{
					// 		await downloadFile( logoURI, logoURIOutputPath );
					// 	}
					// }
					// catch ( err )
					// {
					// 	const errObj = err as any;
					// 	const status = errObj?.response?.status;
					// 	const statusText = errObj?.response?.statusText;
					// 	console.error( `[${ status } ${ statusText }] failed to download file: ${ logoURI }` );
					// }
				}

				//	...
				tsContent += `${ chainId } : ${ JSON.stringify( res, null, 4 ) },\n`;
			}

			tsContent += `};`;

			const outputPath = path.join( __dirname, `resources/oneInchTokens.ts` );
			fs.writeFileSync( outputPath, tsContent, 'utf8' );
			console.log( `Tokens written to ${ outputPath }` );
			console.log( `` );

			resolve( true );
		}
		catch ( err )
		{
			reject( err );
		}
	} );
}


function updateOneInchTokenLogoImages()
{
	try
	{
		const dir = path.join( __dirname, `resources/oneInchTokenLogoFiles` );
		const files = fs.readdirSync( dir );

		let tsContent = `` +
			`import { OneInchTokenLogoImageMap } from "../models/TokenModels";\n\n` +
			`export const oneInchTokenLogoImages : OneInchTokenLogoImageMap = {\n`;

		for ( const filename of files )
		{
			const fullPath = path.join( dir, filename );
			const stat = fs.statSync( fullPath );

			if ( stat.isDirectory() )
			{
				console.log( `Directory: ${ fullPath }` );
				return;
			}

			if ( stat.isFile() )
			{
				console.log( `encode file to base64 string : ${ fullPath }` );
				const base64 = convertFileToBase64( fullPath );
				//console.log( `base64 :`, base64 );

				const contractAddress : string = path.basename( filename.trim().toLowerCase(), '.png' );
				const logoItem : OneInchTokenLogoImageItem = {
					address : contractAddress,
					base64 : `data:image/png;base64,${ base64 }`,
				};

				tsContent += `"${ contractAddress }" : ${ JSON.stringify( logoItem, null, 4 ) },\n`;
			}
		}

		tsContent += `};`;

		const outputPath = path.join( __dirname, `resources/oneInchTokenLogoImages.ts` );
		fs.writeFileSync( outputPath, tsContent, 'utf8' );
		console.log( `base64-encoded images written to ${ outputPath }` );
		console.log( `` );
	}
	catch ( err )
	{
		console.error( 'Error reading directory:', err );
	}
}

function convertFileToBase64( filePath : string ) : string
{
	try
	{
		const fileBuffer = fs.readFileSync( filePath );
		return fileBuffer.toString( 'base64' );
	}
	catch ( err )
	{
		console.error( 'Error reading file:', err );
		return '';
	}
}

/**
 * 	download file
 *	@param url		{string}
 *	@param outputFilepath	{string}
 *	@returns {void}
 */
function downloadFile( url : string, outputFilepath : string ) : Promise<void>
{
	return new Promise( async ( resolve, reject ) =>
	{
		try
		{
			if ( !_.isString( url ) || _.isEmpty( url ) )
			{
				return reject( `downloadFile :: invalid url` );
			}
			if ( !_.isString( outputFilepath ) || _.isEmpty( outputFilepath ) )
			{
				return reject( `downloadFile :: invalid outputFilepath` );
			}

			//	...
			const response = await axios( {
				url,
				method : 'GET',
				responseType : 'stream',
				headers : {
					'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
					'Accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
					'Accept-Encoding' : 'gzip, deflate',
					'Accept-Language' : 'en-US,en;q=0.9',
				},
			} );
			const writer = fs.createWriteStream( outputFilepath );
			response.data.pipe( writer );

			writer.on( 'finish', resolve );
			writer.on( 'error', reject );
		}
		catch ( err )
		{
			reject( err );
		}
	} );
}

/**
 *	check if the file exists
 *	@param filepath
 */
function fileExists( filepath : string ) : boolean
{
	if ( !_.isString( filepath ) || _.isEmpty( filepath ) )
	{
		return false;
	}

	let fileExists = false;
	try
	{
		fs.accessSync( filepath, fs.constants.F_OK );
		fileExists = true;
	}
	catch ( err )
	{
		//console.log('File does not exist');
	}

	return fileExists;
}


async function main()
{
	return new Promise( async ( resolve, reject ) =>
	{
		try
		{
			//
			//
			//
			updateOneInchTokenLogoImages();

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
	} );
}

main().then( res => console.log( `Done!` ) ).catch( err => console.error( err ) );