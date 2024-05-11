const ethers = require('ethers');
const fetch = require('node-fetch');
const { network, infuraKey } = require("./config");

const Wallet = {
    isHD: false, // 是否是HD钱包
    mnemonic: '', // 助记词
    password: '', // 钱包密码，如果password不为空，mnemonic和privateKey应该为密文
    address: '', // 地址
    publicKey: '', // 公钥
    privateKey: '', // 私钥
    index: 0, // 钱包地址index. 非HD钱包，index永远为0
    path: '', // 钱包路径. 非HD钱包，path为空
}

/**
 * 从助记词恢复钱包
 * @param {*} mnemonic 
 * @returns 
 */
exports.createWalletFromMnemonic = function (mnemonic = null) {
    let mnemonicObj;

    // 如果助记词不存在，就随机创建一个助记词
    if (!mnemonic) {
        mnemonicObj = mnemonicObj = ethers.Wallet.createRandom().mnemonic;
        // console.log(mnemonicObj.phrase);
    } else {
        if (!ethers.Mnemonic.isValidMnemonic(mnemonic)) {
            throw new Error('助记词不合规')
        }
        mnemonicObj = ethers.Mnemonic.fromPhrase(mnemonic)
        // console.log(mnemonicObj.phrase);
    }
    const walletObj = ethers.HDNodeWallet.fromMnemonic(mnemonicObj)

    return {
        isHD: true,
        mnemonic: walletObj.mnemonic.phrase,
        password: '',
        address: walletObj.address,
        publicKey: walletObj.publicKey,
        privateKey: walletObj.privateKey,
        index: walletObj.index,
        path: walletObj.path
    }
}

/**
 * 从扩展私钥恢复钱包
 * 支持 BIP32 Root Key | Account Extended Private Key | BIP32 Extended Private Key
 * @param {*} extendedKey 
 * @returns 
 */
exports.createWalletFromExtendedKey = function (extendedKey) {

    if (!extendedKey) {
        throw new Error('未指定扩展私钥')
    }

    const walletObj = ethers.HDNodeWallet.fromExtendedKey(extendedKey)

    let wallet = {
        isHD: true,
        mnemonic: '',
        password: '',
    }

    let deriveWallet;

    switch (walletObj.depth) {
        case 0:
            deriveWallet = walletObj.derivePath(ethers.defaultPath);
            wallet = {
                ...wallet,
                address: deriveWallet.address,
                publicKey: deriveWallet.publicKey,
                privateKey: deriveWallet.privateKey,
                index: deriveWallet.index,
                path: ethers.defaultPath
            }
            break;
        case 3:
            deriveWallet = walletObj.derivePath('m/0/0');
            wallet = {
                ...wallet,
                address: deriveWallet.address,
                publicKey: deriveWallet.publicKey,
                privateKey: deriveWallet.privateKey,
                index: deriveWallet.index,
                path: ethers.defaultPath
            }
            break;
        case 4:
            deriveWallet = walletObj.derivePath('m/0');
            wallet = {
                ...wallet,
                address: deriveWallet.address,
                publicKey: deriveWallet.publicKey,
                privateKey: deriveWallet.privateKey,
                index: deriveWallet.index,
                path: ethers.defaultPath
            }
            break
        default:
            throw new Error('暂不支持此类型扩展私钥')
    }

    return wallet;
}

/**
 * 从钱包私钥恢复
 * @param {*} privateKey 
 */
exports.createWalletFromPrivateKey = function (privateKey = null) {

    // 如果私钥不存在，就随机创建一个私钥
    if (!privateKey) {
        privateKey = ethers.Wallet.createRandom().privateKey
    }

    let privateKeyObj;
    try {
        if (typeof privateKey == 'string' && !privateKey.startsWith('0x')) {
            privateKey = '0x' + privateKey
        }
        privateKeyObj = new ethers.SigningKey(privateKey)
    } catch (error) {
        throw new Error('私钥不合规')
    }

    const walletObj = new ethers.Wallet(privateKeyObj)

    return {
        isHD: false,
        mnemonic: '',
        password: '',
        address: walletObj.address,
        publicKey: ethers.SigningKey.computePublicKey(walletObj.privateKey, true),
        privateKey: walletObj.privateKey,
        index: walletObj.index,
        path: walletObj.path
    }
}

/**
 * 创建钱包新地址
 * @param {*} wallet 
 * @returns 
 */
exports.createNewAddress = function (wallet) {
    if (!wallet) {
        throw new Error('未指定当前钱包')
    }
    const mnemonicObj = ethers.Mnemonic.fromPhrase(wallet.mnemonic)
    const nextPath = ethers.getIndexedAccountPath(wallet.index + 1)
    const walletObj = ethers.HDNodeWallet.fromMnemonic(mnemonicObj, nextPath)

    return {
        isHD: true,
        mnemonic: walletObj.mnemonic.phrase,
        password: '',
        address: walletObj.address,
        publicKey: walletObj.publicKey,
        privateKey: walletObj.privateKey,
        index: walletObj.index,
        path: walletObj.path
    }
}

/**
 * 获取地址中的ETH余额
 * @param {*} address 
 * @returns 
 */
exports.getAccountBalance = async function (address) {
    if (!address) {
        throw new Error('未指定钱包地址')
    }
    const provider = new ethers.InfuraProvider(network, infuraKey);
    const balance = await provider.getBalance(address);
    return balance
}

/**
 * 获取地址中指定 Token 合约的余额
 * @param {*} address 
 * @param {*} tokenAddress 指定的 Token 地址，例如 USDT 合约地址
 * @param {*} ABI 指定 Token 合约对应的 ABI 接口描述
 * @returns 
 */
exports.getAccountTokenBalance = async function (address, tokenAddress, ABI) {
    if (!address) {
        throw new Error('未指定钱包地址')
    }

    if (!tokenAddress) {
        throw new Error('未指定Token合约地址')
    }

    const provider = new ethers.InfuraProvider(network, infuraKey);
    const tokenContract = new ethers.Contract(tokenAddress, ABI, provider);
    const balance = await tokenContract.balanceOf(address);
    return balance
}

/**
 * 获取网络当前 gas price
 * @returns 
 */
exports.getGasPrice = async function () {
    const url = `https://${network}.infura.io/v3/${infuraKey}`;

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_gasPrice',
            params: [],
            id: 1
        })
    };

    const response = await fetch(url, options);
    if (response.status === 200) {
        const gasPrice = await response.json();
        return gasPrice.result;
    } else {
        return null;
    }
}

/**
 * 获取钱包当前 nonce
 * @param {*} address 
 * @returns 
 */
exports.getNonce = async function(address) {
    if (!address) {
        throw new Error('未指定钱包地址')
    }
    const provider = new ethers.InfuraProvider(network, infuraKey);
    const nonce = await provider.getTransactionCount(address);
    return nonce;
}

/**
 * 签名交易
 * @param {*} wallet
 * @param {*} to        收款方地址
 * @param {*} value     ETH 数量
 * @param {*} nonce     nonce 非常重要，可以通过 infura 接口查询当前 nonce
 * @param {*} gasLimit  发送 ETH 的 gasLimit 是固定的 21000，调用其他合约的交易需要提前预估 gasLimit
 * @returns 
 */
exports.signTransaction = async function (wallet, to, value, nonce, gasLimit = 21000) {
    if (!wallet) {
        throw new Error('未指定当前钱包')
    }
    const privateKey = wallet.privateKey;
    const signWallet = new ethers.Wallet(privateKey);

    const gasPrice = await this.getGasPrice();

    const chain = ethers.Network.from(network);

    const transaction = {
        nonce: nonce,
        gasLimit: gasLimit,
        gasPrice: BigInt(gasPrice),
        value: ethers.parseEther(value),
        chainId: chain.chainId,
        to: to
    }

    const signedTransaction = await signWallet.signTransaction(transaction);

    return signedTransaction;
}

/**
 * 广播交易
 * @param {*} signedTransaction 
 */
exports.broadcastTransaction = async function (signedTransaction) {
    if (!signedTransaction) {
        throw new Error('未签名交易')
    }
    const provider = new ethers.InfuraProvider(network, infuraKey);
    const response = await provider.broadcastTransaction(signedTransaction);
    console.log(response);
}
