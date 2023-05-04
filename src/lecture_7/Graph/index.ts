import { createPrefilledColors } from './helpers';
import { Colors, Errors, IGraph, IEdge } from './types';

class Edge<T> implements IEdge<T> {
	constructor(public destination: T, public weight?: number) {}
}

export class Graph<T> implements IGraph<T> {
	#list: Map<T, Array<Edge<T>>> = new Map();
	#directed: boolean;

	constructor(initial?: Iterable<T> | null, directed?: boolean) {
		this.#directed = directed ?? false;

		if (initial) {
			for (const vertex of initial) {
				this.addVertex(vertex);
			}
		}
	}

	get directed(): boolean {
		return this.#directed;
	}

	getAdjacent(key: T): Array<Edge<T>> | void {
		return this.#list.get(key);
	}

	addVertex(key: T): this {
		if (!this.getAdjacent(key)) {
			this.#list.set(key, []);
		}

		return this;
	}

	addEdge(origin: T, destination: T): this;
	addEdge(origin: T, destination: T, weight: number): this;
	addEdge(origin: T, destination: T, weight?: number): this {
		this.addVertex(origin);
		this.addVertex(destination);

		this.getAdjacent(origin)!.push(new Edge(destination, weight));

		if (!this.#directed) {
			this.getAdjacent(destination)!.push(new Edge(origin, weight));
		}

		return this;
	}

	isAdjacent(origin: T, destination: T): boolean {
		const adjacent = this.getAdjacent(origin);

		if (!adjacent) {
			throw new Error(Errors.VERTEX_NOT_FOUND);
		}

		return adjacent.some((edge: Edge<T>) => edge.destination === destination);
	}

	/**
	 * Обходит связный подграф в глубину, начиная с переданной вершины
	 *
	 * @param startVertex Вершина, с которой начнётся обход графа
	 * @param colors Отображение вершин графа на их цвета в контексте обхода графа
	 */
	*#DFS(startVertex: T, colors: Map<T, Colors>): Iterable<[T, Colors]> {
		const stack = [startVertex];

		while (stack.length) {
			const key = stack.pop();

			if (!key) {
				continue;
			}

			const color = colors.get(key);

			/**
			 * Ситуация, когда все потомки вершины посещены и мы вновь достаём её из стека:
			 * В таком случае считаем, что вершина полностью обработана
			 */
			if (color === Colors.GRAY) {
				colors.set(key, Colors.BLACK);

				yield [key, Colors.BLACK];

				continue;
			}

			/**
			 * Если вершина еще не посещалась, помечаем её, как посещенную, но еще не обработанную
			 */
			if (color === Colors.WHITE && key) {
				colors.set(key, Colors.GRAY);
				stack.push(key);

				yield [key, Colors.GRAY];

				const adjacent = this.#list.get(key!);

				if (adjacent) {
					for (let index = adjacent.length; index > 0; index--) {
						const edge = adjacent[index - 1];

						if (colors.get(edge.destination) === Colors.WHITE) {
							stack.push(edge.destination);
						}
					}
				}
			}
		}
	}

	/**
	 * Обходит связный подграф в ширину, начиная с переданной вершины
	 *
	 * @param startVertex Вершина, с которой начнётся обход графа
	 * @param colors Отображение вершин графа на их цвета в контексте обхода графа
	 */
	*#BFS(startVertex: T, colors: Map<T, Colors>): Iterable<T> {
		const queue = [startVertex];

		while (queue.length) {
			const key = queue.shift();
			const color = colors.get(key!);

			/**
			 * Если вершина еще не посещалась, помечаем её, как посещенную, но еще не обработанную
			 */
			if (color === Colors.WHITE && key) {
				colors.set(key, Colors.GRAY);
				queue.push(key);

				yield key;

				const adjacent = this.#list.get(key!);

				if (adjacent) {
					for (const edge of adjacent) {
						if (colors.get(edge.destination) === Colors.WHITE) {
							queue.push(edge.destination);
						}
					}
				}

				/**
				 * Запланировали посещение всех смежных вершин, значит с текущей закончили, она обработана
				 */
				colors.set(key, Colors.BLACK);
			}
		}
	}

	*getDFSIterator() {
		const colors = createPrefilledColors(this.#list);
		const list = this.#list;

		for (const [vertex] of list) {
			for (const [currentVertex, currentColor] of this.#DFS(vertex, colors)) {
				/**
				 * При DFS мы показываем вершины в порядке их посещения
				 * Я решил, что дам возможность отследить и посещение и окончательную обработку вершины
				 */
				if (currentColor === Colors.GRAY) {
					yield currentVertex;
				}
			}
		}
	}

	*getBFSIterator() {
		const colors = createPrefilledColors(this.#list);
		const list = this.#list;

		for (const [key] of list) {
			yield* this.#BFS(key, colors);
		}
	}

	topologicalSort(): Array<T> {
		return [...this.getDFSIterator()];
	}
}
