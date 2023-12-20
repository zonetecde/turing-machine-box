<script lang="ts">
	import { Readable } from '../models/Etat';
	import type Etat from '../models/Etat';
	import SubRow from './SubRow.svelte';

	export let rule: Etat | null = null;
	export let header: boolean = false;
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
			<p class="text-2xl pb-1">{rule.nom}</p>
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
					/>
				{/each}
			</section>
			<section class="w-3/13 flex flex-col">
				{#each rule.readables as readable, i}
					<SubRow
						bind:value={readable.nouvelleEtat}
						last={i === rule.readables.length - 1}
						maxLength={99}
						acceptNull={false}
					/>
				{/each}
			</section>
		</div>
	</div>
{/if}
