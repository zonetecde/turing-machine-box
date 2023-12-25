<script lang="ts">
	import { GlobalVariables } from '../GlobalVariables';
	import Etat from '../models/Etat';
	import { Readable } from '../models/Etat';
	import { cursorPos } from '../stores/store';
	import Rule from './Rule.svelte';

	export let states: Etat[];
	export let values: (string | number | null)[] = [];
	let inputRubanValues = valuesToString();

	let startingState: number | undefined;
	$: if (startingState === undefined) {
		if (states.length > 0) startingState = states[0]?.id;
	} else {
		states = states.map((x) => {
			if (x.id === startingState) x.start = true;
			else x.start = false;
			return x;
		});
	}

	/**
	 * Renvoie un nom d'état aléatoire qui n'est pas déjà utilisé
	 */
	function getRandomStateName(): string {
		const temp = 'q' + Math.floor(Math.random() * 1000);
		if (states.find((x) => x.nom === temp)) return getRandomStateName();
		else return temp;
	}

	/**
	 * Renvoie un id unique
	 */
	function getNextId(): number | undefined {
		const id = GlobalVariables.idCounter;
		GlobalVariables.idCounter++;
		return id;
	}

	function valuesToString(): string {
		return values.join('');
	}

	let cursorPosition: number = -2;

	cursorPos.subscribe((value) => {
		cursorPosition = value;
	});

	$: if (cursorPosition !== undefined) {
		cursorPos.set(cursorPosition);
	}

	function updateRibbonValues(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		inputRubanValues = event.currentTarget.value;
		values = inputRubanValues.split('');
	}

	function handleExport(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
		const data = {
			states: states,
			values: values,
			cursorPosition: cursorPosition
		};

		const file = new Blob([JSON.stringify(data)], { type: 'application/json' });
		const a = document.createElement('a');
		a.href = URL.createObjectURL(file);
		a.download = 'turing-machine.json';
		a.click();
	}

	function handleImport(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		if (event.target === null) return;
		if (event.currentTarget.files === null) return;

		const file = event.currentTarget.files[0];
		const reader = new FileReader();

		reader.onload = (e) => {
			if (e.target === null) return;
			const data = JSON.parse(e.target.result as string);

			states = data.states;
			values = data.values;
			cursorPosition = data.cursorPosition;

			cursorPos.set(cursorPosition);
			inputRubanValues = valuesToString();

			// état de départ
			startingState = states.find((x) => x.start === true)?.id;
		};

		reader.readAsText(file);
	}
</script>

<div class="w-full">
	<div class="flex-col flex justify-center">
		<div class="mx-auto w-10/12 border-2 border-slate-500 shadow-xl shadow-slate-600">
			<Rule header={true} />
			{#each states as state}
				<Rule bind:state bind:states />
			{/each}
		</div>
	</div>

	<div class="flex justify-center mt-5 relative gap-x-5 flex-col">
		<div class="flex justify-center mt-5 relative gap-x-5">
			<label
				class="bg-green-700 duration-150 rounded-md shadow-md shadow-green-900 text-white px-3 py-1"
				>État de départ : <select
					bind:value={startingState}
					class="w-32 text-black outline-none mt-0.5 ml-1"
				>
					{#each states as rule}
						<option value={rule.id} class={rule.start ? 'bg-gray-300' : ''}>{rule.nom}</option>
					{/each}
				</select></label
			>
			<button
				class="bg-green-700 hover:bg-green-800 duration-150 text-white px-3 py-1 rounded-md shadow-md shadow-green-900"
				on:click={() => {
					states = [
						...states,
						new Etat(getRandomStateName(), [new Readable(null, null, null, null)], getNextId())
					];
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 stroke-current inline-block mr-1"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
				Ajouter un état
			</button>

			<label
				class="bg-blue-700 duration-150 rounded-md shadow-md shadow-blue-900 text-white px-3 pt-0.5"
			>
				Position du curseur :
				<input
					type="number"
					bind:value={cursorPosition}
					class="text-black w-16 text-center outline-none mt-1 ml-1"
				/>
			</label>
		</div>
		<div class="flex justify-center mt-5 relative gap-x-5">
			<label
				class="bg-blue-700 duration-150 rounded-md shadow-md pb-1 shadow-blue-900 text-white px-3 pt-0.5"
			>
				Vitesse :
				<input
					type="range"
					min="0.5"
					max="5"
					step="0.1"
					bind:value={GlobalVariables.speed}
					class="w-32 text-black outline-none mt-1.5 ml-1"
				/>
			</label>

			<label
				class="bg-blue-700 duration-150 rounded-md shadow-md pb-1 shadow-blue-900 text-white px-3 pt-0.5"
				>Valeurs du ruban :
				<input
					type="text"
					class="text-black outline-none mt-1.5 ml-1 px-1 text-center"
					value={inputRubanValues}
					on:keyup={updateRibbonValues}
				/>
			</label>
		</div>

		<div class="flex justify-center mt-5 relative gap-x-5">
			<button
				on:click={handleExport}
				class="bg-orange-500 hover:bg-orange-600 duration-150 text-black px-3 py-1 rounded-md shadow-md shadow-orange-900"
				>Exporter</button
			>
			<button
				class="relative bg-orange-500 hover:bg-orange-600 duration-150 text-black px-3 py-1 rounded-md shadow-md shadow-orange-900"
				>Importer

				<input type="file" class="opacity-0 absolute inset-0 z-20" on:change={handleImport} />
			</button>
		</div>
	</div>
</div>
