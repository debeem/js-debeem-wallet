import { UsdtABIItem } from "../models/UsdtABIItem";

export const usdtABI : Array<UsdtABIItem> = [{
	"constant": true,
	"anonymous": false,
	"inputs": [],
	"name": "name",
	"outputs": [{"name": "", "type": "string"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": false,
	"anonymous": false,
	"inputs": [{"name": "_upgradedAddress", "type": "address"}],
	"name": "deprecate",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": false,
	"anonymous": false,
	"inputs": [{"name": "_spender", "type": "address"}, {"name": "_value", "type": "uint256"}],
	"name": "approve",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": true,
	"anonymous": false,
	"inputs": [],
	"name": "deprecated",
	"outputs": [{"name": "", "type": "bool"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": false,
	"anonymous": false,
	"inputs": [{"name": "_evilUser", "type": "address"}],
	"name": "addBlackList",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": true,
	"anonymous": false,
	"inputs": [],
	"name": "totalSupply",
	"outputs": [{"name": "", "type": "uint256"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": false,
	"anonymous": false,
	"inputs": [{"name": "_from", "type": "address"}, {"name": "_to", "type": "address"}, {
		"name": "_value",
		"type": "uint256"
	}],
	"name": "transferFrom",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": true,
	"anonymous": false,
	"inputs": [],
	"name": "upgradedAddress",
	"outputs": [{"name": "", "type": "address"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"anonymous": false,
	"inputs": [{"name": "", "type": "address"}],
	"name": "balances",
	"outputs": [{"name": "", "type": "uint256"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"anonymous": false,
	"inputs": [],
	"name": "decimals",
	"outputs": [{"name": "", "type": "uint256"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"anonymous": false,
	"inputs": [],
	"name": "maximumFee",
	"outputs": [{"name": "", "type": "uint256"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"anonymous": false,
	"inputs": [],
	"name": "_totalSupply",
	"outputs": [{"name": "", "type": "uint256"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": false,
	"anonymous": false,
	"inputs": [],
	"name": "unpause",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": true,
	"anonymous": false,
	"inputs": [{"name": "_maker", "type": "address"}],
	"name": "getBlackListStatus",
	"outputs": [{"name": "", "type": "bool"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"anonymous": false,
	"inputs": [{"name": "", "type": "address"}, {"name": "", "type": "address"}],
	"name": "allowed",
	"outputs": [{"name": "", "type": "uint256"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"anonymous": false,
	"inputs": [],
	"name": "paused",
	"outputs": [{"name": "", "type": "bool"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"anonymous": false,
	"inputs": [{"name": "who", "type": "address"}],
	"name": "balanceOf",
	"outputs": [{"name": "", "type": "uint256"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": false,
	"anonymous": false,
	"inputs": [],
	"name": "pause",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": true,
	"anonymous": false,
	"inputs": [],
	"name": "getOwner",
	"outputs": [{"name": "", "type": "address"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"anonymous": false,
	"inputs": [],
	"name": "owner",
	"outputs": [{"name": "", "type": "address"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"anonymous": false,
	"inputs": [],
	"name": "symbol",
	"outputs": [{"name": "", "type": "string"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": false,
	"anonymous": false,
	"inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}],
	"name": "transfer",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": false,
	"anonymous": false,
	"inputs": [{"name": "newBasisPoints", "type": "uint256"}, {"name": "newMaxFee", "type": "uint256"}],
	"name": "setParams",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": false,
	"anonymous": false,
	"inputs": [{"name": "amount", "type": "uint256"}],
	"name": "issue",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": false,
	"anonymous": false,
	"inputs": [{"name": "amount", "type": "uint256"}],
	"name": "redeem",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": true,
	"anonymous": false,
	"inputs": [{"name": "_owner", "type": "address"}, {"name": "_spender", "type": "address"}],
	"name": "allowance",
	"outputs": [{"name": "remaining", "type": "uint256"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"anonymous": false,
	"inputs": [],
	"name": "basisPointsRate",
	"outputs": [{"name": "", "type": "uint256"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"anonymous": false,
	"inputs": [{"name": "", "type": "address"}],
	"name": "isBlackListed",
	"outputs": [{"name": "", "type": "bool"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": false,
	"anonymous": false,
	"inputs": [{"name": "_clearedUser", "type": "address"}],
	"name": "removeBlackList",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": true,
	"anonymous": false,
	"inputs": [],
	"name": "MAX_UINT",
	"outputs": [{"name": "", "type": "uint256"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": false,
	"anonymous": false,
	"inputs": [{"name": "newOwner", "type": "address"}],
	"name": "transferOwnership",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": false,
	"anonymous": false,
	"inputs": [{"name": "_blackListedUser", "type": "address"}],
	"name": "destroyBlackFunds",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": false,
	"anonymous": false,
	"inputs": [{"name": "_initialSupply", "type": "uint256"}, {"name": "_name", "type": "string"}, {
		"name": "_symbol",
		"type": "string"
	}, {"name": "_decimals", "type": "uint256"}],
	"name" : "",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "constructor"
}, {
	"constant": false,
	"anonymous": false,
	"inputs": [{"indexed": false, "name": "amount", "type": "uint256"}],
	"name": "Issue",
	"outputs": [],
	"payable": false,
	"stateMutability": "",
	"type": "event"
}, {
	"constant": false,
	"anonymous": false,
	"inputs": [{"indexed": false, "name": "amount", "type": "uint256"}],
	"name": "Redeem",
	"outputs": [],
	"payable": false,
	"stateMutability": "",
	"type": "event"
}, {
	"constant": false,
	"anonymous": false,
	"inputs": [{"indexed": false, "name": "newAddress", "type": "address"}],
	"name": "Deprecate",
	"outputs": [],
	"payable": false,
	"stateMutability": "",
	"type": "event"
}, {
	"constant": false,
	"anonymous": false,
	"inputs": [{"indexed": false, "name": "feeBasisPoints", "type": "uint256"}, {
		"indexed": false,
		"name": "maxFee",
		"type": "uint256"
	}],
	"name": "Params",
	"outputs": [],
	"payable": false,
	"stateMutability": "",
	"type": "event"
}, {
	"constant": false,
	"anonymous": false,
	"inputs": [{"indexed": false, "name": "_blackListedUser", "type": "address"}, {
		"indexed": false,
		"name": "_balance",
		"type": "uint256"
	}],
	"name": "DestroyedBlackFunds",
	"outputs": [],
	"payable": false,
	"stateMutability": "",
	"type": "event"
}, {
	"constant": false,
	"anonymous": false,
	"inputs": [{"indexed": false, "name": "_user", "type": "address"}],
	"name": "AddedBlackList",
	"outputs": [],
	"payable": false,
	"stateMutability": "",
	"type": "event"
}, {
	"constant": false,
	"anonymous": false,
	"inputs": [{"indexed": false, "name": "_user", "type": "address"}],
	"name": "RemovedBlackList",
	"outputs": [],
	"payable": false,
	"stateMutability": "",
	"type": "event"
}, {
	"constant": false,
	"anonymous": false,
	"inputs": [{"indexed": true, "name": "owner", "type": "address"}, {
		"indexed": true,
		"name": "spender",
		"type": "address"
	}, {"indexed": false, "name": "value", "type": "uint256"}],
	"name": "Approval",
	"outputs": [],
	"payable": false,
	"stateMutability": "",
	"type": "event"
}, {
	"constant": false,
	"anonymous": false,
	"inputs": [{"indexed": true, "name": "from", "type": "address"}, {
		"indexed": true,
		"name": "to",
		"type": "address"
	}, {"indexed": false, "name": "value", "type": "uint256"}],
	"name": "Transfer",
	"outputs": [],
	"payable": false,
	"stateMutability": "",
	"type": "event"
}, {
	"constant": false,
	"anonymous": false,
	"inputs": [],
	"name": "Pause",
	"outputs": [],
	"payable": false,
	"stateMutability": "",
	"type": "event"
}, {
	"constant": false,
	"anonymous": false,
	"inputs": [],
	"name": "Unpause",
	"outputs": [],
	"payable": false,
	"stateMutability": "",
	"type": "event"
}];
