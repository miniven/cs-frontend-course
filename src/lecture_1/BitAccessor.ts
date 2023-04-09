class BitAccessor {
	static BYTE_SIZE = 8;

	#array: Uint8Array;

	constructor(array: Uint8Array) {
		this.#array = array;
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
	get(elementIndex: number, bitIndex: number): number | void {
		this.assertPositions(elementIndex, bitIndex);

		return (this.#array[elementIndex] & (1 << bitIndex)) === 0 ? 0 : 1;
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
}

export const createBitAccessor = (array: Uint8Array): BitAccessor => {
	return new BitAccessor(array);
}
