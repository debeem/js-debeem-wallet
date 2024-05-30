[debeem-wallet](../../../README.md) / services/storage/BasicStorageService

# services/storage/BasicStorageService

## Index

### Namespaces

| Namespace | Description |
| :------ | :------ |
| [WalletBasicKeys](namespaces/WalletBasicKeys.md) | - |

## Classes

### BasicStorageService

abstract class AbstractStorageService

#### Extends

- [`AbstractStorageService`](../AbstractStorageService.md#abstractstorageservicet)\<`string`\>

#### Implements

- [`IStorageService`](../IStorageService.md#istorageservice)

#### Constructors

##### new BasicStorageService()

```ts
new BasicStorageService(pinCode: string): BasicStorageService
```

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `pinCode` | `string` | `''` |

###### Returns

[`BasicStorageService`](README.md#basicstorageservice)

###### Overrides

[`AbstractStorageService`](../AbstractStorageService.md#abstractstorageservicet).[`constructor`](../AbstractStorageService.md#constructors)

#### Properties

| Property | Modifier | Type | Default value | Inherited from |
| :------ | :------ | :------ | :------ | :------ |
| `databaseName` | `protected` | `string` | `''` | [`AbstractStorageService`](../AbstractStorageService.md#abstractstorageservicet).`databaseName` |
| `db` | `protected` | `IDBPDatabase`\<[`StorageEntity`](../../../entities/StorageEntity.md#storageentity)\> | `undefined` | [`AbstractStorageService`](../AbstractStorageService.md#abstractstorageservicet).`db` |
| `password` | `protected` | `string` | `''` | [`AbstractStorageService`](../AbstractStorageService.md#abstractstorageservicet).`password` |
| `pinCode` | `protected` | `string` | `''` | [`AbstractStorageService`](../AbstractStorageService.md#abstractstorageservicet).`pinCode` |
| `storageCrypto` | `protected` | `AesCrypto` | `...` | [`AbstractStorageService`](../AbstractStorageService.md#abstractstorageservicet).`storageCrypto` |
| `storeName` | `protected` | `"root"` | `'root'` | [`AbstractStorageService`](../AbstractStorageService.md#abstractstorageservicet).`storeName` |
| `sysUserStorageService` | `protected` | [`SysUserStorageService`](../SysUserStorageService.md#sysuserstorageservice) | `...` | [`AbstractStorageService`](../AbstractStorageService.md#abstractstorageservicet).`sysUserStorageService` |

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

[`AbstractStorageService`](../AbstractStorageService.md#abstractstorageservicet).[`changePinCode`](../AbstractStorageService.md#changepincode)

##### clear()

```ts
clear(): Promise<boolean>
```

delete all items

###### Returns

`Promise`\<`boolean`\>

###### Implementation of

[`IStorageService`](../IStorageService.md#istorageservice).[`clear`](../IStorageService.md#clear)

###### Inherited from

[`AbstractStorageService`](../AbstractStorageService.md#abstractstorageservicet).[`clear`](../AbstractStorageService.md#clear)

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

[`IStorageService`](../IStorageService.md#istorageservice).[`count`](../IStorageService.md#count)

###### Inherited from

[`AbstractStorageService`](../AbstractStorageService.md#abstractstorageservicet).[`count`](../AbstractStorageService.md#count)

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

[`IStorageService`](../IStorageService.md#istorageservice).[`delete`](../IStorageService.md#delete)

###### Inherited from

[`AbstractStorageService`](../AbstractStorageService.md#abstractstorageservicet).[`delete`](../AbstractStorageService.md#delete)

##### get()

```ts
get(key: string): Promise<null | string>
```

get item by key

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` |  |

###### Returns

`Promise`\<`null` \| `string`\>

###### Implementation of

[`IStorageService`](../IStorageService.md#istorageservice).[`get`](../IStorageService.md#get)

###### Inherited from

[`AbstractStorageService`](../AbstractStorageService.md#abstractstorageservicet).[`get`](../AbstractStorageService.md#get)

##### getAll()

```ts
getAll(query?: string, maxCount?: number): Promise<null | (null | string)[]>
```

query all items

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `query`? | `string` |  |
| `maxCount`? | `number` |  |

###### Returns

`Promise`\<`null` \| (`null` \| `string`)[]\>

###### Implementation of

[`IStorageService`](../IStorageService.md#istorageservice).[`getAll`](../IStorageService.md#getall)

###### Inherited from

[`AbstractStorageService`](../AbstractStorageService.md#abstractstorageservicet).[`getAll`](../AbstractStorageService.md#getall)

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

[`IStorageService`](../IStorageService.md#istorageservice).[`getAllKeys`](../IStorageService.md#getallkeys)

###### Inherited from

[`AbstractStorageService`](../AbstractStorageService.md#abstractstorageservicet).[`getAllKeys`](../AbstractStorageService.md#getallkeys)

##### getFirst()

```ts
getFirst(): Promise<null | string>
```

get the first item

###### Returns

`Promise`\<`null` \| `string`\>

###### Implementation of

[`IStorageService`](../IStorageService.md#istorageservice).[`getFirst`](../IStorageService.md#getfirst)

###### Inherited from

[`AbstractStorageService`](../AbstractStorageService.md#abstractstorageservicet).[`getFirst`](../AbstractStorageService.md#getfirst)

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

[`IStorageService`](../IStorageService.md#istorageservice).[`getKeyByItem`](../IStorageService.md#getkeybyitem)

###### Inherited from

[`AbstractStorageService`](../AbstractStorageService.md#abstractstorageservicet).[`getKeyByItem`](../AbstractStorageService.md#getkeybyitem)

##### init()

```ts
init(): Promise<null | IDBPDatabase<StorageEntity>>
```

###### Returns

`Promise`\<`null` \| `IDBPDatabase`\<[`StorageEntity`](../../../entities/StorageEntity.md#storageentity)\>\>

###### Inherited from

[`AbstractStorageService`](../AbstractStorageService.md#abstractstorageservicet).[`init`](../AbstractStorageService.md#init)

##### isValidItem()

```ts
isValidItem(item: any, callback?: CallbackSetDesc): boolean
```

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `item` | `any` | {any} |
| `callback`? | [`CallbackSetDesc`](../../../models/CallbackSetDesc.md#callbacksetdesc) | - |

###### Returns

`boolean`

###### Implementation of

[`IStorageService`](../IStorageService.md#istorageservice).[`isValidItem`](../IStorageService.md#isvaliditem)

###### Overrides

[`AbstractStorageService`](../AbstractStorageService.md#abstractstorageservicet).[`isValidItem`](../AbstractStorageService.md#isvaliditem)

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

[`AbstractStorageService`](../AbstractStorageService.md#abstractstorageservicet).[`isValidPinCode`](../AbstractStorageService.md#isvalidpincode)

##### put()

```ts
put(key: string, value: string): Promise<boolean>
```

Put an item into database. replaces the item with the same key.
	value.chainId will be the storage key

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` |  |
| `value` | `string` |  |

###### Returns

`Promise`\<`boolean`\>

###### Implementation of

[`IStorageService`](../IStorageService.md#istorageservice).[`put`](../IStorageService.md#put)

###### Inherited from

[`AbstractStorageService`](../AbstractStorageService.md#abstractstorageservicet).[`put`](../AbstractStorageService.md#put)
