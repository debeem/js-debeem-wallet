import { IRpcService } from "./IRpcService";
import lodash from "lodash";
import { NetworkModels } from "../../models/NetworkModels";

/**
 * 	https://portal.1inch.dev/documentation/authentication
 */
export abstract class AbstractRpcService implements IRpcService
{
	protected _config : NetworkModels = {} as NetworkModels;

	/**
	 * 	define a map containing all supported chains
	 */
	protected chainMap : { [key:number] : string } = {};

	/**
	 * 	define the network currently in use
	 */
	protected chainId : number = 0;
	protected endpoint : string = `https://api.1inch.dev`;
	protected version : string = 'v1.2';
	protected apiKey : string = '';


	protected constructor( chainId : number )
	{
		this.chainId = chainId;
	}

	public setChainMap( chainMap : { [key:number] : string } )
	{
		this.chainMap = chainMap;
	}

	public setEndpoint( endpoint : string )
	{
		this.endpoint = endpoint;
	}

	public setVersion( version : string )
	{
		this.version = version;
	}

	public setApiKey( apiKey : string )
	{
		this.apiKey = apiKey;
	}




	public get supportedChainMap() : { [key: number]: string }
	{
		return this.chainMap;
	}

	/**
	 * 	get supported chain list
	 *
	 * 	@returns {Array<number>}
	 */
	public get supportedChains() : Array<number>
	{
		return Object.keys( this.supportedChainMap ).map( Number );
	}

	public get supportedNetworks() : Array<string>
	{
		return Object.values( this.supportedChainMap );
	}

	public get config() : NetworkModels
	{
		return {} as NetworkModels;
	}

	public getNetworkByChainId( chainId : number ) : string | null
	{
		if ( this.supportedChains.includes( chainId ) )
		{
			return this.supportedChainMap[ chainId ];
		}

		return null;
	}

	public getEndpointByNetwork( network : string ) : string
	{
		return '';
	}

	protected loadConfig( config : NetworkModels ) : NetworkModels
	{
		let newConfig : NetworkModels  = lodash.cloneDeep( config ) as NetworkModels;
		const newNetwork : string | null = this.getNetworkByChainId( this.chainId );
		if ( null === newNetwork )
		{
			throw new Error( 'unsupported network by chainId' );
		}

		newConfig.network = newNetwork;

		//	...
		return newConfig;
	}
}
