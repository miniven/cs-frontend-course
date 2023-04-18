export class BitAccessor {
	static BYTE_SIZE = 8;

	#array: Uint8Array | Uint16Array | Uint32Array;

	constructor(array: Uint8Array | Uint16Array | Uint32Array) {
		this.#array = array;
	}

	/**
	 * Возвращает позицию бита внутри элемента тип. массива
	 *
	 * @param position Позиция бита без привязки к элементам тип. массива
	 * @returns бита внутри элемента тип. массива
	 */
	private getBitPosition(position: number) {
		return position % BitAccessor.BYTE_SIZE;
	}

	/**
	 * Возвращает позицию элемента, в котором находится искомая позиция бита
	 *
	 * @param position Позиция бита без привязки к элементам тип. массива
	 * @returns Позиция элемента, в котором находится искомая позиция бита
	 */
	private getBytePosition(position: number) {
		return Math.floor(position / BitAccessor.BYTE_SIZE);
	}

	/**
	 * Валидирует позиции элемента массива и его бита
	 *
	 * @param elementIndex Индекс элемента массива
	 * @param bitIndex Индекс конкретного бита элемента
	 */
	private assertPositions(elementIndex: number, bitIndex: number) {
		if (this.#array[elementIndex] === undefined) {
			throw new Error('Invalid element position');
		}

		if (bitIndex >= this.#array.BYTES_PER_ELEMENT * BitAccessor.BYTE_SIZE || bitIndex < 0) {
			throw new Error('Invalid bit position');
		}
	}

	/**
	 * Возвращает значение бита по индексу у указанного элемента массива
	 *
	 * @param elementIndex Индекс элемента массива
	 * @param bitIndex Индекс конкретного бита элемента
	 * @returns Бит по искомому индексу
	 */
	get(elementIndex: number, bitIndex: number): 1 | 0 | void {
		this.assertPositions(elementIndex, bitIndex);

		return (this.#array[elementIndex] & (1 << bitIndex)) === 0 ? 0 : 1;
	}

	/**
	 * Возвращает значение бита по абсолютному значению индекса без привязки к номеру элемента
	 *
	 * @param absBitIndex Абсолютная позиция бита
	 * @returns Бит по искомому индексу
	 */
	getAbs(absBitIndex: number): 1 | 0 | void {
		const bytePosition = this.getBytePosition(absBitIndex);
		const bitPosition = this.getBitPosition(absBitIndex);

		return this.get(bytePosition, bitPosition);
	}

	/**
	 * Устанавливает значение бита по индексу у указанного элемента массива
	 *
	 * @param elementIndex Индекс элемента массива
	 * @param bitIndex Индекс конкретного бита элемента
	 * @param value Новое значение бита
	 */
	set(elementIndex: number, bitIndex: number, value: 1 | 0): void {
		this.assertPositions(elementIndex, bitIndex);

		if (value === 0) {
			this.#array[elementIndex] = this.#array[elementIndex] & ~(1 << bitIndex);
		}

		if (value === 1) {
			this.#array[elementIndex] = this.#array[elementIndex] | (1 << bitIndex);
		}
	}

	/**
	 * Устанавливает значение бита по абсолютному индексу
	 *
	 * @param absBitIndex Абсолютный индекс конкретного бита
	 * @param value Новое значение бита
	 */
	setAbs(absBitIndex: number, value: 1 | 0): 1 | 0 | void {
		const bytePosition = this.getBytePosition(absBitIndex);
		const bitPosition = this.getBitPosition(absBitIndex);

		return this.set(bytePosition, bitPosition, value);
	}
}

export const createBitAccessor = (array: Uint8Array | Uint16Array | Uint32Array): BitAccessor => {
	return new BitAccessor(array);
};
