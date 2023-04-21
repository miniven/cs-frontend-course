type TCollapseResult = Record<string, string | boolean | number | null | undefined>;

const addKeyToPrefix = (key: string, prefix?: string): string => (prefix === undefined ? key : `${prefix}.${key}`);

/**
 * Рекурсивно «сжимает» переданный вложенный объект в плоский вид
 *
 * @param data Объект, который нужно сжать
 * @returns Сжатый объект
 */
export const recursiveCollapse = (data: Object): TCollapseResult => {
	const result: TCollapseResult = {};

	function collapseHelper(data: any, prop?: string) {
		if (prop !== undefined && (typeof data !== 'object' || data === null)) {
			return (result[prop] = data);
		}

		for (let key in data) {
			collapseHelper(data[key], addKeyToPrefix(key, prop));
		}
	}

	collapseHelper(data);

	return result;
};

/**
 * «Сжимает» переданный вложенный объект в плоский вид используя стек
 *
 * @param data Объект, который нужно сжать
 * @returns Сжатый объект
 */
export const collapse = (data: Object): TCollapseResult => {
	const stack: Array<any> = [data];
	const properties: Array<string> = [];
	const result: TCollapseResult = {};

	while (stack.length) {
		const element = stack.pop();
		const prop = properties.pop();

		if (prop !== undefined && (typeof element !== 'object' || element === null)) {
			result[prop] = element;

			continue;
		}

		/**
		 * Не используем for...in, потому что нужен обратный порядок элементов
		 * Эта проблема решается использованием очереди вместо стека, но по заданию нужен стек
		 */
		const keys = Object.keys(element);

		for (let index = keys.length; index > 0; index--) {
			const key = keys[index - 1];

			properties.push(addKeyToPrefix(key, prop));
			stack.push(element[key]);
		}
	}

	return result;
};
