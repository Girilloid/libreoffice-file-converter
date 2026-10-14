# libreoffice-file-converter

Simple NodeJS wrapper for libreoffice CLI for converting office documents to different formats.

## Dependency

Please install libreoffice in /Applications (Mac), with your favorite package manager (Linux), or with the msi (Windows).

## Installation

```bash
npm install libreoffice-file-converter
```

For Deno, from JSR:

```bash
deno add jsr:@girilloid/libreoffice-file-converter
```

## How to use

### Constructor

`LibreOfficeFileConverter` constructor accepts optional configuration object.

#### `options.binaryPaths`

Array of paths to LibreOffice binary executables.

Tried in order before the platform default paths.

#### `options.childProcessOptions`

`child_process.ExecFileOptions` object. Can be used to configure such things as timeout, etc.

#### `options.debug`

Prints each soffice call (path, args, execution time, stdout, stderr) to stdout.

#### `options.installationDir`

User installation (profile) directory for LibreOffice.

- `default` - Uses the default user installation directory.
- `dynamic` - Creates a temporary user installation directory for each conversion process and removes it after. Used by default.
- string - Specifies a custom path for the user installation directory.

#### `options.tmpOptions`

`tmp.DirOptions` object. Can be used to configure behavior of `tmp` package, which is used to create temporary folders for LibreOffice data.

Applies to both temporary directories: the conversion directory and, with `dynamic` installationDir, the profile directory.

### `LibreOfficeFileConverter.convert`

Converts provided file, `Buffer` or `Readable` stream to the requested format.

#### `input`

Input type: `buffer` | `file` | `stream`.

Defines corresponding field for input: `buffer` | `inputPath` | `stream`.

#### `output`

Output type: `buffer` | `file` | `stream`.

Requires `outputPath` field to be present when set to `file`.

When set to `stream`, temporary files are removed after the returned stream is closed (fully read or destroyed).

Defines return type: `Promise<Buffer>` | `Promise<void>` | `Promise<Readable>`.

#### `format`

Conversion format.

#### `convertImagesTo`

LibreOffice `--convert-images-to` value. Target filter for all images written to the output format, for example `jpg` when converting to `html`. See LibreOffice [docs](https://help.libreoffice.org/latest/en-US/text/shared/guide/start_parameters.html).

#### `inputFilter`

LibreOffice input filter, see [docs](https://help.libreoffice.org/latest/en-US/text/shared/guide/convertfilters.html).

Accepts filter options as is, for example `Text - txt - csv (StarCalc):44,34,76,1`.

#### `inputFilterOptions`

LibreOffice input filter options, the `--infilter` FilterParams segment, see [docs](https://help.libreoffice.org/latest/en-US/text/shared/guide/convertfilters.html). Requires `inputFilter`, for example `44,34,76,1` with `Text - txt - csv (StarCalc)`.

#### `outputFilter`

LibreOffice output filter, see [docs](https://help.libreoffice.org/latest/en-US/text/shared/guide/convertfilters.html).

#### `outputFilterOptions`

LibreOffice output filter options, the third `--convert-to` segment. Requires `outputFilter`. An object is JSON-stringified, a string is passed as is. For PDF/A-2b: `{ SelectPdfVersion: { type: 'long', value: '2' } }`. See LibreOffice [docs](https://help.libreoffice.org/latest/en-US/text/shared/guide/pdf_params.html).

#### `filter`

LibreOffice output filter, see [docs](https://help.libreoffice.org/latest/en-US/text/shared/guide/convertfilters.html).

Deprecated, use `outputFilter` instead.

#### `options`

Merged with the LibreOfficeFileConverter instance options for this call. Array options concatenate.

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
    output: 'buffer',
  });
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
    output: 'file',
    outputPath,
  });
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
  });
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
  });
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
  });
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
  });
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
  });
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
  });
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
  });
};

run();
```

### `LibreOfficeFileConverter.init`

Initializes LibreOffice installation dir by starting executable in headless mode and then terminating it.

#### `installationDir`

Path for the user installation directory.

#### `options`

Merged with the LibreOfficeFileConverter instance options for this call. Array options concatenate.

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

  await libreOfficeFileConverter.init({ installationDir });
};

run();
```

### Errors

`convert` and `init` throw when the `soffice` binary is not found, or when LibreOffice reports an error. The error message carries the LibreOffice stderr.

## License

MIT. See [LICENSE](./LICENSE).
