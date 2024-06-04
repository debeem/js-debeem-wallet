# debeem-wallet

A complete, compact, and simple Ethereum wallet library based on the ethers library.

## Table of contents
- [Features](#Features)
- [Architecture](#Architecture)
- [Installation](#Installation)
- [Configuration](#Configuration)
  - [About chain](#About chain) 
  - [Configure a chain for your wallet](#Configure a chain for your wallet) 
- [Usage](#Usage)
  - [Wallet Services](#Wallet Services)
  - [Storage Services](#Storage Services)
  - [Chain Service](#Chain Service)
  - [Token Service](#Token Service)
- [Unit Tests](#Unit Tests)
- [Documentation](#Documentation)


## Features

1. Easy to use, whether you have experience in Ethereum wallet development or not, you can easily get started.
1. Provides complete functions such as creation, import, and backup of Ethereum wallets.
1. Provides balance query, total value statistics, and real-time trading pair quotes for Ethereum native token and derivative tokens.
1. Provides transfer, real-time transaction gas fee estimating, transaction history query, transaction details query, and transaction receipt query functions for Ethereum native token and derivative tokens.
1. Provides information query for Ethereum native token and derivative tokens.
1. Provides network information query by chainId.
1. Provide local structured data storage based on AES256 encryption algorithm, and the password can be modified at will.


## Architecture
### UML Graph
```mermaid
flowchart TD

    id([debeem-id])
    cipher([debeem-cipher])
    ethers([ethers])
    idb([idb])

    ethers -. «extend» .-> root
    id -. «extend» .-> root
    cipher -. «extend» .-> root
    idb -. «extend» .-> root

    subgraph debeem-wallet
        root([debeem-wallet])

        config(Config)
        walletServices(Wallet Services)
        storageServices(Storage Services)
        chainService(Chain Service)
        tokenService(Token Service)
        root --- config
        root --- walletServices
        root --- storageServices
        root --- chainService
        root --- tokenService

        %% wallet service list
        walletServiceList["WalletFactory
            WalletAccount
            WalletTransaction
            WalletNFT"]
        walletServices --- walletServiceList

        %% storage service list
        encryptedStorageServices(Encrypted Storage Services)
        storageServicesList["SysUserStorageService
            BasicStorageService
            ChainStorageService
            TokenStorageService
            WalletStorageService"]
        storageServices --- encryptedStorageServices
        encryptedStorageServices --- storageServicesList

        %% chain service list
        tokenServiceList["TokenService"]
        tokenService --- tokenServiceList

        %% token service list
        chainServiceList["ChainService"]
        chainService --- chainServiceList

    end
```

### Dependency Packages

- [debeem-id](https://www.npmjs.com/package/debeem-id)
- [debeem-cipher](https://www.npmjs.com/package/debeem-cipher)
- [ethers](https://www.npmjs.com/package/ethers)
- [idb](https://www.npmjs.com/package/idb)


## Installation
```
npm i debeem-wallet
```

## Configuration

### About chain
There are many chains in the entire blockchain world, such as the Bitcoin chain, Ethereum chain, etc. Every wallet **MUST** work on a certain chain (or call it a network).

So, before using any functions or classes in this development package, you **MUST** first configure a chain/network for your wallet.

View all chains on:  
https://chainlist.org/


### Configure a chain for your wallet

| Function                                                 | Description                                   |
|----------------------------------------------------------|-----------------------------------------------|
| [getDefaultChain](config.md#getDefaultChain())           | get default chainId                           |
| [getCurrentChain](config.md#getCurrentChain())           | get current chainId                           |
| [setCurrentChain](config.md#setCurrentChain())           | set/update current chainId                    |
| [revertToDefaultChain](config.md#revertToDefaultChain()) | revert the current chain to the default chain |




## Usage

### Wallet Services

| Class                                                     | Description                                                                                                                                                 |
|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [WalletFactory](services/wallet/WalletFactory.md)         | create a new wallet, or import a wallet from a specified mnemonic, keystore, private key or wallet address                                                  |
| [WalletAccount](services/wallet/WalletAccount.md)         | query balance, calculate total value, and request real-time quotes for Ethereum native token and derivative tokens                                          |
| [WalletTransaction](services/wallet/WalletTransaction.md) | send and receive Ethereum native token and derivative tokens, estimate transaction gas fee in real time, and query transaction history, details and receipt |
| [WalletNFT](services/wallet/WalletNFT.md)                 | query NFTs by wallet address                                                                                                                                |


### Storage Services

| Class                                                                 | Description                                                                                                         |
|-----------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| [SysUserStorageService](services/storage/SysUserStorageService.md)    | manage table encryption, modify pinCode                                                                             |
| [BasicStorageService](services/storage/BasicStorageService/README.md) | simple storage based on key-value                                                                                   |
| [ChainStorageService](services/storage/ChainStorageService.md)        | get the default supported chain list, get the specified chain information, add, delete and update chain information |
| [TokenStorageService](services/storage/TokenStorageService.md)        | get the default supported token list, get the specified token information, add, delete and update token information |
| [WalletStorageService](services/storage/WalletStorageService.md)      | based on secure encryption, obtain the specified wallet information, add, delete and update wallet information      |


### Chain Service

| Class                                          | Description                                                                |
|------------------------------------------------|----------------------------------------------------------------------------|
| [ChainService](services/chain/ChainService.md) | check whether a chain exists and obtain the chain information by chain id. |


### Token Service

| Class                                          | Description                                                                        |
|------------------------------------------------|------------------------------------------------------------------------------------|
| [TokenService](services/token/TokenService.md) | check whether a token exists and obtain the token information by contract address. |


## Unit Tests
This project has complete unit tests with an average coverage of over 90%. Run the unit tests in the project root directory:
```shell
jest
```


## Documentation
- [https://doc.debeem.metabeem.com](#https://doc.debeem.metabeem.com)


## License
- MIT ([LICENSE-MIT](https://github.com/libp2p/js-libp2p/blob/main/LICENSE-MIT) / <http://opensource.org/licenses/MIT>)



