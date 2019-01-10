module.exports = {
  extends: 'airbnb-base',
  env: {
    es6: true,
    mocha: true
  },
  plugins: [
    'mocha'
  ],
  rules: {
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', 'prev': '*', 'next': 'return' },
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*'},
      { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var']}
    ],
    'max-len': ['error', 140],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'func-names': ['off'],
    'class-methods-use-this': ['off'],
    'no-underscore-dangle': ['error', {'allow': ['_id', '__typename']}],
    'no-multiple-empty-lines': ['error', { maxEOF: 1, max: 2 }],
    'mocha/no-global-tests': ['error']
  }
};
