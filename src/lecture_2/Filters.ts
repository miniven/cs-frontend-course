/**
 * Декоратор для фильтров, который передаёт в фильтр canvas-элемент: 
 * Либо новый, если был передан путь до изображения, либо тот, который был передан.
 * 
 * @param filter Функция применения фильтра к изображению внутри canvas
 * @returns Функция, которая принимает либо путь до изображения, либо canvas-элемент
 */
function withImagePathSupport(filter: (canvas: HTMLCanvasElement) => HTMLCanvasElement) {
	return async (pathOrCanvas: string | HTMLCanvasElement) => {
		if (typeof pathOrCanvas === "string") {
			const imageElement = await fetchImage(pathOrCanvas);
			const canvas = renderToCanvas(imageElement);

			if (!canvas) {
				throw new Error('No canvas element was provided');
			}

			return filter(canvas);
		}

		return filter(pathOrCanvas);
	}
}

/**
 * Рендерит переданное изображение в canvas-элемент
 * 
 * @param image HTML-элемент изображения, которое нужно отрендерить в canvas
 * @param canvas Целевой canvas-элемент, в котором будет происходить рендер изображения
 * @returns canvas-элемент, над которым работала функция
 */
function renderToCanvas(image: HTMLImageElement, canvas = document.querySelector<HTMLCanvasElement>('.canvas')) {
	if (canvas) {
		const context = canvas.getContext('2d');

		canvas.width = image.width;
		canvas.height = image.height;
		context?.drawImage(image, 0, 0);

		return canvas;
	}
}

/**
 * Загружает изображение и создаёт для него HTML-элемент (без рендера в DOM)
 * 
 * @param path Путь до изорбажения
 * @returns HTML-элемент изображения
 */
function fetchImage(path: string) {
	return new Promise<HTMLImageElement>((resolve, reject) => {
		const image = new Image();
		const loadHandler = () => {
			image.removeEventListener("load", loadHandler);

			resolve(image);
		};
		
		image.addEventListener("load", loadHandler);
	
		image.src = path;
	})
}

/**
 * Принимает фильтр и возвращает функцию, которая при вызове применит переданный фильтр к canvas-изображению
 * 
 * @param filter Функция для применения фильтра к каждому биту
 * @returns Функция, для создания эффекта на canvas-изображении
 */
function createCanvasFilter(filter: (channels: Uint8ClampedArray) => void) {
	return withImagePathSupport((canvas: HTMLCanvasElement) => {
		const context = canvas.getContext('2d');
	
		if (context) {
			const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
			const channels = imageData.data;
	
			filter(channels);
	
			context.putImageData(imageData, 0, 0);
		}
	
		return canvas;
	});
};

/**
 * Применяет фильтр инверсии цветов к изображению
 * 
 * @param pathOrCanvas Путь до изображения, которому суждено быть отрисованным в canvas, либо сам canvas
 * @returns canvas-элемент, к которому был применён фильтр
 */
export const inverse = createCanvasFilter((channels: Uint8ClampedArray) => {
	for (let index = 0; index < channels.length; index += 4) {
		channels[index] = 255 - channels[index]; // RED
		channels[index + 1] = 255 - channels[index + 1]; // GREEN
		channels[index + 2] = 255 - channels[index + 2]; // BLUE
	}
});

/**
 * Применяет монохромный фильтр к изображению
 * 
 * @param pathOrCanvas Путь до изображения, которому суждено быть отрисованным в canvas, либо сам canvas
 * @returns canvas-элемент, к которому был применён фильтр
 */
export const grayscale = createCanvasFilter((channels: Uint8ClampedArray) => {
	for (let index = 0; index < channels.length; index += 4) {
		const lightness = (channels[index] + channels[index + 1] + channels[index + 2]) / 3;

		channels[index] = lightness; // RED
		channels[index + 1] = lightness; // GREEN
		channels[index + 2] = lightness; // BLUE
	}
});

