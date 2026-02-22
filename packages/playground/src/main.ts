import App from './App.svelte';
import { mount } from 'svelte';
import 'ghostsui';

mount(App, {
	target: document.getElementById('app')!,
});
