

## [3.1.0](https://github.com/Girilloid/libreoffice-file-converter/compare/v3.0.2...v3.1.0) (2024-09-13)


### Features

* [#8](https://github.com/Girilloid/libreoffice-file-converter/issues/8) Add input filter support ([f700f80](https://github.com/Girilloid/libreoffice-file-converter/commit/f700f80df5b8b58aa52f0f5ebc55200f662b0765))

## [3.0.2](https://github.com/Girilloid/libreoffice-file-converter/compare/v3.0.1...v3.0.2) (2024-08-30)


### Bug Fixes

* [#7](https://github.com/Girilloid/libreoffice-file-converter/issues/7) Fix incorrect resolving of processed file path when input path doesn't have an extension ([0ed7c0a](https://github.com/Girilloid/libreoffice-file-converter/commit/0ed7c0af7cc886bfad80fb10587fecb705f9c380))

## [3.0.1](https://github.com/Girilloid/libreoffice-file-converter/compare/v3.0.0...v3.0.1) (2024-08-22)

## [3.0.0](https://github.com/Girilloid/libreoffice-file-converter/compare/v2.3.4...v3.0.0) (2024-08-22)


### ⚠ BREAKING CHANGES

* convertBuffer, convertFile and convertStream are replaced with a single convert method

### Features

* Advanced conversion configuration ([e1f79c9](https://github.com/Girilloid/libreoffice-file-converter/commit/e1f79c93053d989285ff16a9f47f55727465f9aa))


### Bug Fixes

* Get rid of structureClone for better compatibility with node < 17 ([b3a0ae5](https://github.com/Girilloid/libreoffice-file-converter/commit/b3a0ae5201b3c2873f3ea8fe3a6901e8715fe533))
* Preserve dots in file name ([c20e94b](https://github.com/Girilloid/libreoffice-file-converter/commit/c20e94b69de48d6f738d4d2b233f45a3766a445a))
* Use platform specific separator ([8dc3cd7](https://github.com/Girilloid/libreoffice-file-converter/commit/8dc3cd7c5eb658323d5ba0f6e7d12e71e5a232ba))
* Use platform specific separator for path creation ([f5bb4fe](https://github.com/Girilloid/libreoffice-file-converter/commit/f5bb4fe12872eb7cc594826922f38f39fa520ba1))

## [2.3.4](https://github.com/Girilloid/libreoffice-file-converter/compare/v2.3.3...v2.3.4) (2024-08-08)


### Bug Fixes

* Preserve jsdoc comments in d.ts ([1383f40](https://github.com/Girilloid/libreoffice-file-converter/commit/1383f408bce73c2b7205be27f7b6e484a253cb00))

## [2.3.3](https://github.com/Girilloid/libreoffice-file-converter/compare/v2.3.2...v2.3.3) (2024-06-22)


### Bug Fixes

* Await cleanup onnly on exception ([9da4857](https://github.com/Girilloid/libreoffice-file-converter/commit/9da48575792ec07b2b857853d860417163a7b9d6))

## [2.3.2](https://github.com/Girilloid/libreoffice-file-converter/compare/v2.3.1...v2.3.2) (2024-06-16)


### Bug Fixes

* Better cleanup on error for stream operations ([27682aa](https://github.com/Girilloid/libreoffice-file-converter/commit/27682aa420de964bea7b8c4a94184cd97f4c9e0d))

## [2.3.1](https://github.com/Girilloid/libreoffice-file-converter/compare/v2.3.0...v2.3.1) (2024-06-16)


### Bug Fixes

* Cleanup temp dirs on error ([258cf08](https://github.com/Girilloid/libreoffice-file-converter/commit/258cf08e19e82de27ab81d160e93ac76797aad1a))
* LibreOffice configuration read error is recognized as a convert error ([bb87baf](https://github.com/Girilloid/libreoffice-file-converter/commit/bb87baf2c48968ba71cf0c09c1926947fc9bce21))

## [2.3.0](https://github.com/Girilloid/libreoffice-file-converter/compare/v2.2.0...v2.3.0) (2024-06-10)


### Features

* Additional soffice paths for linux ([fcdb467](https://github.com/Girilloid/libreoffice-file-converter/commit/fcdb467455b75de21274b39e065f07ff5605c5dd))


### Bug Fixes

* Improved arguments passing ([30c205a](https://github.com/Girilloid/libreoffice-file-converter/commit/30c205ad443451e5578d231af6f74ee9ddc22b93))

## [2.2.0](https://github.com/Girilloid/libreoffice-file-converter/compare/v2.1.1...v2.2.0) (2024-05-27)


### Features

* Improve deno compatibility ([5715194](https://github.com/Girilloid/libreoffice-file-converter/commit/5715194f8ea1f97f872c6d0ee406803115c15f86))

## [2.1.1](https://github.com/Girilloid/libreoffice-file-converter/compare/v2.1.0...v2.1.1) (2024-05-21)


### Bug Fixes

* Use built-in pathToFileURL ([683445e](https://github.com/Girilloid/libreoffice-file-converter/commit/683445e6cd62cc3daae0b4aa4b88f327ccb7dae3))
* Windows file URI ([e52714d](https://github.com/Girilloid/libreoffice-file-converter/commit/e52714d3a1b1b077589f613c6509d9a8c7f87b89))
* Windows posix file URI ([b96c097](https://github.com/Girilloid/libreoffice-file-converter/commit/b96c097d2f1a02fa2bdde0b92d4eaedffaad8a95))

## [2.1.0](https://github.com/Girilloid/libreoffice-file-converter/compare/v2.0.0...v2.1.0) (2024-01-13)


### Features

* Throw libreoffice error when it fails to convert file ([a255ff0](https://github.com/Girilloid/libreoffice-file-converter/commit/a255ff051a610e2d3d472caa1681679a00eec57b))

## [2.0.0](https://github.com/Girilloid/libreoffice-file-converter/compare/v1.2.1...v2.0.0) (2024-01-13)


### Features

* Drop support of NodeJS versions < 14 ([a49dfe3](https://github.com/Girilloid/libreoffice-file-converter/commit/a49dfe3b71c49e67b05bf0253e03bfaae771e11b))
* Remove deprecated method ([00b6194](https://github.com/Girilloid/libreoffice-file-converter/commit/00b61947c453001cfad6e884db2603364d4337ad))
* Replace tmp with tmp-promise ([d2fadbe](https://github.com/Girilloid/libreoffice-file-converter/commit/d2fadbe98226bded5b7bdc827f2a66cf85572c1a))


## [1.2.1](https://github.com/Girilloid/libreoffice-file-converter/compare/v1.2.0...v1.2.1) (2023-08-31)

## [1.2.0](https://github.com/Girilloid/libreoffice-file-converter/compare/v1.1.1...v1.2.0) (2023-08-03)


### Features

* Convert streams ([56d8f02](https://github.com/Girilloid/libreoffice-file-converter/commit/56d8f02d6b2f0b40423953e0321140067a9e4423))

### [1.1.1](https://github.com/Girilloid/libreoffice-file-converter/compare/v1.1.0...v1.1.1) (2023-06-27)

## [1.1.0](https://github.com/Girilloid/libreoffice-file-converter/compare/v1.0.5...v1.1.0) (2023-06-26)

### [1.0.4](https://github.com/Girilloid/libreoffice-file-converter/compare/v1.0.3...v1.0.4) (2023-05-17)


### Bug Fixes

* Return dts, add commonjs/esm exports ([42a20a3](https://github.com/Girilloid/libreoffice-file-converter/commit/42a20a38205cfcf300221aea73deb2e657c4163b))

### [1.0.3](https://github.com/Girilloid/libreoffice-file-converter/compare/v1.0.2...v1.0.3) (2023-05-16)
