import { Result } from './containers/result';

const success = new Result(() => 42);

success.then((data) => {
	console.log(data); // 42
});

const fail = new Result(() => {
	throw 'Boom!';
});

fail.then(console.log).catch(console.error); // Boom!

const chain = new Result(() => 333);

chain
	.then((value) => {
		console.log(value); // 333

		throw new Error(`Error after ${value}`);
	})
	.catch((err: Error) => {
		console.log(err.message); // Error after 333

		return 444;
	})
	.then((value) => {
		console.log(value); // 444
	})
	.then((value) => {
		console.log(value); // undefined
	});

console.log('Аналог async...await');

Result.unwrap<number>(function* main() {
	const result = yield new Result(() => 42);

	console.log(result);

	try {
		yield new Result(() => {
			throw new Error('Boom!');
		});
	} catch (err) {
		console.error((err as Error).message);
	}

	const last = yield new Result(() => 3333).then((value) => value! + 1111);

	console.log(last);
});
