/**
 * @class Класс динамического массива (вектор), работающего по принципу двусторонней очереди
 */
export class Vector {
	#array: Uint8Array;
	#length = 0;
	#frontPointer = -1;
	#backPointer = 0;

	/**
	 * Создаёт экземпляр вектора
	 *
	 * @param ArrayConstructor Класс типизированного массива, который будет взят за основу вектора
	 * @param capacity Начальная вместимость вектора
	 */
	constructor(ArrayConstructor: Uint8ArrayConstructor, capacity: number) {
		this.#array = new ArrayConstructor(capacity);
	}

	/**
	 * Геттер для получения количества элементов в векторе
	 */
	get length() {
		return this.#length;
	}

	/**
	 * Ошибка, когда стек пустой
	 *
	 * @private
	 */
	private assertEmptyStack() {
		if (this.#length === 0) {
			throw new Error('Queue is empty');
		}
	}

	/**
	 * Возвращает указатель, чтобы он всегда был в границах массива
	 *
	 * @private
	 * @param pointer Исходный указатель, который может быть отрицательным, или превышать длину массива
	 * @returns Форматированный указатель
	 */
	#adjustPointer(pointer: number) {
		if (pointer < 0) {
			return this.#array.length + pointer;
		}

		return pointer % this.#array.length;
	}

	/**
	 * Создаёт новый массив большей длины и копирует в него все элементы,
	 * которые были в старом массиве. При этом все элементы будут лежать в новом массиве, начиная с индекса 0.
	 *
	 * @private
	 */
	#allocateBuffer(targetLength: number) {
		let nextLength = this.#length;

		while (nextLength < targetLength) {
			nextLength = (nextLength * 3) / 2 + 1;
		}

		const Constructor = this.#array.constructor as Uint8ArrayConstructor;
		const nextArray = new Constructor(nextLength);

		let pointer = this.#adjustPointer(this.#backPointer);
		let nextIndex = 0;

		while (nextIndex < this.#length) {
			const value = this.#array[pointer];

			nextArray[nextIndex] = value;
			pointer = this.#adjustPointer(++this.#backPointer);
			nextIndex++;
		}

		this.#array = nextArray;
		this.#backPointer = 0;
		this.#frontPointer = this.#length - 1;
	}

	/**
	 * Добавляет все переданные в качестве аргументов элементы в конец вектора
	 *
	 * @param args Последовательность элементов, которые будут помещены в конец вектора
	 * @returns Количество элементов в векторе
	 */
	pushFront(...args: number[]): number {
		const targetLength = this.#length + args.length;

		if (targetLength > this.#array.length) {
			this.#allocateBuffer(targetLength);
		}

		for (let num of args) {
			this.#array[this.#adjustPointer(++this.#frontPointer)] = num;
			this.#length++;
		}

		return this.#length;
	}

	/**
	 * Добавляет все переданные в качестве аргументов элементы в начало вектора
	 *
	 * @param args Последовательность элементов, которые будут помещены в начало вектора
	 * @returns Количество элементов в векторе
	 */
	pushBack(...args: number[]): number {
		const targetLength = this.#length + args.length;

		if (targetLength > this.#array.length) {
			this.#allocateBuffer(targetLength);
		}

		for (let num of args) {
			this.#array[this.#adjustPointer(--this.#backPointer)] = num;
			this.#length++;
		}

		return this.#length;
	}

	/**
	 * Извлекает из вектора последний элемент и возвращает его
	 *
	 * @returns Последний элемент вектора
	 */
	popFront() {
		this.assertEmptyStack();

		const value = this.#array[this.#adjustPointer(this.#frontPointer--)];

		this.#length--;

		return value;
	}

	/**
	 * Извлекает из вектора первый элемент и возвращает его
	 *
	 * @returns Первый элемент вектора
	 */
	popBack() {
		this.assertEmptyStack();

		const value = this.#array[this.#adjustPointer(this.#backPointer++)];

		this.#length--;

		return value;
	}
}
