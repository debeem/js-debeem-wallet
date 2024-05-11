1. [Installation](#installation)
1. [Changes](#changes)
1. [API](#api)
    1. [Services](#Services)
        1. [chain](#Services-chain)
            1. [ChainService](#Services-chain-ChainService)
                1. [`exists`](#Services-chain-ChainService-exists)
                1. [`getItem`](#Services-chain-ChainService-getItem)
        2. [storage](#Services-storage)
            1. [BasicStorageService](#Services-storage-BasicStorageService)
                1. [`isValidItem`](#Services-storage-BasicStorageService-isValidItem)
                1. [`get`](#Services-storage-BasicStorageService-get)
                1. [`getAllKeys`](#Services-storage-BasicStorageService-getAllKeys)
                1. [`getAll`](#Services-storage-BasicStorageService-getAll)
                1. [`put`](#Services-storage-BasicStorageService-put)
                1. [`delete`](#Services-storage-BasicStorageService-delete)
                1. [`clear`](#Services-storage-BasicStorageService-clear)
           1. [ChainStorageService](#Services-storage-ChainStorageService)
               1. [`isValidItem`](#Services-storage-ChainStorageService-isValidItem)
               1. [`isValidRpcItem`](#Services-storage-ChainStorageService-isValidRpcItem)
               1. [`getDefault`](#Services-storage-ChainStorageService-getDefault)
               1. [`flushDefault`](#Services-storage-ChainStorageService-flushDefault)
               1. [`getKeyByItem`](#Services-storage-ChainStorageService-getKeyByItem)
               1. [`getKeyByChainId`](#Services-storage-ChainStorageService-getKeyByChainId)
               1. [`get`](#Services-storage-ChainStorageService-get)
               1. [`getByChainId`](#Services-storage-ChainStorageService-getByChainId)
               1. [`getFirst`](#Services-storage-ChainStorageService-getFirst)
               1. [`getAllKeys`](#Services-storage-ChainStorageService-getAllKeys)
               1. [`getAll`](#Services-storage-ChainStorageService-getAll)
               1. [`put`](#Services-storage-ChainStorageService-put)
               1. [`delete`](#Services-storage-ChainStorageService-delete)
               1. [`clear`](#Services-storage-ChainStorageService-clear)
           1. [TokenStorageService](#Services-storage-TokenStorageService)
               1. [`isValidItem`](#Services-storage-TokenStorageService-isValidItem)
               1. [`getDefault`](#Services-storage-TokenStorageService-getDefault)
               1. [`flushDefault`](#Services-storage-TokenStorageService-flushDefault)
               1. [`getKeyByItem`](#Services-storage-TokenStorageService-getKeyByItem)
               1. [`get`](#Services-storage-TokenStorageService-get)
               1. [`getFirst`](#Services-storage-TokenStorageService-getFirst)
               1. [`getAllKeys`](#Services-storage-TokenStorageService-getAllKeys)
               1. [`getAll`](#Services-storage-TokenStorageService-getAll)
               1. [`put`](#Services-storage-TokenStorageService-put)
               1. [`delete`](#Services-storage-TokenStorageService-delete)
               1. [`clear`](#Services-storage-TokenStorageService-clear)
           1. [WalletStorageService](#Services-storage-WalletStorageService)
               1. [`generateRandomWalletAddress`](#Services-storage-WalletStorageService-generateRandomWalletAddress)
               1. [`isValidItem`](#Services-storage-WalletStorageService-isValidItem)
               1. [`getKeyByItem`](#Services-storage-WalletStorageService-getKeyByItem)
               1. [`get`](#Services-storage-WalletStorageService-get)
               1. [`getFirst`](#Services-storage-WalletStorageService-getFirst)
               1. [`getAllKeys`](#Services-storage-WalletStorageService-getAllKeys)
               1. [`getAll`](#Services-storage-WalletStorageService-getAll)
               1. [`put`](#Services-storage-WalletStorageService-put)
               1. [`delete`](#Services-storage-WalletStorageService-delete)
               1. [`clear`](#Services-storage-WalletStorageService-clear)
       1. [token](#Services-token)
           1. [TokenService](#Services-token-TokenService)
               1. [`exists`](#Services-token-TokenService-exists)
               1. [`getItem`](#Services-token-TokenService-getItem)
               1. [`getIconByContract`](#Services-token-TokenService-getIconByContract)
               1. [`getIconBySymbol`](#Services-token-TokenService-getIconBySymbol)
       1. [wallet](#Services-wallet)
           1. [WalletFactory](#Services-wallet-WalletFactory)
               1. [`isValidWalletFactoryData`](#Services-wallet-WalletFactory-isValidWalletFactoryData)
               1. [`createWalletFromMnemonic`](#Services-wallet-WalletFactory-createWalletFromMnemonic)
               1. [`createWalletFromKeystore`](#Services-wallet-WalletFactory-createWalletFromKeystore)
               1. [`createWalletFromExtendedKey`](#Services-wallet-WalletFactory-createWalletFromExtendedKey)
               1. [`createWalletFromPrivateKey`](#Services-wallet-WalletFactory-createWalletFromPrivateKey)
               1. [`createNewAddress`](#Services-wallet-WalletFactory-createNewAddress)
          1. [WalletAccount](#Services-wallet-WalletAccount)
              1. [`getAccountBalance`](#Services-wallet-WalletAccount-getAccountBalance)
              1. [`getAccountTokenBalance`](#Services-wallet-WalletAccount-getAccountTokenBalance)
          1. [WalletNFT](#Services-wallet-WalletTransaction)
              1. [`queryNFTs`](#Services-wallet-WalletNFT-queryNFTs)
          1. [WalletTransaction](#Services-wallet-WalletTransaction)
              1. [`getDefaultGasLimit`](#Services-wallet-WalletTransaction-getDefaultGasLimit)
              1. [`getNonce`](#Services-wallet-WalletTransaction-getNonce)
              1. [`send`](#Services-wallet-WalletTransaction-send)
              1. [`signTransaction`](#Services-wallet-WalletTransaction-signTransaction)
              1. [`broadcastTransaction`](#Services-wallet-WalletTransaction-broadcastTransaction)
              1. [`sendContractTransaction`](#Services-wallet-WalletTransaction-sendContractTransaction)
              1. [`queryTransactionHistory`](#Services-wallet-WalletTransaction-queryTransactionHistory)
              1. [`queryTransactionCountFromAddress`](#Services-wallet-WalletTransaction-queryTransactionCountFromAddress)
              1. [`queryTransactionDetail`](#Services-wallet-WalletTransaction-queryTransactionDetail)
              1. [`queryTransactionReceipt`](#Services-wallet-WalletTransaction-queryTransactionReceipt)





1. [Unit Test](#unit-test)






# Installation
```
npm install debeem-wallet
```

# Changes

[See details of (potentially) breaking changes](CHANGELOG.md).


# API



# Unit Test

```
npm test
```
Or

```bash
npm install -g jest

jest
```
