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
<img alt="UML Graph" src="https://raw.githubusercontent.com/debeem/debeem.github.io/main/resources/images/debeem-wallet-architecture-w.png" />

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
```shell
npm i debeem-wallet
```
*to fix issue: `Module not found: Error: Can't resolve 'fake-indexeddb/auto'`*
```shell
npm i -D fake-indexeddb
```


## Configuration

### About chain
There are many chains in the entire blockchain world, such as the Bitcoin chain, Ethereum chain, etc. Every wallet **MUST** work on a certain chain (or call it a network).

So, before using any functions or classes in this development package, you **MUST** first configure a chain/network for your wallet.

View all chains on:  
https://chainlist.org/


### Configurations

#### 1, Chain Configuration
| Function                                                                                                                              | Invocations | Storage  | Description                                                                                |
|---------------------------------------------------------------------------------------------------------------------------------------|-------------|----------|--------------------------------------------------------------------------------------------|
| [getDefaultChain](https://debeem.github.io/docs/js-debeem-wallet/functions/config_functions.getDefaultChain.html)                     | sync        | memory   | get default chainId from memory                                                            |
| [getCurrentChain](https://debeem.github.io/docs/js-debeem-wallet/functions/config_functions.getCurrentChain.html)                     | sync        | memory   | get current chainId from memory                                                            |
| [setCurrentChain](https://debeem.github.io/docs/js-debeem-wallet/functions/config_functions.setCurrentChain.html)                     | sync        | memory   | set/update current chainId to memory                                                       |
| [revertToDefaultChain](https://debeem.github.io/docs/js-debeem-wallet/functions/config_functions.revertToDefaultChain.html)           | sync        | memory   | revert the current chain to the default value in memory                                    |
| [getCurrentChainAsync](https://debeem.github.io/docs/js-debeem-wallet/functions/config_functions.getCurrentChainAsync.html)           | async       | database | asynchronously get current chainId from the database                                       |
| [putCurrentChainAsync](https://debeem.github.io/docs/js-debeem-wallet/functions/config_functions.putCurrentChainAsync.html)           | async       | database | asynchronously set/update current chainId into the database                                |
| [revertToDefaultChainAsync](https://debeem.github.io/docs/js-debeem-wallet/functions/config_functions.revertToDefaultChainAsync.html) | async       | database | asynchronously revert the current chain to the default value and save it into the database |

#### 2, Wallet Configuration

| Function                                                                                                                      | Invocations | Storage  | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|-------------------------------------------------------------------------------------------------------------------------------|-------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [getCurrentWalletAsync](https://debeem.github.io/docs/js-debeem-wallet/functions/config_functions.getCurrentWalletAsync.html) | async       | database | asynchronously get current wallet from the database                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| [putCurrentWalletAsync](https://debeem.github.io/docs/js-debeem-wallet/functions/config_functions.putCurrentWalletAsync.html) | async       | database | asynchronously put current wallet into the database                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| [initWalletAsync](https://debeem.github.io/docs/js-debeem-wallet/functions/config_functions.initWalletAsync.html)             | async       | database | asynchronously create or recover an account. For detailed usage instructions, please refer to the unit tests: [config.test.ts](https://github.com/debeem/js-debeem-wallet/blob/main/test/unit/configs/config.test.ts), [SysUserStorageService.test.ts](https://github.com/debeem/js-debeem-wallet/blob/main/test/unit/services/storage/SysUserStorageService.test.ts), [WalletStorageService.test.ts](https://github.com/debeem/js-debeem-wallet/blob/main/test/unit/services/storage/WalletStorageService.test.ts). |




## Usage

### Wallet Services

| Class                                                                                              | Description                                                                                                                                            |
|----------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| [WalletFactory](https://debeem.github.io/docs/js-debeem-wallet/modules/WalletFactory.html)         | create a new wallet, or import a wallet from a mnemonic, keystore, private key or a wallet address                                                     |
| [WalletAccount](https://debeem.github.io/docs/js-debeem-wallet/modules/WalletAccount.html)         | query balance, calculate total value, and request quotes in real-time for the Ethereum native token or any derivative tokens                           |
| [WalletTransaction](https://debeem.github.io/docs/js-debeem-wallet/modules/WalletTransaction.html) | send and receive your Ethereum native token or any derivative tokens, estimate transaction gas fee, and query transaction history, details and receipt |
| [WalletNFT](https://debeem.github.io/docs/js-debeem-wallet/modules/WalletNFT.html)                 | query NFTs information                                                                                                                                 |


### Storage Services

| Class                                                                                                      | Description                                                                                                               |
|------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| [SysUserStorageService](https://debeem.github.io/docs/js-debeem-wallet/modules/SysUserStorageService.html) | manage encryption information table and modify PIN code                                                                   |
| [BasicStorageService](https://debeem.github.io/docs/js-debeem-wallet/modules/BasicStorageService.html)     | simple storage based on key-value                                                                                         |
| [ChainStorageService](https://debeem.github.io/docs/js-debeem-wallet/modules/ChainStorageService.html)     | get the default supported chain list, get information of a chain, add, delete and update the information of a chain |
| [TokenStorageService](https://debeem.github.io/docs/js-debeem-wallet/modules/TokenStorageService.html)     | manage tokens of a wallet on a specified chain. get the token list, add, delete and update the token information |
| [WalletStorageService](https://debeem.github.io/docs/js-debeem-wallet/modules/WalletStorageService.html)   | based on secure encryption, obtain information of a wallet, add, delete and update a wallet                      |


### Chain Service

| Class                                          | Description                                                                |
|------------------------------------------------|----------------------------------------------------------------------------|
| [ChainService](https://debeem.github.io/docs/js-debeem-wallet/modules/ChainService.html) | check whether a chain exists and obtain the chain information by chain id. |


### Token Service

| Class                                                                                    | Description                                                                        |
|------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------|
| [TokenService](https://debeem.github.io/docs/js-debeem-wallet/modules/TokenService.html) | check whether a token exists and obtain the token information by contract address. |


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
