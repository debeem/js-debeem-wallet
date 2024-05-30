/**
 * 	@category Data Models
 *
 * 	@module
 */
export interface UsdtABIItem
{
	constant: boolean,
	anonymous : boolean,
	inputs: Array<any>,
	name: string,
	outputs: Array<any>,
	payable: boolean,
	stateMutability: string,
	type: string
}
