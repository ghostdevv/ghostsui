#!/usr/bin/env node
import { version } from '../package.json' with { type: 'json' };
import { build } from './build';
import sade from 'sade';

const cli = sade('shark').version(version);

cli.command('build [input]')
	.describe('Export markdown files as html')
	.option('-d, --out-dir <dir>', 'Output directory', 'dist')
	.option('--watch', 'Watch for changes', false)
	.action(build);

await (cli.parse(process.argv) as unknown as Promise<void>);
