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

#### `options.installationDir`

User installation (profile) directory for LibreOffice.

- `default` - Uses the default user installation directory.
- `dynamic` - Creates a temporary user installation directory for each conversion process. Used by default.
- string - Specifies a custom path for the user installation directory.

#### `options.tmpOptions`

`tmp.DirOptions` object. Can be used to configure behavior of `tmp` package, which is used to create temporary folders for LibreOffice data.

### `LibreOfficeFileConverter.convert`

Converts provided file, `Buffer` or `Readable` stream to the request format.

#### `input`

Input type: `buffer` | `file` | `stream`.

Defines corresponding field for input: `buffer` | `inputPath` | `stream`.

#### `output`

Output type: `buffer` | `file` | `stream`.

Requires `outputPath` field to be present when set to `file`.

Defines return type: `Promise<Buffer>` | `Promise<void>` | `Promise<Readable>`.

#### `format`

Conversion format.

#### `inputFilter`

LibreOffice input filter, see [docs](https://help.libreoffice.org/latest/en-US/text/shared/guide/convertfilters.html).

#### `outputFilter`

LibreOffice output filter, see [docs](https://help.libreoffice.org/latest/en-US/text/shared/guide/convertfilters.html).

#### `filter`

LibreOffice output filter, see [docs](https://help.libreoffice.org/latest/en-US/text/shared/guide/convertfilters.html).

Deprecated, use `outputFilter` instead.

#### `options`

Overrides for LibreOfficeFileConverter instance options.

#### Examples

From `Buffer` to `Buffer`.

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

From `Buffer` to file.

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

From `Buffer` to `Readable` stream.

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

From file to `Buffer`.

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

From `Readable` stream to `Buffer`.

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

### `LibreOfficeFileConverter.init`

Initializes LibreOffice installation dir by starting executable in headless mode and then terminating it.

#### `installationDir`

Path for the user installation directory.

#### `options`

Overrides for LibreOfficeFileConverter instance options.

#### Examples

```ts
import { join } from 'path';
import { LibreOfficeFileConverter } from 'libreoffice-file-converter';

const installationDir = join(__dirname, './installation-dir');

const run = async () => {
  const libreOfficeFileConverter = new LibreOfficeFileConverter({
    childProcessOptions: {
      timeout: 60 * 1000,
    },
  });

  await libreOfficeFileConverter.init({ installationDir })
};

run();
```
