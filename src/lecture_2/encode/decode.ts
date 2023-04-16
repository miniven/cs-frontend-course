import { createBitAccessor } from '../../lecture_1/BitAccessor';
import { getBitPosition, getBytePosition, isASCIISchema, isBooleanSchema, isNumberSchema } from './helpers';

import type { TSchema } from './types';

const CHAR_BITS_LENGTH = 8;

function commonValueDecoder(value: number, bit: 1 | 0, bitPosition: number) {
	return value | (bit << bitPosition);
}

function ASCIIValueDecoder(value: number, bit: 1 | 0, bitPosition: number) {
	return value | (bit << bitPosition % CHAR_BITS_LENGTH);
}

function isEndOfChar(index: number) {
	return index && index % CHAR_BITS_LENGTH === 0;
}

export function decode(buffer: ArrayBuffer, schema: TSchema) {
	const bufferView = new Uint8Array(buffer);
	const accessor = createBitAccessor(bufferView);
	const result: Array<number | boolean | string> = [];

	let previousBitsCounter = 0;

	for (const valueSchema of schema) {
		let index = 0;
		let value = 0;
		let ASCIISymbols = [];

		while (index < valueSchema[0]) {
			const bytePosition = getBytePosition(previousBitsCounter);
			const bitPosition = getBitPosition(previousBitsCounter);
			const bitValue = accessor.get(bytePosition, bitPosition);

			if (isASCIISchema(valueSchema) && isEndOfChar(index)) {
				ASCIISymbols.push(value);
				value = 0;
			}

			if (isBooleanSchema(valueSchema) && index) {
				previousBitsCounter += valueSchema[0] - index;

				break;
			}

			/**
			 * Значение изначально представляет собой последовательность нулей,
			 * значит имеет смысл только подставить единицы в нужные разряды.
			 */
			if (bitValue) {
				value = isASCIISchema(valueSchema)
					? ASCIIValueDecoder(value, bitValue, index)
					: commonValueDecoder(value, bitValue, index);
			}

			previousBitsCounter++;
			index++;
		}

		if (isNumberSchema(valueSchema)) {
			result.push(value);
		}

		if (isBooleanSchema(valueSchema)) {
			result.push(Boolean(value));
		}

		if (isASCIISchema(valueSchema)) {
			ASCIISymbols.push(value);
			result.push(String.fromCharCode(...ASCIISymbols));
		}
	}

	return result;
}
