class TrieNode {
	edges: Map<string, number> = new Map();
	isTerminal = false;
	isDisabled = false;

	disable() {
		this.isDisabled = true;
	}
}

export class Trie {
	#buffer: Array<TrieNode> = [new TrieNode()];

	/**
	 * Добавляет новое слово в бор
	 *
	 * @param word Добавляемое слово
	 */
	add(word: string) {
		let current = this.#buffer[0];

		for (const char of word) {
			if (current.edges.has(char)) {
				const nextNodeIndex = current.edges.get(char)!;

				current = this.#buffer[nextNodeIndex];
			} else {
				const length = this.#buffer.push(new TrieNode());

				current.edges.set(char, length - 1);
				current = this.#buffer[length - 1];
			}
		}

		current.isTerminal = true;

		return this;
	}

	/**
	 * Проверяет, присутствует ли слово в боре
	 *
	 * @param word Искомое слово
	 * @returns Флаг о присутствии слова в боре
	 */
	has(word: string) {
		let current = this.#buffer[0];

		for (const char of word) {
			if (!current.edges.has(char)) {
				return false;
			}

			const nextNodeIndex = current.edges.get(char)!;

			current = this.#buffer[nextNodeIndex];
		}

		return current.isTerminal;
	}

	/**
	 * Удаляет слово из бора
	 *
	 * @param word Слово, которое нужно удалить
	 */
	remove(word: string) {
		if (!this.has(word)) {
			return this;
		}

		let current = this.#buffer[0];
		const stack: TrieNode[] = [];

		/**
		 * Добираемся до последнего узла для удаляемого слова, по ходу добавляя пройденные узлы в стек
		 */
		for (const char of word) {
			const nextNodeindex = current.edges.get(char)!;

			stack.push(current);
			current = this.#buffer[nextNodeindex];
		}

		/**
		 * Указываем, что узел больше не терминальный
		 */
		current.isTerminal = false;

		let charIndex = stack.length - 1;

		/**
		 * Достаём из стека узлы и у каждого удаляем ребро, соответствующее символу в удаленном слове,
		 * если узел, на который указывает это ребро больше не несёт никакой ценности
		 */
		while (stack.length) {
			const node = stack.pop()!;
			const nextNodeIndex = node.edges.get(word[charIndex])!;
			const nextNode = this.#buffer[nextNodeIndex];

			if (nextNode.edges.size === 0 && !nextNode.isTerminal) {
				node.edges.delete(word[charIndex]);
				nextNode.disable();
			}

			charIndex--;
		}

		return this;
	}
}
