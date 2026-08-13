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

async function ensureDir(dir: string) {
	const exists = existsSync(dir);
	if (!exists) await mkdir(dir, { recursive: true });
}

interface Options {
	'out-dir': string;
}

function fmtPath(path: string) {
	const home = homedir();
	return path.startsWith(home) ? `~${path.slice(home.length)}` : path;
}

interface File {
	name: string;
	path: string;
}

async function readFiles(input: string): Promise<File[]> {
	if (!existsSync(input)) return [];
	const info = await stat(input);

	if (info.isFile()) {
		return [{ name: basename(input), path: input }];
	}

	return (await readdir(input, { withFileTypes: true, recursive: true }))
		.filter((file) => file.isFile() && extname(file.name) === '.md')
		.map((file) => ({
			name: file.name,
			path: join(file.parentPath, file.name),
		}));
}

export async function build(inputRaw = 'src', options: Options) {
	intro(
		`${styleText('blue', `@ghostsui${styleText('dim', '/')}${styleText('bold', 'shark')}`)} ${styleText('magenta', 'build')}`,
	);

	const dest = resolve(options['out-dir']);
	const input = resolve(inputRaw);
	const cwd = process.cwd();

	if (!existsSync(input)) {
		log.error(`Input file/directory ${input} does not exist`);
		process.exit(1);
	}

	const inputDir = (await stat(input)).isFile() ? dirname(input) : input;
	log.info(`Input:  ${fmtPath(input)}\nOutput: ${fmtPath(dest)}`);

	let s = spinner();
	s.start('Finding files');

	const files = await readFiles(input);

	if (!files.length) {
		s.error('No markdown files found :((');
		process.exit(1);
	}

	s.stop(`Found ${files.length} markdown files!`);

	s = spinner();
	s.start('Rendering markdown');

	for (const file of files) {
		s.message(`Rendering ${file.name}`);
		const contents = await readFile(file.path, 'utf-8');
		const html = await render(contents);

		const path = join(
			dest,
			relative(inputDir, file.path).slice(0, -2) + 'html',
		);

		await ensureDir(dirname(path));
		await writeFile(path, html, 'utf-8');
	}

	s.stop(`Rendered ${files.length} markdown to ${relative(cwd, dest)}`);

	s = spinner();
	s.start('Creating ghostsui.css');

	const css = await readFile(
		fileURLToPath(import.meta.resolve('ghostsui')),
		'utf-8',
	);

	await writeFile(join(dest, 'ghostsui.css'), css, 'utf-8');

	s.stop('Created ghostsui.css');

	outro('Done!');
}
