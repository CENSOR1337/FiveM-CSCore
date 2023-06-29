export class Dispatcher {
	private listenerId = 0;
	private listeners: Map<number, (...args: any[]) => void> = new Map();

	public add(listener: (...args: any[]) => void) {
		this.listenerId++;
		this.listeners.set(this.listenerId, listener);
		return this.listenerId;
	}

	public remove(id: number) {
		this.listeners.delete(id);
	}

	public broadcast(...args: any[]) {
		this.listeners.forEach((listener) => {
			listener(...args);
		});
	}
}