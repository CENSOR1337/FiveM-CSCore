import * as crypto from "crypto";
import * as cfx from "@nativewrappers/fivem-server";
import { Vector3 } from "@cscore-shared/utils/Vector3";
import { WordObject } from "./WordObject";
import { CollisionSphere } from "./Collision";
import { SYSTEM_EVENTS } from "@cscore-shared/enums/system";

export class VirtualEntity extends WordObject {
	readonly id = crypto.randomUUID();
	readonly collision: CollisionSphere;
	readonly streamingPlayers: Set<number> = new Set();
	readonly syncedMeta: Record<string, any>;
	_dimension: number = 0;

	constructor(position: Vector3, streamingDistance: number, data?: Record<string, any>) {
		super(position);
		const collision = new CollisionSphere(position, streamingDistance);
		collision.playersOnly = true;
		collision.onBeginOverlap(this.onEnterStreamingRange.bind(this));
		collision.onEndOverlap(this.onLeaveStreamingRange.bind(this));
		this.collision = collision;

		this.syncedMeta = data || {};
	}

	public get dimension(): number {
		return this._dimension;
	}

	public set dimension(value: number) {
		this._dimension = value;
		this.collision.dimension = value;
	}

	public setSyncedMeta(key: string, value: any) {
        this.syncedMeta[key] = value;
		for (const src of this.streamingPlayers) {
			emitNet(SYSTEM_EVENTS.onVirtualEntitySyncedMetaChange, src, this.id, key, value);
		}
	}

	private getSyncData(): Record<string, any> {
		return {
			id: this.id,
			pos: this.pos,
			syncedMeta: this.syncedMeta,
		};
	}

	private onEnterStreamingRange(entity: number) {
		const src = NetworkGetEntityOwner(entity);
		this.streamingPlayers.add(src);
		const data = this.getSyncData();
		emitNet(SYSTEM_EVENTS.onVirtualEntityStreamIn, src, data);
	}
	private onLeaveStreamingRange(entity: number) {
		const src = NetworkGetEntityOwner(entity);
		this.streamingPlayers.delete(src);
		const data = this.getSyncData();
		emitNet(SYSTEM_EVENTS.onVirtualEntityStreamOut, src, data);
	}
}
