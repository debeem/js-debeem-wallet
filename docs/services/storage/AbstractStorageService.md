[debeem-wallet](../../README.md) / services/storage/AbstractStorageService

# services/storage/AbstractStorageService

## Classes

### `abstract` AbstractStorageService\<T\>

abstract class AbstractStorageService

#### Extended by

- [`BasicStorageService`](BasicStorageService/README.md#basicstorageservice)
- [`ChainStorageService`](ChainStorageService.md#chainstorageservice)
- [`TokenStorageService`](TokenStorageService.md#tokenstorageservice)
- [`WalletStorageService`](WalletStorageService.md#walletstorageservice)

#### Type parameters

| Type parameter |
| :------ |
| `T` |

#### Implements

- [`IStorageService`](IStorageService.md#istorageservice)

#### Constructors

##### new AbstractStorageService()

```ts
protected new AbstractStorageService<T>(databaseName: string, pinCode: string): AbstractStorageService<T>
```

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `databaseName` | `string` | `undefined` |
| `pinCode` | `string` | `''` |

###### Returns

[`AbstractStorageService`](AbstractStorageService.md#abstractstorageservicet)\<`T`\>

#### Properties

| Property | Modifier | Type | Default value |
| :------ | :------ | :------ | :------ |
| `databaseName` | `protected` | `string` | `''` |
| `db` | `protected` | `IDBPDatabase`\<[`StorageEntity`](../../entities/StorageEntity.md#storageentity)\> | `undefined` |
| `password` | `protected` | `string` | `''` |
| `pinCode` | `protected` | `string` | `''` |
| `storageCrypto` | `protected` | `AesCrypto` | `...` |
| `storeName` | `protected` | `"root"` | `'root'` |
| `sysUserStorageService` | `protected` | [`SysUserStorageService`](SysUserStorageService.md#sysuserstorageservice) | `...` |

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

##### clear()

```ts
clear(): Promise<boolean>
```

delete all items

###### Returns

`Promise`\<`boolean`\>

###### Implementation of

[`IStorageService`](IStorageService.md#istorageservice).[`clear`](IStorageService.md#clear)

##### count()

```ts
count(query?: string): Promise<number>
```

Retrieves the number of records matching the given query in a store.

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `query`? | `string` |  |

###### Returns

`Promise`\<`number`\>

###### Implementation of

[`IStorageService`](IStorageService.md#istorageservice).[`count`](IStorageService.md#count)

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

##### get()

```ts
get(key: string): Promise<null | T>
```

get item by key

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` |  |

###### Returns

`Promise`\<`null` \| `T`\>

###### Implementation of

[`IStorageService`](IStorageService.md#istorageservice).[`get`](IStorageService.md#get)

##### getAll()

```ts
getAll(query?: string, maxCount?: number): Promise<null | (null | T)[]>
```

query all items

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `query`? | `string` |  |
| `maxCount`? | `number` |  |

###### Returns

`Promise`\<`null` \| (`null` \| `T`)[]\>

###### Implementation of

[`IStorageService`](IStorageService.md#istorageservice).[`getAll`](IStorageService.md#getall)

##### getAllKeys()

```ts
getAllKeys(query?: string, maxCount?: number): Promise<null | string[]>
```

get all of keys

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `query`? | `string` |  |
| `maxCount`? | `number` |  |

###### Returns

`Promise`\<`null` \| `string`[]\>

###### Implementation of

[`IStorageService`](IStorageService.md#istorageservice).[`getAllKeys`](IStorageService.md#getallkeys)

##### getFirst()

```ts
getFirst(): Promise<null | T>
```

get the first item

###### Returns

`Promise`\<`null` \| `T`\>

###### Implementation of

[`IStorageService`](IStorageService.md#istorageservice).[`getFirst`](IStorageService.md#getfirst)

##### getKeyByItem()

```ts
getKeyByItem(value: any): null | string
```

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `value` | `any` |

###### Returns

`null` \| `string`

###### Implementation of

[`IStorageService`](IStorageService.md#istorageservice).[`getKeyByItem`](IStorageService.md#getkeybyitem)

##### init()

```ts
init(): Promise<null | IDBPDatabase<StorageEntity>>
```

###### Returns

`Promise`\<`null` \| `IDBPDatabase`\<[`StorageEntity`](../../entities/StorageEntity.md#storageentity)\>\>

##### isValidItem()

```ts
isValidItem(item: any): boolean
```

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `item` | `any` | {any} |

###### Returns

`boolean`

###### Implementation of

[`IStorageService`](IStorageService.md#istorageservice).[`isValidItem`](IStorageService.md#isvaliditem)

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

##### put()

```ts
put(key: string, value: T): Promise<boolean>
```

Put an item into database. replaces the item with the same key.
	value.chainId will be the storage key

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` |  |
| `value` | `T` |  |

###### Returns

`Promise`\<`boolean`\>

###### Implementation of

[`IStorageService`](IStorageService.md#istorageservice).[`put`](IStorageService.md#put)
