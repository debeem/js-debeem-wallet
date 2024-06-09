/**
 * 	@category Rpc Services
 * 	@module IRpcService
 */
import { NetworkModels } from "../../models/NetworkModels";

export interface IRpcService
{
	get supportedChainMap() : { [key: number]: string };
	get supportedChains() : Array<number>;
	get supportedNetworks() : Array<string>;

	/**
	 * 	return verified configurations
	 */
	get config() : NetworkModels;

	getNetworkByChainId( chainId ?: number ) : string | null;
	getEndpointByChainId( chainId ?: number ) : string;
}
