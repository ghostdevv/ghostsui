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
	let changedFiles = new Set<string>(files);
	let rendering = false;
	let scheduled = false;

	async function run() {
		if (rendering) {
			scheduled = true;
			return;
		}
		rendering = true;
		const toEmit = changedFiles;
		changedFiles = new Set();
		try {
			await callback(toEmit);
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
		const sizeBefore = changedFiles.size;

		switch (event) {
			case 'add':
			case 'addDir':
				for (const file of await readFiles(path)) {
					if (!files.has(file)) {
						files.add(file);
						changedFiles.add(file);
					}
				}
				break;
			case 'unlink':
				if (files.has(path)) {
					files.delete(path);
					changedFiles.add(path);
				}
				break;
			case 'unlinkDir': {
				const prefix = path.endsWith('/') ? path : path + '/';
				for (const file of files) {
					if (file === path || file.startsWith(prefix)) {
						files.delete(file);
						changedFiles.add(file);
					}
				}
				break;
			}
			case 'change':
				if (files.has(path)) changedFiles.add(path);
				break;
		}

		if (changedFiles.size === sizeBefore) return;
		clearTimeout(debounceTimer);
		// todo throttled
		debounceTimer = setTimeout(() => run(), 300);
	});
}
