import { Vector3 } from "@cscore-shared/utils/Vector3";
import { SYSTEM_EVENTS } from "@cscore-shared/enums/system";

const virtualEntities = new Map<string, VirtualEntity>();

class VirtualEntity {
	readonly id: string;
	readonly pos: Vector3;
	readonly syncedMeta: Record<string, any>;

	constructor(id: string, pos: Vector3, syncedMeta: Record<string, any>) {
		this.id = id;
		this.pos = pos;
		this.syncedMeta = syncedMeta;
		onNet(SYSTEM_EVENTS.onVirtualEntitySyncedMetaChange, this.onSyncedMetaChange.bind(this));
	}

	public getSyncedMeta<T>(key: string): any {
		return this.syncedMeta[key];
	}

	private onSyncedMetaChange(id: string, key: string, value: any) {
		if (id !== this.id) return;
		this.syncedMeta[key] = value;
	}

	public destroy() {
		removeEventListener(SYSTEM_EVENTS.onVirtualEntitySyncedMetaChange, this.onSyncedMetaChange);
	}
}

onNet(SYSTEM_EVENTS.onVirtualEntityStreamIn, function (veObject: any) {
	const id = veObject.id;
	const pos = veObject.pos;
	const syncedMeta = veObject.syncedMeta;
	if (virtualEntities.has(id)) return;
	const object = new VirtualEntity(id, pos, syncedMeta);
	virtualEntities.set(id, object);
});

onNet(SYSTEM_EVENTS.onVirtualEntityStreamOut, function (veObject: any) {
	const id = veObject.id;
	const object = virtualEntities.get(id);
	if (!object) return;
	object.destroy();
	virtualEntities.delete(id);
});
