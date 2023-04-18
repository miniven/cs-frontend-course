import type { BitAccessor } from '../../../lecture_1/BitAccessor';

/**
 * Создаёт функцию записи значения в ArrayBuffer,
 * инкапсулируя в себе логику перебора битов о определения их позиций в ArrayBuffer
 *
 * @param getBitValue Функция для побитового приведения значения к двоичному виду
 * @returns Функция записи не двоичного значения в ArrayBuffer
 */
export function createEncoder<T extends any>(getBitValue: (value: T, index: number, limit: number) => 1 | 0) {
	return (accessor: BitAccessor, value: T, absPosition: number, size: number) => {
		for (let index = 0; index < size; index++) {
			accessor.setAbs(absPosition + index, getBitValue(value, index, size));
		}
	};
}

export function commonValueDecoder(value: number, bit: 1 | 0, bitPosition: number) {
	return value | (bit << bitPosition);
}
