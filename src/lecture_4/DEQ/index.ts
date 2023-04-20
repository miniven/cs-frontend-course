import type { IDoubleEndedQueue } from './types';

export class DEQ<T> implements IDoubleEndedQueue<T> {
	#size = 0;
	#frontPointer = 0;
	#backPointer = -1;
	#queue: Array<T>;

	constructor(length: number) {
		this.#queue = new Array(length);
	}

	private assertEmptyStack() {
		if (this.#size === 0) {
			throw new Error('Stack is empty');
		}
	}

	private assertFullStack() {
		if (this.#size === this.#queue.length) {
			throw new Error('Stack is full');
		}
	}

	private adjustPointer(pointer: number) {
		if (pointer < 0) {
			return this.#queue.length + pointer;
		}

		return pointer % this.#queue.length;
	}

	pushBack(value: T): void {
		this.assertFullStack();

		const pointer = this.adjustPointer(++this.#backPointer);

		this.#queue[pointer] = value;
		this.#size++;
	}

	pushFront(value: T): void {
		this.assertFullStack();

		const pointer = this.adjustPointer(--this.#frontPointer);

		this.#queue[pointer] = value;
		this.#size++;
	}

	popBack(): T {
		this.assertEmptyStack();

		const pointer = this.adjustPointer(this.#backPointer--);
		const value = this.#queue[pointer];

		this.#size--;

		return value;
	}

	popFront(): T {
		this.assertEmptyStack();

		const pointer = this.adjustPointer(this.#frontPointer++);
		const value = this.#queue[pointer];

		this.#size--;

		return value;
	}

	get back() {
		return this.#queue[this.#backPointer];
	}

	get front() {
		return this.#queue[this.#frontPointer];
	}

	get size() {
		return this.#size;
	}
}
