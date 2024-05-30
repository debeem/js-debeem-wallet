[debeem-wallet](../../README.md) / services/wallet/WalletFactory

# services/wallet/WalletFactory

## Classes

### WalletFactory

Code blocks are great for examples

```ts
// run typedoc --help for a list of supported languages
const instance = new MyClass();
```

#### Constructors

##### new WalletFactory()

```ts
new WalletFactory(): WalletFactory
```

###### Returns

[`WalletFactory`](WalletFactory.md#walletfactory)

#### Methods

##### createNewAddress()

```ts
createNewAddress(wallet: any): WalletEntityBaseItem
```

Generate a new address for the specified wallet

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `wallet` | `any` | {any} |

###### Returns

[`WalletEntityBaseItem`](../../entities/WalletEntity.md#walletentitybaseitem)

##### createWalletFromAddress()

```ts
createWalletFromAddress(address: string): WalletEntityBaseItem
```

Create a watch wallet from a wallet address

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | {string} |

###### Returns

[`WalletEntityBaseItem`](../../entities/WalletEntity.md#walletentitybaseitem)

##### createWalletFromExtendedKey()

```ts
createWalletFromExtendedKey(extendedKey: string): WalletEntityBaseItem
```

https://iancoleman.io/bip39/
	扩展私钥不是钱包的私钥，是助记词
	m/44'/60'/0'/0
	Derivation Path  BIP44

	Create a wallet from an extended private key.
	supported BIP32 Root Key | Account Extended Private Key | BIP32 Extended Private Key

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `extendedKey` | `string` | {string}	- BIP32 Extended Private Key |

###### Returns

[`WalletEntityBaseItem`](../../entities/WalletEntity.md#walletentitybaseitem)

##### createWalletFromKeystore()

```ts
createWalletFromKeystore(keystoreJson: string, password: string): Promise<WalletEntityBaseItem>
```

Returns the wallet details for the JSON Keystore Wallet json using {password}.
	https://docs.ethers.org/v6/api/wallet/
	https://docs.ethers.org/v6/api/wallet/#KeystoreAccount

###### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `keystoreJson` | `string` | `undefined` | {string} Wallet keystore JSON string |
| `password` | `string` | `''` | {string} decrypt keystoreJson using {password} |

###### Returns

`Promise`\<[`WalletEntityBaseItem`](../../entities/WalletEntity.md#walletentitybaseitem)\>

##### createWalletFromMnemonic()

```ts
createWalletFromMnemonic(mnemonic?: string): WalletEntityBaseItem
```

Create a wallet from a mnemonic phrase.

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `mnemonic`? | `string` | string |

###### Returns

[`WalletEntityBaseItem`](../../entities/WalletEntity.md#walletentitybaseitem)

##### createWalletFromPrivateKey()

```ts
createWalletFromPrivateKey(privateKey: any): WalletEntityBaseItem
```

Create a wallet from a wallet private key

###### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `privateKey` | `any` | `null` | {any} |

###### Returns

[`WalletEntityBaseItem`](../../entities/WalletEntity.md#walletentitybaseitem)

##### createWatchWallet()

```ts
createWatchWallet(address: string): WalletEntityBaseItem
```

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | {string} |

###### Returns

[`WalletEntityBaseItem`](../../entities/WalletEntity.md#walletentitybaseitem)

##### getKeystoreOfWallet()

```ts
getKeystoreOfWallet(wallet: WalletEntityBaseItem, password: string): Promise<string>
```

Resolved to the JSON Keystore Wallet for {wallet} encrypted with {password}.

###### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `wallet` | [`WalletEntityBaseItem`](../../entities/WalletEntity.md#walletentitybaseitem) | `undefined` | {WalletEntityBaseItem} |
| `password` | `string` | `''` | {string}		encrypt {wallet} with {password} |

###### Returns

`Promise`\<`string`\>

##### isValidAddress()

```ts
isValidAddress(address: string): boolean
```

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | {string}	- wallet address |

###### Returns

`boolean`

##### isValidWalletFactoryData()

```ts
static isValidWalletFactoryData(wallet: any): boolean
```

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `wallet` | `any` | {any} |

###### Returns

`boolean`
