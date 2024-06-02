# debeem-wallet

A complete, compact, and simple Ethereum wallet library based on the ethers library.

## Table of contents
- [Features](#Features)
- [Architecture](#Architecture)
- [Installation](#Installation)
- [Usage](#Usage)
  - [Configuration](#Configuration)
  - [Services](#Services)
- [Unit Tests](#Unit Tests)


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

        walletServices(Wallet Services)
        storageServices(Storage Services)
        chainService(Chain Service)
        tokenService(Token Service)
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

## Usage
### Configuration
Before using this development kit, you must first use the following function to set the current chain/network for the wallet.

| Function                                                 | Description                                   |
|----------------------------------------------------------|-----------------------------------------------|
| [getDefaultChain](config.md#getDefaultChain())           | get default chainId                           |
| [getCurrentChain](config.md#getCurrentChain())           | get current chainId                           |
| [setCurrentChain](config.md#setCurrentChain())           | set/update current chainId                    |
| [revertToDefaultChain](config.md#revertToDefaultChain()) | revert the current chain to the default chain |


### Wallet Services

| Class                                            | Description                                                                                                                                                 |
|--------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [WalletFactory](config.md#getDefaultChain())     | create a new wallet, or import a wallet from a specified mnemonic, keystore, private key or wallet address                                                  |
| [WalletAccount](config.md#getCurrentChain())     | query balance, calculate total value, and request real-time quotes for Ethereum native token and derivative tokens                                          |
| [WalletTransaction](config.md#setCurrentChain()) | send and receive Ethereum native token and derivative tokens, estimate transaction gas fee in real time, and query transaction history, details and receipt |
| [WalletNFT](config.md#revertToDefaultChain())    | query NFTs by wallet address                                                                                                                                |


### Storage Services
  - SysUserStorageService
  - BasicStorageService
  - ChainStorageService
  - TokenStorageService
  - WalletStorageService

### Chain Service
  - ChainService

### Token Service
  - TokenService



## Unit Tests
This project has complete unit tests with an average coverage of over 90%. Run the unit tests in the project root directory:
```shell
jest
```


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
