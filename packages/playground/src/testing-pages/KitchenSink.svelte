<script lang="ts">
	let m_dialog = $state<HTMLDialogElement>();
	let nm_dialog = $state<HTMLDialogElement>();
</script>

<button onclick={() => m_dialog?.showModal()}> open modal dialog </button>
<button onclick={() => nm_dialog?.show()}> open non-modal dialog </button>

<dialog bind:this={nm_dialog}>
	non-modal dialog
	<button onclick={() => nm_dialog?.close()}> close </button>
</dialog>

<dialog bind:this={m_dialog}>
	modal dialog
	<button onclick={() => m_dialog?.close()}> close </button>
</dialog>

<div role="banner">
	<p>I have <code>role="banner"</code></p>
</div>

<div class="banner green">
	<p>I have <code>class="banner green"</code></p>
</div>

<a href="https://ghostdev.xyz"> View awesome website </a>

<a href="https://ghostdev.xyz" class="button"> Anchor styled as button </a>

<a class="card" href="/"> Link Card</a>
<a class="card blue" href="/"> Blue Link Card</a>
<button class="card">Button Card</button>
<div class="card"><p>Regular Card</p></div>

<input type="checkbox" />
<input type="checkbox" class="switch" />

<input disabled type="checkbox" />
<input disabled type="checkbox" class="switch" />

<input disabled checked type="checkbox" />
<input disabled checked type="checkbox" class="switch" />

<input name="test" type="radio" />
<input name="test" type="radio" />

<h3>buttons</h3>

<button>Regular</button>
<button class="outline">Outline</button>

<button class="red">Red</button>
<button class="outline red">Red outline</button>

<button class="green">Green</button>
<button class="green outline">Green outline</button>

<button class="orange">Orange</button>
<button class="orange outline">Orange outline</button>

<button disabled>Disabled</button>
<button disabled class="outline">Disabled outline</button>

<button class="icon">
	<!-- Ghost icon by Obra Icons https://icons.obra.studio/ -->
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g class="oi-ghost">
			<path
				class="oi-fill"
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M9.76779 9.41425C10.3201 9.41425 10.7678 9.86196 10.7678 10.4142L10.7678 10.9952C10.8028 11.2892 10.7076 11.5958 10.482 11.8214L10.4749 11.8285C10.1889 12.1145 9.75878 12.2 9.3851 12.0452C9.01143 11.8905 8.76779 11.5258 8.76779 11.1214L8.76779 10.4142C8.76779 9.86196 9.2155 9.41425 9.76779 9.41425Z"
				fill="currentColor"
			/>
			<path
				class="oi-fill"
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M13.7678 9.41425C14.3201 9.41425 14.7678 9.86196 14.7678 10.4142L14.7678 10.9952C14.8028 11.2892 14.7076 11.5958 14.482 11.8214L14.4749 11.8285C14.1889 12.1145 13.7588 12.2 13.3851 12.0452C13.0114 11.8905 12.7678 11.5258 12.7678 11.1214L12.7678 10.4142C12.7678 9.86196 13.2155 9.41425 13.7678 9.41425Z"
				fill="currentColor"
			/>
			<path
				class="oi-vector"
				d="M15.0705 20.4349L15.6721 19.6361L15.0705 20.4349C15.9178 21.073 17.072 21.1219 17.9703 20.5581L19.0632 19.8721C19.6461 19.5062 20 18.8663 20 18.1781V10.9564C20 6.5563 16.4124 3 12 3C7.58763 3 4 6.5563 4 10.9564V18.1781C4 18.8663 4.35386 19.5062 4.93679 19.8721L6.11016 20.6086C6.94173 21.1305 7.99944 21.1305 8.83102 20.6086L9.64396 20.0983C9.82544 19.9844 10.0569 19.9844 10.2384 20.0983L10.9709 20.5581C11.8692 21.1219 13.0234 21.073 13.8707 20.4349L14.1345 20.2362C14.3331 20.0866 14.608 20.0866 14.8067 20.2362L15.0705 20.4349Z"
				stroke="currentColor"
				stroke-width="2"
			/>
		</g>
	</svg>
</button>

<hr />

<header>
	<h1>HTML5 Test Page</h1>
	<p>
		This is a test page filled with common HTML elements to be used to
		provide visual feedback whilst building CSS systems and frameworks.
	</p>
</header>
<nav>
	<ul>
		<li>
			<a href="#text">Text</a>
			<ul>
				<li><a href="#text__headings">Headings</a></li>
				<li><a href="#text__paragraphs">Paragraphs</a></li>
				<li><a href="#text__blockquotes">Blockquotes</a></li>
				<li><a href="#text__lists">Lists</a></li>
				<li><a href="#text__hr">Horizontal rules</a></li>
				<li><a href="#text__tables">Tabular data</a></li>
				<li><a href="#text__code">Code</a></li>
				<li><a href="#text__inline">Inline elements</a></li>
				<li><a href="#text__comments">HTML Comments</a></li>
			</ul>
		</li>
		<li>
			<a href="#embedded">Embedded content</a>
			<ul>
				<li><a href="#embedded__images">Images</a></li>
				<li><a href="#embedded__audio">Audio</a></li>
				<li><a href="#embedded__video">Video</a></li>
				<li><a href="#embedded__canvas">Canvas</a></li>
				<li><a href="#embedded__meter">Meter</a></li>
				<li><a href="#embedded__progress">Progress</a></li>
				<li><a href="#embedded__svg">Inline SVG</a></li>
				<li><a href="#embedded__iframe">IFrames</a></li>
			</ul>
		</li>
		<li>
			<a href="#forms">Form elements</a>
			<ul>
				<li><a href="#forms__input">Input fields</a></li>
				<li><a href="#forms__select">Select menus</a></li>
				<li><a href="#forms__checkbox">Checkboxes</a></li>
				<li><a href="#forms__radio">Radio buttons</a></li>
				<li><a href="#forms__textareas">Textareas</a></li>
				<li><a href="#forms__html5">HTML5 inputs</a></li>
				<li><a href="#forms__action">Action buttons</a></li>
			</ul>
		</li>
	</ul>
</nav>
<main>
	<section id="text">
		<header><h1>Text</h1></header>
		<article id="text__headings">
			<header>
				<h1>Headings</h1>
			</header>
			<div>
				<h1>Heading 1</h1>
				<h2>Heading 2</h2>
				<h3>Heading 3</h3>
				<h4>Heading 4</h4>
				<h5>Heading 5</h5>
				<h6>Heading 6</h6>
			</div>
			<footer><p><a href="#top">[Top]</a></p></footer>
		</article>
		<article id="text__paragraphs">
			<header><h1>Paragraphs</h1></header>
			<div>
				<p>
					A paragraph (from the Greek paragraphos, “to write beside”
					or “written beside”) is a self-contained unit of a discourse
					in writing dealing with a particular point or idea. A
					paragraph consists of one or more sentences. Though not
					required by the syntax of any language, paragraphs are
					usually an expected part of formal writing, used to organize
					longer prose.
				</p>
			</div>
			<footer><p><a href="#top">[Top]</a></p></footer>
		</article>
		<article id="text__blockquotes">
			<header><h1>Blockquotes</h1></header>
			<div>
				<blockquote>
					<p>
						A block quotation (also known as a long quotation or
						extract) is a quotation in a written document, that is
						set off from the main text as a paragraph, or block of
						text.
					</p>
					<p>
						It is typically distinguished visually using indentation
						and a different typeface or smaller size quotation. It
						may or may not include a citation, usually placed at the
						bottom.
					</p>
					<cite><a href="#!">Said no one, ever.</a></cite>
				</blockquote>
			</div>
			<footer><p><a href="#top">[Top]</a></p></footer>
		</article>
		<article id="text__lists">
			<header><h1>Lists</h1></header>
			<div>
				<h3>Definition list</h3>
				<dl>
					<dt>Definition List Title</dt>
					<dd>This is a definition list division.</dd>
				</dl>
				<h3>Ordered List</h3>
				<ol>
					<li>List Item 1</li>
					<li>List Item 2</li>
					<li>List Item 3</li>
				</ol>
				<h3>Unordered List</h3>
				<ul>
					<li>List Item 1</li>
					<li>List Item 2</li>
					<li>List Item 3</li>
				</ul>
			</div>
			<footer><p><a href="#top">[Top]</a></p></footer>
		</article>
		<article id="text__hr">
			<header><h1>Horizontal rules</h1></header>
			<div>
				<hr />
			</div>
			<footer><p><a href="#top">[Top]</a></p></footer>
		</article>
		<article id="text__tables">
			<header><h1>Tabular data</h1></header>
			<table>
				<caption>Table Caption</caption>
				<thead>
					<tr>
						<th>Table Heading 1</th>
						<th>Table Heading 2</th>
						<th>Table Heading 3</th>
						<th>Table Heading 4</th>
						<th>Table Heading 5</th>
					</tr>
				</thead>
				<tfoot>
					<tr>
						<th>Table Footer 1</th>
						<th>Table Footer 2</th>
						<th>Table Footer 3</th>
						<th>Table Footer 4</th>
						<th>Table Footer 5</th>
					</tr>
				</tfoot>
				<tbody>
					<tr>
						<td>Table Cell 1</td>
						<td>Table Cell 2</td>
						<td>Table Cell 3</td>
						<td>Table Cell 4</td>
						<td>Table Cell 5</td>
					</tr>
					<tr>
						<td>Table Cell 1</td>
						<td>Table Cell 2</td>
						<td>Table Cell 3</td>
						<td>Table Cell 4</td>
						<td>Table Cell 5</td>
					</tr>
					<tr>
						<td>Table Cell 1</td>
						<td>Table Cell 2</td>
						<td>Table Cell 3</td>
						<td>Table Cell 4</td>
						<td>Table Cell 5</td>
					</tr>
					<tr>
						<td>Table Cell 1</td>
						<td>Table Cell 2</td>
						<td>Table Cell 3</td>
						<td>Table Cell 4</td>
						<td>Table Cell 5</td>
					</tr>
				</tbody>
			</table>
			<footer><p><a href="#top">[Top]</a></p></footer>
		</article>
		<article id="text__code">
			<header><h1>Code</h1></header>
			<div>
				<p><strong>Keyboard input:</strong> <kbd>Cmd</kbd></p>
				<p>
					<strong>Inline code:</strong>
					<code>&lt;div&gt;code&lt;/div&gt;</code>
				</p>
				<p>
					<strong>Sample output:</strong>
					<samp>This is sample output from a computer program.</samp>
				</p>
				<h2>Pre-formatted text</h2>
				<pre>P R E F O R M A T T E D T E X T
! " # $ % &amp; ' ( ) * + , - . /
0 1 2 3 4 5 6 7 8 9 : ; &lt; = &gt; ?
@ A B C D E F G H I J K L M N O
P Q R S T U V W X Y Z [ \ ] ^ _
` a b c d e f g h i j k l m n o
p q r s t u v w x y z | ~ </pre>

				<h2>Code</h2>
				<pre><code
						>console.log('Hello World              asdddddddddddddddddddddddddddddddddddddddddddddssssssssssssssssssssssssssssssssssssssssssssssssssssssssss')</code
					></pre>
			</div>
			<footer><p><a href="#top">[Top]</a></p></footer>
		</article>
		<article id="text__inline">
			<header><h1>Inline elements</h1></header>
			<div>
				<p><a href="#!">This is a text link</a>.</p>
				<p>
					<strong
						>Strong is used to indicate strong importance.</strong
					>
				</p>
				<p><em>This text has added emphasis.</em></p>
				<p>
					The <b>b element</b> is stylistically different text from normal
					text, without any special importance.
				</p>
				<p>
					The <i>i element</i> is text that is offset from the normal text.
				</p>
				<p>
					The <u>u element</u> is text with an unarticulated, though explicitly
					rendered, non-textual annotation.
				</p>
				<p>
					I have sneakily inserted a <code>code</code> element in this text
					to see how it looks.
				</p>
				<p>
					<del>This text is deleted</del> and
					<ins>This text is inserted</ins>.
				</p>
				<p><s>This text has a strikethrough</s>.</p>
				<p>Superscript<sup>®</sup>.</p>
				<p>Subscript for things like H<sub>2</sub>O.</p>
				<p>
					<small
						>This small text is small for for fine print, etc.</small
					>
				</p>
				<p>
					Abbreviation: <abbr title="HyperText Markup Language"
						>HTML</abbr
					>
				</p>
				<p>
					<q
						cite="https://developer.mozilla.org/en-US/docs/HTML/Element/q"
						>This text is a short inline quotation.</q
					>
				</p>
				<p><cite>This is a citation.</cite></p>
				<p>The <dfn>dfn element</dfn> indicates a definition.</p>
				<p>The <mark>mark element</mark> indicates a highlight.</p>
				<p>
					The <var>variable element</var>, such as <var>x</var> =
					<var>y</var>.
				</p>
				<p>
					The time element: <time datetime="2013-04-06T12:32+00:00"
						>2 weeks ago</time
					>
				</p>
			</div>
			<footer><p><a href="#top">[Top]</a></p></footer>
		</article>
		<article id="text__comments">
			<header><h1>HTML Comments</h1></header>
			<div>
				<p>
					There is comment here: <!--This comment should not be displayed-->
				</p>
				<p>
					There is a comment spanning multiple tags and lines below
					here.
				</p>
				<!--<p><a href="#!">This is a text link. But it should not be displayed in a comment</a>.</p>
            <p><strong>Strong is used to indicate strong importance. But, it should not be displayed in a comment</strong></p>
            <p><em>This text has added emphasis. But, it should not be displayed in a comment</em></p>-->
			</div>
			<footer><p><a href="#top">[Top]</a></p></footer>
		</article>
	</section>
	<section id="embedded">
		<header><h1>Embedded content</h1></header>
		<article id="embedded__images">
			<header><h2>Images</h2></header>
			<div>
				<h3>No <code>&lt;figure&gt;</code> element</h3>
				<p>
					<img
						src="https://http.cat/418"
						class="small"
						alt="cat in a teapot"
					/>
				</p>
				<h3>
					Wrapped in a <code>&lt;figure&gt;</code> element, no
					<code>&lt;figcaption&gt;</code>
				</h3>
				<figure>
					<img
						src="https://http.cat/418"
						class="small"
						alt="cat in a teapot"
					/>
				</figure>
				<h3>
					Wrapped in a <code>&lt;figure&gt;</code> element, with a
					<code>&lt;figcaption&gt;</code>
				</h3>
				<figure>
					<img
						src="https://http.cat/418"
						class="small"
						alt="cat in a teapot"
					/>
					<figcaption>Here is a caption for this image.</figcaption>
				</figure>

				<h3>Figure with table</h3>
				<figure>
					<table>
						<thead>
							<tr>
								<th>Table Heading 1</th>
								<th>Table Heading 2</th>
								<th>Table Heading 3</th>
								<th>Table Heading 4</th>
								<th>Table Heading 5</th>
								<th>Table Heading 6</th>
								<th>Table Heading 7</th>
								<th>Table Heading 8</th>
								<th>Table Heading 9</th>
								<th>Table Heading 10</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Table Cell 1</td>
								<td>Table Cell 2</td>
								<td>Table Cell 3</td>
								<td>Table Cell 4</td>
								<td>Table Cell 5</td>
								<td>Table Cell 6</td>
								<td>Table Cell 7</td>
								<td>Table Cell 8</td>
								<td>Table Cell 9</td>
								<td>Table Cell 10</td>
							</tr>
						</tbody>
					</table>
				</figure>
			</div>
			<footer><p><a href="#top">[Top]</a></p></footer>
		</article>
		<article id="embedded__audio">
			<header><h2>Audio</h2></header>
			<div><audio controls>audio</audio></div>
			<footer><p><a href="#top">[Top]</a></p></footer>
		</article>
		<article id="embedded__video">
			<header><h2>Video</h2></header>
			<!-- svelte-ignore a11y_media_has_caption -->
			<div><video controls>video</video></div>
			<footer><p><a href="#top">[Top]</a></p></footer>
		</article>
		<article id="embedded__canvas">
			<header><h2>Canvas</h2></header>
			<div><canvas>canvas</canvas></div>
			<footer><p><a href="#top">[Top]</a></p></footer>
		</article>
		<article id="embedded__meter">
			<header><h2>Meter</h2></header>
			<div><meter value="2" min="0" max="10">2 out of 10</meter></div>
			<footer><p><a href="#top">[Top]</a></p></footer>
		</article>
		<article id="embedded__progress">
			<header><h2>Progress</h2></header>
			<div><progress>progress</progress></div>
			<footer><p><a href="#top">[Top]</a></p></footer>
		</article>
		<article id="embedded__svg">
			<header><h2>Inline SVG</h2></header>
			<div>
				<svg width="100px" height="100px"
					><circle cx="100" cy="100" r="100" fill="#1fa3ec" /></svg
				>
			</div>
			<footer><p><a href="#top">[Top]</a></p></footer>
		</article>
		<article id="embedded__iframe">
			<header><h2>IFrame</h2></header>
			<div><iframe src="/" title="iframe" height="300"></iframe></div>
			<footer><p><a href="#top">[Top]</a></p></footer>
		</article>
	</section>

	<section id="forms">
		<header><h1>Form elements</h1></header>
		<form>
			<fieldset id="forms__input">
				<legend>Input fields</legend>

				<p>
					<label>
						Text Input
						<input type="text" placeholder="Text Input" />
					</label>
				</p>
				<p>
					<label>
						Password

						<input
							type="password"
							placeholder="Type your Password"
						/>
					</label>
				</p>
				<p>
					<label>
						Web Address
						<input type="url" placeholder="http://yoursite.com" />
					</label>
				</p>
				<p>
					<label>
						Email Address
						<input type="email" placeholder="name@email.com" />
					</label>
				</p>
				<p>
					<label>
						Phone Number
						<input type="tel" placeholder="(999) 999-9999" />
					</label>
				</p>
				<p>
					<label>
						Search
						<input type="search" placeholder="Enter Search Term" />
					</label>
				</p>
				<p>
					<label>
						Number Input
						<input type="number" placeholder="Enter a Number" />
					</label>
				</p>
				<p>
					<label class="error">
						Error
						<input
							class="is-error"
							type="text"
							placeholder="Text Input"
						/>
					</label>
				</p>
				<p>
					<label class="valid">
						Valid
						<input
							class="is-valid"
							type="text"
							placeholder="Text Input"
						/>
					</label>
				</p>
			</fieldset>

			<p><a href="#top">[Top]</a></p>
			<fieldset id="forms__select">
				<legend>Select menus</legend>

				<label>
					Select
					<select>
						<optgroup label="Option Group">
							<option>Option One</option>
							<option>Option Two</option>
							<option>Option Three</option>
						</optgroup>
					</select>
				</label>
			</fieldset>

			<p><a href="#top">[Top]</a></p>

			<fieldset id="forms__checkbox">
				<legend>Checkboxes</legend>

				<label>
					Choice A
					<input name="checkbox" type="checkbox" checked />
				</label>
				<label>
					Choice B
					<input name="checkbox" type="checkbox" />
				</label>
				<label>
					Choice C
					<input name="checkbox" type="checkbox" />
				</label>
			</fieldset>
			<p><a href="#top">[Top]</a></p>

			<fieldset id="forms__radio">
				<legend>Radio buttons</legend>

				<label>
					Option 1
					<input name="radio" type="radio" class="radio" checked />
				</label>
				<label>
					Option 2
					<input name="radio" type="radio" class="radio" />
				</label>
				<label>
					Option 3
					<input name="radio" type="radio" class="radio" />
				</label>
			</fieldset>
			<p><a href="#top">[Top]</a></p>

			<fieldset id="forms__textareas">
				<legend>Textareas</legend>
				<p>
					<label>
						Textarea
						<textarea
							rows="8"
							cols="48"
							placeholder="Enter your message here"></textarea>
					</label>
				</p>
			</fieldset>
			<p><a href="#top">[Top]</a></p>

			<fieldset id="forms__html5">
				<legend>HTML5 inputs</legend>

				<label>
					Color input
					<input type="color" value="#000000" />
				</label>

				<label>
					Number input
					<input type="number" min="0" max="10" value="5" />
				</label>

				<label>
					Range input
					<input type="range" value="10" />
				</label>

				<label>
					Date input<input type="date" value="1970-01-01" />
				</label>

				<label>
					Month input
					<input type="month" value="1970-01" />
				</label>

				<label>
					Week input<input type="week" value="1970-W01" />
				</label>

				<label>
					Datetime input
					<input type="datetime" value="1970-01-01T00:00:00Z" />
				</label>

				<label>
					Datetime-local input
					<input type="datetime-local" value="1970-01-01T00:00" />
				</label>
			</fieldset>
			<p><a href="#top">[Top]</a></p>

			<fieldset id="forms__action">
				<legend>Action buttons</legend>

				<p>
					<button type="submit">&lt;button type=submit&gt;</button>
					<button type="button">&lt;button type=button&gt;</button>
					<button type="reset">&lt;button type=reset&gt;</button>
					<button type="button" disabled>
						&lt;button disabled&gt;
					</button>
				</p>
			</fieldset>
			<p><a href="#top">[Top]</a></p>
		</form>
	</section>
</main>

<footer>
	<p>
		Based on
		<a href="http://github.com/cbracco/html5-test-page">HTML 5 test page</a>
		by <a href="http://twitter.com/cbracco">@cbracco</a>
	</p>

	<p>
		<a href="https://github.com/ghostdevv/ghostsui">ghostsui</a> by
		<a href="https://twiiter.com">GHOST</a>
	</p>
</footer>

<style>
	img.small {
		width: 400px;
		height: auto;
	}
</style>
