import * as cfx from "@nativewrappers/client";

console.log("[cscore] Client Resource Started");

onNet("vEntity:create", function (id: string, position: cfx.Vector3, streamingDistance: number) {
	console.log(`[cscore] vEntity:create ${id} ${position} ${streamingDistance}`);
});
