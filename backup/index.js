const ethers = require('ethers');
const wallet = require('./wallet');
const { usdtABI } = require('./abi');

const walletObj = wallet.createWalletFromMnemonic('position clerk entire salt dune bus hazard provide record lyrics announce allow')
console.log(walletObj);

const nextWalletObj = wallet.createNewAddress(walletObj)
console.log(nextWalletObj);

const extendedWallet = wallet.createWalletFromExtendedKey("xprvA1GZU99FkT9g9ZMcXufWN36oK5YgQDYGBXhaJQK8rCpRJ44YMeQWdeo12xbrJK8vx9W8kwFzZcrbEzGFyCJEY6NKqJojAKEDKsFZ4VXPaVu")
console.log(extendedWallet);

const privateKeyWallet = wallet.createWalletFromPrivateKey("f8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a")
console.log(privateKeyWallet);


// const mnemonicObj = ethers.Mnemonic.fromPhrase(mnemonic)

// const walletObj1 = ethers.HDNodeWallet.fromMnemonic(mnemonicObj)

// wallet.getAccountBalance("0x3B5Ed1724E4CdE8C22D2c1fAD4625D06A828D7F8").then(b => {
//     console.log(b);
// })

// wallet.getAccountTokenBalance("0x3B5Ed1724E4CdE8C22D2c1fAD4625D06A828D7F8", "0x9DC9a9a2a753c13b63526d628B1Bf43CabB468Fe", usdtABI).then(b => {
//     console.log(b);
// })

wallet.getNonce(walletObj.address).then(async nonce => {
    const signedTx = await wallet.signTransaction(walletObj, '0x3B5Ed1724E4CdE8C22D2c1fAD4625D06A828D7F8', '0.01', nonce);
    console.log(signedTx);
    await wallet.broadcastTransaction(signedTx);
})
