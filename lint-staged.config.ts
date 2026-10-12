export default {
  '*.ts': ['oxfmt', 'oxlint --fix', () => 'tsc --noEmit'],
};
