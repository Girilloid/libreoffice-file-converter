import type { Config } from 'jest';

const config: Config = {
  collectCoverageFrom: ['<rootDir>/src/**/*.{js,ts}'],
  coverageDirectory: '<rootDir>/coverage',
  coveragePathIgnorePatterns: ['index.ts', 'paths.ts', 'types.ts'],
  coverageReporters: ['lcov', 'clover', 'text-summary'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        isolatedModules: false,
      },
    ],
  },
};

export default config;
