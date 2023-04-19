import { ListNode } from './ListNode';

import type { ILinkedList } from './types';

/**
 * @class Двусвязный список
 */
export class LinkedList<T> implements ILinkedList<T> {
	head: ListNode<T> | null = null;
	tail: ListNode<T> | null = null;
	size: number = 0;

	/**
	 * Добавляет значение в начало списка
	 *
	 * @param value Значение, которое будет добавлено в начало списка
	 * @returns Экземпляр списка
	 */
	addFirst(value: T) {
		const node = new ListNode(value);

		if (this.size === 0) {
			this.head = node;
			this.tail = node;
			this.size++;

			return this;
		}

		const head = this.head as ListNode;

		this.head = node;
		this.head.next = head;
		this.head.next.prev = this.head;
		this.size++;

		return this;
	}

	/**
	 * Добавляет значение в конец списка
	 *
	 * @param value Значение, которое будет добавлено в конец списка
	 * @returns Экземпляр списка
	 */
	addLast(value: T) {
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
	 */
	removeFirst() {
		if (!this.head) {
			return this;
		}

		this.size--;

		if (this.head === this.tail && this.size === 0) {
			this.head = null;
			this.tail = null;

			return this;
		}

		if (this.head.next) {
			this.head = this.head.next;
			this.head.prev = null;

			return this;
		}

		this.head = null;

		return this;
	}

	/**
	 * Удаляет хвостовой узел списка, в том числе обрабатывая случаи,
	 * когда узлов нет, или когда голова и хвост — один узел
	 */
	removeLast() {
		if (!this.tail) {
			return this;
		}

		this.size--;

		if (this.tail === this.head && this.size === 0) {
			this.head = null;
			this.tail = null;

			return this;
		}

		if (this.tail.prev) {
			this.tail = this.tail.prev;
			this.tail.next = null;

			return this;
		}

		this.tail = null;

		return this;
	}

	/**
	 * Удаляет значение из списка
	 *
	 * @param value Значение, которое будет удалено из списка
	 * @returns Экземпляр списка
	 */
	removeValue(value: T) {
		if (!this.head || !this.tail) {
			return this;
		}

		if (this.head.value === value) {
			return this.removeFirst();
		}

		if (this.tail.value === value) {
			return this.removeLast();
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
