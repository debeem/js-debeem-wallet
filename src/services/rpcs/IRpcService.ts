import { EthersNetworkProvider } from "../../models/EthersNetworkProvider";

export interface IRpcService
{
	get supportedChainMap() : { [key: number]: string };
	get supportedChains() : Array<number>;
	get supportedNetworks() : Array<string>;

	/**
	 * 	return verified configurations
	 */
	get config() : EthersNetworkProvider;

	getNetworkByChainId( chainId : number ) : string | null;
	getEndpointByNetwork( network : string ) : string;
}
