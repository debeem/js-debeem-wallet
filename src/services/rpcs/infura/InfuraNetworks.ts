/**
 * 	https://chainid.network/chains.json
 */

export interface NativeCurrency
{
	name: string,
	symbol: string,
	decimals: number,
}
export interface ExplorerItem
{
	name: string,
	url: string,
	standard: string
}

export interface InfuraNetworkItem
{
	name : string,
	network : string,
	chainId : number,
	networkId : number,
	chain : string,
	nativeCurrency : NativeCurrency,
	rpc : Array<string>,
	explorers : Array<ExplorerItem>,
}

export const InfuraNetworks : Array<InfuraNetworkItem> = [
	{
		name : 'Ethereum Mainnet',
		network : 'mainnet',
		chainId : 1,
		networkId : 1,
		chain : "ETH",
		nativeCurrency : {
			name: "Ether",
			symbol: "ETH",
			decimals: 18
		},
		rpc : [
			"https://mainnet.infura.io/v3/${INFURA_API_KEY}",
			"wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}",
		],
		explorers : [
			{
				name: "etherscan",
				url: "https://etherscan.io",
				standard: "EIP3091"
			}
		]
	},
	{
		name : 'Ethereum Testnet Goerli',
		network : 'goerli',
		chainId : 5,
		networkId : 5,
		chain : "ETH",
		nativeCurrency : {
			name: "Goerli Ether",
			symbol: "ETH",
			decimals: 18
		},
		rpc : [
			"https://goerli.infura.io/v3/${INFURA_API_KEY}",
			"wss://goerli.infura.io/v3/${INFURA_API_KEY}",
		],
		explorers : [
			{
				name: "etherscan-goerli",
				url: "https://goerli.etherscan.io",
				standard: "EIP3091"
			}
		]
	},
	{
		name : 'Ethereum Testnet Sepolia',
		network : 'sepolia',
		chainId : 11155111,
		networkId : 11155111,
		chain : "ETH",
		nativeCurrency : {
			name: "Sepolia Ether",
			symbol: "ETH",
			decimals: 18
		},
		rpc : [
			"https://rpc.sepolia.org",
			"https://rpc2.sepolia.org",
			"https://rpc-sepolia.rockx.com"
		],
		explorers : [
			{
				name: "etherscan-sepolia",
				url: "https://sepolia.etherscan.io",
				standard: "EIP3091"
			},
			{
				name: "otterscan-sepolia",
				url: "https://sepolia.otterscan.io",
				standard: "EIP3091"
			}
		]
	},
	{
		//	TODO
		//	不清楚哪个是主网
		name : 'arbitrum',
		network : 'arbitrum',
		chainId : 0,
		networkId : 0,
		chain : "ETH",
		nativeCurrency : {
			name: "",
			symbol: "",
			decimals: 18
		},
		rpc : [],
		explorers : []
	},
	{
		name : 'Arbitrum Goerli Rollup Testnet',
		network : 'arbitrum-goerli',
		chainId : 421613,
		networkId : 421613,
		chain : "ETH",
		nativeCurrency : {
			name: "Arbitrum Goerli Ether",
			symbol: "AGOR",
			decimals: 18
		},
		rpc : [
			"https://goerli-rollup.arbitrum.io/rpc/"
		],
		explorers : [
			{
				name: "Arbitrum Goerli Rollup Explorer",
				url: "https://goerli-rollup-explorer.arbitrum.io",
				standard: "EIP3091"
			}
		]
	},
	{
		name : 'Polygon Mainnet',
		network : 'matic',
		chainId : 137,
		networkId : 137,
		chain : "Polygon",
		nativeCurrency : {
			name: "MATIC",
			symbol: "MATIC",
			decimals: 18
		},
		rpc : [
			"https://polygon-rpc.com/",
			"https://rpc-mainnet.matic.network",
			"https://matic-mainnet.chainstacklabs.com",
			"https://rpc-mainnet.maticvigil.com",
			"https://rpc-mainnet.matic.quiknode.pro",
			"https://matic-mainnet-full-rpc.bwarelabs.com",
			"https://polygon-bor.publicnode.com"
		],
		explorers : [
			{
				name: "polygonscan",
				url: "https://polygonscan.com",
				standard: "EIP3091"
			}
		]
	},
	{
		name : 'Polygon Testnet Mumbai',
		network : 'matic-mumbai',
		chainId : 80001,
		networkId : 80001,
		chain : "Polygon",
		nativeCurrency : {
			name: "MATIC",
			symbol: "MATIC",
			decimals: 18
		},
		rpc : [
			"https://matic-mumbai.chainstacklabs.com",
			"https://rpc-mumbai.maticvigil.com",
			"https://matic-testnet-archive-rpc.bwarelabs.com",
			"https://polygon-mumbai-bor.publicnode.com"
		],
		explorers : [
			{
				name: "polygonscan",
				url: "https://mumbai.polygonscan.com",
				standard: "EIP3091"
			}
		]
	},
	{
		name : 'Optimism Mainnet',
		network : 'optimism',
		chainId : 10,
		networkId : 10,
		chain : "ETH",
		nativeCurrency : {
			name: "Ether",
			symbol: "ETH",
			decimals: 18
		},
		rpc : [
			"https://mainnet.optimism.io/"
		],
		explorers : [
			{
				name: "etherscan",
				url: "https://optimistic.etherscan.io",
				standard: "EIP3091"
			}
		]
	},
	{
		name : 'Optimism Goerli Testnet',
		network : 'optimism-goerli',
		chainId : 420,
		networkId : 420,
		chain : "ETH",
		nativeCurrency : {
			name: "Goerli Ether",
			symbol: "ETH",
			decimals: 18
		},
		rpc : [
			"https://goerli.optimism.io/"
		],
		explorers : []
	},
];
