import { basename, dirname, join, relative, resolve } from 'node:path';
import { watchFiles, readFiles, ensureDir, fmtPath } from './fs';
import { readFile, stat, writeFile } from 'node:fs/promises';
import { intro, log, outro, spinner } from '@clack/prompts';
import expressiveCode from 'satteri-expressive-code';
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
		const html = await render(contents, base);

		const path = join(dest, relative(inputDir, file).slice(0, -2) + 'html');
		await ensureDir(dirname(path));
		await writeFile(path, html, 'utf-8');
	}

	s.stop(
		`Rendered ${files.size} markdown to ${relative(process.cwd(), dest)}`,
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
		log.info('Watching files for changes...');

		await watchFiles(input, async (files) => {
			await renderFiles(files, dest, inputDir, options.base);
		});
	} else {
		await renderFiles(files, dest, inputDir, options.base);
		outro('Done!');
	}
}
