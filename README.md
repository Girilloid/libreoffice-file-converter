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

### `LibreOfficeFileConverter.convert`

Converts provided file, Buffer or `Readable` stream to the request format.

From Buffer to Buffer.

```ts
import { readFile } from 'fs/promises';
import { join } from 'path';
import { LibreOfficeFileConverter } from 'libreoffice-file-converter';

const inputPath = join(__dirname, './resources/example.doc');

const run = async () => {
  const libreOfficeFileConverter = new LibreOfficeFileConverter({
    childProcessOptions: {
      timeout: 60 * 1000,
    },
  });

  const inputBuffer = await readFile(inputPath);

  const outputBuffer = await libreOfficeFileConverter.convert({
    buffer: inputBuffer,
    format: 'pdf',
    input: 'buffer',
    output: 'buffer'
  })
};

run();
```

From Buffer to file.

```ts
import { readFile } from 'fs/promises';
import { join } from 'path';
import { LibreOfficeFileConverter } from 'libreoffice-file-converter';

const inputPath = join(__dirname, './resources/example.doc');
const outputPath = join(__dirname, './resources/output/result.pdf');

const run = async () => {
  const libreOfficeFileConverter = new LibreOfficeFileConverter({
    childProcessOptions: {
      timeout: 60 * 1000,
    },
  });

  const inputBuffer = await readFile(inputPath);

  await libreOfficeFileConverter.convert({
    buffer: inputBuffer,
    format: 'pdf',
    input: 'buffer',
    output: 'fille',
    outputPath,
  })
};

run();
```

From Buffer to `Readable` stream.

```ts
import { readFile } from 'fs/promises';
import { join } from 'path';
import { LibreOfficeFileConverter } from 'libreoffice-file-converter';

const inputPath = join(__dirname, './resources/example.doc');

const run = async () => {
  const libreOfficeFileConverter = new LibreOfficeFileConverter({
    childProcessOptions: {
      timeout: 60 * 1000,
    },
  });

  const inputBuffer = await readFile(inputPath);

  const outputStream = await libreOfficeFileConverter.convert({
    buffer: inputBuffer,
    format: 'pdf',
    input: 'buffer',
    output: 'stream',
  })
};

run();
```

From file to Buffer.

```ts
import { readFile } from 'fs/promises';
import { join } from 'path';
import { LibreOfficeFileConverter } from 'libreoffice-file-converter';

const inputPath = join(__dirname, './resources/example.doc');

const run = async () => {
  const libreOfficeFileConverter = new LibreOfficeFileConverter({
    childProcessOptions: {
      timeout: 60 * 1000,
    },
  });

  const outputBuffer = await libreOfficeFileConverter.convert({
    format: 'pdf',
    input: 'file',
    inputPath,
    output: 'buffer',
  })
};

run();
```

From file to file.

```ts
import { readFile } from 'fs/promises';
import { join } from 'path';
import { LibreOfficeFileConverter } from 'libreoffice-file-converter';

const inputPath = join(__dirname, './resources/example.doc');
const outputPath = join(__dirname, './resources/output/result.pdf');

const run = async () => {
  const libreOfficeFileConverter = new LibreOfficeFileConverter({
    childProcessOptions: {
      timeout: 60 * 1000,
    },
  });

  await libreOfficeFileConverter.convert({
    format: 'pdf',
    input: 'file',
    inputPath,
    output: 'file',
    outputPath,
  })
};

run();
```

From file to `Readable` stream.

```ts
import { readFile } from 'fs/promises';
import { join } from 'path';
import { LibreOfficeFileConverter } from 'libreoffice-file-converter';

const inputPath = join(__dirname, './resources/example.doc');

const run = async () => {
  const libreOfficeFileConverter = new LibreOfficeFileConverter({
    childProcessOptions: {
      timeout: 60 * 1000,
    },
  });

  const outputStream = await libreOfficeFileConverter.convert({
    format: 'pdf',
    input: 'file',
    inputPath,
    output: 'stream',
  })
};

run();
```

From `Readable` stream to buffer.

```ts
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

  const outputBuffer = await libreOfficeFileConverter.convert({
    format: 'pdf',
    input: 'stream',
    output: 'buffer',
    stream: inputStream,
  })
};

run();
```

From `Readable` stream to file.

```ts
import { createReadStream } from 'fs';
import { join } from 'path';
import { LibreOfficeFileConverter } from 'libreoffice-file-converter';

const inputPath = join(__dirname, './resources/example.doc');
const outputPath = join(__dirname, './resources/output/result.pdf');

const run = async () => {
  const libreOfficeFileConverter = new LibreOfficeFileConverter({
    childProcessOptions: {
      timeout: 60 * 1000,
    },
  });

  const inputStream = createReadStream(inputPath);

  await libreOfficeFileConverter.convert({
    format: 'pdf',
    input: 'stream',
    output: 'file',
    outputPath,
    stream: inputStream,
  })
};

run();
```

From `Readable` stream to `Readable` stream.

```ts
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

  const outputStream = await libreOfficeFileConverter.convert({
    format: 'pdf',
    input: 'stream',
    output: 'stream',
    stream: inputStream,
  })
};

run();
```
