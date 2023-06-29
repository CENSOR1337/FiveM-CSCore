import * as crypto from "crypto";
import { Vector3 } from "@cscore-shared/utils/Vector3";
import { WordObject } from "./WordObject";
import { SYSTEM_EVENTS } from "../../shared/enums/system";

function GetPlayers() {
	const players = new Array<number>();
	const num = GetNumPlayerIndices();
	for (let i = 0; i < num; i++) {
		const playerId = parseInt(GetPlayerFromIndex(i));
		players.push(playerId);
	}
	return players;
}

export class Colshape extends WordObject {
	readonly id = crypto.randomUUID();
	public playersOnly: boolean;
	public radius: number;
	private interval: NodeJS.Timer;
	private insideEntities: Set<number> = new Set();
	private destroyed: boolean = false;
    
	constructor(pos: Vector3, radius: number) {
		super(pos);
		this.radius = radius;
		this.interval = setInterval(this.onTick.bind(this), 1000);
	}

	private isPosInside(pos: Vector3) {
		return this.pos.distance(pos) <= this.radius;
	}

	private isEntityInside(entity: number) {
		const position = Vector3.fromArray(GetEntityCoords(entity));
		return this.isPosInside(position);
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
            const isSameDimension = GetEntityRoutingBucket(handle) === this.dimension;
			if (!isExist || !isInside || !isSameDimension) {
				this.insideEntities.delete(handle);
				emit(SYSTEM_EVENTS.onLeaveColshape, this.id, handle);
			}
		}

		for (const handle of entities) {
			if (this.insideEntities.has(handle)) continue;
			const isInside = this.isEntityInside(handle);
            const isSameDimension = GetEntityRoutingBucket(handle) === this.dimension;
			if (isInside && isSameDimension) {
				if (!this.insideEntities.has(handle)) {
					this.insideEntities.add(handle);
					emit(SYSTEM_EVENTS.onEnterColshape, this.id, handle);
				}
			}
		}
	}
}
