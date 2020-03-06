module.exports = {
  root: true,
  extends: ['alloy', 'alloy/react', 'alloy/typescript'],
  env: {
    browser: true,
    node: true
  },
  rules: {
    'react/static-property-placement': 0,
    '@typescript-eslint/consistent-type-assertions': 0,
    '@typescript-eslint/consistent-type-definitions': 0,
    '@typescript-eslint/triple-slash-reference': 0,
    '@typescript-eslint/typedef': 0,
    complexity: 0,
    'max-depth': 0,
    'react/jsx-fragments': 0,
    'no-param-reassign': 0,
    '@typescript-eslint/member-ordering': 0,
    'no-eq-null': ['warn'],
    eqeqeq: ['warn', 'allow-null'],
    'spaced-comment': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/explicit-member-accessibility': 0
  }
};
