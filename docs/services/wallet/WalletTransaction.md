[debeem-wallet](../../README.md) / services/wallet/WalletTransaction

# services/wallet/WalletTransaction

## Classes

### WalletTransaction

#### Constructors

##### new WalletTransaction()

```ts
new WalletTransaction(): WalletTransaction
```

###### Returns

[`WalletTransaction`](WalletTransaction.md#wallettransaction)

#### Methods

##### broadcastTransaction()

```ts
broadcastTransaction(signedTx: string): Promise<TransactionResponse>
```

broadcast transaction

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `signedTx` | `string` | {string} |

###### Returns

`Promise`\<`TransactionResponse`\>

##### estimateEthGasLimit()

```ts
estimateEthGasLimit(transactionRequest: TransactionRequest): Promise<number>
```

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `transactionRequest` | `TransactionRequest` | {TransactionRequest} |

###### Returns

`Promise`\<`number`\>

##### estimateEthGasLimitByToAddress()

```ts
estimateEthGasLimitByToAddress(toAddress: AddressLike): Promise<number>
```

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `toAddress` | `AddressLike` | {AddressLike} |

###### Returns

`Promise`\<`number`\>

##### getDefaultGasLimit()

```ts
getDefaultGasLimit(): number
```

return default gas limit

###### Returns

`number`

##### queryNonce()

```ts
queryNonce(address: string): Promise<number>
```

get last nonce count

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | wallet address |

###### Returns

`Promise`\<`number`\>

##### queryTransactionCountFromAddress()

```ts
queryTransactionCountFromAddress(address: string): Promise<bigint>
```

returns the number of transactions sent from the address

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | {string} |

###### Returns

`Promise`\<`bigint`\>

##### queryTransactionDetail()

```ts
queryTransactionDetail(txHash: string): Promise<any>
```

Query the details of a transaction

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `txHash` | `string` |  |

###### Returns

`Promise`\<`any`\>

##### queryTransactionHistory()

```ts
queryTransactionHistory(address: string, options?: FetchListOptions): Promise<TransactionHistoryResult>
```

Query all transaction history of a wallet

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | {string} |
| `options`? | `FetchListOptions` | {FetchListOptions} |

###### Returns

`Promise`\<[`TransactionHistoryResult`](../../models/Transaction.md#transactionhistoryresult)\>

##### queryTransactionHistoryFromAddress()

```ts
queryTransactionHistoryFromAddress(address: string, options?: FetchListOptions): Promise<TransactionHistoryResult>
```

Query the transactions of a wallet by fromAddress

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `string` |
| `options`? | `FetchListOptions` |

###### Returns

`Promise`\<[`TransactionHistoryResult`](../../models/Transaction.md#transactionhistoryresult)\>

##### queryTransactionHistoryToAddress()

```ts
queryTransactionHistoryToAddress(address: string, options?: FetchListOptions): Promise<TransactionHistoryResult>
```

Query the transactions of a wallet by toAddress

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `string` |
| `options`? | `FetchListOptions` |

###### Returns

`Promise`\<[`TransactionHistoryResult`](../../models/Transaction.md#transactionhistoryresult)\>

##### queryTransactionReceipt()

```ts
queryTransactionReceipt(txHash: string): Promise<any>
```

Query the receipt of a transaction

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `txHash` | `string` |  |

###### Returns

`Promise`\<`any`\>

##### send()

```ts
send(
   wallet: WalletEntityBaseItem, 
   to: string, 
   value: string, 
   nonce?: number, 
gasLimit?: number): Promise<TransactionResponse>
```

send a transaction for native currency

###### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `wallet` | [`WalletEntityBaseItem`](../../entities/WalletEntity.md#walletentitybaseitem) | `undefined` | {WalletEntityBaseItem} |
| `to` | `string` | `undefined` | {string} |
| `value` | `string` | `undefined` | {string} |
| `nonce`? | `number` | `-1` | {number} |
| `gasLimit`? | `number` | `0` | {number} |

###### Returns

`Promise`\<`TransactionResponse`\>

##### sendContractTransaction()

```ts
sendContractTransaction(
   contractAddress: string, 
   wallet: WalletEntityBaseItem, 
   toAddress: string, 
   value: string, 
   decimals: number, 
   nonce: number, 
gasLimit: number): Promise<TransactionResponse>
```

Send Derivative Token Transaction

###### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `contractAddress` | `string` | `undefined` | {string} |
| `wallet` | [`WalletEntityBaseItem`](../../entities/WalletEntity.md#walletentitybaseitem) | `undefined` | {WalletEntityBaseItem} |
| `toAddress` | `string` | `undefined` | {string} |
| `value` | `string` | `undefined` | {string} |
| `decimals` | `number` | `18` | {number} |
| `nonce` | `number` | `-1` | {number} |
| `gasLimit` | `number` | `0` | {number} |

###### Returns

`Promise`\<`TransactionResponse`\>

##### signTransaction()

```ts
signTransaction(
   wallet: WalletEntityBaseItem, 
   toAddress: string, 
   value: string, 
   nonce?: number, 
gasLimit?: number): Promise<string>
```

sign a transaction before it will be broadcast

###### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `wallet` | [`WalletEntityBaseItem`](../../entities/WalletEntity.md#walletentitybaseitem) | `undefined` | {WalletEntityBaseItem} |
| `toAddress` | `string` | `undefined` | {string}	Receiver's wallet address |
| `value` | `string` | `undefined` | {string}	ETH quantity, unit ETH, for example: "0.001" ETH |
| `nonce`? | `number` | `-1` | {number}	The nonce is very important. We can query the current nonce through the Infura API. |
| `gasLimit`? | `number` | `0` | <p>{number}	The gasLimit for sending ETH is fixed at 21,000.</p><p>						Transactions calling other contracts need to estimate the gasLimit in advance.</p> |

###### Returns

`Promise`\<`string`\>
