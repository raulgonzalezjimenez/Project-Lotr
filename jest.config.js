export default {
  collectCoverage: true,
  collectCoverageFrom: ['src/*/*.ts'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    'index.ts',
    'type.repo.ts',
    'entities',
    'interface',
    'tools',
    '_mock',
  ],
  coverageProvider: 'v8',
  preset: 'ts-jest',
  testPathIgnorePatterns: ['dist'],
  resolver: 'jest-ts-webcompat-resolver',
};
