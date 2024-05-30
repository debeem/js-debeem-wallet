[debeem-wallet](../README.md) / entities/ChainEntity

# entities/ChainEntity

## Remark

Definition of the structure of the database entities

## Interfaces

### ChainEntityItem

#### Properties

| Property | Type |
| :------ | :------ |
| `chainId` | `number` |
| `explorers?` | `string`[] |
| `name` | `string` |
| `rpcs` | [`ChainEntityRpcItem`](ChainEntity.md#chainentityrpcitem)[] |
| `token?` | `string` |

***

### ChainEntityRpcItem

#### Properties

| Property | Type |
| :------ | :------ |
| `name` | `string` |
| `selected` | `boolean` |
| `url` | `string` |
