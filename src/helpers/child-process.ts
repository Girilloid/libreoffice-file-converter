import { Buffer } from 'node:buffer';
import { execFile } from 'node:child_process';
import type { ExecFileOptions } from 'node:child_process';
import process from 'node:process';
import { inspect, promisify } from 'node:util';

import { hasLibreOfficeError } from './libreoffice';

const processOutputToString = (processOutput: string | Buffer): string => {
  return Buffer.isBuffer(processOutput) ? processOutput.toString('utf-8') : processOutput;
};

const execFilePromise = promisify(execFile);

type ExecutionError = Error & {
  stdout?: string | Buffer;
  stderr?: string | Buffer;
};

type ExecFileAsyncParams = {
  readonly args: readonly string[];
  readonly debug?: boolean;
  readonly options?: ExecFileOptions;
  readonly path: string;
};

export const execFileAsync = async ({ args, debug, options, path }: ExecFileAsyncParams): Promise<void> => {
  let startTime = 0;

  if (debug) {
    startTime = performance.now();
  }

  let executionError: ExecutionError | undefined;
  let stdout: string | Buffer = '';
  let stderr: string | Buffer = '';

  try {
    ({ stdout, stderr } = await execFilePromise(path, args, options || {}));
  } catch (error) {
    executionError = error as ExecutionError;
    stdout = executionError.stdout || '';
    stderr = executionError.stderr || '';
  }

  const stdoutString = processOutputToString(stdout);
  const stderrString = processOutputToString(stderr);

  if (debug) {
    const debugInfo = inspect(
      {
        args,
        executionTime: performance.now() - startTime,
        path,
        stderr: stderrString,
        stdout: stdoutString,
      },
      {
        colors: true,
        sorted: true,
      },
    );

    process.stdout.write(`LibreOffice debug output:\n${debugInfo}\n`);
  }

  if (executionError || hasLibreOfficeError(stderrString)) {
    throw new Error(stderrString || executionError?.message, {
      cause: executionError,
    });
  }
};
