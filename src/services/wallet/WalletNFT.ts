import { FetchListOptions } from "debeem-utils";
import { AlchemyService } from "../rpcs/alchemy/AlchemyService";
import { getCurrentChain } from "../../config";

/**
 * 	@category Wallet Services
 */

/**
 * 	@class
 */
export class WalletNFT
{
	constructor()
	{
	}

	/**
	 * 	Query the receipt of a transaction
	 *	@param address
	 *	@param options
	 */
	public async queryNFTs( address : string, options? : FetchListOptions ) : Promise< Array<any> | null >
	{
		return new AlchemyService( getCurrentChain() ).queryNFTs( address, options );
	}
}
