import { stat, readdir, mkdir } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import chokidar from 'chokidar';

export async function ensureDir(dir: string) {
	const exists = existsSync(dir);
	if (!exists) await mkdir(dir, { recursive: true });
}

export function fmtPath(path: string) {
	const home = homedir();
	return path.startsWith(home) ? `~${path.slice(home.length)}` : path;
}

export async function readFiles(input: string): Promise<Set<string>> {
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

export async function watchFiles(
	input: string,
	callback: (files: Set<string>) => Promise<void> | void,
) {
	const files = await readFiles(input);
	let rendering = false;
	let scheduled = false;

	async function run() {
		if (rendering) {
			scheduled = true;
			return;
		}
		rendering = true;
		try {
			await callback(files);
		} finally {
			rendering = false;
			if (scheduled) {
				scheduled = false;
				await run();
			}
		}
	}

	// initial run
	await run();

	let debounceTimer: ReturnType<typeof setTimeout>;
	const watcher = chokidar.watch(input, { ignoreInitial: true });

	watcher.on('all', async (event, path) => {
		let changed = false;

		switch (event) {
			case 'add':
			case 'addDir':
				for (const file of await readFiles(path)) {
					if (!files.has(file)) {
						changed = true;
						files.add(file);
					}
				}
				break;

			case 'unlink':
				if (files.has(path)) {
					changed = true;
					files.delete(path);
				}
				break;

			case 'unlinkDir': {
				const toRemove = [];
				for (const file of files) {
					if (file.startsWith(path)) {
						toRemove.push(file);
					}
				}
				if (toRemove.length) {
					changed = true;
					for (const f of toRemove) files.delete(f);
				}
				break;
			}

			case 'change':
				// file content changed – set changed to trigger render if file is tracked
				if (files.has(path)) changed = true;
				break;
		}

		if (!changed) return;
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => run(), 300);
	});
}
