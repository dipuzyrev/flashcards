module.exports = {
  root: true,
  extends: ['@react-native-community', 'plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
        'prettier/prettier': 'error',
        'eslint-comments/no-unlimited-disable': 'off',
      },
    },
  ],
};
