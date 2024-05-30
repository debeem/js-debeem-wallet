[debeem-wallet](../../README.md) / services/wallet/WalletAccount

# services/wallet/WalletAccount

## Classes

### WalletAccount

#### Constructors

##### new WalletAccount()

```ts
new WalletAccount(): WalletAccount
```

###### Returns

[`WalletAccount`](WalletAccount.md#walletaccount)

#### Methods

##### ethQueryBalance()

```ts
ethQueryBalance(address: string): Promise<bigint>
```

query the balance of native currency on chain

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | wallet address |

###### Returns

`Promise`\<`bigint`\>

- balance in wei, 18 decimal places

##### queryPairPrice()

```ts
queryPairPrice(pair: string): Promise<null | ChainLinkPriceResult>
```

Get the current price of the specified pair

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `pair` | `string` | {string} - e.g.: BTC/USD, see: EthereumPriceFeedAddresses.ts |

###### Returns

`Promise`\<`null` \| `ChainLinkPriceResult`\>

##### querySimplePrice()

```ts
querySimplePrice(ids: string, vsCurrencies: string): Promise<any>
```

Get the current price of any cryptocurrencies in any other supported currencies that you need.

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `ids` | `string` | <p>{string} id of coins, comma-separated if querying more than 1 coin.</p><p>					 see: src/resources/coinGeckoCoinList.json</p> |
| `vsCurrencies` | `string` | <p>{string} vs_currency of coins, comma-separated if querying more than 1 vs_currency.</p><p>					 see: src/resources/coinGeckoSupportedVsCurrencies.json</p> |

###### Returns

`Promise`\<`any`\>

##### querySimpleTokenPrice()

```ts
querySimpleTokenPrice(
   platformId: string, 
   contractAddresses: string, 
vsCurrencies: string): Promise<any>
```

Get current price of tokens (using contract addresses) for a given platform in any other currency that you need.

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `platformId` | `string` | <p>{string} The id of the platform issuing tokens.</p><p>						 see: src/resources/coinGeckoAssetPlatforms.json</p> |
| `contractAddresses` | `string` | <p>{string} The contract address of tokens, comma separated</p><p>						 see: src/resources/ethereumTokens.json.ts</p> |
| `vsCurrencies` | `string` | <p>{string} vs_currency of coins, comma-separated if querying more than 1 vs_currency</p><p>						 see: src/resources/coinGeckoSupportedVsCurrencies.json</p> |

###### Returns

`Promise`\<`any`\>

##### queryTokenBalances()

```ts
queryTokenBalances(
   address: string, 
   tokens: ContractTokenBalanceItem[], 
ABI?: UsdtABIItem[]): Promise<ContractTokenBalanceItem[]>
```

query balance of derivative tokens, and try to query the balance of the native token, if specified.

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | {string} wallet address |
| `tokens` | [`ContractTokenBalanceItem`](../../models/TokenModels.md#contracttokenbalanceitem)[] | {Array<ContractTokenBalanceItem>} contract addresses list |
| `ABI`? | [`UsdtABIItem`](../../models/UsdtABIItem.md#usdtabiitem)[] | {Array<UsdtABIItem>} Application Binary Interface |

###### Returns

`Promise`\<[`ContractTokenBalanceItem`](../../models/TokenModels.md#contracttokenbalanceitem)[]\>

##### queryTokenValues()

```ts
queryTokenValues(
   address: string, 
   tokens: ContractTokenBalanceItem[], 
ABI?: UsdtABIItem[]): Promise<ContractTokenValueItem[]>
```

query the value of derivative tokens

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | {string} wallet address |
| `tokens` | [`ContractTokenBalanceItem`](../../models/TokenModels.md#contracttokenbalanceitem)[] | {Array<ContractTokenBalanceItem>} |
| `ABI`? | [`UsdtABIItem`](../../models/UsdtABIItem.md#usdtabiitem)[] | {Array<UsdtABIItem>} |

###### Returns

`Promise`\<[`ContractTokenValueItem`](../../models/TokenModels.md#contracttokenvalueitem)[]\>

##### queryTotalValues()

```ts
queryTotalValues(
   address: string, 
   storagePassword: string, 
ABI?: UsdtABIItem[]): Promise<null | TotalValues>
```

query the value of derivative tokens

###### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `address` | `string` | `undefined` | {string} wallet address |
| `storagePassword` | `string` | `""` | {string} password for storage |
| `ABI`? | [`UsdtABIItem`](../../models/UsdtABIItem.md#usdtabiitem)[] | `undefined` | {Array<UsdtABIItem>} |

###### Returns

`Promise`\<`null` \| [`TotalValues`](../../models/TokenModels.md#totalvalues)\>

##### queryValue()

```ts
queryValue(
   address: string, 
   pair: string, 
decimals: number): Promise<TokenValueItem>
```

query value

###### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `address` | `string` | `undefined` | {string} wallet address |
| `pair` | `string` | `undefined` | {string} e.g.: ETH/USD, see: EthereumPriceFeedAddresses.ts |
| `decimals` | `number` | `18` | {number} |

###### Returns

`Promise`\<[`TokenValueItem`](../../models/TokenModels.md#tokenvalueitem)\>
