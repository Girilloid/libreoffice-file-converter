export default {
  '*.ts': ['oxfmt', 'oxlint --fix', () => 'tsc --project tsconfig.typecheck.json --noEmit'],
};
