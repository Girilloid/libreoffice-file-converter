module.exports = {
  '*.ts': ['prettier --write', 'eslint --fix', () => 'tsc --project tsconfig.typecheck.json --noEmit'],
};
