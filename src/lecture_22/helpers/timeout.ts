export const timeout = (promise: Promise<unknown>, ms: number) => {
	return new Promise((resolve, reject) => {
		promise.then(resolve).catch(reject);

		setTimeout(() => {
			reject('Time is up!');
		}, ms);
	});
};
