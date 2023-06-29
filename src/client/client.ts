import { Vector3 } from "@cscore-shared/utils/Vector3";

console.log("[cscore] Client Resource Started");

onNet("vEntity:create", function (id: string, position: Vector3, streamingDistance: number) {
	console.log(`[cscore] vEntity:create ${id} ${position} ${streamingDistance}`);
});
