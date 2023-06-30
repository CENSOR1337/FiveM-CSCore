import { Vector3 } from "@cscore-shared/utils/Vector3";

export class WordObject {
	public pos: Vector3;
	public _dimension: number;

	constructor(pos: Vector3, dimension?: number) {
		this.pos = pos;
		this._dimension = dimension || 0;
	}

    public set dimension(value: number) {
        this._dimension = value;
    }

    public get dimension(): number {
        return this._dimension;
    }
}
