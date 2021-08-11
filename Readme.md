# libreoffice-file-converter

Simple NodeJS wrapper for libreoffice CLI for converting office documents to differrent formats.

## Dependency

Please install libreoffice in /Applications (Mac), with your favorite package manager (Linux), or with the msi (Windows).

## Usage example

```typescript
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { LibreOfficeFileConverter } from 'libreoffice-file-converter';

const inputPath = join(__dirname, './resources/example.doc');
const outputPath = join(__dirname, './resources/result.pdf');

const convertFile = async () => {
  const libreOfficeFileConverter = new LibreOfficeFileConverter({
    childProcessOptions: {
      timeout: 60 * 1000,
    },
  });

  const buffer = await readFile(inputPath);

  const result = await libreOfficeFileConverter.convert(buffer, 'pdf');

  await writeFile(outputPath, result);
};

convertFile();
```
