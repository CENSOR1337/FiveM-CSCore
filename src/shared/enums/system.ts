const namespace = "cscore";

function appendNamespace(name: string): string {
	return `${namespace}:${name}`;
}

export const SYSTEM_EVENTS = {
	onEnterColshape: appendNamespace("colshape:enter"),
	onLeaveColshape: appendNamespace("colshape:leave"),
};
