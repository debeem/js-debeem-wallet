/**
 * THIS IS EXAMPLE CODE THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS EXAMPLE CODE THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
//import { ethers, JsonRpcProvider } from "ethers";
const { ethers, JsonRpcProvider } = require( 'ethers' );



const aggregatorV3InterfaceABI = [
	{
		inputs: [],
		name: "decimals",
		outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "description",
		outputs: [{ internalType: "string", name: "", type: "string" }],
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
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
]

const addr = "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c";

//const provider = new JsonRpcProvider("https://rpc.ankr.com/eth_sepolia")
//const provider = new JsonRpcProvider("https://rpc.ankr.com/eth_goerli")
const provider = new JsonRpcProvider("https://rpc.ankr.com/eth")
const priceFeed = new ethers.Contract( addr, aggregatorV3InterfaceABI, provider )
priceFeed.latestRoundData().then((roundData) =>
{
	//	function latestRoundData() external view
	//     returns (
	//         uint80 roundId,
	//         int256 answer,
	//         uint256 startedAt,
	//         uint256 updatedAt,
	//         uint80 answeredInRound
	//     )
	console.log( "Latest Round Data", roundData );

	if ( Array.isArray( roundData ) && 5 === roundData.length )
	{
		const price = roundData[ 1 ] / BigInt( 1e6 );
		console.log( `price: `, parseFloat( price.toString() ) / 100 );
	}
})
//2911437000000n,
