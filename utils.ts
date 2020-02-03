export const getImage = (() => {
	const cache = new Map();
	return (url: string) => {
		if (url === "") {
			return;
		}
		const cached = cache.get(url);
		if (cached) {
			return cached.image;
		} else {
			const imageRef: {image: HTMLImageElement | null} = {image: null};
			const image = new Image();
			image.onload = () => {
				imageRef.image = image;
			};
			image.onerror = () => {
				throw new Error(`failed to load ${url}`);
			};
			image.src = url;
			cache.set(url, imageRef);
		}
		return null;
	};
})();

export function getCanvas(): HTMLCanvasElement {
	const canvas = document.getElementById("viewport");
	if (!(canvas instanceof HTMLCanvasElement)) {
		throw new Error("die");
	}
	return canvas;
}
