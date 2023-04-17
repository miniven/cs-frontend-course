import { BitAccessor } from '../../lecture_1/BitAccessor';
import { limits } from './const';
import { encodeNumber, encodeUTF16 } from './helpers';

import { IStructure, StructureFieldType, TStructureFieldName, TStructureFieldSchema } from './types';

export class Structure implements IStructure {
	#schema: Array<TStructureFieldSchema>;
	#accessor: BitAccessor;
	#currentBitPointer: number = 0;
	#currentFieldIndex: number = 0;

	constructor(schema: Array<TStructureFieldSchema>) {
		const size = this._countBufferSize(schema);
		const buffer = new ArrayBuffer(size);

		this.#schema = schema;
		this.#accessor = new BitAccessor(new Uint8Array(buffer));
	}

	/**
	 * Возвращает количество бит, которое займёт в памяти данное поле
	 *
	 * @static
	 * @param fieldSchema Схема, описывающая поле
	 * @returns Количество бит
	 */
	static getFieldSize([, type, limit = 1]: TStructureFieldSchema) {
		return limits[type] * limit;
	}

	/**
	 * Возвращает длину буфера, которая необходима, чтобы поместить в него все описанные значения
	 *
	 * @private
	 * @param schema Схема полей структуры
	 * @returns Длина буфера
	 */
	private _countBufferSize(schema: Array<TStructureFieldSchema>) {
		let bitsAmount = 0;

		for (const field of schema) {
			bitsAmount += Structure.getFieldSize(field);
		}

		return Math.ceil(bitsAmount / 8);
	}

	/**
	 * Находит позицию поля в ArrayBuffer
	 *
	 * @private
	 * @description Ищет позицию через перебор всех полей, чтобы не пришлось хранить доп. данные о позициях в памяти
	 *
	 * @param name Имя поля
	 * @returns Массив, где первый элемент — абсолютная позиция поля в ArrayBuffer, а второй — схема искомого поля
	 */
	private _getFieldPosition(name: TStructureFieldName): [number, TStructureFieldSchema?] {
		let position = 0;

		for (const field of this.#schema) {
			const [nameInSchema] = field;

			if (name === nameInSchema) {
				return [position, field];
			}

			position += Structure.getFieldSize(field);
		}

		return [-1];
	}

	/**
	 * Устанавливает значение поля в ArrayBuffer
	 *
	 * @param name Имя поля
	 * @param value Значение поля
	 */
	set(name: TStructureFieldName, value: any) {
		const currentFieldSchema = this.#schema[this.#currentFieldIndex];

		if (name !== currentFieldSchema[0]) {
			throw new Error(`Wrong field name: "${name}". Set "${currentFieldSchema[0]}" field before`);
		}

		const valueLength = Structure.getFieldSize(currentFieldSchema);

		if (currentFieldSchema[1] === StructureFieldType.U_16) {
			encodeNumber(this.#accessor, value, this.#currentBitPointer, valueLength);
		}

		if (currentFieldSchema[1] === StructureFieldType.UTF_16) {
			encodeUTF16(this.#accessor, value, this.#currentBitPointer, valueLength);
		}

		this.#currentBitPointer += valueLength;
		this.#currentFieldIndex++;
	}

	/**
	 * Возвращает значение указанного поля
	 *
	 * @param name Имя поля
	 * @returns Значение поля
	 */
	get(name: TStructureFieldName): any {
		const [position, field] = this._getFieldPosition(name);

		if (!field || position < 0) {
			return;
		}

		let value = 0;

		for (let index = 0; index < Structure.getFieldSize(field); index++) {
			const bitValue = this.#accessor.getAbs(index + position);

			if (bitValue) {
				value = value | (bitValue << index);
			}
		}

		return value;
	}
}
