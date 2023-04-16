import type { TDataTypes, TSchema } from './types';

export const BITS_PER_ELEMENT = 8;

/**
 * Возвращает максимальное число, которое можно записать в данное количество бит
 *
 * @param length Количество бит, которые будут заполнены единицами
 * @returns Максимальное число, которое можно записать в данное количество бит
 */
export function getMaxNumForBitDepth(length: number) {
	return ~0 >>> (32 - length);
}

/**
 * Возвращает позицию элемента, в котором находится искомая позиция бита
 *
 * @param position Позиция бита без привязки к элементам тип. массива
 * @param bitsPerElement Количество бит в элементе тип. массива
 * @returns Позиция элемента, в котором находится искомая позиция бита
 */
export function getBytePosition(position: number) {
	return Math.floor(position / BITS_PER_ELEMENT);
}

/**
 * Возвращает позицию бита внутри элемента тип. массива
 *
 * @param position Позиция бита без привязки к элементам тип. массива
 * @param bitsPerElement Количество бит в элементе тип. массива
 * @returns бита внутри элемента тип. массива
 */
export function getBitPosition(position: number) {
	return position % BITS_PER_ELEMENT;
}

export function isNumberSchema(schema: [number, TDataTypes]): schema is [number, 'number'] {
	return schema[1] === 'number';
}

export function isBooleanSchema(schema: [number, TDataTypes]): schema is [number, 'boolean'] {
	return schema[1] === 'boolean';
}

export function isASCIISchema(schema: [number, TDataTypes]): schema is [number, 'ascii'] {
	return schema[1] === 'ascii';
}

/**
 * Считает полное количество использованных в схеме бит
 *
 * @param schema Схема кодирования
 * @returns Полное количество использованных бит
 */
export function countTotalBits(schema: TSchema) {
	return schema.reduce((acc, item) => acc + item[0], 0);
}
