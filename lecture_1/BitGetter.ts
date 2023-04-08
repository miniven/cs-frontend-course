class BitGetter {
	private array: Uint8Array;

	constructor(array: Uint8Array) {
		this.array = array;
	}

	get(elementIndex: number, bitIndex: number): number | void {
		const element = this.array[elementIndex];

		if (element !== undefined) {
			return (element & (1 << bitIndex)) === 0 ? 0 : 1;
		}
	}
}

const createBitGetter = (array: Uint8Array): BitGetter => {
	return new BitGetter(array);
}

const bitGetter = createBitGetter(new Uint8Array([0b1110, 0b1101]));

// Второй параметр это порядок бита "справа-налево"
console.log(bitGetter.get(0, 1)); // 1
console.log(bitGetter.get(1, 1)); // 0