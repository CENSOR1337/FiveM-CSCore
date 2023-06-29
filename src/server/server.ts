import { VirtualEntity } from "systems/VirtualEntity";
import { Vector3 } from "../shared/utils/Vector3";
import { CollisionSphere } from "systems/Collision";
import { ColshapeSphere } from "systems/Colshape";
import { SYSTEM_EVENTS } from "@cscore-shared/enums/system";

setTimeout(function () {
	new VirtualEntity(new Vector3(0, 0, 0), 100);
	const col = new CollisionSphere(new Vector3(-181.8695, -890.3558, 29.3466), 10);
	col.onBeginOverlap((entity) => {
		console.log("entityEnterColshape", entity);
	});
	col.onEndOverlap((entity) => {
		console.log("entityLeaveColshape", entity);
	});

	//
	const colsphere = new ColshapeSphere(new Vector3(-181.8695, -890.3558, 29.3466), 10);
	colsphere.playersOnly = true;
}, 10);

on(SYSTEM_EVENTS.onEnterColshape, (colshapeId: string, entity: number) => {
	console.log("onEnterColshape", colshapeId, entity);
});

on(SYSTEM_EVENTS.onLeaveColshape, (colshapeId: string, entity: number) => {
	console.log("onLeaveColshape", colshapeId, entity);
});
