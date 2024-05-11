"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const ethers = require("ethers");
const wallet = require('./wallet');
const { usdtABI } = require("../src/usdtABI");
describe("Create Wallet From Mnemonic", () => {
    it("should create a wallet from a empty mnemonic", () => __awaiter(void 0, void 0, void 0, function* () {
        // Create a wallet from the mnemonic
        const walletObj = wallet.createWalletFromMnemonic();
        expect(walletObj).not.toBeNull();
        expect(walletObj.mnemonic.split(" ").length).toBe(12);
        expect(walletObj.privateKey.startsWith('0x')).toBe(true);
        expect(walletObj.address.startsWith('0x')).toBe(true);
    }));
    it("should create a wallet from a random mnemonic", () => __awaiter(void 0, void 0, void 0, function* () {
        const mnemonic = 'olympic cradle tragic crucial exit annual silly cloth scale fine gesture ancient';
        const walletObj = wallet.createWalletFromMnemonic(mnemonic);
        expect(walletObj).not.toBeNull();
        expect(walletObj.mnemonic).toBe(mnemonic);
        expect(walletObj.privateKey.startsWith('0x')).toBe(true);
        expect(walletObj.address.startsWith('0x')).toBe(true);
        expect(walletObj.index).toBe(0);
        expect(walletObj.path).toBe(ethers.defaultPath);
    }));
    it("should throw an error if the mnemonic is not valid", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            wallet.createWalletFromMnemonic("invalid mnemonic");
        }
        catch (error) {
            // Assert that the error is thrown
            expect(error).toBeDefined();
            expect(error.message).toEqual("助记词不合规");
        }
    }));
});
describe("Create Wallet From Private Key", () => {
    it("should create a wallet from a empty private key", () => __awaiter(void 0, void 0, void 0, function* () {
        const walletObj = wallet.createWalletFromPrivateKey();
        expect(walletObj).not.toBeNull();
        expect(walletObj.mnemonic).toBe('');
        expect(walletObj.privateKey.startsWith('0x')).toBe(true);
        expect(walletObj.address.startsWith('0x')).toBe(true);
        expect(walletObj.index).not.toBeDefined();
        expect(walletObj.path).not.toBeDefined();
    }));
    it("should create a wallet from a specified private key", () => __awaiter(void 0, void 0, void 0, function* () {
        // Create a wallet from the specified private key
        const privateKey = "0xf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a";
        const publicKey = "0x03ed2098910ab9068abd54e1562eb9dee3cb2d9fc1426dfe91541970a89b5aa622";
        const address = "0xC8F60EaF5988aC37a2963aC5Fabe97f709d6b357";
        const walletObj = wallet.createWalletFromPrivateKey(privateKey);
        expect(walletObj).not.toBeNull();
        expect(walletObj.mnemonic).toBe('');
        expect(walletObj.privateKey).toEqual(privateKey);
        expect(walletObj.publicKey).toEqual(publicKey);
        expect(walletObj.address).toEqual(address);
        expect(walletObj.index).not.toBeDefined();
        expect(walletObj.path).not.toBeDefined();
    }));
    it("should throw an error if the private key is not valid", () => __awaiter(void 0, void 0, void 0, function* () {
        // Try to create a wallet from an invalid private key
        const privateKey = "xxf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a";
        try {
            wallet.createWalletFromPrivateKey(privateKey);
        }
        catch (error) {
            // Assert that the error is thrown
            expect(error).toBeDefined();
            expect(error.message).toEqual("私钥不合规");
        }
    }));
});
describe("Create New Address", () => {
    it("should create a new adderss from a specified HD wallet", () => __awaiter(void 0, void 0, void 0, function* () {
        const mnemonic = 'olympic cradle tragic crucial exit annual silly cloth scale fine gesture ancient';
        const firstAddress = '0xC8F60EaF5988aC37a2963aC5Fabe97f709d6b357';
        const secondAdderss = '0x75BaAEc1C767A6A6F076dEEeA665F8642973dafA';
        const thirdAddress = '0xE05eCB996dA9D59315d569D65C93Af68bA9AA4a5';
        const walletObj = wallet.createWalletFromMnemonic(mnemonic);
        expect(walletObj.address).toBe(firstAddress);
        expect(walletObj.index).toBe(0);
        expect(walletObj.path).toBe(ethers.defaultPath);
        const secondWalletObj = wallet.createNewAddress(walletObj);
        expect(secondWalletObj.address).toBe(secondAdderss);
        expect(secondWalletObj.index).toBe(1);
        expect(secondWalletObj.path).toBe(ethers.getIndexedAccountPath(1));
        const thirdWalletObj = wallet.createNewAddress(secondWalletObj);
        expect(thirdWalletObj.address).toBe(thirdAddress);
        expect(thirdWalletObj.index).toBe(2);
        expect(thirdWalletObj.path).toBe(ethers.getIndexedAccountPath(2));
    }));
    it("should throw an error if the wallet is not valid", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            wallet.createNewAddress();
        }
        catch (error) {
            // Assert that the error is thrown
            expect(error).toBeDefined();
            expect(error.message).toEqual("未指定当前钱包");
        }
    }));
});
describe("Get Account Balance", () => {
    it("should get the Ether balance in the specified address through Infura API", () => __awaiter(void 0, void 0, void 0, function* () {
        const address = '0xC8F60EaF5988aC37a2963aC5Fabe97f709d6b357';
        const balance = yield wallet.getAccountBalance(address);
        expect(ethers.formatEther(balance)).toBe("0.1");
    }));
    it("should get the Ether balance in the specified new address through Infura API", () => __awaiter(void 0, void 0, void 0, function* () {
        const address = '0xE05eCB996dA9D59315d569D65C93Af68bA9AA4a5';
        const balance = yield wallet.getAccountBalance(address);
        expect(ethers.formatEther(balance)).toBe("0.0");
    }));
    it("should get the token contract balance in the specified address through Infura API", () => __awaiter(void 0, void 0, void 0, function* () {
        const address = '0xC8F60EaF5988aC37a2963aC5Fabe97f709d6b357';
        const usdtToken = '0x9e15898acf36C544B6f4547269Ca8385Ce6304d8';
        const balance = yield wallet.getAccountTokenBalance(address, usdtToken, usdtABI);
        expect(ethers.formatUnits(balance, 6)).toBe("100.0");
    }));
    it("should get the token contract balance in the specified new address through Infura API", () => __awaiter(void 0, void 0, void 0, function* () {
        const address = '0xE05eCB996dA9D59315d569D65C93Af68bA9AA4a5';
        const usdtToken = '0x9e15898acf36C544B6f4547269Ca8385Ce6304d8';
        const balance = yield wallet.getAccountTokenBalance(address, usdtToken, usdtABI);
        expect(ethers.formatUnits(balance, 6)).toBe("0.0");
    }));
    it("should throw an error if the adderss is not valid", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield wallet.getAccountBalance();
        }
        catch (error) {
            // Assert that the error is thrown
            expect(error).toBeDefined();
            expect(error.message).toEqual("未指定钱包地址");
        }
        try {
            yield wallet.getAccountTokenBalance();
        }
        catch (error) {
            // Assert that the error is thrown
            expect(error).toBeDefined();
            expect(error.message).toEqual("未指定钱包地址");
        }
    }));
    it("should throw an error if the token ABI is not valid", () => __awaiter(void 0, void 0, void 0, function* () {
        const address = '0xC8F60EaF5988aC37a2963aC5Fabe97f709d6b357';
        try {
            yield wallet.getAccountTokenBalance(address);
        }
        catch (error) {
            // Assert that the error is thrown
            expect(error).toBeDefined();
            expect(error.message).toEqual("未指定Token合约地址");
        }
    }));
});
