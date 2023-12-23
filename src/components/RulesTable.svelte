<script lang="ts">
	import { GlobalVariables } from '../GlobalVariables';
	import Etat from '../models/Etat';
	import { Readable } from '../models/Etat';
	import Rule from './Rule.svelte';

	export let rules: Etat[];

	let startingState: number | undefined;
	$: if (startingState === undefined) {
		startingState = rules[0]?.id;
	} else {
		rules = rules.map((x) => {
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
		if (rules.find((x) => x.nom === temp)) return getRandomStateName();
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
</script>

<div class="w-full">
	<div class="flex-col flex justify-center">
		<div class="mx-auto w-10/12 border-2 border-slate-500 shadow-xl shadow-slate-600">
			<Rule header={true} />
			{#each rules as rule}
				<Rule bind:state={rule} states={rules} />
			{/each}
		</div>
	</div>

	<div class="flex justify-center mt-5 relative gap-x-5">
		<label
			class="bg-green-700 duration-150 rounded-md shadow-md shadow-green-900 text-white px-3 py-1"
			>État de départ : <select
				bind:value={startingState}
				class="w-32 text-black outline-none mt-0.5 ml-1"
			>
				{#each rules as rule}
					<option value={rule.id} class={rule.start ? 'bg-gray-300' : ''}>{rule.nom}</option>
				{/each}
			</select></label
		>
		<button
			class="bg-green-700 hover:bg-green-800 duration-150 text-white px-3 py-1 rounded-md shadow-md shadow-green-900"
			on:click={() => {
				rules = [
					...rules,
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
	</div>
</div>
