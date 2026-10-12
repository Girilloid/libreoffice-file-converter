const config = {
  collectCoverageFrom: ['<rootDir>/src/**/*.{js,ts}'],
  coverageDirectory: '<rootDir>/coverage',
  coveragePathIgnorePatterns: ['index.ts', 'paths.ts', 'types.ts'],
  coverageReporters: ['lcov', 'clover', 'text-summary'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  testEnvironment: 'node',
  testRegex: '.*\\.spec\\.ts$',
  transform: { '^.+\\.ts$': '@swc/jest' },
};

module.exports = config;
