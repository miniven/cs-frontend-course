import { inverse, grayscale, transformImageToCanvas } from './Filters';

const grayscaleButton = document.querySelector('.js-filter-button-grayscale');
const inverseButton = document.querySelector('.js-filter-button-inverse');

(async function() {
	let canvas: HTMLCanvasElement = await transformImageToCanvas("/lecture_2/lama.jpeg");

	inverseButton?.addEventListener("click", async () => {
		canvas = await inverse(canvas);
	});

	grayscaleButton?.addEventListener("click", async () => {
		canvas = await grayscale(canvas);
	});
}());
