<script lang="ts">
	export let value: string | null = '';
	export let last: boolean = false;
	export let maxLength = 1;
	export let acceptNull = true;

	let editMode = false;
</script>

{#if value !== null}
	<div class="relative">
		{#if !editMode}
			<button
				class={'min-h-[41px] w-full text-left cursor-text pl-3 py-1.5 border-black ' +
					(last ? '' : 'border-b')}
				on:click={() => (editMode = true)}
			>
				<span class={'text-xl ' + (value === '' ? 'italic' : '')}
					>{value === '' ? 'NULL' : value}</span
				>
			</button>
		{:else}
			<!-- svelte-ignore a11y-autofocus -->
			<input
				class={'w-full text-left outline-none bg-gray-100 text-xl cursor-text pl-3 py-1.5 border-black ' +
					(last ? '' : 'border-b')}
				type="text"
				spellcheck="false"
				autofocus
				bind:value
				maxlength={maxLength}
				on:blur={() => {
					setTimeout(() => {
						if (value === ' ' && acceptNull) value = '';
						else if (value === '' && acceptNull === false) value = null;

						editMode = false;
					}, 100);
				}}
				on:keydown={(e) => {
					if (e.key === 'Enter') {
						editMode = false;
					}
				}}
			/>

			<!-- Delete button -->
			<button
				class="absolute right-1 px-1 top-1 bottom-1 bg-red-500 hover:bg-red-600 text-white flex justify-center items-center"
				on:click={() => {
					value = null;
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 stroke-current"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		{/if}
	</div>
{:else}
	<!-- Empty line -->
	<button
		class={'h-[41px] border-black cursor-text ' + (last ? '' : 'border-b')}
		on:click={() => {
			editMode = true;
			value = '';
		}}
	></button>
{/if}
