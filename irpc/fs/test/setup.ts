import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { anchor } from '@anchorlib/core';
import { beforeEach } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env');

if (existsSync(envPath)) {
  const content = readFileSync(envPath, 'utf-8');
  content.split('\n').forEach((line) => {
    const match = line.trim().match(/^([^=]+)="?(.*?)"?$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2];
    }
  });
}

beforeEach(() => {
  anchor.configure({ globalScopeWarning: false });
});
