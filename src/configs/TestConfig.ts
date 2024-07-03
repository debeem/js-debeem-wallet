import { EtherWallet } from "debeem-id";
import { TWalletBaseItem } from "debeem-id/src/models/TWallet";

export interface TestUser
{
	id : number,
	name : string;
	mnemonic : string;
	walletObj : TWalletBaseItem;
}


export const testUserList : Array<TestUser> = [
	{
		id : 1,
		name : `Alice`,
		mnemonic : `olympic cradle tragic crucial exit annual silly cloth scale fine gesture ancient`,
		walletObj : EtherWallet.createWalletFromMnemonic( `olympic cradle tragic crucial exit annual silly cloth scale fine gesture ancient` )
	},
	{
		id : 2,
		name : `Bob`,
		mnemonic : `evidence cement snap basket genre fantasy degree ability sunset pistol palace target`,
		walletObj : EtherWallet.createWalletFromMnemonic( `evidence cement snap basket genre fantasy degree ability sunset pistol palace target` )
	},
	{
		id : 3,
		name : `Mary`,
		mnemonic : `electric shoot legal trial crane rib garlic claw armed snow blind advance`,
		walletObj : EtherWallet.createWalletFromMnemonic( `electric shoot legal trial crane rib garlic claw armed snow blind advance` )
	}
];


export const testUserAlice : number = 0;
export const testUserBob : number = 1;
export const testUserMary : number = 2;


export const testMnemonicList = {
	alice : testUserList[ testUserAlice ].mnemonic,
	bob : testUserList[ testUserBob ].mnemonic,
	mary : testUserList[ testUserMary ].mnemonic,
};

export const testWalletObjList = {
	alice : testUserList[ testUserAlice ].walletObj,
	bob : testUserList[ testUserBob ].walletObj,
	mary : testUserList[ testUserMary ].walletObj,
};