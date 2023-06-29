import * as crypto from "crypto";
import * as cfx from "@nativewrappers/fivem-server";
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
	constructor(pos: cfx.Vector3, radius: number) {
		super(pos);
		this.radius = radius;
		this.interval = setInterval(this.onTick.bind(this), 1000);
	}

	private isPosInside(pos: cfx.Vector3) {
		return this.pos.distance(pos) <= this.radius;
	}

	private isEntityInside(entity: cfx.Entity | number) {
		const position = entity instanceof cfx.Entity ? entity.Position : cfx.Vector3.fromArray(GetEntityCoords(entity));
		return this.isPosInside(position);
	}

	public destroy() {
		this.destroyed = true;
	}

	private onTick() {
		if (this.destroyed) {
			clearInterval(this.interval);
			for (const handle of this.insideEntities) {
				const entity = new cfx.Entity(handle);
				emit(SYSTEM_EVENTS.onLeaveColshape, entity, this);
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
			if (!isExist || !isInside) {
				this.insideEntities.delete(handle);
				emit(SYSTEM_EVENTS.onLeaveColshape, this.id, handle);
			}
		}

		for (const handle of entities) {
			if (this.insideEntities.has(handle)) continue;
			const isInside = this.isEntityInside(handle);
			if (isInside) {
				if (!this.insideEntities.has(handle)) {
					this.insideEntities.add(handle);
					emit(SYSTEM_EVENTS.onEnterColshape, this.id, handle);
				}
			}
		}
	}
}
