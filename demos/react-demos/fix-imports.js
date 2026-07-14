import fs from 'fs';
import path from 'path';

const searchDir = process.argv[2] || '.';

const formComponents = new Set([
  'Checkbox',
  'Radio',
  'Select',
  'SelectButton',
  'SelectItem',
  'SelectMenu',
  'SelectOption',
  'SelectTrigger',
  'Switch',
  'TextField',
  'Textarea',
  'Form',
  'FormField',
  'FormReset',
  'FormSubmit',
]);

function walkDir(dir) {
  let files = [];
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(walkDir(fullPath));
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = walkDir(searchDir);

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Find import { ... } from '@airlib/react-ui/components';
  const importRegex = /import\s+{([^}]+)}\s+from\s+['"]@airlib\/react-ui\/components['"];?/g;
  let match;
  let hasChanges = false;

  while ((match = importRegex.exec(content)) !== null) {
    const imports = match[1]
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const formImports = [];
    const uiImports = [];

    for (const imp of imports) {
      if (formComponents.has(imp)) {
        formImports.push(imp);
      } else {
        uiImports.push(imp);
      }
    }

    if (formImports.length > 0) {
      hasChanges = true;
      let newImportString = '';
      if (uiImports.length > 0) {
        newImportString += `import { ${uiImports.join(', ')} } from '@airlib/react-ui/components';\n`;
      }
      newImportString += `import { ${formImports.join(', ')} } from '@airlib/react-ui/form';`;

      content = content.replace(match[0], newImportString);
    }
  }

  if (hasChanges) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
