type TCollapseResult = Record<string, string | boolean | number | null | undefined>;

const addKeyToPrefix = (key: string, prefix?: string): string => (prefix ? `${prefix}.${key}` : key);

/**
 * Рекурсивно «сжимает» переданный вложенный объект в плоский вид
 *
 * @param data Объект, который нужно сжать
 * @returns Сжатый объект
 */
export const recursiveCollapse = (data: Object): TCollapseResult => {
	const result: TCollapseResult = {};

	function collapseHelper(data: any, property: string = '') {
		if (typeof data !== 'object' || data === null) {
			return (result[property] = data);
		}

		for (let key in data) {
			collapseHelper(data[key], addKeyToPrefix(key, property));
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

		if (prop && (typeof element !== 'object' || element === null)) {
			result[prop] = element;

			continue;
		}

		const keys = Object.keys(element);

		for (let index = keys.length; index > 0; index--) {
			const key = keys[index - 1];

			properties.push(addKeyToPrefix(key, prop));
			stack.push(element[key]);
		}
	}

	return result;
};
