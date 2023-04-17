import type { BitAccessor } from '../../lecture_1/BitAccessor';

export const BITS_PER_ELEMENT = 16;

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

/**
 * Записывает числовое значение в ArrayBuffer
 *
 * @param accessor Класс, отвечающий за запись битов в ArrayBuffer
 * @param value Значение, которое должно быть записано в ArrayBuffer в его первоначальном виде
 * @param absPosition Позиция значения в ArrayBuffer относительно всех битов
 * @param size Количество битов, которые займёт значение
 */
export const encodeNumber = createEncoder((value: number, index: number) => ((value & (1 << index)) > 0 ? 1 : 0));

/**
 * Записывает значение типа Boolean в ArrayBuffer
 *
 * @param accessor Класс, отвечающий за запись битов в ArrayBuffer
 * @param value Значение, которое должно быть записано в ArrayBuffer в его первоначальном виде
 * @param absPosition Позиция значения в ArrayBuffer относительно всех битов
 * @param size Количество битов, которые займёт значение
 */
export const encodeBoolean = createEncoder((value: boolean, index: number, limit: number) => {
	/**
	 * Если имеем значение true, то записываем его в первый разряд, остальное заполняем нулями
	 */
	return value && index === limit - 1 ? 1 : 0;
});

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
	const charPosition = Math.floor(index / BITS_PER_ELEMENT);
	const bitPosition = index % BITS_PER_ELEMENT;
	const code = value.charCodeAt(charPosition);

	return (code & (1 << bitPosition)) > 0 ? 1 : 0;
});
