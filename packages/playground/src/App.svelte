<script lang="ts">
	import MarkdownGen from './testing-pages/MarkdownGen.svelte';
	import KitchenSink from './testing-pages/KitchenSink.svelte';
	import Other from './testing-pages/Other.svelte';
	import Pico from './testing-pages/Pico.svelte';

	const TESTING_PAGES = Object.freeze({
		KitchenSink,
		Pico,
		MarkdownGen,
		Other,
	});

	type Option = keyof typeof TESTING_PAGES;

	const options = Object.keys(TESTING_PAGES) as Option[];

	let selected: Option = $state('KitchenSink');
</script>

<header>
	{#each options as option}
		<button
			class="outline"
			class:active={selected == option}
			onclick={() => (selected = option)}
		>
			{option}
		</button>
	{/each}

	<hr />
</header>

{#if selected}
	{@const SvelteComponent = TESTING_PAGES[selected]}
	<SvelteComponent></SvelteComponent>
{/if}
