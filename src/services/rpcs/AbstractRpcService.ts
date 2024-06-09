/**
 * 	@category Rpc Services
 * 	@module AbstractRpcService
 */
import { IRpcService } from "./IRpcService";
import lodash from "lodash";
import { NetworkModels } from "../../models/NetworkModels";
import {RpcSupportedChainMap} from "../../models/RpcModels";
import _ from "lodash";

/**
 * 	https://portal.1inch.dev/documentation/authentication
 */
export abstract class AbstractRpcService implements IRpcService
{
	/**
	 * 	@hidden
	 *	@protected
	 */
	protected _config : NetworkModels = {} as NetworkModels;

	/**
	 * 	@hidden
	 * 	@protected
	 * 	define a map containing all supported chains
	 */
	protected chainMap : { [key:number] : string } = {};

	/**
	 * 	@hidden
	 * 	@protected
	 * 	define the network currently in use
	 */
	protected chainId : number = 0;

	/**
	 * 	@hidden
	 *	@protected
	 */
	protected endpoint : string = `https://api.1inch.dev`;

	/**
	 * 	@hidden
	 *	@protected
	 */
	protected version : string = 'v1.2';

	/**
	 * 	@hidden
	 *	@protected
	 */
	protected apiKey : string = '';


	protected constructor( chainId : number )
	{
		this.chainId = chainId;
	}


	/**
	 * 	get supported chain map
	 *
	 * 	@returns {{ [ key: number ]: string }}
	 */
	public get supportedChainMap() : RpcSupportedChainMap
	{
		return this.chainMap;
	}

	/**
	 * 	get supported chain id list
	 *
	 * 	@returns {Array<number>}
	 */
	public get supportedChains() : Array<number>
	{
		return Object.keys( this.supportedChainMap ).map( Number );
	}

	/**
	 * 	get supported chain/network short name list
	 *
	 * 	@returns {Array<string>}
	 */
	public get supportedNetworks() : Array<string>
	{
		return Object.values( this.supportedChainMap );
	}

	/**
	 * 	get config
	 *
	 * 	@returns {NetworkModels}
	 */
	public get config() : NetworkModels
	{
		return {} as NetworkModels;
	}




	/**
	 * 	check if the given chainId is supported
	 *
	 * 	@group Basic Methods
	 *	@param chainId	{number} the chainId number
	 *	@returns {boolean}
	 */
	public isSupportedChain( chainId : number ) : boolean
	{
		return _.isNumber( chainId ) &&
			chainId > 0 &&
			this.supportedChains.includes( chainId );
	}

	/**
	 * 	get network short name by chainId
	 *
	 * 	@group Basic Methods
	 *	@param chainId	{number} the chainId number
	 *	@returns {string | null}
	 */
	public getNetworkByChainId( chainId ?: number ) : string | null
	{
		chainId = _.isNumber( chainId ) ? chainId : this.chainId;
		if ( this.supportedChains.includes( chainId ) )
		{
			return this.supportedChainMap[ chainId ];
		}

		return null;
	}

	/**
	 * 	set end point by chainId
	 *
	 * 	@group Basic Methods
	 *	@param chainId	{number} the chainId number
	 *	@returns {string}
	 */
	public getEndpointByChainId( chainId ?: number ) : string
	{
		return ``;
	}




	/**
	 * 	set supported chain map
	 *
	 * 	@group Basic Methods
	 *	@param chainMap {RpcSupportedChainMap}
	 *	@returns {void}
	 */
	protected setChainMap( chainMap : RpcSupportedChainMap ) : void
	{
		this.chainMap = chainMap;
	}

	/**
	 * 	set end point
	 *
	 * 	@group Basic Methods
	 *	@param endpoint	{string} the end point url
	 *	@returns {void}
	 */
	protected setEndpoint( endpoint : string ) : void
	{
		this.endpoint = endpoint;
	}

	/**
	 * 	set version
	 *
	 * 	@group Basic Methods
	 *	@param version	{string}
	 *	@returns {void}
	 */
	protected setVersion( version : string ) : void
	{
		this.version = version;
	}

	/**
	 * 	set api key
	 *
	 * 	@group Basic Methods
	 *	@param apiKey	{string}
	 *	@returns {void}
	 */
	protected setApiKey( apiKey : string ) : void
	{
		this.apiKey = apiKey;
	}





	/**
	 * 	deep clone configuration from the input
	 *
	 * 	@group Basic Methods
	 *	@param config	{NetworkModels}
	 *	@returns {NetworkModels}
	 *	@protected
	 */
	protected cloneConfig( config : NetworkModels ) : NetworkModels
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
