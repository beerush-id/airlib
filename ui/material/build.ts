import { $ } from 'bun';
import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

async function getFiles(dir: string): Promise<string[]> {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = join(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    })
  );
  return Array.prototype.concat(...files);
}

const files = await getFiles('./src');
const cssFiles = files.filter((f) => f.endsWith('.css'));

let safelist = '<div class="';
for (const file of cssFiles) {
  const content = await readFile(file, 'utf-8');
  // Match @utility name
  const matches = content.matchAll(/@utility\s+([a-zA-Z0-9_-]+)/g);
  for (const match of matches) {
    safelist += match[1] + ' ';
  }
}
safelist += '"></div>';

await writeFile('safelist.html', safelist);
console.log('Generated safelist.html with all utilities.');

// Run the build
await $`bunx @tailwindcss/cli -i ./bundle.css -o ./dist/index.css --minify`;
console.log('Build complete.');
