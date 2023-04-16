class Node<T extends any = any> {
	value: T;
	next: Node | null = null;
	prev: Node | null = null;

	constructor(value: T) {
		this.value = value;
	}
}

export class LinkedList {
	head: Node | null = null;
	tail: Node | null = null;
	size: number = 0;

	add(value: number | string | boolean) {
		const node = new Node(value);

		if (this.size === 0) {
			this.head = node;
			this.tail = node;
			this.size++;

			return;
		}

		const tail = this.tail as Node;

		tail.next = node;
		node.prev = tail;
		this.tail = node;
		this.size++;
	}

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

	remove(value: number | string | boolean) {
		if (!this.head || !this.tail) {
			return;
		}

		if (this.head.value === value) {
			this.removeHead();
		}

		if (this.tail.value === value) {
			this.removeTail();
		}

		let current: Node | null = this.head;

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
	}

	*[Symbol.iterator]() {
		let current = this.head;

		while (current) {
			yield current.value;

			current = current.next;
		}
	}
}
