import { AbstractRpcService } from "../AbstractRpcService";
import { etherscan } from "../../../config";
import { FetchUtil, FetchListOptions, FetchOptions } from "debeem-utils";
import { FetchResponse } from "ethers";
import { NetworkModels } from "../../../models/NetworkModels";
import { TypeUtil } from "debeem-utils";
import { IRpcService } from "../IRpcService";


/**
 * 	class of EtherscanService
 */
export class EtherscanService extends AbstractRpcService implements IRpcService
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
		this._config = this.loadConfig( etherscan );

		//	...
		this.setEndpoint( this.getEndpointByNetwork( this._config.network ) );
		this.setVersion( "" );
		this.setApiKey( this._config.apiKey );
	}

	public get config() : NetworkModels
	{
		return this._config;
	}

	public getEndpointByNetwork( network : string ) : string
	{
		switch ( network )
		{
			case "mainnet":
				return "https://api.etherscan.io";
			case "sepolia":
				return "https://api-sepolia.etherscan.io";
			case "goerli":
				return "https://api-goerli.etherscan.io";
		}

		return '';
	}

	/**
	 * 	query transaction list
	 *	@param address	{string}
	 *	@param options	{FetchListOptions}
	 */
	public async queryTransactions( address : string, options? : FetchListOptions ) : Promise< Array<any> | null >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const page = FetchUtil.getSafePage( options?.page );
				const pageSize = FetchUtil.getSafePageSize( options?.pageSize );
				const sort = FetchUtil.getSafeSort( options?.sort );
				const url = `${ this.endpoint }/api?module=account&action=txlist&address=${ address }&startblock=0&endblock=99999999&page=${ page }&offset=${ pageSize }&sort=${ sort }&apikey=${ this._config.apiKey }`;
				const fetchOptions : FetchOptions = {
					url : url,
					timeout : 5 * 60 * 1000,
					accept : `application/json`,
					headers : [
						{ key : 'Dnt', value : '1' },
						{ key : 'Cache-Control', value : 'no-cache' },
						{ key : 'Pragma', value : 'no-cache' },
						{ key : 'Accept-Language', value : 'en-US,en;q=0.9,zh-CN;q=0.8,zh-TW;q=0.7,zh;q=0.6,ja;q=0.5,de;q=0.4,es;q=0.3,fr;q=0.2,it;q=0.1,ko;q=0.1,pl;q=0.1,pt-PT;q=0.1,pt;q=0.1,ru;q=0.1,th;q=0.1,vi;q=0.1' },
						{ key : 'User-Agent', value : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36' },
						//{ key : 'Cookie', value : '_gid=GA1.2.882202140.1690649666; __stripe_mid=c63c2b26-e73c-4b2b-8761-ab935196b2592aa867; __cuid=12533cdcbd92419ab7d2047d7f002688; amp_fef1e8=0a1219c4-7321-40fc-af31-84bbbdc64e4eR...1h6hnjfa1.1h6hnk0i4.k.2.m; cf_clearance=m5PNfqxf7utc_zzQ2_Q.Ce0qD5JBiP0YdIzjTQ7r3.E-1690709736-0-150.2.1690709736; _ga=GA1.2.822639634.1690649664; _ga_T1JC9RNQXV=GS1.1.1690709732.5.1.1690709816.0.0.0' }
					]
				};
				const response : FetchResponse = await FetchUtil.getRequest( fetchOptions );
				if ( response && response.bodyJson )
				{
					const jsonObject = response.bodyJson;
					if ( TypeUtil.isNotNullObjectWithKeys( jsonObject, [ 'status', 'message', 'result' ] ) )
					{
						if ( Array.isArray( jsonObject.result ) )
						{
							return resolve( jsonObject.result );
						}
					}
				}

				resolve( null );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}
}
