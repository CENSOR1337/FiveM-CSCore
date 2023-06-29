import { VirtualEntity } from "systems/VirtualEntity";
import { SYSTEM_EVENTS } from "../shared/enums/system";
import { Vector3 } from "../shared/utils/Vector3";
import { CollisionSphere } from "systems/Collision";

setTimeout(function () {
	new VirtualEntity(new Vector3(0, 0, 0), 100);
	const col = new CollisionSphere(new Vector3(-181.8695, -890.3558, 29.3466), 10);
	col.onBeginOverlap((entity) => {
		console.log("entityEnterColshape", entity);
	});
	col.onEndOverlap((entity) => {
		console.log("entityLeaveColshape", entity);
	});
	//const col = new ColshapeSphere(new Vector3(-181.8695, -890.3558, 29.3466), 10);
	//col.playersOnly = true;
}, 10);

/* on(SYSTEM_EVENTS.onEnterColshape, (colshapeId: string, entity: number) => {
	console.log("entityEnterColshape", colshapeId, entity);
});

on(SYSTEM_EVENTS.onLeaveColshape, (colshapeId: string, entity: number) => {
	console.log("entityLeaveColshape", colshapeId, entity);
});
 */
