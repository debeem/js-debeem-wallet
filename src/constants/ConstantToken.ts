/**
 * 	@category Constants
 * 	@module ConstantToken
 */
import { TokenEntityItem } from "../entities/TokenEntity";
import { TokenValueItem } from "../models/TokenModels";

export const defaultTokens : Array<TokenEntityItem> = [
	{
		wallet : '',
		name: "Ether",
		chainId: 1,
		address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
		symbol: "ETH",
		decimals: 18,
	},
	{
		wallet : '',
		name: "Tether USD",
		chainId: 1,
		address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
		symbol: "USDT",
		decimals: 6,
	},
	{
		wallet : '',
		name: "USD Coin",
		chainId: 1,
		address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
		symbol: "USDC",
		decimals: 6
	},
];


export const defaultTokenValueItem : TokenValueItem = {
	balance : BigInt( 0 ),
	balanceDecimals : 0,
	floatBalance : 0,
	value : BigInt( 0 ),
	valueDecimals : 0,
	floatValue : 0,
};
