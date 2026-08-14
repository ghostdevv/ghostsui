#!/usr/bin/env node
import { version } from '../package.json' with { type: 'json' };
import { build } from './build';
import sade from 'sade';
import { printIntro } from './logo';

const cli = sade('shark').version(version);

cli.command('build [input]')
	.describe('Export markdown files as html')
	.option('-d, --out-dir <dir>', 'Output directory', 'dist')
	.option('--watch', 'Watch for changes', false)
	.option('--base', 'Asset base path', '/')
	.action(build);

const command = cli.parse(process.argv, { lazy: true });

if (command) {
	printIntro(command.name);
	await command.handler(...command.args);
}
