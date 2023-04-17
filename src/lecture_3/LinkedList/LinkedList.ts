import { ListNode } from './ListNode';

import type { ILinkedList } from './types';

/**
 * @class Двусвязный список
 */
export class LinkedList implements ILinkedList {
	head: ListNode | null = null;
	tail: ListNode | null = null;
	size: number = 0;

	/**
	 * Добавляет значение в список
	 *
	 * @param value Значение, которое будет добавлено в список
	 * @returns Экземпляр списка
	 */
	add(value: number | string | boolean) {
		const node = new ListNode(value);

		if (this.size === 0) {
			this.head = node;
			this.tail = node;
			this.size++;

			return this;
		}

		const tail = this.tail as ListNode;

		tail.next = node;
		node.prev = tail;
		this.tail = node;
		this.size++;

		return this;
	}

	/**
	 * Удаляет голову списка, в том числе обрабатывая случаи,
	 * когда узлов нет, или когда голова и хвост — один узел
	 *
	 * @private
	 */
	private removeHead() {
		if (!this.head) {
			return;
		}

		if (this.head === this.tail && this.size === 0) {
			this.head = null;
			this.tail = null;

			return;
		}

		if (this.head.next) {
			this.head = this.head.next;
			this.head.prev = null;

			return;
		}

		this.head = null;
	}

	/**
	 * Удаляет хвостовой узел списка, в том числе обрабатывая случаи,
	 * когда узлов нет, или когда голова и хвост — один узел
	 *
	 * @private
	 */
	private removeTail() {
		if (!this.tail) {
			return;
		}

		if (this.tail === this.head && this.size === 0) {
			this.head = null;
			this.tail = null;

			return;
		}

		if (this.tail.prev) {
			this.tail = this.tail.prev;
			this.tail.next = null;

			return;
		}

		this.tail = null;
	}

	/**
	 * Удаляет значение из списка
	 *
	 * @param value Значение, которое будет удалено из списка
	 * @returns Экземпляр списка
	 */
	remove(value: number | string | boolean) {
		if (!this.head || !this.tail) {
			return this;
		}

		if (this.head.value === value) {
			this.removeHead();

			return this;
		}

		if (this.tail.value === value) {
			this.removeTail();

			return this;
		}

		let current: ListNode | null = this.head;

		while (current) {
			if (current.value === value) {
				break;
			}

			current = current.next;
		}

		if (current && current.prev) {
			current.prev.next = current.next;
		}

		this.size--;

		return this;
	}

	/**
	 * Итератор для перебора всех элементов списка
	 */
	*[Symbol.iterator]() {
		let current = this.head;

		while (current) {
			yield current.value;

			current = current.next;
		}
	}
}
