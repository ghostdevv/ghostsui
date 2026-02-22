<script lang="ts" module>
	/**
	 * Context that can be used to interact with the modal from the snippet.
	 */
	export interface SnippetContext {
		/**
		 * Cause the model to open
		 */
		open: () => void;

		/**
		 * Cause the model to close
		 */
		close: () => void;
	}

	/**
	 * The content of the modal
	 */
	export type ChildrenSnippet = Snippet<[ctx: SnippetContext]>;

	/**
	 * Snippet for the button that opens the modal.
	 *
	 * @param attrs - These props must be spread on the button to open the modal.
	 * @param ctx - {@link SnippetContext}
	 *
	 * @example
	 *
	 * ```svelte
	 * {#snippet activator(attrs, ctx)}
	 *     <button {...attrs} title="Open Modal">
	 *         Open Modal
	 *     </button>
	 * {/snippet}
	 * ``
	 */
	export type ActivatorSnippet = Snippet<[attrs: Dialog['trigger'], ctx: SnippetContext]>;

	/**
	 * Modal Props
	 */
	export interface Props {
		/**
		 * Controls whether the model is open/closed.
		 * @bindable
		 */
		open?: boolean;

		/**
		 * The content of the modal, see @link {ChildrenSnippet};
		 */
		children: ChildrenSnippet;

		/**
		 * The activator of the modal, see @link {ActivatorSnippet};
		 */
		activator?: ActivatorSnippet;

		/**
		 * Callback to run when the modal is opened.
		 */
		onOpen?: () => void;

		/**
		 * Callback to run when the modal is closed.
		 */
		onClose?: () => void;
	}
</script>

<!--
    @component
    A Modal (dialog) that uses Melt's Dialog under the hood.

    @example

    ```svelte
    <script lang="ts">
        import { Modal } from '@ghostsui/svelte/modal';
    </script>

    <Modal>
        {#snippet activator(attrs, ctx)}
            <button {...attrs} title="Open Modal"> Open Modal </button>
        {/snippet}

        <h2>Hello World</h2>
    </Modal>
    ```
-->

<script lang="ts">
	import { Dialog } from 'melt/builders';
	import type { Snippet } from 'svelte';

	let { open = $bindable(false), children, activator, onOpen, onClose }: Props = $props();

	const dialog = new Dialog({
		onOpenChange(newState) {
			if (newState !== open) {
				open = newState;
			}

			if (newState) {
				onOpen?.();
			} else {
				onClose?.();
			}
		}
	});

	// todo patch upstream
	$effect(() => {
		if (dialog.open !== open) {
			dialog.open = open;
		}
	});

	const context = $derived<SnippetContext>({
		close: () => (dialog.open = false),
		open: () => (dialog.open = true)
	});
</script>

{#if activator}
	{@render activator(dialog.trigger, context)}
{/if}

<div {...dialog.overlay}></div>

<dialog {...dialog.content}>
	{@render children(context)}
</dialog>

<style>
	[data-melt-dialog-content] {
		opacity: 0;
		scale: 0.95;
		transition:
			opacity 0.2s ease-in,
			scale 0.2s ease-in;

		&::backdrop {
			display: none;
		}

		&[data-open] {
			opacity: 1;
			scale: 1;
		}
	}

	[data-melt-dialog-overlay] {
		position: fixed;
		width: 100%;
		height: 100%;

		background: rgba(18, 18, 20, 0.8);
		transition: opacity 0.2s ease-in;
		opacity: 0;

		&[data-open] {
			opacity: 1;
		}
	}
</style>
