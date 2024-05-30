[debeem-wallet](../../README.md) / services/storage/TokenStorageService

# services/storage/TokenStorageService

## Classes

### TokenStorageService

abstract class AbstractStorageService

#### Extends

- [`AbstractStorageService`](AbstractStorageService.md#abstractstorageservicet)\<[`TokenEntityItem`](../../entities/TokenEntity.md#tokenentityitem)\>

#### Implements

- [`IStorageService`](IStorageService.md#istorageservice)

#### Constructors

##### new TokenStorageService()

```ts
new TokenStorageService(pinCode: string): TokenStorageService
```

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `pinCode` | `string` | `''` |

###### Returns

[`TokenStorageService`](TokenStorageService.md#tokenstorageservice)

###### Overrides

[`AbstractStorageService`](AbstractStorageService.md#abstractstorageservicet).[`constructor`](AbstractStorageService.md#constructors)

#### Properties

| Property | Modifier | Type | Default value | Inherited from |
| :------ | :------ | :------ | :------ | :------ |
| `databaseName` | `protected` | `string` | `''` | [`AbstractStorageService`](AbstractStorageService.md#abstractstorageservicet).`databaseName` |
| `db` | `protected` | `IDBPDatabase`\<[`StorageEntity`](../../entities/StorageEntity.md#storageentity)\> | `undefined` | [`AbstractStorageService`](AbstractStorageService.md#abstractstorageservicet).`db` |
| `password` | `protected` | `string` | `''` | [`AbstractStorageService`](AbstractStorageService.md#abstractstorageservicet).`password` |
| `pinCode` | `protected` | `string` | `''` | [`AbstractStorageService`](AbstractStorageService.md#abstractstorageservicet).`pinCode` |
| `storageCrypto` | `protected` | `AesCrypto` | `...` | [`AbstractStorageService`](AbstractStorageService.md#abstractstorageservicet).`storageCrypto` |
| `storeName` | `protected` | `"root"` | `'root'` | [`AbstractStorageService`](AbstractStorageService.md#abstractstorageservicet).`storeName` |
| `sysUserStorageService` | `protected` | [`SysUserStorageService`](SysUserStorageService.md#sysuserstorageservice) | `...` | [`AbstractStorageService`](AbstractStorageService.md#abstractstorageservicet).`sysUserStorageService` |

#### Methods

##### changePinCode()

```ts
changePinCode(oldPinCode: string, newPinCode: string): Promise<boolean>
```

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `oldPinCode` | `string` | {string} |
| `newPinCode` | `string` | {string} |

###### Returns

`Promise`\<`boolean`\>

###### Inherited from

[`AbstractStorageService`](AbstractStorageService.md#abstractstorageservicet).[`changePinCode`](AbstractStorageService.md#changepincode)

##### ~~clear()~~

```ts
clear(): Promise<boolean>
```

###### Returns

`Promise`\<`boolean`\>

###### Implementation of

[`IStorageService`](IStorageService.md#istorageservice).[`clear`](IStorageService.md#clear)

###### Overrides

[`AbstractStorageService`](AbstractStorageService.md#abstractstorageservicet).[`clear`](AbstractStorageService.md#clear)

###### Deprecated

##### clearByWallet()

```ts
clearByWallet(wallet: string): Promise<boolean>
```

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `wallet` | `string` | {string} wallet address |

###### Returns

`Promise`\<`boolean`\>

##### ~~count()~~

```ts
count(query?: string): Promise<number>
```

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `query`? | `string` |

###### Returns

`Promise`\<`number`\>

###### Implementation of

[`IStorageService`](IStorageService.md#istorageservice).[`count`](IStorageService.md#count)

###### Overrides

[`AbstractStorageService`](AbstractStorageService.md#abstractstorageservicet).[`count`](AbstractStorageService.md#count)

###### Deprecated

##### countByWallet()

```ts
countByWallet(wallet: string, query?: string): Promise<number>
```

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `wallet` | `string` | {string} wallet address |
| `query`? | `string` | {string} |

###### Returns

`Promise`\<`number`\>

##### delete()

```ts
delete(key: string): Promise<boolean>
```

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | wallet address is the key |

###### Returns

`Promise`\<`boolean`\>

###### Implementation of

[`IStorageService`](IStorageService.md#istorageservice).[`delete`](IStorageService.md#delete)

###### Inherited from

[`AbstractStorageService`](AbstractStorageService.md#abstractstorageservicet).[`delete`](AbstractStorageService.md#delete)

##### flushDefault()

```ts
flushDefault(wallet: string): Promise<boolean>
```

flush the default data into database

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `wallet` | `string` | {string} wallet address |

###### Returns

`Promise`\<`boolean`\>

##### get()

```ts
get(key: string): Promise<null | TokenEntityItem>
```

get item by key

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` |  |

###### Returns

`Promise`\<`null` \| [`TokenEntityItem`](../../entities/TokenEntity.md#tokenentityitem)\>

###### Implementation of

[`IStorageService`](IStorageService.md#istorageservice).[`get`](IStorageService.md#get)

###### Inherited from

[`AbstractStorageService`](AbstractStorageService.md#abstractstorageservicet).[`get`](AbstractStorageService.md#get)

##### ~~getAll()~~

```ts
getAll(query?: string, maxCount?: number): Promise<null | (null | TokenEntityItem)[]>
```

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `query`? | `string` |
| `maxCount`? | `number` |

###### Returns

`Promise`\<`null` \| (`null` \| [`TokenEntityItem`](../../entities/TokenEntity.md#tokenentityitem))[]\>

###### Implementation of

[`IStorageService`](IStorageService.md#istorageservice).[`getAll`](IStorageService.md#getall)

###### Overrides

[`AbstractStorageService`](AbstractStorageService.md#abstractstorageservicet).[`getAll`](AbstractStorageService.md#getall)

###### Deprecated

##### getAllByWallet()

```ts
getAllByWallet(
   wallet: string, 
   query?: string, 
maxCount?: number): Promise<null | TokenEntityItem[]>
```

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `wallet` | `string` | {string} wallet address |
| `query`? | `string` | {string} |
| `maxCount`? | `number` | {number} |

###### Returns

`Promise`\<`null` \| [`TokenEntityItem`](../../entities/TokenEntity.md#tokenentityitem)[]\>

##### ~~getAllKeys()~~

```ts
getAllKeys(query?: string, maxCount?: number): Promise<null | string[]>
```

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `query`? | `string` |
| `maxCount`? | `number` |

###### Returns

`Promise`\<`null` \| `string`[]\>

###### Implementation of

[`IStorageService`](IStorageService.md#istorageservice).[`getAllKeys`](IStorageService.md#getallkeys)

###### Overrides

[`AbstractStorageService`](AbstractStorageService.md#abstractstorageservicet).[`getAllKeys`](AbstractStorageService.md#getallkeys)

###### Deprecated

##### getAllKeysByWallet()

```ts
getAllKeysByWallet(
   wallet: string, 
   query?: string, 
maxCount?: number): Promise<null | string[]>
```

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `wallet` | `string` | {string} wallet address |
| `query`? | `string` | {string} |
| `maxCount`? | `number` | {number} |

###### Returns

`Promise`\<`null` \| `string`[]\>

##### getDefault()

```ts
getDefault(wallet: string): TokenEntityItem[]
```

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `wallet` | `string` | {string} wallet address |

###### Returns

[`TokenEntityItem`](../../entities/TokenEntity.md#tokenentityitem)[]

##### ~~getFirst()~~

```ts
getFirst(): Promise<null | TokenEntityItem>
```

###### Returns

`Promise`\<`null` \| [`TokenEntityItem`](../../entities/TokenEntity.md#tokenentityitem)\>

###### Implementation of

[`IStorageService`](IStorageService.md#istorageservice).[`getFirst`](IStorageService.md#getfirst)

###### Overrides

[`AbstractStorageService`](AbstractStorageService.md#abstractstorageservicet).[`getFirst`](AbstractStorageService.md#getfirst)

###### Deprecated

##### getFirstByWallet()

```ts
getFirstByWallet(wallet: string): Promise<null | TokenEntityItem>
```

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `wallet` | `string` | {string} wallet address |

###### Returns

`Promise`\<`null` \| [`TokenEntityItem`](../../entities/TokenEntity.md#tokenentityitem)\>

##### getKeyByItem()

```ts
getKeyByItem(value: TokenEntityItem): null | string
```

get storage key

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `value` | [`TokenEntityItem`](../../entities/TokenEntity.md#tokenentityitem) |  |

###### Returns

`null` \| `string`

###### Implementation of

[`IStorageService`](IStorageService.md#istorageservice).[`getKeyByItem`](IStorageService.md#getkeybyitem)

###### Overrides

[`AbstractStorageService`](AbstractStorageService.md#abstractstorageservicet).[`getKeyByItem`](AbstractStorageService.md#getkeybyitem)

##### init()

```ts
init(): Promise<null | IDBPDatabase<StorageEntity>>
```

###### Returns

`Promise`\<`null` \| `IDBPDatabase`\<[`StorageEntity`](../../entities/StorageEntity.md#storageentity)\>\>

###### Inherited from

[`AbstractStorageService`](AbstractStorageService.md#abstractstorageservicet).[`init`](AbstractStorageService.md#init)

##### isValidItem()

```ts
isValidItem(item: any, callback?: CallbackSetDesc): boolean
```

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `item` | `any` | {any} |
| `callback`? | [`CallbackSetDesc`](../../models/CallbackSetDesc.md#callbacksetdesc) | - |

###### Returns

`boolean`

###### Implementation of

[`IStorageService`](IStorageService.md#istorageservice).[`isValidItem`](IStorageService.md#isvaliditem)

###### Overrides

[`AbstractStorageService`](AbstractStorageService.md#abstractstorageservicet).[`isValidItem`](AbstractStorageService.md#isvaliditem)

##### isValidPinCode()

```ts
isValidPinCode(pinCode: string): Promise<boolean>
```

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `pinCode` | `string` | {string} |

###### Returns

`Promise`\<`boolean`\>

###### Inherited from

[`AbstractStorageService`](AbstractStorageService.md#abstractstorageservicet).[`isValidPinCode`](AbstractStorageService.md#isvalidpincode)

##### put()

```ts
put(key: string, value: TokenEntityItem): Promise<boolean>
```

Put an item into database. replaces the item with the same key.
	value.chainId will be the storage key

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` |  |
| `value` | [`TokenEntityItem`](../../entities/TokenEntity.md#tokenentityitem) |  |

###### Returns

`Promise`\<`boolean`\>

###### Implementation of

[`IStorageService`](IStorageService.md#istorageservice).[`put`](IStorageService.md#put)

###### Inherited from

[`AbstractStorageService`](AbstractStorageService.md#abstractstorageservicet).[`put`](AbstractStorageService.md#put)
