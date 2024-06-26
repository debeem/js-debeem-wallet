import { OneInchTokenMap } from "../models/TokenModels";

/**
 * 	USDT contract address on sepolia
 * 	https://sepolia.etherscan.io/address/0x271B34781c76fB06bfc54eD9cfE7c817d89f7759
 */
export const oneInchTokensSepolia : OneInchTokenMap = {
	"0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" : {
		"chainId": 11155111,
		"symbol": "ETH",
		"name": "Ether",
		"address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
		"decimals": 18,
		"logoURI": "https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png",
		"providers": [
			"1inch",
			"Curve Token List"
		],
		"eip2612": false,
		"tags": [
			"native",
			"PEG:ETH"
		],
		"logo": {
			"oneInch": "",
			"metaBeem": ""
		}
	},
	"0x271b34781c76fb06bfc54ed9cfe7c817d89f7759" : {
		"chainId": 11155111,
		"symbol": "USDT",
		"name": "Tether USD",
		"address": "0x271b34781c76fb06bfc54ed9cfe7c817d89f7759",
		"decimals": 6,
		"logoURI": "https://tokens.1inch.io/0x271b34781c76fb06bfc54ed9cfe7c817d89f7759.png",
		"providers": [
			"1inch",
			"MetaBeem",
			"Local"
		],
		"eip2612": false,
		"tags": [
			"PEG:USD",
			"tokens"
		],
		"logo": {
			"oneInch": "",
			"metaBeem": ""
		}
	},
};