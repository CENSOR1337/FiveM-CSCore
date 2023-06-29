import { Vector3 } from "@cscore-shared/utils/Vector3";
import { SYSTEM_EVENTS } from "../../shared/enums/system";
import { ColshapeSphere } from "./Colshape";

interface listenerType {
	id: number;
	type: "enter" | "exit";
	callback: (entity: number) => void;
}

export class CollisionSphere extends ColshapeSphere {
	private enterBind;
	private exitBind;
	private listenerId = 0;
	private listeners: Map<number, listenerType> = new Map();

	constructor(pos: Vector3, radius: number) {
		super(pos, radius);
		this.enterBind = this.handleEnterShape.bind(this);
		this.exitBind = this.handleExitShape.bind(this);
		on(SYSTEM_EVENTS.onEnterColshape, this.enterBind);
		on(SYSTEM_EVENTS.onLeaveColshape, this.exitBind);
		return this;
	}

	onBeginOverlap(callback: (entity: number) => void) {
		this.listenerId++;
		const listener: listenerType = {
			id: this.listenerId,
			type: "enter",
			callback,
		};
		this.listeners.set(this.listenerId, listener);
		return this.listenerId;
	}

	onEndOverlap(callback: (entity: number) => void) {
		this.listenerId++;
		const listener: listenerType = {
			id: this.listenerId,
			type: "exit",
			callback,
		};
		this.listeners.set(this.listenerId, listener);
		return this.listenerId;
	}

	off(id: number) {
		this.listeners.delete(id);
	}

	destroy() {
		removeEventListener(SYSTEM_EVENTS.onEnterColshape, this.enterBind);
		removeEventListener(SYSTEM_EVENTS.onLeaveColshape, this.exitBind);
		super.destroy();
	}

	private isColshapeValid(id: string) {
		if (id !== this.id) return false;
		return true;
	}

	private handleEnterShape(colshapeId: string, entity: number) {
		if (!this.isColshapeValid(colshapeId)) return;

		this.listeners.forEach((callback) => {
			if (callback.type === "enter") {
				callback.callback(entity);
			}
		});
	}

	private handleExitShape(colshapeId: string, entity: number) {
		if (!this.isColshapeValid(colshapeId)) return;

		this.listeners.forEach((callback) => {
			if (callback.type === "exit") {
				callback.callback(entity);
			}
		});
	}
}
