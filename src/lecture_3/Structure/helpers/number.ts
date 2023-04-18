import { StructureFieldType, TStructureFieldSchema } from '../types';
import { createEncoder } from './common';

/**
 * Выбрасывает исключение, если число не умещается в отведённое количество бит
 *
 * @param value Число, которое нужно проверить
 * @param limit Допустимое количество бит для числа
 */
export function assertNumber(value: number, limit: number) {
	if (value > getMaxNumForBitDepth(limit)) {
		throw new Error(`The element of type U16 exceeds the limit of ${limit} bits`);
	}
}

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
 * Записывает числовое значение в ArrayBuffer
 *
 * @param accessor Класс, отвечающий за запись битов в ArrayBuffer
 * @param value Значение, которое должно быть записано в ArrayBuffer в его первоначальном виде
 * @param absPosition Позиция значения в ArrayBuffer относительно всех битов
 * @param size Количество битов, которые займёт значение
 */
export const encodeNumber = createEncoder((value: number, index: number) => ((value & (1 << index)) > 0 ? 1 : 0));

export const isNumberSchema = (schema: TStructureFieldSchema) => schema[1] === StructureFieldType.U_16;
