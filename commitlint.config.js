module.exports = {
  parserPreset: 'conventional-changelog-conventionalcommits',
  rules: {
    'subject-case': [0],
    'type-enum': [2, 'always', ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'refactor', 'revert', 'test']],
  },
};
