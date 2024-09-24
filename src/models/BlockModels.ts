

export type BlockItem =
{
	/**
	 * 	A hexadecimal of the difficulty for this block.
	 * 	"0xbfabcdbd93dda"
	 */
	difficulty: string,

	/**
	 * 	The "extra data" field of this block.
	 * 	"0x737061726b706f6f6c2d636e2d6e6f64652d3132"
	 */
	extraData: string,

	/**
	 * 	Maximum gas allowed in this block.
	 * 	"0x79f39e"
	 */
	gasLimit: string,

	/**
	 * 	Total used gas by all transactions in this block.
	 * 	"0x79ccd3"
	 */
	gasUsed: string,

	/**
	 * 	32 bytes. The hash of the block. Null when the returned block is the pending block.
	 * 	"0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35"
	 */
	hash: string,

	/**
	 * 	256 bytes. The bloom filter for the logs of the block. Null when the returned block is the pending block.
	 * 	"0x4848112002a2020aaa0812180045840210020005281600c80104264300080008000491220144461026015300100000128005018401002090a824a4150015410020140400d808440106689b29d0280b1005200007480ca950b15b010908814e01911000054202a020b05880b914642a0000300003010044044082075290283516be82504082003008c4d8d14462a8800c2990c88002a030140180036c220205201860402001014040180002006860810ec0a1100a14144148408118608200060461821802c081000042d0810104a8004510020211c088200420822a082040e10104c00d010064004c122692020c408a1aa2348020445403814002c800888208b1"
	 */
	logsBloom: string,

	/**
	 * 	20 bytes. The address of the beneficiary to whom the mining rewards were given.
	 * 	"0x5a0b54d5dc17e0aadc383d2db43b0a0d3e029c4c"
	 */
	miner: string,

	/**
	 * 	8 bytes. The hash of the generated proof-of-work. Null when the returned block is the pending block.
	 * 	"0x4db7a1c01d8a8072"
	 */
	nonce: string,

	/**
	 * 	The block number. Null when the returned block is the pending block.
	 * 	"0x5bad55"
	 */
	number: string,

	/**
	 * 	32 bytes. The hash of the parent block.
	 * 	"0x61a8ad530a8a43e3583f8ec163f773ad370329b2375d66433eb82f005e1d6202"
	 */
	parentHash: string,

	/**
	 * 	32 bytes. The root of the receipts trie of the block.
	 * 	"0x5eced534b3d84d3d732ddbc714f5fd51d98a941b28182b6efe6df3a0fe90004b"
	 */
	receiptsRoot: string,

	/**
	 * 	32 bytes. The SHA3 of the uncles data in the block.
	 * 	"0x8a562e7634774d3e3a36698ac4915e37fc84a2cd0044cb84fa5d80263d2af4f6"
	 */
	sha3Uncles: string,

	/**
	 * 	A hexadecimal of the size of this block in bytes.
	 * 	"0x41c7"
	 */
	size: string,

	/**
	 * 	32 bytes. The root of the final state trie of the block.
	 * 	"0xf5208fffa2ba5a3f3a2f64ebd5ca3d098978bedd75f335f56b705d8715ee2305"
	 */
	stateRoot: string,

	/**
	 * 	Unix timestamp for when the block was collated.
	 * 	"0x5b541449"
	 */
	timestamp: string,

	/**
	 * 	timestamp in long format
	 */
	timestampInSecond: number,

	/**
	 * 	A hexadecimal of the total difficulty of the chain until this block.
	 * 	"0x12ac11391a2f3872fcd"
	 */
	totalDifficulty: string,

	/**
	 * 	An array of transaction objects, or 32 bytes transaction hashes depending on the last given parameter.
	 * 	[
	 *       "0x8784d99762bccd03b2086eabccee0d77f14d05463281e121a62abfebcf0d2d5f",
	 *       "0x311be6a9b58748717ac0f70eb801d29973661aaf1365960d159e4ec4f4aa2d7f",
	 *       "0xe42b0256058b7cad8a14b136a0364acda0b4c36f5b02dea7e69bfd82cef252a2",
	 *       "0x4eb05376055c6456ed883fc843bc43df1dcf739c321ba431d518aecd7f98ca11",
	 *       "0x994dd9e72b212b7dc5fd0466ab75adf7d391cf4f206a65b7ad2a1fd032bb06d7",
	 *       "0xf6feecbb9ab0ac58591a4bc287059b1133089c499517e91a274e6a1f5e7dce53",
	 *       "0x7e537d687a5525259480440c6ea2e1a8469cd98906eaff8597f3d2a44422ff97",
	 *       "0xa762220e92bed6d77a2c19ffc60dad77d71bd5028c5230c896ab4b9552a39b50",
	 *       "0xf1fa677edda7e5add8e794732c7554cd5459a5c12781dc71de73c7937dfb2775",
	 *       "0x241d89f7888fbcfadfd415ee967882fec6fdd67c07ca8a00f2ca4c910a84c7dd"
	 *     ]
	 */
	transactions: Array<string>,

	/**
	 * 	32 bytes. The root of the transaction trie of the block.
	 * 	"0xf98631e290e88f58a46b7032f025969039aa9b5696498efc76baf436fa69b262"
	 */
	transactionsRoot: string,

	/**
	 * 	An Array of uncle hashes.
	 * 	[
	 *       "0x824cce7c7c2ec6874b9fa9a9a898eb5f27cbaf3991dfa81084c3af60d1db618c"
	 *     ]
	 */
	uncles: Array<string>,
}