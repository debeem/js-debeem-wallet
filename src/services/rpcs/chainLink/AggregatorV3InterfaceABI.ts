/**
 * 	@category Rpc Services
 * 	@module ChainLinkService
 */


export type AggregatorV3InterfaceABIOutputItem = {
	internalType: string,
	name: string,
	type: string
};
export type AggregatorV3InterfaceABIItem = {
	inputs: Array<any>,
	name: string,
	outputs: Array<AggregatorV3InterfaceABIOutputItem>,
	stateMutability: string,
	type: string,
};

export const aggregatorV3InterfaceABI : Array<AggregatorV3InterfaceABIItem> = [
	{
		inputs: [],
		name: "decimals",
		outputs: [
			{ internalType: "uint8", name: "", type: "uint8" }
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "description",
		outputs: [
			{ internalType: "string", name: "", type: "string" }
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
		name: "getRoundData",
		outputs: [
			{ internalType: "uint80", name: "roundId", type: "uint80" },
			{ internalType: "int256", name: "answer", type: "int256" },
			{ internalType: "uint256", name: "startedAt", type: "uint256" },
			{ internalType: "uint256", name: "updatedAt", type: "uint256" },
			{ internalType: "uint80", name: "answeredInRound", type: "uint80" },
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "latestRoundData",
		outputs: [
			{ internalType: "uint80", name: "roundId", type: "uint80" },
			{ internalType: "int256", name: "answer", type: "int256" },
			{ internalType: "uint256", name: "startedAt", type: "uint256" },
			{ internalType: "uint256", name: "updatedAt", type: "uint256" },
			{ internalType: "uint80", name: "answeredInRound", type: "uint80" },
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "version",
		outputs: [
			{ internalType: "uint256", name: "", type: "uint256" }
		],
		stateMutability: "view",
		type: "function",
	},
];
