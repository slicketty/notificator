/**
 * ESLint rules.
 * Uses AirBNB style combined with Prettier config.
 */

module.exports = {
  plugins: ['jest', 'prettier'],
  extends: ['airbnb-base', 'prettier'],

  rules: {
    'prettier/prettier': 'error',
    'import/no-absolute-path': 'off',
    'import/no-unresolved': 'off',
    'no-underscore-dangle': 'off',
    'no-await-in-loop': 'off',
  },

  env: {
    'jest/globals': true,
  },
}
