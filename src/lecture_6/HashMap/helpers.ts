import { hashSymbol } from './const';

export function getStringHash(key: string): number {
	return key.split('').reduce((acc, char, index) => {
		return acc + char.charCodeAt(0) * (index + 1);
	}, 0);
}

export function getObjectHash(key: { [hashSymbol]?: number }): number {
	if (key[hashSymbol] !== undefined) {
		return key[hashSymbol];
	}

	const newHash = Math.floor(Math.random() * 1000);

	return (key[hashSymbol] = newHash);
}

export function isPrime(num: number) {
	for (let x = 2; x * x <= num; x++) {
		if (num % x === 0) {
			return false;
		}
	}

	return true;
}

export function getClosestPrime(num: number) {
	while (!isPrime(num)) {
		num++;
	}

	return num;
}
