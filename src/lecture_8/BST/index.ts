import { Color, Direction } from './types';

export class TreeNode<T = unknown> {
	value: T;
	left: TreeNode<T> | null = null;
	right: TreeNode<T> | null = null;

	constructor(value: T) {
		this.value = value;
	}
}

export class BST<T = unknown> {
	#comparator: (inserted: T, compared: T) => number;
	#root: TreeNode<T> | null = null;

	constructor(comparator: (inserted: T, compared: T) => number) {
		this.#comparator = comparator;
	}

	/**
	 * Ищет и возвращает узел, который будет родителем для нового узла с указанным значением
	 *
	 * @param startNode Узел, с которого начинается поиск
	 * @param value Значение, для которого ищется позиция
	 * @returns Родительский узел для узла с переданным значением
	 */
	#findParentForValue(startNode: TreeNode<T>, value: T) {
		let current = startNode;

		while (current) {
			const comparison = this.#comparator(value, current.value);

			if (comparison < 0 && current.left) {
				current = current.left;

				continue;
			}

			if (comparison >= 0 && current.right) {
				current = current.right;

				continue;
			}

			break;
		}

		return current;
	}

	/**
	 * Находит экстремальный (самый правый, или самый левый) узел среди потомков указанного узла
	 *
	 * @param parent Родительский узел, от которого начинается поиск
	 * @param direction Направление движения по узлам
	 * @returns Крайний узел в заданном направлении
	 */
	#findExtremeNode(parent: TreeNode<T>, direction: 'left' | 'right') {
		let current = parent;

		while (current[direction]) {
			current = current[direction]!;
		}

		return current;
	}

	/**
	 * Возвращает минимальное значение в дереве, или null, если дерево пустое
	 *
	 * @returns Минимальное значение в дереве
	 */
	findMin() {
		if (!this.#root) {
			return null;
		}

		return this.#findExtremeNode(this.#root, Direction.LEFT).value;
	}

	/**
	 * Возвращает максимальное значение в дереве, или null, если дерево пустое
	 *
	 * @returns Максимальное значение в дереве
	 */
	findMax() {
		if (!this.#root) {
			return null;
		}

		return this.#findExtremeNode(this.#root, Direction.RIGHT).value;
	}

	/**
	 * Добавляет новое значение в дерево.
	 * Поддерживается цепочка вызовов методов
	 *
	 * @param value Значение, которое будет добавлено в дерево
	 * @returns Текущий экземпляр класса
	 */
	add(value: T) {
		const node = new TreeNode(value);

		if (!this.#root) {
			this.#root = node;

			return this;
		}

		const parentNode = this.#findParentForValue(this.#root, value);

		if (this.#comparator(value, parentNode.value) < 0) {
			parentNode.left = node;

			return this;
		}

		parentNode.right = node;

		return this;
	}

	/**
	 *
	 * @param value Значение, которое будет удалено из дерева
	 * @returns Текущий экземпляр класса
	 */
	remove(value: T | null) {
		if (!this.#root || value === null) {
			return this;
		}

		let parent = this.#root;
		let current = this.#root;

		while (current) {
			const comparison = this.#comparator(value, current.value);

			if (comparison === 0) {
				break;
			}

			parent = current;

			if (comparison < 0 && current.left) {
				current = current.left;

				continue;
			}

			if (comparison > 0 && current.right) {
				current = current.right;

				continue;
			}

			/**
			 * Случай, когда двигаться больше некуда, а искомое значение не равно текущему
			 */
			return this;
		}

		const direction = this.#comparator(value, parent.value) < 0 ? Direction.LEFT : Direction.RIGHT;

		/**
		 * Случай, когда у удаляемого узла нет потомков
		 */
		if (!current.left && !current.right) {
			if (current === this.#root) {
				this.#root = null;

				return this;
			}

			parent[direction] = null;

			return this;
		}

		/**
		 * Когда у удаляемого узла только левый потомок
		 */
		if (!current.right) {
			if (current === this.#root) {
				this.#root = current.left;

				return this;
			}

			parent[direction] = current.left;

			return this;
		}

		/**
		 * Когда у удаляемого узла только правый потомок
		 */
		if (!current.left) {
			if (current === this.#root) {
				this.#root = current.right;

				return this;
			}

			parent[direction] = current.right;

			return this;
		}

		let successor = current.right;
		let successorParent = current;

		while (successor.left) {
			successorParent = successor;
			successor = successor.left;
		}

		/**
		 * Если следующим по величине от удаляемого узла идёт его правый потомок
		 *
		 * 1. Присваиваем правому потоку всё левое поддерево удаляемого узла (своего левого поддерева у него нет)
		 * 2. На место удаляемого узла ставим правого потомка (правое поддерево двигается вместе с ним)
		 */
		if (successor === current.right) {
			successor.left = current.left;

			if (current === this.#root) {
				this.#root = successor;
			} else {
				parent[direction] = successor;
			}

			return this;
		}

		/**
		 * Если следующий по величине узел является самым левым потомком правого узла
		 *
		 * 1. Его правый потомок становится левым потомком его родителя
		 * 2. Сам он становится на место удаляемого и получает левое и правое поддеревья от удаляемого
		 */
		successorParent.left = successor.right;
		successor.left = current.left;
		successor.right = current.right;

		if (current === this.#root) {
			this.#root = successor;
		} else {
			parent[direction] = successor;
		}

		return this;
	}

	/**
	 * Префиксный (симметричный) обход дерева в глубину
	 *
	 * @returns Итерируемый объект
	 */
	*preOrderTraverse(): Iterable<T> {
		if (!this.#root) {
			return;
		}

		const stack = [[this.#root, Color.WHITE]];

		while (stack.length) {
			const [current, color] = stack.pop() as [TreeNode<T>, Color];

			if (color === Color.WHITE) {
				if (current.right) {
					stack.push([current.right, Color.WHITE]);
				}

				stack.push([current, Color.GRAY]);

				if (current.left) {
					stack.push([current.left, Color.WHITE]);
				}

				continue;
			}

			yield current.value;
		}
	}

	/**
	 * Обход дерева в ширину
	 *
	 * @returns Итерируемый объект
	 */
	*breadthFirstTraverse() {
		if (!this.#root) {
			return;
		}

		const queue = [this.#root];

		while (queue.length) {
			const current = queue.shift() as TreeNode<T>;

			yield current.value;

			if (current.left) {
				queue.push(current.left);
			}

			if (current.right) {
				queue.push(current.right);
			}
		}
	}
}
