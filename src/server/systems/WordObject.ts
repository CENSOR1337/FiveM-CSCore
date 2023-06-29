import * as cfx from "@nativewrappers/fivem-server";

export class WordObject {
	public pos: cfx.Vector3;
	public dimension: number;

	constructor(pos: cfx.Vector3, dimension?: number) {
		this.pos = pos;
		this.dimension = dimension || 0;
	}
}
