import { BitAccessor, createBitAccessor } from '../../lecture_1/BitAccessor';

type TDataTypes = 'number' | 'boolean' | 'ascii';
type TSchema = Array<[number, TDataTypes]>;

const BITS_PER_ELEMENT = 8;

/**
 * Возвращает максимальное число, которое можно записать в данное количество бит
 *
 * @param length Количество бит, которые будут заполнены единицами
 * @returns Максимальное число, которое можно записать в данное количество бит
 */
function getMaxNumForBitDepth(length: number) {
	return ~0 >>> (32 - length);
}

/**
 * Возвращает позицию элемента, в котором находится искомая позиция бита
 *
 * @param position Позиция бита без привязки к элементам тип. массива
 * @param bitsPerElement Количество бит в элементе тип. массива
 * @returns Позиция элемента, в котором находится искомая позиция бита
 */
function getBytePosition(position: number) {
	return Math.floor(position / BITS_PER_ELEMENT);
}

/**
 * Возвращает позицию бита внутри элемента тип. массива
 *
 * @param position Позиция бита без привязки к элементам тип. массива
 * @param bitsPerElement Количество бит в элементе тип. массива
 * @returns бита внутри элемента тип. массива
 */
function getBitPosition(position: number) {
	return position % BITS_PER_ELEMENT;
}

/**
 * Создаёт функцию записи значения в ArrayBuffer,
 * инкапсулируя в себе логику перебора битов о определения их позиций в ArrayBuffer
 *
 * @param getBitValue Функция для побитового приведения значения к двоичному виду
 * @returns Функция записи не двоичного значения в ArrayBuffer
 */
function createEncoder<T extends any>(getBitValue: (value: T, index: number, limit: number) => 1 | 0) {
	return (accessor: BitAccessor, value: T, absPosition: number, size: number) => {
		for (let index = 0; index < size; index++) {
			const byteIndex = getBytePosition(absPosition + index);
			const bitIndex = getBitPosition(absPosition + index);

			accessor.set(byteIndex, bitIndex, getBitValue(value, index, size));
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
const encodeNumber = createEncoder((value: number, index: number) => ((value & (1 << index)) > 0 ? 1 : 0));

/**
 * Записывает значение типа Boolean в ArrayBuffer
 *
 * @param accessor Класс, отвечающий за запись битов в ArrayBuffer
 * @param value Значение, которое должно быть записано в ArrayBuffer в его первоначальном виде
 * @param absPosition Позиция значения в ArrayBuffer относительно всех битов
 * @param size Количество битов, которые займёт значение
 */
const encodeBoolean = createEncoder((value: boolean, index: number, limit: number) => {
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
const encodeASCII = createEncoder((value: string, index: number) => {
	/**
	 * Заполняем все доступные биты двоичным представлением кода символа
	 */
	const charPosition = Math.floor(index / BITS_PER_ELEMENT);
	const bitPosition = index % BITS_PER_ELEMENT;
	const code = value.charCodeAt(charPosition);

	return (code & (1 << bitPosition)) > 0 ? 1 : 0;
});

/**
 * Выбрасывает исключение, если значение типа ASCII не умещается в отведённое количество бит
 *
 * @param value Строка, которую нужно проверить
 * @param schema Схема валидации для типа ASCII
 */
function assertASCII(value: string, [limit, type]: [number, 'ascii']) {
	const CHAR_BITS_LENGTH = 8;

	if (value.length > limit / CHAR_BITS_LENGTH) {
		throw new Error(`The element of type ${type} exceeds the limit of ${limit} bits`);
	}
}

/**
 * Выбрасывает исключение, если число не умещается в отведённое количество бит
 *
 * @param value Число, которое нужно проверить
 * @param schema Схема валидации для типа Number
 */
function assertNumber(value: number, [limit, type]: [number, 'number']) {
	if (value > getMaxNumForBitDepth(limit)) {
		throw new Error(`The element of type ${type} exceeds the limit of ${limit} bits`);
	}
}

/**
 * Выбрасывает исключение, если значение не умещается в отведённое количество бит
 *
 * @param value Значение типа Boolean, которое нужно проверить
 * @param schema Схема валидации для типа Boolean
 */
function assertBoolean(value: boolean, [limit, type]: [number, 'boolean']) {
	if (limit <= 0) {
		throw new Error(`The type ${type} requires at least 1 bit`);
	}
}

function isNumberSchema(schema: [number, TDataTypes]): schema is [number, 'number'] {
	return schema[1] === 'number';
}

function isBooleanSchema(schema: [number, TDataTypes]): schema is [number, 'boolean'] {
	return schema[1] === 'boolean';
}

function isASCIISchema(schema: [number, TDataTypes]): schema is [number, 'ascii'] {
	return schema[1] === 'ascii';
}

/**
 * Добавляет значения в двоичном виде в ArrayBuffer согласно указанной схеме
 *
 * @param data Массив значений, которые нужно поместить в ArrayBuffer
 * @param schema Схема буфера, с указанием типов данных и отведенного им количества бит
 * @returns ArrayBuffer
 */
export function encode(data: Array<number | boolean | string>, schema: TSchema) {
	if (data.length !== schema.length) {
		throw new Error('Provided data length is not equal to Schema');
	}

	const buffer = new ArrayBuffer(Math.ceil(schema.reduce((acc, item) => acc + item[0], 0) / BITS_PER_ELEMENT));
	const bufferView = new Uint8Array(buffer);
	const accessor = createBitAccessor(bufferView);

	let nextValuePosition = 0;

	for (let index = 0; index < data.length; index++) {
		const value = data[index];
		const valueSchema = schema[index];

		if (typeof value === 'number' && isNumberSchema(valueSchema)) {
			assertNumber(value, valueSchema);
			encodeNumber(accessor, value, nextValuePosition, valueSchema[0]);
		}

		if (typeof value === 'boolean' && isBooleanSchema(valueSchema)) {
			assertBoolean(value, valueSchema);
			encodeBoolean(accessor, value, nextValuePosition, valueSchema[0]);
		}

		if (typeof value === 'string' && isASCIISchema(valueSchema)) {
			assertASCII(value, valueSchema);
			encodeASCII(accessor, value, nextValuePosition, valueSchema[0]);
		}

		nextValuePosition += valueSchema[0];
	}

	return buffer;
}
