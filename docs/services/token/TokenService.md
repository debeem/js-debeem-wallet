[debeem-wallet](../../README.md) / services/token/TokenService

# services/token/TokenService

## Classes

### TokenService

class TokenService

#### Constructors

##### new TokenService()

```ts
new TokenService(): TokenService
```

###### Returns

[`TokenService`](TokenService.md#tokenservice)

#### Accessors

##### ETHAddress

```ts
get ETHAddress(): string
```

###### Returns

`string`

#### Methods

##### exists()

```ts
exists(contractAddress: string): boolean
```

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `contractAddress` | `string` |

###### Returns

`boolean`

##### getIconByContract()

```ts
getIconByContract(contractAddress: string): null | string
```

get token icon by contract

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `contractAddress` | `string` |  |

###### Returns

`null` \| `string`

##### getIconBySymbol()

```ts
getIconBySymbol(symbol: string): null | string
```

get icon by symbol

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `symbol` | `string` | e.g. "ETH", "USDT" |

###### Returns

`null` \| `string`

##### getItem()

```ts
getItem(contractAddress: string): null | Object
```

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `contractAddress` | `string` |

###### Returns

`null` \| `Object`

##### getItemDecimals()

```ts
getItemDecimals(contractAddress: string): number
```

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `contractAddress` | `string` | {string} |

###### Returns

`number`

##### isETH()

```ts
isETH(contractAddress: string): boolean
```

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `contractAddress` | `string` | {string} |

###### Returns

`boolean`
