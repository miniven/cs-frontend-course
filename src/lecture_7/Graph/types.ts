export interface IEdge<T> {
	/**
	 * Вершина, смежная по отношению к той, к которой относится данное ребро
	 */
	destination: T;

	/**
	 * Вес ребра
	 */
	weight?: number;
}

export interface IGraph<T> {
	/**
	 * Является ли граф направленным
	 */
	directed: boolean;

	/**
	 * Создаёт вершину с указанным ключом и добавляет её в граф
	 *
	 * @param key Ключ, присвоенный вершине
	 */
	addVertex(key: T): this;

	/**
	 * Устанавливает отношение (ребро) между двумя вершинами
	 * Если какой-то из вершин нет в списке, она автоматически будет добавлена
	 *
	 * @param from Ключ вершины
	 * @param to Ключ вершины
	 * @param weight Вес ребра
	 */
	addEdge(from: T, to: T): void;
	addEdge(from: T, to: T, weight: number): void;

	/**
	 * Возвращает список смежных вершин для указанной
	 *
	 * @param key Ключ вершины
	 */
	getAdjacent(key: T): Array<IEdge<T>> | void;

	/**
	 * Являются ли две вершины смежными
	 *
	 * @param origin Исходная вершина
	 * @param destination Целевая вершина
	 */
	isAdjacent(origin: T, destination: T): boolean | never;

	/**
	 * Возвращает итерируемый объект для перебора вершин графа по стратегии DFS
	 */
	getDFSIterator(): Iterable<T>;

	/**
	 * Возвращает итерируемый объект для перебора вершин графа по стратегии BFS
	 */
	getBFSIterator(): Iterable<T>;

	/**
	 * Возвращает массив вершин графа, отсортированных в топологическом порядке
	 */
	topologicalSort(): Array<T>;
}

export enum Colors {
	WHITE = 'white',
	GRAY = 'gray',
	BLACK = 'black',
}

export enum Errors {
	VERTEX_NOT_FOUND = 'Vertex not found',
}
