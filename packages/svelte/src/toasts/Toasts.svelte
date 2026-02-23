<script lang="ts" module>
	/**
	 * Toasts Component Props
	 */
	export interface Props {
		/**
		 * The icon that is used in the close button on each toast.
		 */
		closeIcon: Component;
	}

	/**
	 * The data structure for each toast.
	 */
	export interface ToastData {
		/**
		 * The type of the toast.
		 */
		type: ToastType;

		/**
		 * The message to display in the toast.
		 */
		message: string;
	}

	/**
	 * The type of the toast.
	 */
	export type ToastType = 'success' | 'error' | 'info' | 'warn';

	const toaster = new Toaster<ToastData>({
		closeDelay: 10000
	});

	/**
	 * The internal toasts state.
	 */
	export const toasts = Object.freeze({
		/**
		 * The full list of toasts currently displayed.
		 */
		get list() {
			return toaster.toasts;
		}
	});

	/**
	 * Create and show a toast.
	 *
	 * @param type - The type of the toast.
	 * @param message - The message to display in the toast.
	 *
	 * @example
	 * ```
	 * <script lang="ts">
	 *     import { toast } from '@ghostsui/svelte/toasts';
	 * <\/script>
	 *
	 * <button onclick={() => toast('info', 'Something profound')}>
	 *     Toast!
	 * </button>
	 * ```
	 */
	export const toast = (type: ToastType, message: string) => {
		toaster.addToast({ data: { message, type } });
	};
</script>

<!--
    @component
    Toasts component renders the toasts from the global store.
    This only needs to be rendered once per application.

    @example Render Toasts
    ```svelte
    <script lang="ts">
        import { Toasts } from '@ghostsui/svelte/toasts';
        import IconClose from '~icons/lucide/x';
    </script>

    <Toasts closeIcon={IconClose} />
    ```

    @example Add a toast
    ```svelte
    <script lang="ts">
        import { toast } from '@ghostsui/svelte/toasts';
    </script>

    <button onclick={() => toast('info', 'Something profound')}>
        Toast!
    </button>
    ```
-->

<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Toaster } from 'melt/builders';
	import type { Component } from 'svelte';

	const { closeIcon: CloseIcon }: Props = $props();
</script>

<div {...toaster.root}>
	{#each toaster.toasts as toast (toast.id)}
		<div transition:fade class={toast.data.type} {...toast.content}>
			<p {...toast.description}>{toast.data.message}</p>
			<button class="icon" {...toast.close} title="dismiss toast">
				<CloseIcon />
			</button>
		</div>
	{/each}
</div>

<style lang="scss">
	p {
		margin: 0px;
	}

	[data-melt-toaster-toast-content] {
		background-color: var(--background-secondary);
		border: 2px dotted var(--background-tertiary);
		border-radius: 12px;
		padding: 12px 16px;
		padding-right: 48px;
		color: var(--text);
		max-width: 300px;

		position: relative;
		display: flex;
		flex-direction: column;
		gap: 8px;

		&.success {
			border-color: var(--green);
		}

		&.error {
			border-color: var(--red);
		}

		&.warn {
			border-color: var(--orange);
		}
	}

	[data-melt-toaster-toast-close] {
		position: absolute;
		top: 8px;
		right: 8px;
	}

	[data-melt-toaster-root] {
		background: transparent;
		border: none;
		inset: unset;
		right: 16px;
		bottom: 16px;
		z-index: 10000;

		display: flex;
		flex-direction: column;
		gap: 8px;

		box-shadow: none;
		border-radius: 0px;
		padding: 0px;

		@media (max-width: 500px) {
			inset: var(--inset, auto 8px 112px auto);
		}
	}
</style>
