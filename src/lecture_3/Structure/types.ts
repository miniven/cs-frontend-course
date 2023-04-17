export type TStructureFieldName = string;

export enum StructureFieldType {
	UTF_16 = 'utf16',
	U_16 = 'u16',
}

export type TStructureFieldSchema =
	| [TStructureFieldName, StructureFieldType.UTF_16, number]
	| [TStructureFieldName, StructureFieldType.U_16];

export interface IStructure<T extends any = any> {
	set(name: TStructureFieldName, value: T): void;
	get(name: TStructureFieldName): T;
}
