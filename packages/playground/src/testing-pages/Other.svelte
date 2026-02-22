<details>
	<summary>foo</summary>
	<details style="padding-left: 8px;">
		<summary>baz</summary>
		<p>qux</p>
	</details>
</details>

<form>
	<label>
		Foo
		<input type="text" />
	</label>

	<label>
		Bar
		<textarea></textarea>
	</label>

	<label>
		Baz
		<input type="checkbox" />
	</label>
</form>

<button command="show-modal" commandfor="modal">Open Modal</button>

<dialog id="modal">
	<h1>hii</h1>
</dialog>

<button command="toggle-popover" commandfor="popover">Popover</button>

<div popover id="popover">
	<h4>hii</h4>
</div>
