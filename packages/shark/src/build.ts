import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';
import { intro, log, outro, spinner } from '@clack/prompts';
import expressiveCode from 'satteri-expressive-code';
import { serendipity } from './serendipity';
import { markdownToHtml } from 'satteri';
import { fileURLToPath } from 'node:url';
import { styleText } from 'node:util';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import chokidar from 'chokidar';
import dedent from 'dedent';

const htmlWrap = (children: string) => dedent`
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="$/ghostsui.css">
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

async function render(markdown: string) {
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

	return htmlWrap(html);
}

async function renderFiles(
	files: Set<string>,
	dest: string,
	inputDir: string,
	signal?: AbortSignal,
) {
	const s = spinner();
	s.start('Rendering markdown');

	for (const file of files.values()) {
		if (signal?.aborted) {
			s.stop('Cancelled');
			return;
		}

		s.message(`Rendering ${basename(file)}`);
		const contents = await readFile(file, 'utf-8');
		const html = await render(contents);

		const path = join(dest, relative(inputDir, file).slice(0, -2) + 'html');
		await ensureDir(dirname(path));
		await writeFile(path, html, 'utf-8');
	}

	s.stop(
		`Rendered ${files.size} markdown to ${relative(process.cwd(), dest)}`,
	);
}

async function ensureDir(dir: string) {
	const exists = existsSync(dir);
	if (!exists) await mkdir(dir, { recursive: true });
}

interface Options {
	'out-dir': string;
	watch: boolean;
}

function fmtPath(path: string) {
	const home = homedir();
	return path.startsWith(home) ? `~${path.slice(home.length)}` : path;
}

async function readFiles(input: string): Promise<Set<string>> {
	if (!existsSync(input)) return new Set();
	const info = await stat(input);

	if (info.isFile()) {
		// todo check is markdown
		return new Set([input]);
	}

	return new Set(
		(await readdir(input, { withFileTypes: true, recursive: true }))
			.filter((file) => file.isFile() && extname(file.name) === '.md')
			.map((file) => join(file.parentPath, file.name)),
	);
}

export async function build(inputRaw = 'src', options: Options) {
	intro(
		`${styleText('blue', `@ghostsui${styleText('dim', '/')}${styleText('bold', 'shark')}`)} ${styleText('magenta', 'build')}`,
	);

	const dest = resolve(options['out-dir']);
	await ensureDir(dest);

	const input = resolve(inputRaw);

	if (!existsSync(input)) {
		log.error(`Input file/directory ${input} does not exist`);
		process.exit(1);
	}

	const inputDir = (await stat(input)).isFile() ? dirname(input) : input;
	log.info(`Input:  ${fmtPath(input)}\nOutput: ${fmtPath(dest)}`);

	let s = spinner();
	s.start('Creating ghostsui.css');

	const css = await readFile(
		fileURLToPath(import.meta.resolve('ghostsui')),
		'utf-8',
	);

	await writeFile(join(dest, 'ghostsui.css'), css, 'utf-8');

	s.stop('Created ghostsui.css');

	s = spinner();
	s.start('Finding files');

	const files = await readFiles(input);

	if (!files.size && !options.watch) {
		s.error('No markdown files found :((');
		process.exit(1);
	}

	s.stop(`Found ${files.size} markdown files!`);

	if (options.watch) {
		let controller = new AbortController();
		let rendering = false;
		let scheduled = false;

		async function render() {
			if (rendering) {
				scheduled = true;
				return;
			}
			rendering = true;
			try {
				await renderFiles(files, dest, inputDir, controller.signal);
			} catch {
				// aborted or cancelled — ignore
			} finally {
				rendering = false;
				if (scheduled) {
					scheduled = false;
					await render();
				}
			}
		}

		let debounceTimer: ReturnType<typeof setTimeout>;
		chokidar.watch(input).on('all', async (event, path) => {
			let changed = false;

			switch (event) {
				case 'add':
				case 'addDir':
					for (const file of await readFiles(path)) {
						if (files.has(file)) continue;
						changed = true;
						files.add(file);
					}
					break;

				case 'unlink':
					for (const file of files) {
						if (file === path) {
							changed = true;
							files.delete(file);
						}
					}
					break;

				case 'unlinkDir':
					for (const file of files) {
						if (file.startsWith(path)) {
							changed = true;
							files.delete(file);
						}
					}
					break;

				case 'change':
					if (files.has(path)) {
						changed = true;
					}
					break;
			}

			if (changed) {
				clearTimeout(debounceTimer);
				debounceTimer = setTimeout(() => {
					controller.abort();
					controller = new AbortController();
					render();
				}, 300);
			}
		});

		await render();
	} else {
		await renderFiles(files, dest, inputDir);
		outro('Done!');
	}
}
