# libreoffice-file-converter

Simple NodeJS wrapper for libreoffice CLI for converting office documents to different formats.

## Dependency

Please install libreoffice in /Applications (Mac), with your favorite package manager (Linux), or with the msi (Windows).

## How to use

### Constructor

`LibreOfficeFileConverter` constructor accepts optional configuration object.

#### `options.binaryPaths`

Array of paths to LibreOffice binary executables.

#### `options.childProcessOptions`

`child_process.ExecFileOptions` object. Can be used to configure such things as timeout, etc.

#### `options.debug`

Enables debug output for LibreOffice command execution.

#### `options.tmpOptions`

`tmp.DirOptions` object. Can be used to configure behavior of `tmp` package, which is used to create temporary folders for LibreOffice data.

### `LibreOfficeFileConverter.convertBuffer`

Converts the provided file Buffer to the requested format.

```typescript
import { readFile } from 'fs/promises';
import { join } from 'path';
import { LibreOfficeFileConverter } from 'libreoffice-file-converter';

const inputPath = join(__dirname, './resources/example.doc');
const outputPath = join(__dirname, './resources/result.pdf');

const run = async () => {
  const libreOfficeFileConverter = new LibreOfficeFileConverter({
    childProcessOptions: {
      timeout: 60 * 1000,
    },
  });

  const buffer = await readFile(inputPath);

  const result = await libreOfficeFileConverter.convertBuffer(buffer, 'pdf');
};

run();
```

### `LibreOfficeFileConverter.convertFile`

Converts the provided file to the requested format.

```typescript
import { join } from 'path';
import { LibreOfficeFileConverter } from 'libreoffice-file-converter';

const inputPath = join(__dirname, './resources/example.doc');
const outputDir = join(__dirname, './resources');

const run = async () => {
  const libreOfficeFileConverter = new LibreOfficeFileConverter({
    childProcessOptions: {
      timeout: 60 * 1000,
    },
  });

  await libreOfficeFileConverter.convertFile(inputPath, outputDir, 'pdf'); // output path is `./resources/example.pdf`
};

run();
```

### `LibreOfficeFileConverter.convertStream`

Converts the provided readable stream to the requested format.

```typescript
import { createReadStream } from 'fs';
import { join } from 'path';
import { LibreOfficeFileConverter } from 'libreoffice-file-converter';

const inputPath = join(__dirname, './resources/example.doc');

const run = async () => {
  const libreOfficeFileConverter = new LibreOfficeFileConverter({
    childProcessOptions: {
      timeout: 60 * 1000,
    },
  });

  const inputStream = createReadStream(inputPath);

  const outputStream = await libreOfficeFileConverter.convertStream(inputStream, 'pdf');
};

run();
```
