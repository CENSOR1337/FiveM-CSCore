import { CollisionSphere } from "./Collision";
import { Vector3 } from "@cscore-shared/utils/Vector3";
import { SYSTEM_EVENTS } from "@cscore-shared/enums/system";

export class ColshapeSphere extends CollisionSphere {
	constructor(pos: Vector3, radius: number) {
		super(pos, radius);
		this.onBeginOverlap(this.beginOverlap.bind(this));
		this.onEndOverlap(this.endOverlap.bind(this));
	}

	private beginOverlap(entity: number) {
		emit(SYSTEM_EVENTS.onEnterColshape, this.id, entity);
	}

	private endOverlap(entity: number) {
		emit(SYSTEM_EVENTS.onLeaveColshape, this.id, entity);
	}
}
