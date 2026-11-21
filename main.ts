// Kucing Senja is handed in as static browser files, plus the real screenshots the judge sees.
// Keep the output tree a direct copy so dossier.json describes the exact submitted game.
import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const root = fileURLToPath(new URL('.', import.meta.url));
const output = process.env.MAKEFUN_OUTPUT_DIR || '/output';

function copyEntryTree(name) {
  const source = join(root, name);
  const destination = join(output, name);
  if (existsSync(source)) cpSync(source, destination, { recursive: true });
}

mkdirSync(output, { recursive: true });
copyEntryTree('game');
mkdirSync(join(output, 'screenshots'), { recursive: true });
copyEntryTree('screenshots');

writeFileSync(
  join(output, 'dossier.json'),
  buildDossier(output, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
