[debeem-wallet](../../README.md) / services/storage/IStorageService

# services/storage/IStorageService

## Interfaces

### IStorageService

#### Methods

##### clear()

```ts
clear(): Promise<boolean>
```

###### Returns

`Promise`\<`boolean`\>

##### count()

```ts
count(query?: string): Promise<number>
```

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `query`? | `string` |

###### Returns

`Promise`\<`number`\>

##### delete()

```ts
delete(key: string): Promise<boolean>
```

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

###### Returns

`Promise`\<`boolean`\>

##### get()

```ts
get(key: string): Promise<any>
```

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

###### Returns

`Promise`\<`any`\>

##### getAll()

```ts
getAll(query?: string, maxCount?: number): Promise<null | any[]>
```

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `query`? | `string` |
| `maxCount`? | `number` |

###### Returns

`Promise`\<`null` \| `any`[]\>

##### getAllKeys()

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

##### getFirst()

```ts
getFirst(): Promise<any>
```

###### Returns

`Promise`\<`any`\>

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

##### isValidItem()

```ts
isValidItem(item: any, callback?: CallbackSetDesc): boolean
```

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `item` | `any` |
| `callback`? | [`CallbackSetDesc`](../../models/CallbackSetDesc.md#callbacksetdesc) |

###### Returns

`boolean`

##### put()

```ts
put(key: string, value: any): Promise<boolean>
```

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | `any` |

###### Returns

`Promise`\<`boolean`\>
