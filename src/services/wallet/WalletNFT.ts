/**
 * 	query NFTs information
 *
 * 	@category Wallet Services
 * 	@module WalletNFT
 */
import { FetchListOptions } from "debeem-utils";
import { AlchemyService } from "../rpcs/alchemy/AlchemyService";
import { getCurrentChain } from "../../config";

/**
 * 	@class
 */
export class WalletNFT
{
	constructor()
	{
	}

	/**
	 * 	Query NFT by address
	 *	@param address	{string} wallet address
	 *	@param options	{FetchListOptions}
	 */
	public async queryNFTs( address : string, options? : FetchListOptions ) : Promise< Array<any> | null >
	{
		return new AlchemyService( getCurrentChain() ).queryNFTs( address, options );
	}
}
