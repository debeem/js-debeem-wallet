[debeem-wallet](../../README.md) / services/storage/SysUserStorageService

# services/storage/SysUserStorageService

## Classes

### SysUserStorageService

#### Constructors

##### new SysUserStorageService()

```ts
new SysUserStorageService(): SysUserStorageService
```

###### Returns

[`SysUserStorageService`](SysUserStorageService.md#sysuserstorageservice)

#### Properties

| Property | Modifier | Type | Default value |
| :------ | :------ | :------ | :------ |
| `databaseName` | `protected` | `string` | `'sys_user_entity'` |
| `storageCrypto` | `protected` | `AesCrypto` | `...` |
| `storeName` | `protected` | `"root"` | `'root'` |
| `sysDb` | `protected` | `IDBPDatabase`\<[`SysUserEntity`](../../entities/SysUserEntity.md#sysuserentity)\> | `undefined` |

#### Methods

##### changePinCode()

```ts
changePinCode(
   entityName: string, 
   oldPinCode: string, 
newPinCode: string): Promise<boolean>
```

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `entityName` | `string` | {string} |
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

##### extractPassword()

```ts
extractPassword(entityName: string, pinCode: string): Promise<null | string>
```

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `entityName` | `string` | {string} |
| `pinCode` | `string` | {string} |

###### Returns

`Promise`\<`null` \| `string`\>

##### generatePassword()

```ts
generatePassword(): string
```

generate password

###### Returns

`string`

##### initDb()

```ts
initDb(): Promise<null | IDBPDatabase<SysUserEntity>>
```

###### Returns

`Promise`\<`null` \| `IDBPDatabase`\<[`SysUserEntity`](../../entities/SysUserEntity.md#sysuserentity)\>\>

##### isValidPinCode()

```ts
isValidPinCode(entityName: string, pinCode: string): Promise<boolean>
```

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `entityName` | `string` | {string} |
| `pinCode` | `string` | {string} |

###### Returns

`Promise`\<`boolean`\>

##### savePassword()

```ts
savePassword(
   entityName: string, 
   pinCode: string, 
password?: string): Promise<string>
```

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `entityName` | `string` | {string} |
| `pinCode` | `string` | {string} |
| `password`? | `string` | {string} |

###### Returns

`Promise`\<`string`\>
