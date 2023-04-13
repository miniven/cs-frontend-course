import { inverse, grayscale } from './Filters';

(async function() {
	const canvas = await inverse("/lecture_2/lama.jpeg");

	setTimeout(() => {
		grayscale(canvas);
	}, 5000);
}());