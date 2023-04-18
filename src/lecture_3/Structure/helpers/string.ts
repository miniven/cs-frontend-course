import { StructureFieldType, TStructureFieldSchema } from '../types';
import { createEncoder } from './common';

export const UTF_16_BITS_SIZE = 16;

/**
 * Выбрасывает исключение, если количество символов в значении типа UTF-16 превышает допустимое
 *
 * @param value Строка, которую нужно проверить
 * @param limit Допустимое количество символов
 */
export function assertUTF16(value: string, limit: number) {
	if (value.length > limit) {
		throw new Error(`The element of type UTF-16 exceeds the limit of ${limit} characters`);
	}
}

/**
 * Записывает строку в ArrayBuffer
 *
 * @param accessor Класс, отвечающий за запись битов в ArrayBuffer
 * @param value Значение, которое должно быть записано в ArrayBuffer в его первоначальном виде
 * @param absPosition Позиция значения в ArrayBuffer относительно всех битов
 * @param size Количество битов, которые займёт значение
 */
export const encodeUTF16 = createEncoder((value: string, index: number) => {
	/**
	 * Заполняем все доступные биты двоичным представлением кода символа
	 */
	const charPosition = Math.floor(index / UTF_16_BITS_SIZE);
	const bitPosition = index % UTF_16_BITS_SIZE;
	const code = value.charCodeAt(charPosition);

	return (code & (1 << bitPosition)) > 0 ? 1 : 0;
});

export const isUTF16Schema = (schema: TStructureFieldSchema) => schema[1] === StructureFieldType.UTF_16;

export function UTF16ValueDecoder(value: number, bit: 1 | 0, bitPosition: number) {
	return value | (bit << bitPosition % UTF_16_BITS_SIZE);
}

export function isEndOfChar(index: number) {
	return index && index % UTF_16_BITS_SIZE === 0;
}
