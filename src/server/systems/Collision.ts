import * as crypto from "crypto";
import { WordObject } from "./WordObject";
import { Vector3 } from "@cscore-shared/utils/Vector3";
import { SYSTEM_EVENTS } from "@cscore-shared/enums/system";
import { Dispatcher } from "@cscore-shared/utils/Dispatcher";

function GetPlayers() {
	const players = new Array<number>();
	const num = GetNumPlayerIndices();
	for (let i = 0; i < num; i++) {
		const playerId = parseInt(GetPlayerFromIndex(i));
		players.push(playerId);
	}
	return players;
}

interface listenerType {
	id: number;
	type: "enter" | "exit";
}

export class Collision extends WordObject {
	readonly id = crypto.randomUUID();
	public playersOnly: boolean;
	private interval: NodeJS.Timer;
	private insideEntities: Set<number> = new Set();
	private destroyed: boolean = false;
	private listeners = {
		enter: new Dispatcher(),
		exit: new Dispatcher(),
	};

	constructor(pos: Vector3) {
		super(pos);
		this.interval = setInterval(this.onTick.bind(this), 1000);
	}

	public onBeginOverlap(callback: (entity: number) => void): listenerType {
		const id = this.listeners.enter.add(callback);
		return { id, type: "enter" };
	}

	public onEndOverlap(callback: (entity: number) => void) {
		const id = this.listeners.exit.add(callback);
		return { id, type: "exit" };
	}

	public off(listener: listenerType) {
		if (listener.type === "enter") {
			this.listeners.enter.remove(listener.id);
		} else {
			this.listeners.exit.remove(listener.id);
		}
	}

	public destroy() {
		this.destroyed = true;
	}

	private onTick() {
		if (this.destroyed) {
			clearInterval(this.interval);
			for (const handle of this.insideEntities) {
				emit(SYSTEM_EVENTS.onLeaveColshape, handle, this);
			}
			this.insideEntities.clear();
			return;
		}

		const entities = new Array<number>();

		const players = GetPlayers();

		for (const src of players) {
			const playerPed = GetPlayerPed(String(src));
			entities.push(playerPed);
		}
		if (!this.playersOnly) {
			const npcPeds = GetAllPeds();
			for (const handle of npcPeds) {
				if (IsPedAPlayer(handle)) continue;
				entities.push(handle);
			}

			const vehicles = GetAllVehicles();
			for (const handle of vehicles) {
				entities.push(handle);
			}

			const props = GetAllObjects();
			for (const handle of props) {
				entities.push(handle);
			}
		}

		for (const handle of this.insideEntities) {
			const isExist = DoesEntityExist(handle);
			const isInside = this.isEntityInside(handle);
			const isSameDimension = isExist ? GetEntityRoutingBucket(handle) === this.dimension : false;
			if (!isExist || !isInside || !isSameDimension) {
				this.insideEntities.delete(handle);
				this.listeners.exit.broadcast(handle);
			}
		}

		for (const handle of entities) {
			if (this.insideEntities.has(handle)) continue;
			const isInside = this.isEntityInside(handle);
			const isSameDimension = GetEntityRoutingBucket(handle) === this.dimension;
			if (isInside && isSameDimension) {
				if (!this.insideEntities.has(handle)) {
					this.insideEntities.add(handle);
					this.listeners.enter.broadcast(handle);
				}
			}
		}
	}

	protected isPosInside(pos: Vector3) {
		return false; // implement in child class
	}

	protected isEntityInside(entity: number) {
		return false; // implement in child class
	}
}

export class CollisionSphere extends Collision {
	radius: number;
	constructor(pos: Vector3, radius: number) {
		super(pos);
		this.radius = radius;
	}

	protected isPosInside(pos: Vector3) {
		return this.pos.distance(pos) <= this.radius;
	}

	protected isEntityInside(entity: number) {
		const position = Vector3.fromArray(GetEntityCoords(entity));
		return this.isPosInside(position);
	}
}
