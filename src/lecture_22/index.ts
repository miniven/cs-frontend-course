import { SyncPromise } from './helpers/SyncPromise';
import { allLimit } from './helpers/allLimit';
import { promisify } from './helpers/promisify';
import { sleep } from './helpers/sleep';
import { timeout } from './helpers/timeout';

(async function () {
	console.log('\nТестирование sleep');

	sleep(1000).then(() => {
		console.log(`I'am awake!`);
	});

	await sleep(1500);

	console.log('\nТестирование timeout (reject через 2 сек)');

	timeout(
		sleep(3000).then(() => 'RESOLVE'),
		2000
	)
		.then(console.log)
		.catch(console.error);

	await sleep(2500);

	console.log('\nТестирование timeout (resolve через 1 сек)');

	timeout(
		sleep(1000).then(() => 'RESOLVE'),
		2000
	)
		.then(console.log)
		.catch(console.error);

	await sleep(1500);

	console.log('\nТестирование promisify (успешное чтение)');

	function readFile(_: string, callback: (err: Error | null, value: unknown) => void) {
		callback(null, 'file content');
	}

	const readFilePromise = promisify(readFile);

	readFilePromise('my-file.txt').then(console.log).catch(console.error);

	await sleep(500);

	console.log('\nТестирование promisify (ошибка при чтении)');

	function readFileFailure(_: string, callback: (err: Error | null, value: unknown) => void) {
		callback(new Error('Error: Unexpected token'), null);
	}

	const readFileFailurePromise = promisify(readFileFailure);

	readFileFailurePromise('my-failure-file.txt')
		.then(console.log)
		.catch((err: Error) => console.error(err.message));

	await sleep(500);

	console.log('\nТестирование SyncPromise');

	SyncPromise.resolve<number | void>(1).then(console.log); // 1
	console.log(2); // 2

	await sleep(500);

	console.log('\nТестирование allLimit');

	const createFakeRequest = <T>(response: T, ms: number): (() => Promise<T>) => {
		return () => sleep(ms).then(() => response);
	};

	allLimit(
		[
			createFakeRequest('Один', 1000),
			createFakeRequest('Два', 2000),
			createFakeRequest('Три', 500),
			createFakeRequest('Четыре', 1000),
			createFakeRequest('Пять', 4000),
			createFakeRequest('Шесть', 1000),
		],
		2
	)
		.then(console.log)
		.catch(console.error);

	await sleep(7000);

	console.log('\nТестирование allLimit с ошибкой');

	allLimit(
		[
			createFakeRequest('Один', 1000),
			createFakeRequest('Два', 2000),
			() =>
				sleep(500).then(() => {
					throw new Error('Ошибка в запросе три');
				}),
			createFakeRequest('Четыре', 1000),
			createFakeRequest('Пять', 4000),
			createFakeRequest('Шесть', 1000),
		],
		2
	)
		.then(console.log)
		.catch(console.error);
})();
