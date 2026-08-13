import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { intro, outro, spinner } from '@clack/prompts';
import expressiveCode from 'satteri-expressive-code';
import { serendipity } from './serendipity';
import { markdownToHtml } from 'satteri';
import { fileURLToPath } from 'node:url';
import { styleText } from 'node:util';
import { existsSync } from 'node:fs';
import { cwd } from 'node:process';
import dedent from 'dedent';

const ENTRY_DIR = resolve('src');
const DIST_DIR = resolve('dist');

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

export async function build() {
	intro(
		`${styleText('blue', `@ghostsui${styleText('dim', '/')}${styleText('bold', 'shark')}`)} ${styleText('magenta', 'build')}`,
	);

	let s = spinner();
	s.start('Finding files');

	// prettier-ignore
	const files = (await readdir(ENTRY_DIR, { withFileTypes: true, recursive: true }))
		.filter((file) => file.isFile() && extname(file.name) === '.md')
		.map((file) => ({
			name: file.name,
			path: join(file.parentPath, file.name),
		}));

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

		const dest = join(DIST_DIR, relative(ENTRY_DIR, file.path));
		await ensureDir(dirname(dest));
		await writeFile(dest.replace(/\.md$/, '.html'), html, 'utf-8');
	}

	s.stop(`Rendered ${files.length} markdown to ${relative(cwd(), DIST_DIR)}`);

	s = spinner();
	s.start('Creating ghostsui.css');

	const css = await readFile(
		fileURLToPath(import.meta.resolve('ghostsui')),
		'utf-8',
	);

	await writeFile(join(DIST_DIR, 'ghostsui.css'), css, 'utf-8');

	s.stop('Created ghostsui.css');

	outro('Done!');
}
