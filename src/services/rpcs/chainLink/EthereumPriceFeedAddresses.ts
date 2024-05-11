export type ChainLinkPriceFeedAddressItem = {
	address : string,
	decimals : number,
};
export type ChainLinkPriceFeedAddressObject = {
	[key: string]: ChainLinkPriceFeedAddressItem;
};

export const priceFeedAddressesOnMainnet : ChainLinkPriceFeedAddressObject = {
	"1INCH/ETH" : {
		address : "0x72AFAECF99C9d9C8215fF44C77B94B99C28741e8",
		decimals : 18,
	},
	"1INCH/USD" : {
		address : "0xc929ad75B72593967DE83E7F7Cda0493458261D9",
		decimals : 8,
	},
	"AAVE/ETH" : {
		address : "0x6Df09E975c830ECae5bd4eD9d90f3A95a4f88012",
		decimals : 18,
	},
	"AAVE/USD" : {
		address : "0x547a514d5e3769680Ce22B2361c10Ea13619e8a9",
		decimals : 8,
	},
	"ADA/USD" : {
		address : "0xAE48c91dF1fE419994FFDa27da09D5aC69c30f55",
		decimals : 8,
	},
	"ADX/USD" : {
		address : "0x231e764B44b2C1b7Ca171fa8021A24ed520Cde10",
		decimals : 8,
	},
	"ALCX/ETH" : {
		address : "0x194a9AaF2e0b67c35915cD01101585A33Fe25CAa",
		decimals : 18,
	},
	"ALPHA/ETH" : {
		address : "0x89c7926c7c15fD5BFDB1edcFf7E7fC8283B578F6",
		decimals : 18,
	},
	"AMPL/ETH" : {
		address : "0x492575FDD11a0fCf2C6C719867890a7648d526eB",
		decimals : 18,
	},
	"AMPL/USD" : {
		address : "0xe20CA8D7546932360e37E9D72c1a47334af57706",
		decimals : 18,
	},
	"ANKR/USD" : {
		address : "0x7eed379bf00005CfeD29feD4009669dE9Bcc21ce",
		decimals : 8,
	},
	"ANT/ETH" : {
		address : "0x8f83670260F8f7708143b836a2a6F11eF0aBac01",
		decimals : 18,
	},
	"APE/ETH" : {
		address : "0xc7de7f4d4C9c991fF62a07D18b3E31e349833A18",
		decimals : 18,
	},
	"APE/USD" : {
		address : "0xD10aBbC76679a20055E167BB80A24ac851b37056",
		decimals : 8,
	},
	"ATOM/ETH" : {
		address : "0x15c8eA24Ba2d36671Fa22aD4Cff0a8eafe144352",
		decimals : 18,
	},
	"AUD/USD" : {
		address : "0x77F9710E7d0A19669A13c055F62cd80d313dF022",
		decimals : 8,
	},
	"AVAX/USD" : {
		address : "0xFF3EEb22B5E3dE6e705b44749C2559d704923FD7",
		decimals : 8,
	},
	"AXS/ETH" : {
		address : "0x8B4fC5b68cD50eAc1dD33f695901624a4a1A0A8b",
		decimals : 18,
	},
	"ARBITRUMHEALTHCHECK" : {
		address : "0x32EaFC72772821936BCc9b8A32dC394fEFcDBfD9",
		decimals : NaN,
	},
	"BADGER/ETH" : {
		address : "0x58921Ac140522867bf50b9E009599Da0CA4A2379",
		decimals : 18,
	},
	"BADGER/USD" : {
		address : "0x66a47b7206130e6FF64854EF0E1EDfa237E65339",
		decimals : 8,
	},
	"BAL/ETH" : {
		address : "0xC1438AA3823A6Ba0C159CfA8D98dF5A994bA120b",
		decimals : 18,
	},
	"BAL/USD" : {
		address : "0xdF2917806E30300537aEB49A7663062F4d1F2b5F",
		decimals : 8,
	},
	"BAND/ETH" : {
		address : "0x0BDb051e10c9718d1C29efbad442E88D38958274",
		decimals : 18,
	},
	"BAT/ETH" : {
		address : "0x0d16d4528239e9ee52fa531af613AcdB23D88c94",
		decimals : 18,
	},
	"BNB/USD" : {
		address : "0x14e613AC84a31f709eadbdF89C6CC390fDc9540A",
		decimals : 8,
	},
	"BNT/ETH" : {
		address : "0xCf61d1841B178fe82C8895fe60c2EDDa08314416",
		decimals : 18,
	},
	"BNT/USD" : {
		address : "0x1E6cF0D433de4FE882A437ABC654F58E1e78548c",
		decimals : 8,
	},
	"BTC/ETH" : {
		address : "0xdeb288F737066589598e9214E782fa5A8eD689e8",
		decimals : 18,
	},
	"BTC/USD" : {
		address : "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c",
		decimals : 8,
	},
	"BUSD/ETH" : {
		address : "0x614715d2Af89E6EC99A233818275142cE88d1Cfd",
		decimals : 18,
	},
	"BUSD/USD" : {
		address : "0x833D8Eb16D306ed1FbB5D7A2E019e106B960965A",
		decimals : 8,
	},
	"CAD/USD" : {
		address : "0xa34317DB73e77d453b1B8d04550c44D10e981C8e",
		decimals : 8,
	},
	"CAKE/USD" : {
		address : "0xEb0adf5C06861d6c07174288ce4D0a8128164003",
		decimals : 8,
	},
	"CBETH/ETH" : {
		address : "0xF017fcB346A1885194689bA23Eff2fE6fA5C483b",
		decimals : 18,
	},
	"CHF/USD" : {
		address : "0x449d117117838fFA61263B61dA6301AA2a88B13A",
		decimals : 8,
	},
	"CNY/USD" : {
		address : "0xeF8A4aF35cd47424672E3C590aBD37FBB7A7759a",
		decimals : 8,
	},
	"COMP/ETH" : {
		address : "0x1B39Ee86Ec5979ba5C322b826B3ECb8C79991699",
		decimals : 18,
	},
	"COMP/USD" : {
		address : "0xdbd020CAeF83eFd542f4De03e3cF0C28A4428bd5",
		decimals : 8,
	},
	"CRV/ETH" : {
		address : "0x8a12Be339B0cD1829b91Adc01977caa5E9ac121e",
		decimals : 18,
	},
	"CRV/USD" : {
		address : "0xCd627aA160A6fA45Eb793D19Ef54f5062F20f33f",
		decimals : 8,
	},
	"CSPX/USD" : {
		address : "0xF4E1B57FB228879D057ac5AE33973e8C53e4A0e0",
		decimals : 8,
	},
	"CVX/ETH" : {
		address : "0xC9CbF687f43176B302F03f5e58470b77D07c61c6",
		decimals : 18,
	},
	"CVX/USD" : {
		address : "0xd962fC30A72A84cE50161031391756Bf2876Af5D",
		decimals : 8,
	},
	"CALCULATEDXSUSHI/ETH" : {
		address : "0xF05D9B6C08757EAcb1fbec18e36A1B7566a13DEB",
		decimals : 18,
	},
	"CALCULATEDXSUSHI/USD" : {
		address : "0xCC1f5d9e6956447630d703C8e93b2345c2DE3D13",
		decimals : 8,
	},
	"CONSUMERPRICEINDEX" : {
		address : "0x9a51192e065ECC6BDEafE5e194ce54702DE4f1f5",
		decimals : 18,
	},
	"DAI/ETH" : {
		address : "0x773616E4d11A78F511299002da57A0a94577F1f4",
		decimals : 18,
	},
	"DAI/USD" : {
		address : "0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9",
		decimals : 8,
	},
	"DOGE/USD" : {
		address : "0x2465CefD3b488BE410b941b1d4b2767088e2A028",
		decimals : 8,
	},
	"DOT/USD" : {
		address : "0x1C07AFb8E2B827c5A4739C6d59Ae3A5035f28734",
		decimals : 8,
	},
	"DPI/ETH" : {
		address : "0x029849bbc0b1d93b85a8b6190e979fd38F5760E2",
		decimals : 18,
	},
	"DPI/USD" : {
		address : "0xD2A593BF7594aCE1faD597adb697b5645d5edDB2",
		decimals : 8,
	},
	"ENJ/ETH" : {
		address : "0x24D9aB51950F3d62E9144fdC2f3135DAA6Ce8D1B",
		decimals : 18,
	},
	"ENJ/USD" : {
		address : "0x23905C55dC11D609D5d11Dc604905779545De9a7",
		decimals : 8,
	},
	"ENS/USD" : {
		address : "0x5C00128d4d1c2F4f652C267d7bcdD7aC99C16E16",
		decimals : 8,
	},
	"ETH/BTC" : {
		address : "0xAc559F25B1619171CbC396a50854A3240b6A4e99",
		decimals : 8,
	},
	"ETH/USD" : {
		address : "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
		decimals : 8,
	},
	"EUR/USD" : {
		address : "0xb49f677943BC038e9857d61E7d053CaA2C1734C1",
		decimals : 8,
	},
	"EURT/USD" : {
		address : "0x01D391A48f4F7339aC64CA2c83a07C22F95F587a",
		decimals : 8,
	},
	"FARM/ETH" : {
		address : "0x611E0d2709416E002A3f38085e4e1cf77c015921",
		decimals : 18,
	},
	"FIL/ETH" : {
		address : "0x0606Be69451B1C9861Ac6b3626b99093b713E801",
		decimals : 18,
	},
	"FLOW/USD" : {
		address : "0xD9BdD9f5ffa7d89c846A5E3231a093AE4b3469D2",
		decimals : 8,
	},
	"FOR/USD" : {
		address : "0x456834f736094Fb0AAD40a9BBc9D4a0f37818A54",
		decimals : 8,
	},
	"FRAX/ETH" : {
		address : "0x14d04Fff8D21bd62987a5cE9ce543d2F1edF5D3E",
		decimals : 18,
	},
	"FRAX/USD" : {
		address : "0xB9E1E3A9feFf48998E45Fa90847ed4D467E8BcfD",
		decimals : 8,
	},
	"FTM/ETH" : {
		address : "0x2DE7E4a9488488e0058B95854CC2f7955B35dC9b",
		decimals : 18,
	},
	"FTT/ETH" : {
		address : "0xF0985f7E2CaBFf22CecC5a71282a89582c382EFE",
		decimals : 18,
	},
	"FXS/USD" : {
		address : "0x6Ebc52C8C1089be9eB3945C4350B68B8E4C2233f",
		decimals : 8,
	},
	"FASTGAS/GWEI" : {
		address : "0x169E633A2D1E6c10dD91238Ba11c4A708dfEF37C",
		decimals : NaN,
	},
	"GBP/USD" : {
		address : "0x5c0Ab2d9b5a7ed9f470386e82BB36A3613cDd4b5",
		decimals : 8,
	},
	"GHO/USD" : {
		address : "0x3f12643D3f6f874d39C2a4c9f2Cd6f2DbAC877FC",
		decimals : 8,
	},
	"GRT/ETH" : {
		address : "0x17D054eCac33D91F7340645341eFB5DE9009F1C1",
		decimals : 18,
	},
	"GRT/USD" : {
		address : "0x86cF33a451dE9dc61a2862FD94FF4ad4Bd65A5d2",
		decimals : 8,
	},
	"GTC/ETH" : {
		address : "0x0e773A17a01E2c92F5d4c53435397E2bd48e215F",
		decimals : 18,
	},
	"GUSD/ETH" : {
		address : "0x96d15851CBac05aEe4EFD9eA3a3DD9BDEeC9fC28",
		decimals : 18,
	},
	"GUSD/USD" : {
		address : "0xa89f5d2365ce98B3cD68012b6f503ab1416245Fc",
		decimals : 8,
	},
	"HBAR/USD" : {
		address : "0x38C5ae3ee324ee027D88c5117ee58d07c9b4699b",
		decimals : 8,
	},
	"HIGH/USD" : {
		address : "0xe2F95bC12FE8a3C35684Be7586C39fD7c0E5b403",
		decimals : 8,
	},
	"IB01/USD" : {
		address : "0x32d1463EB53b73C095625719Afa544D5426354cB",
		decimals : 8,
	},
	"IBTA/USD" : {
		address : "0xd27e6D02b72eB6FCe04Ad5690C419196B4EF2885",
		decimals : 8,
	},
	"ILV/ETH" : {
		address : "0xf600984CCa37cd562E74E3EE514289e3613ce8E4",
		decimals : 18,
	},
	"IMX/USD" : {
		address : "0xBAEbEFc1D023c0feCcc047Bff42E75F15Ff213E6",
		decimals : 8,
	},
	"INR/USD" : {
		address : "0x605D5c2fBCeDb217D7987FC0951B5753069bC360",
		decimals : 8,
	},
	"JPY/USD" : {
		address : "0xBcE206caE7f0ec07b545EddE332A47C2F75bbeb3",
		decimals : 8,
	},
	"KNC/ETH" : {
		address : "0x656c0544eF4C98A6a98491833A89204Abb045d6b",
		decimals : 18,
	},
	"KNC/USD" : {
		address : "0xf8fF43E991A81e6eC886a3D281A2C6cC19aE70Fc",
		decimals : 8,
	},
	"KP3R/ETH" : {
		address : "0xe7015CCb7E5F788B8c1010FC22343473EaaC3741",
		decimals : 18,
	},
	"KRW/USD" : {
		address : "0x01435677FB11763550905594A16B645847C1d0F3",
		decimals : 8,
	},
	"LDO/ETH" : {
		address : "0x4e844125952D32AcdF339BE976c98E22F6F318dB",
		decimals : 18,
	},
	"LINK/ETH" : {
		address : "0xDC530D9457755926550b59e8ECcdaE7624181557",
		decimals : 18,
	},
	"LINK/USD" : {
		address : "0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c",
		decimals : 8,
	},
	"LON/ETH" : {
		address : "0x13A8F2cC27ccC2761ca1b21d2F3E762445f201CE",
		decimals : 18,
	},
	"LRC/ETH" : {
		address : "0x160AC928A16C93eD4895C2De6f81ECcE9a7eB7b4",
		decimals : 18,
	},
	"LTC/USD" : {
		address : "0x6AF09DF7563C363B5763b9102712EbeD3b9e859B",
		decimals : 8,
	},
	"LUSD/USD" : {
		address : "0x3D7aE7E594f2f2091Ad8798313450130d0Aba3a0",
		decimals : 8,
	},
	"MANA/ETH" : {
		address : "0x82A44D92D6c329826dc557c5E1Be6ebeC5D5FeB9",
		decimals : 18,
	},
	"MANA/USD" : {
		address : "0x56a4857acbcfe3a66965c251628B1c9f1c408C19",
		decimals : 8,
	},
	"MATIC/USD" : {
		address : "0x7bAC85A8a13A4BcD8abb3eB7d6b4d632c5a57676",
		decimals : 8,
	},
	"MIM/USD" : {
		address : "0x7A364e8770418566e3eb2001A96116E6138Eb32F",
		decimals : 8,
	},
	"MKR/ETH" : {
		address : "0x24551a8Fb2A7211A25a17B1481f043A8a8adC7f2",
		decimals : 18,
	},
	"MKR/USD" : {
		address : "0xec1D1B3b0443256cc3860e24a46F108e699484Aa",
		decimals : 8,
	},
	"MLN/ETH" : {
		address : "0xDaeA8386611A157B08829ED4997A8A62B557014C",
		decimals : 18,
	},
	"NMR/ETH" : {
		address : "0x9cB2A01A7E64992d32A34db7cEea4c919C391f6A",
		decimals : 18,
	},
	"NZD/USD" : {
		address : "0x3977CFc9e4f29C184D4675f4EB8e0013236e5f3e",
		decimals : 8,
	},
	"NEXUSWETHRESERVES" : {
		address : "0xCc72039A141c6e34a779eF93AEF5eB4C82A893c7",
		decimals : 18,
	},
	"OGN/ETH" : {
		address : "0x2c881B6f3f6B5ff6C975813F87A4dad0b241C15b",
		decimals : 18,
	},
	"OHMV2/ETH" : {
		address : "0x9a72298ae3886221820B1c878d12D872087D3a23",
		decimals : 18,
	},
	"OMG/USD" : {
		address : "0x7D476f061F8212A8C9317D5784e72B4212436E93",
		decimals : 8,
	},
	"ONT/USD" : {
		address : "0xcDa3708C5c2907FCca52BB3f9d3e4c2028b89319",
		decimals : 8,
	},
	"ORN/ETH" : {
		address : "0xbA9B2a360eb8aBdb677d6d7f27E12De11AA052ef",
		decimals : 18,
	},
	"OXT/USD" : {
		address : "0xd75AAaE4AF0c398ca13e2667Be57AF2ccA8B5de6",
		decimals : 8,
	},
	"ORCHID" : {
		address : "0xa175FA75795c6Fb2aFA48B72d22054ee0DeDa4aC",
		decimals : 5,
	},
	"PAX/ETH" : {
		address : "0x3a08ebBaB125224b7b6474384Ee39fBb247D2200",
		decimals : 18,
	},
	"PAXG/ETH" : {
		address : "0x9B97304EA12EFed0FAd976FBeCAad46016bf269e",
		decimals : 18,
	},
	"PERP/ETH" : {
		address : "0x3b41D5571468904D4e53b6a8d93A6BaC43f02dC9",
		decimals : 18,
	},
	"PERP/USD" : {
		address : "0x01cE1210Fe8153500F60f7131d63239373D7E26C",
		decimals : 8,
	},
	"RAI/ETH" : {
		address : "0x4ad7B025127e89263242aB68F0f9c4E5C033B489",
		decimals : 18,
	},
	"RAI/USD" : {
		address : "0x483d36F6a1d063d580c7a24F9A42B346f3a69fbb",
		decimals : 8,
	},
	"RARI/ETH" : {
		address : "0x2a784368b1D492f458Bf919389F42c18315765F5",
		decimals : 18,
	},
	"REN/ETH" : {
		address : "0x3147D7203354Dc06D9fd350c7a2437bcA92387a4",
		decimals : 18,
	},
	"RETH/ETH" : {
		address : "0x536218f9E9Eb48863970252233c8F271f554C2d0",
		decimals : 18,
	},
	"RLC/ETH" : {
		address : "0x4cba1e1fdc738D0fe8DB3ee07728E2Bc4DA676c6",
		decimals : 18,
	},
	"RPL/USD" : {
		address : "0x4E155eD98aFE9034b7A5962f6C84c86d869daA9d",
		decimals : 8,
	},
	"RSR/USD" : {
		address : "0x759bBC1be8F90eE6457C44abc7d443842a976d02",
		decimals : 8,
	},
	"RUNE/ETH" : {
		address : "0x875D60C44cfbC38BaA4Eb2dDB76A767dEB91b97e",
		decimals : 18,
	},
	"SAND/USD" : {
		address : "0x35E3f7E558C04cE7eEE1629258EcbbA03B36Ec56",
		decimals : 8,
	},
	"SGD/USD" : {
		address : "0xe25277fF4bbF9081C75Ab0EB13B4A13a721f3E13",
		decimals : 8,
	},
	"SHIB/ETH" : {
		address : "0x8dD1CD88F43aF196ae478e91b9F5E4Ac69A97C61",
		decimals : 18,
	},
	"SHV/USD" : {
		address : "0xc04611C43842220fd941515F86d1DDdB15F04e46",
		decimals : 8,
	},
	"SNX/ETH" : {
		address : "0x79291A9d692Df95334B1a0B3B4AE6bC606782f8c",
		decimals : 18,
	},
	"SNX/USD" : {
		address : "0xDC3EA94CD0AC27d9A86C180091e7f78C683d3699",
		decimals : 8,
	},
	"SOL/USD" : {
		address : "0x4ffC43a60e009B551865A93d232E33Fce9f01507",
		decimals : 8,
	},
	"SPELL/USD" : {
		address : "0x8c110B94C5f1d347fAcF5E1E938AB2db60E3c9a8",
		decimals : 8,
	},
	"STETH/ETH" : {
		address : "0x86392dC19c0b719886221c78AB11eb8Cf5c52812",
		decimals : 18,
	},
	"STETH/USD" : {
		address : "0xCfE54B5cD566aB89272946F602D76Ea879CAb4a8",
		decimals : 8,
	},
	"STG/USD" : {
		address : "0x7A9f34a0Aa917D438e9b6E630067062B7F8f6f3d",
		decimals : 8,
	},
	"SUSD/ETH" : {
		address : "0x8e0b7e6062272B5eF4524250bFFF8e5Bd3497757",
		decimals : 18,
	},
	"SUSHI/ETH" : {
		address : "0xe572CeF69f43c2E488b33924AF04BDacE19079cf",
		decimals : 18,
	},
	"SUSHI/USD" : {
		address : "0xCc70F09A6CC17553b2E31954cD36E4A2d89501f7",
		decimals : 8,
	},
	"SXP/USD" : {
		address : "0xFb0CfD6c19e25DB4a08D8a204a387cEa48Cc138f",
		decimals : 8,
	},
	"TOMO/USD" : {
		address : "0x3d44925a8E9F9DFd90390E58e92Ec16c996A331b",
		decimals : 8,
	},
	"TRIBE/ETH" : {
		address : "0x84a24deCA415Acc0c395872a9e6a63E27D6225c8",
		decimals : 18,
	},
	"TRU/USD" : {
		address : "0x26929b85fE284EeAB939831002e1928183a10fb1",
		decimals : 8,
	},
	"TRY/USD" : {
		address : "0xB09fC5fD3f11Cf9eb5E1C5Dba43114e3C9f477b5",
		decimals : 8,
	},
	"TUSD/ETH" : {
		address : "0x3886BA987236181D98F2401c507Fb8BeA7871dF2",
		decimals : 18,
	},
	"TUSD/USD" : {
		address : "0xec746eCF986E2927Abd291a2A1716c940100f8Ba",
		decimals : 8,
	},
	"TOTALMARKETCAP/USD" : {
		address : "0xEC8761a0A73c34329CA5B1D3Dc7eD07F30e836e2",
		decimals : 8,
	},
	"UMA/ETH" : {
		address : "0xf817B69EA583CAFF291E287CaE00Ea329d22765C",
		decimals : 18,
	},
	"UNI/ETH" : {
		address : "0xD6aA3D25116d8dA79Ea0246c4826EB951872e02e",
		decimals : 18,
	},
	"UNI/USD" : {
		address : "0x553303d460EE0afB37EdFf9bE42922D8FF63220e",
		decimals : 8,
	},
	"USDC/ETH" : {
		address : "0x986b5E1e1755e3C2440e960477f25201B0a8bbD4",
		decimals : 18,
	},
	"USDC/USD" : {
		address : "0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6",
		decimals : 8,
	},
	"USDD/USD" : {
		address : "0x0ed39A19D2a68b722408d84e4d970827f61E6c0A",
		decimals : 8,
	},
	"USDP/USD" : {
		address : "0x09023c0DA49Aaf8fc3fA3ADF34C6A7016D38D5e3",
		decimals : 8,
	},
	"USDT/ETH" : {
		address : "0xEe9F2375b4bdF6387aa8265dD4FB8F16512A1d46",
		decimals : 18,
	},
	"USDT/USD" : {
		address : "0x3E7d1eAB13ad0104d2750B8863b489D65364e32D",
		decimals : 8,
	},
	"WBTC/BTC" : {
		address : "0xfdFD9C85aD200c506Cf9e21F1FD8dd01932FBB23",
		decimals : 8,
	},
	"WING/USD" : {
		address : "0x134fE0a225Fb8e6683617C13cEB6B3319fB4fb82",
		decimals : 8,
	},
	"WNXM/ETH" : {
		address : "0xe5Dc0A609Ab8bCF15d3f35cFaa1Ff40f521173Ea",
		decimals : 18,
	},
	"XAG/USD" : {
		address : "0x379589227b15F1a12195D3f2d90bBc9F31f95235",
		decimals : 8,
	},
	"XAU/USD" : {
		address : "0x214eD9Da11D2fbe465a6fc601a91E62EbEc1a0D6",
		decimals : 8,
	},
	"XCN/USD" : {
		address : "0xeb988B77b94C186053282BfcD8B7ED55142D3cAB",
		decimals : 8,
	},
	"YFI/ETH" : {
		address : "0x7c5d4F8345e66f68099581Db340cd65B078C41f4",
		decimals : 18,
	},
	"YFI/USD" : {
		address : "0xA027702dbb89fbd58938e4324ac03B58d812b0E1",
		decimals : 8,
	},
	"YFII/ETH" : {
		address : "0xaaB2f6b45B28E962B3aCd1ee4fC88aEdDf557756",
		decimals : 18,
	},
	"ZRX/ETH" : {
		address : "0x2Da4983a622a8498bb1a21FaE9D8F6C664939962",
		decimals : 18,
	},
	"ZRX/USD" : {
		address : "0x2885d15b8Af22648b98B122b22FDF4D2a56c6023",
		decimals : 8,
	},
	"SUSD/USD" : {
		address : "0xad35Bd71b9aFE6e4bDc266B345c198eaDEf9Ad94",
		decimals : 8,
	},

};
export const priceFeedAddressesOnSepoliaTestnet : ChainLinkPriceFeedAddressObject = {
	"BTC/ETH" : {
		address : "0x5fb1616F78dA7aFC9FF79e0371741a747D2a7F22",
		decimals : 18,
	},
	"BTC/USD" : {
		address : "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43",
		decimals : 8,
	},
	"CSPX/USD" : {
		address : "0x4b531A318B0e44B549F3b2f824721b3D0d51930A",
		decimals : 8,
	},
	"CZK/USD" : {
		address : "0xC32f0A9D70A34B9E7377C10FDAd88512596f61EA",
		decimals : 8,
	},
	"DAI/USD" : {
		address : "0x14866185B1962B63C3Ea9E03Bc1da838bab34C19",
		decimals : 8,
	},
	"ETH/USD" : {
		address : "0x694AA1769357215DE4FAC081bf1f309aDC325306",
		decimals : 8,
	},
	"EUR/USD" : {
		address : "0x1a81afB8146aeFfCFc5E50e8479e826E7D55b910",
		decimals : 8,
	},
	"FORTH/USD" : {
		address : "0x070bF128E88A4520b3EfA65AB1e4Eb6F0F9E6632",
		decimals : 8,
	},
	"GBP/USD" : {
		address : "0x91FAB41F5f3bE955963a986366edAcff1aaeaa83",
		decimals : 8,
	},
	"GHO/USD" : {
		address : "0x635A86F9fdD16Ff09A0701C305D3a845F1758b8E",
		decimals : 8,
	},
	"IB01/USD" : {
		address : "0xB677bfBc9B09a3469695f40477d05bc9BcB15F50",
		decimals : 8,
	},
	"IBTA/USD" : {
		address : "0x5c13b249846540F81c093Bc342b5d963a7518145",
		decimals : 8,
	},
	"JPY/USD" : {
		address : "0x8A6af2B75F23831ADc973ce6288e5329F63D86c6",
		decimals : 8,
	},
	"LINK/ETH" : {
		address : "0x42585eD362B3f1BCa95c640FdFf35Ef899212734",
		decimals : 18,
	},
	"LINK/USD" : {
		address : "0xc59E3633BAAC79493d908e63626716e204A45EdF",
		decimals : 8,
	},
	"SNX/USD" : {
		address : "0xc0F82A46033b8BdBA4Bb0B0e28Bc2006F64355bC",
		decimals : 8,
	},
	"USDC/USD" : {
		address : "0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E",
		decimals : 8,
	},
	"XAU/USD" : {
		address : "0xC5981F461d74c46eB4b0CF3f4Ec79f025573B0Ea",
		decimals : 8,
	},

};
export const priceFeedAddressesOnGoerliTestnet : ChainLinkPriceFeedAddressObject = {
	"BTC/ETH" : {
		address : "0x779877A7B0D9E8603169DdbD7836e478b4624789",
		decimals : 18,
	},
	"BTC/USD" : {
		address : "0xA39434A63A52E749F02807ae27335515BA4b07F7",
		decimals : 8,
	},
	"CZK/USD" : {
		address : "0xAE45DCb3eB59E27f05C170752B218C6174394Df8",
		decimals : 8,
	},
	"DAI/USD" : {
		address : "0x0d79df66BE487753B02D015Fb622DED7f0E9798d",
		decimals : 8,
	},
	"ETH/USD" : {
		address : "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
		decimals : 8,
	},
	"EUR/USD" : {
		address : "0x44390589104C9164407A0E0562a9DBe6C24A0E05",
		decimals : 8,
	},
	"FORTH/USD" : {
		address : "0x7A65Cf6C2ACE993f09231EC1Ea7363fb29C13f2F",
		decimals : 8,
	},
	"GBP/USD" : {
		address : "0x73D9c953DaaB1c829D01E1FC0bd92e28ECfB66DB",
		decimals : 8,
	},
	"JPY/USD" : {
		address : "0x982B232303af1EFfB49939b81AD6866B2E4eeD0B",
		decimals : 8,
	},
	"LINK/ETH" : {
		address : "0xb4c4a493AB6356497713A78FFA6c60FB53517c63",
		decimals : 18,
	},
	"LINK/USD" : {
		address : "0x48731cF7e84dc94C5f84577882c14Be11a5B7456",
		decimals : 8,
	},
	"SNX/USD" : {
		address : "0xdC5f59e61e51b90264b38F0202156F07956E2577",
		decimals : 8,
	},
	"USDC/USD" : {
		address : "0xAb5c49580294Aff77670F839ea425f5b78ab3Ae7",
		decimals : 8,
	},
	"XAU/USD" : {
		address : "0x7b219F57a8e9C7303204Af681e9fA69d17ef626f",
		decimals : 18,
	},

};
