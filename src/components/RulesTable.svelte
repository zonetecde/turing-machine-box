<script lang="ts">
	import { GlobalVariables } from '../GlobalVariables';
	import Etat from '../models/Etat';
	import { Readable } from '../models/Etat';
	import Rule from './Rule.svelte';

	export let rules: Etat[];

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
				<Rule bind:rule {rules} />
			{/each}
		</div>
	</div>

	<!-- Add button -->
	<div class="flex justify-center mt-5">
		<button
			class="bg-green-700 hover:bg-green-800 duration-150 text-white px-3 py-1 rounded-md shadow-md"
			on:click={() => {
				rules = [...rules, new Etat(getRandomStateName(), [], getNextId())];
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
			Ajouter une règle
		</button>
	</div>
</div>
