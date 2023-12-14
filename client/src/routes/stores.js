import { writable } from 'svelte/store';

export const SequenceStore = writable({});
export const AnalysisStore = writable({});
export const ResultsStore = writable({});
export const buttonClicked = writable(false);
