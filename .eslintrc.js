module.exports = {
  'env': {
    'browser': true,
    'jest': true,
    'es6': true,
    'node': true,
  },
  'extends': [
    'airbnb',
    'plugin:flowtype/recommended',
  ],
  'parser': 'babel-eslint',
  'plugins': [
    'flowtype'
  ],
  'rules': {
  },
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    }
  }
}