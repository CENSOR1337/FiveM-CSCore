import * as crypto from "crypto";
import * as cfx from "@nativewrappers/fivem-server";
import { WordObject } from "./WordObject";

export class VirtualEntity extends WordObject {
	readonly id = crypto.randomUUID();
	constructor(position: cfx.Vector3, streamingDistance: number, data?: Record<string, any>) {
		super(position);

		const players = cfx.Player.AllPlayers();
		for (const player of players) {
			player.emit("vEntity:create", this.id, position, streamingDistance);
		}
	}
}
