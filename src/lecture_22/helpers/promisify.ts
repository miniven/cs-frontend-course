export const promisify = (callback: Function) => {
	return (...args: Array<unknown>) => {
		return new Promise((resolve, reject) => {
			callback(...args.slice(0, callback.length - 1), (err: Error | null, value: unknown) => {
				if (err === null) {
					resolve(value);
				}

				reject(err);
			});
		});
	};
};
