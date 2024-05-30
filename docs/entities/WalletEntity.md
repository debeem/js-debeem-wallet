[debeem-wallet](../README.md) / entities/WalletEntity

# entities/WalletEntity

## Interfaces

### WalletEntityBaseItem

#### Extended by

- [`WalletEntityItem`](WalletEntity.md#walletentityitem)

#### Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | address of wallet. this, wallet address is the globally unique stored key for storage |
| `chainCode?` | `string` | The chaincode, which is effectively a public key used to derive children. |
| `depth?` | `number` | The depth of this wallet, which is the number of components in its path. |
| `fingerprint?` | `string` | <p>The fingerprint.</p><p>	A fingerprint allows quick qay to detect parent and child nodes,</p><p>	but developers should be prepared to deal with collisions as it is only 4 bytes.</p> |
| `index` | `number` | The index of the generated wallet address. For non-HD wallets, the index will always be 0 |
| `isHD` | `boolean` | HD wallet? |
| `mnemonic?` | `string` | mnemonic phrase, a word list |
| `parentFingerprint?` | `string` | The parent fingerprint. |
| `password` | `string` | <p>The password of the wallet, used to encrypt mnemonic and privateKey.</p><p>	If password is not empty, mnemonic and privateKey should be ciphertext</p> |
| `path?` | `null` \| `string` | Wallet path. For non-HD wallets, the path is empty |
| `privateKey` | `string` | private key and public key |
| `publicKey` | `string` | - |

***

### WalletEntityItem

#### Extends

- [`WalletEntityBaseItem`](WalletEntity.md#walletentitybaseitem)

#### Properties

| Property | Type | Description | Inherited from |
| :------ | :------ | :------ | :------ |
| `address` | `string` | address of wallet. this, wallet address is the globally unique stored key for storage | [`WalletEntityBaseItem`](WalletEntity.md#walletentitybaseitem).`address` |
| `avatar?` | `string` | - | - |
| `chainCode?` | `string` | The chaincode, which is effectively a public key used to derive children. | [`WalletEntityBaseItem`](WalletEntity.md#walletentitybaseitem).`chainCode` |
| `chainId` | `number` | - | - |
| `depth?` | `number` | The depth of this wallet, which is the number of components in its path. | [`WalletEntityBaseItem`](WalletEntity.md#walletentitybaseitem).`depth` |
| `fingerprint?` | `string` | <p>The fingerprint.</p><p>	A fingerprint allows quick qay to detect parent and child nodes,</p><p>	but developers should be prepared to deal with collisions as it is only 4 bytes.</p> | [`WalletEntityBaseItem`](WalletEntity.md#walletentitybaseitem).`fingerprint` |
| `freePayment?` | `boolean` | - | - |
| `index` | `number` | The index of the generated wallet address. For non-HD wallets, the index will always be 0 | [`WalletEntityBaseItem`](WalletEntity.md#walletentitybaseitem).`index` |
| `isHD` | `boolean` | HD wallet? | [`WalletEntityBaseItem`](WalletEntity.md#walletentitybaseitem).`isHD` |
| `mnemonic?` | `string` | mnemonic phrase, a word list | [`WalletEntityBaseItem`](WalletEntity.md#walletentitybaseitem).`mnemonic` |
| `name` | `string` | - | - |
| `parentFingerprint?` | `string` | The parent fingerprint. | [`WalletEntityBaseItem`](WalletEntity.md#walletentitybaseitem).`parentFingerprint` |
| `password` | `string` | <p>The password of the wallet, used to encrypt mnemonic and privateKey.</p><p>	If password is not empty, mnemonic and privateKey should be ciphertext</p> | [`WalletEntityBaseItem`](WalletEntity.md#walletentitybaseitem).`password` |
| `path?` | `null` \| `string` | Wallet path. For non-HD wallets, the path is empty | [`WalletEntityBaseItem`](WalletEntity.md#walletentitybaseitem).`path` |
| `pinCode` | `string` | - | - |
| `privateKey` | `string` | private key and public key | [`WalletEntityBaseItem`](WalletEntity.md#walletentitybaseitem).`privateKey` |
| `publicKey` | `string` | - | [`WalletEntityBaseItem`](WalletEntity.md#walletentitybaseitem).`publicKey` |
| `remark?` | `string` | - | - |
