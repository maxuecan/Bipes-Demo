module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended' // 确保ESLint的规则与Prettier的格式化一致
  ],
  env: {
    browser: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    indent: ["error", 4]
  },
};
