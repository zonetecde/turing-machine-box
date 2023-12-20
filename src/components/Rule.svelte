<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { Readable } from '../models/Etat';
	import type Etat from '../models/Etat';
	import SubRow from './SubRow.svelte';
	import { error } from '@sveltejs/kit';

	export let rule: Etat | null = null;
	export let header: boolean = false;
	export let rules: Etat[] = [];

	let modifyStateName = false;

	$: if (rule && rule.nom) {
	}
</script>

{#if header}
	<div class="w-full h-12 flex flex-row border border-black">
		<div class="w-1/6 bg-slate-200 border-r-2 border-black flex items-center justify-center">
			<p class="text-lg">Nom de l'état</p>
		</div>
		<div class="w-5/6 grid grid-cols-4 bg-slate-200">
			<section class="border-r-2 border-black flex items-center justify-center text-lg">
				Lecture
			</section>
			<section class="w-3/13 border-r-2 border-black flex items-center justify-center text-lg">
				Ecriture
			</section>
			<section class="w-3/13 border-r-2 border-black flex items-center justify-center text-lg">
				Déplacement
			</section>
			<section class="w-3/13 flex items-center justify-center text-lg">Nouvel état</section>
		</div>
	</div>
{:else if rule != null}
	<div class="w-full min-h-[40px] flex flex-row border border-black">
		<div class="w-1/6 bg-slate-200 border-r-2 border-black flex items-center justify-center">
			{#if modifyStateName}
				<!-- svelte-ignore a11y-autofocus -->
				<input
					type="text"
					class="text-2xl pb-1 outline-none text-center bg-transparent"
					bind:value={rule.nom}
					autofocus
					maxlength="15"
					on:keyup={(e) => {
						if (e.key === 'Enter') modifyStateName = false;
					}}
					on:blur={() => {
						if (rule) {
							// vérifie qu'il n'y a pas deux états qui ont le même nom
							if (rules.filter((r) => r.nom === rule?.nom).length > 1) {
								toast.error('Deux états ne peuvent pas avoir le même nom');
								rule.nom = 'q' + Math.floor(Math.random() * 1000);
							} else {
								if (rule.nom.trim() === '') rule.nom = 'q' + Math.floor(Math.random() * 1000);
								modifyStateName = false;
							}
						}
					}}
				/>
			{:else}
				<button on:click={() => (modifyStateName = true)}>
					<p class="text-2xl pb-1">{rule.nom}</p>
				</button>
			{/if}
		</div>
		<div class="w-5/6 bg-white grid grid-cols-4">
			<section class="border-r-2 border-black flex flex-col">
				{#each rule.readables as readable, i}
					<SubRow bind:value={readable.symbole} last={i === rule.readables.length - 1} />
				{/each}
			</section>
			<section class="w-3/13 border-r-2 border-black flex flex-col">
				{#each rule.readables as readable, i}
					<SubRow bind:value={readable.nouvelleValeur} last={i === rule.readables.length - 1} />
				{/each}
			</section>
			<section class="w-3/13 border-r-2 border-black flex flex-col">
				{#each rule.readables as readable, i}
					<SubRow
						bind:value={readable.direction}
						last={i === rule.readables.length - 1}
						acceptNull={false}
						maxLength={5}
						acceptableValues={['left', 'right']}
					/>
				{/each}
			</section>
			<section class="w-3/13 flex flex-col">
				{#each rule.readables as readable, i}
					<SubRow
						etats={rules}
						bind:value={readable.nouvelEtatId}
						last={i === rule.readables.length - 1}
						maxLength={99}
						acceptNull={false}
						acceptableValues={rules.map((r) => r.nom)}
						isStateSelection={true}
					/>
				{/each}
			</section>
		</div>
	</div>
{/if}
