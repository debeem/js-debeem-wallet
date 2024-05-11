import { FetchUtil, FetchOptions } from "debeem-utils";
import { FetchResponse } from "ethers";
import { AbstractRpcService } from "../AbstractRpcService";
import { IRpcService } from "../IRpcService";
import { oneInch } from "../../../config";
import { EthersNetworkProvider } from "../../../models/EthersNetworkProvider";

/**
 * 	https://portal.1inch.dev/documentation/authentication
 */
export class OneInchTokenService extends AbstractRpcService implements IRpcService
{
	constructor( chainId : number )
	{
		super( chainId );
		this.setChainMap({
			1 : "mainnet",		//	Ethereum mainnet
			11155111 : "sepolia",	//	Ethereum Testnet Sepolia
			5 : "goerli",		//	Ethereum Testnet Goerli
		});

		//	load config
		//	it will check whether the network specified by chainId can be supported
		this._config = this.loadConfig( oneInch );

		this.setEndpoint( this.getEndpointByNetwork( this._config.network ) );
		this.setVersion( "v1.2" );
		this.setApiKey( oneInch.apiKey );
	}

	public get config() : EthersNetworkProvider
	{
		return this._config;
	}

	public getEndpointByNetwork( network : string ) : string
	{
		return `https://api.1inch.dev`;
	}

	public async fetchTokenCustomInfo( chainId : number, contractAddress : string ) : Promise<any>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				//	https://api.1inch.dev/token/v1.2/1/custom/0x491e136ff7ff03e6ab097e54734697bb5802fc1c
				//	/token/v1.2/{chain_id}/custom/{addresses}
				const url = `${ this.endpoint }/token/${ this.version }/${ chainId }/custom/${ contractAddress }`;
				const options : FetchOptions = {
					url : url,
					timeout : 5 * 60 * 1000,
					accept : `application/json`,
					headers : [
						{ key : 'Authorization', value : `Bearer ${ this.apiKey }` }
					]
				};
				const response : FetchResponse = await FetchUtil.getRequest( options );
				if ( response && response.bodyJson )
				{
					//
					//	{
					//		"id": 385599,
					//		"symbol": "KTN",
					//		"name": "Kattana",
					//		"address": "0x491e136ff7ff03e6ab097e54734697bb5802fc1c",
					//		"decimals": 18,
					//		"logoURI": "https://tokens.1inch.io/0x491e136ff7ff03e6ab097e54734697bb5802fc1c.png",
					//		"rating": 3,
					//		"eip2612": null,
					//		"tags": [
					//			{
					//				"value": "tokens",
					//				"provider": "1inch"
					//			}
					//		],
					//		"providers": [
					//			"1inch",
					//			"Trust Wallet Assets",
					//			"Zapper Token List"
					//		]
					//	}
					//
					return resolve( response.bodyJson );
				}

				return reject( `invalid response` );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}
}
