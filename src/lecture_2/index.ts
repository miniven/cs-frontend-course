import { inverse, grayscale, transformImageToCanvas } from './filters';
import { decode, encode } from './encode';

import type { TSchema } from './encode/types';

const grayscaleButton = document.querySelector('.js-filter-button-grayscale');
const inverseButton = document.querySelector('.js-filter-button-inverse');

(async function () {
	let canvas: HTMLCanvasElement = await transformImageToCanvas('/lecture_2/lama.jpeg');

	inverseButton?.addEventListener('click', async () => {
		canvas = await inverse(canvas);
	});

	grayscaleButton?.addEventListener('click', async () => {
		canvas = await grayscale(canvas);
	});
})();

const schema: TSchema = [
	[3, 'number'],
	[2, 'number'],
	[1, 'boolean'],
	[2, 'number'],
	[16, 'ascii'],
];

const data = encode([7, 3, true, 3, 'ab'], schema);

/**
 * Тут я ожидаю, что увижу ArrayBuffer с тремя байтами:
 * 255 (биты первых четырёх значений), 97 (первый символ строки) и 98 (второй символ строки)
 */
console.log(data);

const originalData = decode(data, schema);

/**
 * Тут ожидаю увидеть массив [7, 3, true, 3, 'ab']
 */
console.log(originalData);
