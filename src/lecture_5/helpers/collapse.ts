const addKeyToPrefix = (key: string, prefix?: string) => (prefix ? `${prefix}.${key}` : key);

/**
 * Рекурсивно «сжимает» переданный вложенный объект в плоский вид
 *
 * @param data Объект, который нужно сжать
 * @returns Сжатый объект
 */
export const recursiveCollapse = (data: Object): Record<string, string | boolean | number> => {
	const result: Record<string, string | number | boolean> = {};

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

export const collapse = (data: Object): Record<string, string | boolean | number | null | undefined> => {
	const stack: Array<any> = [data];
	const properties: Array<string> = [];
	const result: Record<string, string | boolean | number | null | undefined> = {};

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
