<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import 'ghostsui';

	const { children } = $props();

	const title = $derived.by(() => {
		switch (page.route.id) {
			case '/':
				return 'ghostsui';
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{title}</title>
</svelte:head>

{@render children()}
