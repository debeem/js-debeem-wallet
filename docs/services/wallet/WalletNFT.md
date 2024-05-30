[debeem-wallet](../../README.md) / services/wallet/WalletNFT

# services/wallet/WalletNFT

## Classes

### WalletNFT

#### Constructors

##### new WalletNFT()

```ts
new WalletNFT(): WalletNFT
```

###### Returns

[`WalletNFT`](WalletNFT.md#walletnft)

#### Methods

##### queryNFTs()

```ts
queryNFTs(address: string, options?: FetchListOptions): Promise<null | any[]>
```

Query the receipt of a transaction

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` |  |
| `options`? | `FetchListOptions` |  |

###### Returns

`Promise`\<`null` \| `any`[]\>
