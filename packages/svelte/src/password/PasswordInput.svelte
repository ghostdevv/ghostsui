<script lang="ts" module>
	import type { Component } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	/**
	 * PasswordInput props
	 */
	export interface Props extends Omit<HTMLInputAttributes, 'type' | 'id'> {
		/**
		 * The value of the password input.
		 * @bindable
		 */
		value?: string | undefined | null;

		/**
		 * The label of the password input.
		 */
		label: string;

		/**
		 * Applies the "sr-only" class to the label.
		 */
		hideLabel?: boolean;

		/**
		 * The icon to display when the password is visible.
		 */
		iconOn: Component;

		/**
		 * The icon to display when the password is hidden.
		 */
		iconOff: Component;
	}
</script>

<!--
    @component An input that allows you to toggle a password as visible/hidden

    @example
    ```svelte
    <script lang="ts">
        import { PasswordInput } from '@ghostsui/svelte/password';
        import IconEyeOff from '~icons/lucide/eye-off';
        import IconEye from '~icons/lucide/eye';
    </script>

    <PasswordInput
        label="Password"
        placeholder="Incredible password"
        iconOn={IconEye}
        iconOff={IconEyeOff}
    />
    ```
-->

<script lang="ts">
	let {
		label,
		disabled,
		hideLabel,
		iconOn: IconOn,
		iconOff: IconOff,
		value = $bindable(''),
		...attrs
	}: Props = $props();

	let type = $state<'text' | 'password'>('password');
	const id = $props.id();
</script>

<label for={id} class:sr-only={hideLabel}>{label}</label>

<div class="password-input">
	<input {...attrs} {id} {type} bind:value {disabled} />

	<button
		type="button"
		class="icon toggle"
		onclick={() => (type = type === 'text' ? 'password' : 'text')}
		{disabled}
	>
		{#if type == 'text'}
			<IconOff />
		{:else}
			<IconOn />
		{/if}
	</button>
</div>

<style lang="scss">
	.password-input {
		width: 100%;
		position: relative;
		margin-top: 6px;

		.toggle {
			position: absolute;
			inset: 0 10px 0 auto;
		}
	}
</style>
