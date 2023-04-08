class BitAccessor {
	static BYTE_SIZE = 8;

	private array: Uint8Array;

	constructor(array: Uint8Array) {
		this.array = array;
	}

	private validate(elementIndex: number, bitIndex: number) {
		if (this.array[elementIndex] === undefined) {
			throw new Error('Invalid element position');
		}

		if (bitIndex >= this.array.BYTES_PER_ELEMENT * BitAccessor.BYTE_SIZE || bitIndex < 0) {
			throw new Error('Invalid bit position');
		}
	}

	get(elementIndex: number, bitIndex: number): number | void {
		this.validate(elementIndex, bitIndex);

		return (this.array[elementIndex] & (1 << bitIndex)) === 0 ? 0 : 1;
	}

	set(elementIndex: number, bitIndex: number, value: 1 | 0): void {
		this.validate(elementIndex, bitIndex);

		if (value === 0) {
			this.array[elementIndex] = this.array[elementIndex] & ~(1 << bitIndex);
		}

		if (value === 1) {
			this.array[elementIndex] = this.array[elementIndex] | (1 << bitIndex);
		}
	}
}

export const createBitAccessor = (array: Uint8Array): BitAccessor => {
	return new BitAccessor(array);
}
