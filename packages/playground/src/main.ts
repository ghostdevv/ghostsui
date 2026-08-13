import App from './App.svelte';
import { mount } from 'svelte';
// @ts-expect-error shhh
import 'ghostsui';

mount(App, {
	target: document.getElementById('app')!,
});
