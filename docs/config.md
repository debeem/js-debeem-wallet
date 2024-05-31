[debeem-wallet](README.md) / config

# config

## Functions

### getCurrentChain()

```ts
function getCurrentChain(): number
```

get current chainId

#### Returns

`number`

***

### getDefaultChain()

```ts
function getDefaultChain(): number
```

get default chainId

#### Returns

`number`

***

### revertToDefaultChain()

```ts
function revertToDefaultChain(): void
```

revert the current chain to the default chain

#### Returns

`void`

***

### setCurrentChain()

```ts
function setCurrentChain(chainId: number): void
```

set/update current chainId

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `chainId` | `number` | {number} numeric chainId |

#### Returns

`void`
