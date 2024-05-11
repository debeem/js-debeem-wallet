import { chains } from '../../resources/chains.json';
import { TypeUtil } from "debeem-utils";

export class ChainService
{
	public exists( chainId : number ) : boolean
	{
		return Boolean( this.getItem( chainId ) );
	}

	public getItem( chainId : number ) : Object | null
	{
		for ( const chain of chains )
		{
			if ( TypeUtil.isNotNullObjectWithKeys( chain, [ 'chainId' ] ) )
			{
				if ( chain.chainId === chainId )
				{
					//
					//	{
					// 		"name" : "Ethereum Mainnet",
					// 		"chain" : "ETH",
					// 		"icon" : "ethereum",
					// 		"rpc" : [ "https://mainnet.infura.io/v3/${INFURA_API_KEY}", "wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}", "https://api.mycryptoapi.com/eth", "https://cloudflare-eth.com", "https://ethereum.publicnode.com" ],
					// 		"features" : [ { "name" : "EIP155" }, { "name" : "EIP1559" } ],
					// 		"faucets" : [],
					// 		"nativeCurrency" : { "name" : "Ether", "symbol" : "ETH", "decimals" : 18 },
					// 		"infoURL" : "https://ethereum.org",
					// 		"shortName" : "eth",
					// 		"chainId" : 1,
					// 		"networkId" : 1,
					// 		"slip44" : 60,
					// 		"ens" : { "registry" : "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e" },
					// 		"explorers" : [ { "name" : "etherscan", "url" : "https://etherscan.io", "standard" : "EIP3091" } ]
					// 	}
					//
					return chain;
				}
			}
		}

		return null;
	}
}
