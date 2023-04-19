import { LinkedList } from '../../lecture_3/LinkedList';

import type { IQueue } from './types';

export class Queue<T extends number | string | boolean> implements IQueue<T> {
	#list = new LinkedList<T>();

	insert(value: T): void {
		this.#list.addLast(value);
	}

	remove(): T {
		const head = this.#list.head;

		if (!this.#list.size || !head) {
			throw new Error('Queue is empty');
		}

		this.#list.removeFirst();

		return head.value;
	}
}
