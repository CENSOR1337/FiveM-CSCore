const namespace = "cscore";

function appendNamespace(name: string): string {
	return `${namespace}:${name}`;
}

export const SYSTEM_EVENTS = {
	onEnterColshape: appendNamespace("entityEnterColshape"),
	onLeaveColshape: appendNamespace("entityLeaveColshape"),
};
