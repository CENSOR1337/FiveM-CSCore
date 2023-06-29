import * as cfx from "@nativewrappers/fivem-server";
import { Colshape } from "systems/Colshape";
import { VirtualEntity } from "systems/VirtualEntity";
import { SYSTEM_EVENTS } from "../shared/enums/system";

setTimeout(function () {
	new VirtualEntity(new cfx.Vector3(0, 0, 0), 100);
	const col = new Colshape(new cfx.Vector3(-181.8695, -890.3558, 29.3466), 10);
	//col.playersOnly = true;
}, 10);

on(SYSTEM_EVENTS.onEnterColshape, (colshapeId: string, entity: number) => {
	console.log("entityEnterColshape", colshapeId, entity);
});

on(SYSTEM_EVENTS.onLeaveColshape, (colshapeId: string, entity: number) => {
	console.log("entityLeaveColshape", colshapeId, entity);
});
