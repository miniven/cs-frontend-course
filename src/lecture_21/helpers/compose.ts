export const compose = (...functions: Array<Function>): Function => {
	return functions.reduce((fn, current) => {
		return (...args: Array<any>) => fn(current(...args));
	});
};
