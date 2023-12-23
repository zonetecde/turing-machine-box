import { writable } from 'svelte/store';

// Current playing state
const playingStateS = {
	stateId: 0,
	ruleId: 0
};

export const playingState = writable(playingStateS);
