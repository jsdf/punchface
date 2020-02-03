export class Input {
	keys = new Set();

	onKeyDown(key) {
		this.keys.add(key);
	}

	onKeyUp(key) {
		this.keys.delete(key);
	}
}
