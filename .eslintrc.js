/* global module */
module.exports = {

  extends: './node_modules/eslint-config-airbnb/base.js',
  parser: 'babel-eslint',

  env: {
    browser: true,
    node: true
  },

  globals: {
  },

  rules: {
    'comma-dangle': [2, 'never'],
    'func-names': 0,
    'max-len': [2, 150]
  }

};
