[debeem-wallet](../README.md) / models/TokenModels

# models/TokenModels

## Type Aliases

### ContractTokenBalanceItem

```ts
type ContractTokenBalanceItem: {
  contractAddress: string;
  decimals: number;
  pair: string;
  tokenBalance: bigint;
};
```

#### Type declaration

| Member | Type |
| :------ | :------ |
| `contractAddress` | `string` |
| `decimals` | `number` |
| `pair` | `string` |
| `tokenBalance` | `bigint` |

***

### ContractTokenBalances

```ts
type ContractTokenBalances: {
  address: string;
  tokenBalances: ContractTokenBalanceItem[];
};
```

#### Type declaration

| Member | Type |
| :------ | :------ |
| `address` | `string` |
| `tokenBalances` | [`ContractTokenBalanceItem`](TokenModels.md#contracttokenbalanceitem)[] |

***

### ContractTokenValueItem

```ts
type ContractTokenValueItem: TokenValueItem & {
  contractAddress: string;
  pair: string;
};
```

#### Type declaration

| Member | Type |
| :------ | :------ |
| `contractAddress` | `string` |
| `pair` | `string` |

***

### TokenValueItem

```ts
type TokenValueItem: {
  balance: bigint;
  floatBalance: number;
  floatValue: number;
  value: bigint;
};
```

#### Type declaration

| Member | Type |
| :------ | :------ |
| `balance` | `bigint` |
| `floatBalance` | `number` |
| `floatValue` | `number` |
| `value` | `bigint` |

***

### TotalValues

```ts
type TotalValues: {
  total: TokenValueItem;
  values: ContractTokenValueItem[];
};
```

#### Type declaration

| Member | Type |
| :------ | :------ |
| `total` | [`TokenValueItem`](TokenModels.md#tokenvalueitem) |
| `values` | [`ContractTokenValueItem`](TokenModels.md#contracttokenvalueitem)[] |
