import { copyFileSync, existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const output = fileURLToPath(new URL('../out/', import.meta.url));
let aliases = 0;

// Windows export emits segment payloads inside __next.* directories, while the
// router requests their dotted filenames. Keep originals and add delivery aliases
// in build output only; the same static archive then works locally and on Sites.
function flattenPayloads(directory, destination, prefix) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const source = path.join(directory, entry.name);
    const name = `${prefix}.${entry.name}`;
    if (entry.isDirectory()) {
      flattenPayloads(source, destination, name);
    } else if (entry.isFile() && entry.name.endsWith('.txt')) {
      const target = path.join(destination, name);
      if (existsSync(target)) {
        if (!readFileSync(target).equals(readFileSync(source))) throw new Error(`Conflicting static payload: ${name}`);
      } else {
        copyFileSync(source, target);
        aliases += 1;
      }
    }
  }
}

function visit(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === '_next') continue;
    const source = path.join(directory, entry.name);
    if (entry.name.startsWith('__next.')) flattenPayloads(source, directory, entry.name);
    else visit(source);
  }
}

visit(output);
console.log(`Static export ready; ${aliases} segment payload aliases added.`);
