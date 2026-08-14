import { basename, dirname, join, relative, resolve } from 'node:path';
import { watchFiles, readFiles, ensureDir, fmtPath } from './fs';
import { readFile, stat, writeFile } from 'node:fs/promises';
import { log, outro, spinner } from '@clack/prompts';
import expressiveCode from 'satteri-expressive-code';
import { format as fmtBytes } from '@std/fmt/bytes';
import { serendipity } from './serendipity';
import { markdownToHtml } from 'satteri';
import { fileURLToPath } from 'node:url';
import { styleText } from 'node:util';
import { existsSync } from 'node:fs';
import dedent from 'dedent';

interface Options {
	'out-dir': string;
	watch: boolean;
	base: string;
}

const htmlWrap = (children: string, base: string) => dedent`
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="${base}${base.endsWith('/') ? '' : '/'}ghostsui.css">
        <title>wai</title>
        <style>
            h2 {
                margin: 16px 0px;
            }

            h3 {
                margin: 12px 0px;
            }

            .expressive-code {
                margin: 12px 0px;
            }
        </style>
    </head>
    <body>
        <main>
            ${children}
        </main>
    </body>
</html>`;

async function render(markdown: string, base: string) {
	const { html } = await markdownToHtml(markdown, {
		hastPlugins: [
			expressiveCode({
				themes: [serendipity],
				defaultProps: {
					overridesByLang: { 'bash,sh': { frame: 'code' } },
				},
				useThemedScrollbars: false,
				useStyleReset: true,
				styleOverrides: {
					uiFontFamily: 'var(--font-family)',
					codeFontSize: 'var(--post-font-size)',
					codeFontFamily: "'Comic Mono', monospace",
					codeBackground: 'var(--background-secondary)',
					borderColor: 'transparent',
					borderWidth: '0px',
					frames: {
						frameBoxShadowCssValue: 'none',
						// code frame + title
						editorTabBarBackground: 'transparent',
						editorActiveTabBackground:
							'var(--background-secondary)',
						editorActiveTabBorderColor: 'transparent',
						editorActiveTabIndicatorTopColor:
							'var(--background-secondary)',
						editorActiveTabIndicatorBottomColor: 'var(--primary)',
						editorActiveTabIndicatorHeight: '1px',
						// Copy Button
						tooltipSuccessBackground: 'var(--green)',
						inlineButtonBackground: 'var(--background-tertiary)',
						inlineButtonBackgroundHoverOrFocusOpacity: '1',
						inlineButtonBackgroundActiveOpacity: '1',
					},
				},
			}),
		],
	});

	return htmlWrap(html, base);
}

async function renderFiles(
	files: Set<string>,
	dest: string,
	inputDir: string,
	base: string,
	logb: BuildLogger,
) {
	let first = true;

	for (const file of files.values()) {
		logb.lap();
		const contents = await readFile(file, 'utf-8');
		const html = await render(contents, base);

		const path = join(dest, relative(inputDir, file).slice(0, -2) + 'html');
		await ensureDir(dirname(path));
		await writeFile(path, html, 'utf-8');
		await logb.push(path, first);
		first = false;
	}
}

class BuildLogger {
	private ts = performance.now();
	private first = true;

	constructor(private readonly spacing: number) {}

	lap() {
		this.ts = performance.now();
	}

	async push(path: string, plus = false) {
		let prefix = plus
			? styleText(['dim', 'green'], '+ ')
			: styleText('gray', '│ ');

		if (this.first) {
			prefix = `${styleText('gray', '│ ')}\n${prefix}`;
			this.first = false;
		}

		console.log(prefix, await this.render(path));
	}

	private async render(path: string) {
		const colour = path.endsWith('.css') ? 'magenta' : 'yellow';
		const { size } = await stat(path);
		const name = basename(path);
		const spacing = Math.max(this.spacing + 1 - name.length, 1);

		return (
			styleText(['dim', colour], name) +
			' '.repeat(spacing) +
			fmtBytes(size) +
			` [${Math.round(performance.now() - this.ts)}ms]`
		);
	}
}

async function renderCSS(dest: string, logb: BuildLogger) {
	const path = join(dest, 'ghostsui.css');
	const css = fileURLToPath(import.meta.resolve('ghostsui'));
	await writeFile(path, await readFile(css, 'utf-8'), 'utf-8');
	await logb.push(path);
}

export async function build(inputRaw = 'src', options: Options) {
	const dest = resolve(options['out-dir']);
	await ensureDir(dest);

	const input = resolve(inputRaw);

	if (!existsSync(input)) {
		log.error(`Input file/directory ${input} does not exist`);
		process.exit(1);
	}

	const inputDir = (await stat(input)).isFile() ? dirname(input) : input;

	log.message(
		`Input:  ${styleText('dim', fmtPath(input))}\nOutput: ${styleText('dim', fmtPath(dest))}`,
		{ symbol: styleText(['dim', 'cyan'], '~') },
	);

	const s = spinner({ indicator: 'timer' });
	s.start('Discovering files...');

	const files = await readFiles(input);

	if (!files.size && !options.watch) {
		s.error('No markdown files found :((');
		process.exit(1);
	}

	s.stop(`Found ${styleText(['dim', 'cyan'], files.size.toString())} files`);
	if (options.watch) log.info('Watching files for changes...');

	const spacing = files
		.values()
		.map((f) => basename(f).replace(/\.md$/, '.html'))
		.toArray()
		.sort((a, b) => b.length - a.length)[0].length;

	const logb = new BuildLogger(Math.max(spacing, 12));

	if (options.watch) {
		await watchFiles(input, async (files) => {
			await renderFiles(files, dest, inputDir, options.base, logb);
		});
		renderCSS(dest, logb);
	} else {
		await renderFiles(files, dest, inputDir, options.base, logb);
		await renderCSS(dest, logb);
		outro('(ﾉ◕ヮ◕)ﾉ*:・ﾟ✧ Built!');
	}
}
