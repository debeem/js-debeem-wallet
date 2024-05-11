import { ChainEntityItem } from "../entities/ChainEntity";

export const supportedChains : Array<number> = [
	1, 11155111
];

//	TODO
//	用一个函数获取 icon

export const defaultChains : Array<ChainEntityItem> = [
	{
		name: "Ethereum Mainnet",
		chainId: 1,
		token: "ETH",
		rpcs: [
			{
				name : "https://mainnet.infura.io/v3/${INFURA_API_KEY}",
				url : "https://mainnet.infura.io/v3/${INFURA_API_KEY}",
				selected : true,
			}
		],
		explorers: [
			"https://etherscan.io"
		],
	},
	{
		name: "Ethereum Testnet Goerli",
		chainId: 5,
		token: "ETH",
		rpcs: [
			{
				name : "https://goerli.infura.io/v3/${INFURA_API_KEY}",
				url : "https://goerli.infura.io/v3/${INFURA_API_KEY}",
				selected : true,
			}
		],
		explorers: [
			"https://goerli.etherscan.io"
		],
	},
	{
		name: "Ethereum Testnet Sepolia",
		chainId: 11155111,
		token: "ETH",
		rpcs: [
			{
				name : "https://sepolia.infura.io/v3/${INFURA_API_KEY}",
				url : "https://sepolia.infura.io/v3/${INFURA_API_KEY}",
				selected : true,
			}
		],
		explorers: [
			"https://sepolia.etherscan.io"
		],
	}
];
