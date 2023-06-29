import { Vector3 } from "@cscore-shared/utils/Vector3";

export class WordObject {
	public pos: Vector3;
	public dimension: number;

	constructor(pos: Vector3, dimension?: number) {
		this.pos = pos;
		this.dimension = dimension || 0;
	}
}
