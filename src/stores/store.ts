import { writable } from 'svelte/store';

// Current playing state
const playingStateS = {
	stateId: 0,
	ruleId: 0
};

const cursorPosS: number = -2;

export const playingState = writable(playingStateS);
export const cursorPos = writable(cursorPosS);
