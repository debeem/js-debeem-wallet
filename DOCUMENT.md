# What is debeem-wallet?

A complete, compact, and simple Ethereum wallet library based on the `ethers` library.


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
<img src="https://raw.githubusercontent.com/debeem/debeem.github.io/main/resources/images/debeem-wallet-architecture-w.png" />

### Dependency Packages

- [debeem-id](https://www.npmjs.com/package/debeem-id)
- [debeem-cipher](https://www.npmjs.com/package/debeem-cipher)
- [ethers](https://www.npmjs.com/package/ethers)
- [idb](https://www.npmjs.com/package/idb)


## Installation
### 1, install nvm
use the following cURL or Wget command to install [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file):
```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```
```shell
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```
### 2, install node

install the latest LTS version of node, for example: v18.20.3 (Latest LTS: Hydrogen)
```shell
nvm install v18.20.3
nvm use v18.20.3
```
### 3, install our package
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

| Function                                                                                                                    | Description                                   |
|-----------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------|
| [getDefaultChain](https://debeem.github.io/docs/js-debeem-wallet/functions/config_functions.getDefaultChain.html)           | get default chainId                           |
| [getCurrentChain](https://debeem.github.io/docs/js-debeem-wallet/functions/config_functions.getCurrentChain.html)           | get current chainId                           |
| [setCurrentChain](https://debeem.github.io/docs/js-debeem-wallet/functions/config_functions.setCurrentChain.html)           | set/update current chainId                    |
| [revertToDefaultChain](https://debeem.github.io/docs/js-debeem-wallet/functions/config_functions.revertToDefaultChain.html) | revert the current chain to the default chain |




## Usage

### Wallet Services

| Class                                                                                              | Description                                                                                                                                                 |
|----------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [WalletFactory](https://debeem.github.io/docs/js-debeem-wallet/modules/WalletFactory.html)         | create a new wallet, or import a wallet from a specified mnemonic, keystore, private key or wallet address                                                  |
| [WalletAccount](https://debeem.github.io/docs/js-debeem-wallet/modules/WalletAccount.html)         | query balance, calculate total value, and request real-time quotes for Ethereum native token and derivative tokens                                          |
| [WalletTransaction](https://debeem.github.io/docs/js-debeem-wallet/modules/WalletTransaction.html) | send and receive Ethereum native token and derivative tokens, estimate transaction gas fee in real time, and query transaction history, details and receipt |
| [WalletNFT](https://debeem.github.io/docs/js-debeem-wallet/modules/WalletNFT.html)                 | query NFTs information                                                                                                                                      |


### Storage Services

| Class                                                                                                      | Description                                                                                                         |
|------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| [SysUserStorageService](https://debeem.github.io/docs/js-debeem-wallet/modules/SysUserStorageService.html) | manage table encryption, modify pinCode                                                                             |
| [BasicStorageService](https://debeem.github.io/docs/js-debeem-wallet/modules/BasicStorageService.html)     | simple storage based on key-value                                                                                   |
| [ChainStorageService](https://debeem.github.io/docs/js-debeem-wallet/modules/ChainStorageService.html)     | get the default supported chain list, get the specified chain information, add, delete and update chain information |
| [TokenStorageService](https://debeem.github.io/docs/js-debeem-wallet/modules/TokenStorageService.html)     | get the default supported token list, get the specified token information, add, delete and update token information |
| [WalletStorageService](https://debeem.github.io/docs/js-debeem-wallet/modules/WalletStorageService.html)   | based on secure encryption, obtain the specified wallet information, add, delete and update wallet information      |


### Chain Service

| Class                                          | Description                                                                |
|------------------------------------------------|----------------------------------------------------------------------------|
| [ChainService](https://debeem.github.io/docs/js-debeem-wallet/modules/ChainService.html) | check whether a chain exists and obtain the chain information by chain id. |


### Token Service

| Class                                                                                    | Description                                                                        |
|------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------|
| [TokenService](https://debeem.github.io/docs/js-debeem-wallet/modules/TokenService.html) | check whether a token exists and obtain the token information by contract address. |



## Unit Tests
This project has complete unit tests with an average coverage of over 90%. Run the unit tests in the project root directory:
```shell
jest
```


## License
- MIT ([LICENSE-MIT](https://github.com/libp2p/js-libp2p/blob/main/LICENSE-MIT) / <http://opensource.org/licenses/MIT>)
