const { NODE_ENV, BABEL_ENV } = process.env
const cjs = NODE_ENV === 'test' || BABEL_ENV === 'commonjs'

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          esmodules: true,
        },
        // Use the equivalent of `babel-preset-modules`
        bugfixes: true,
        modules: false,
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    ['@babel/proposal-decorators', { legacy: true }],
    '@babel/transform-react-jsx',
    cjs && ['@babel/transform-modules-commonjs'],
    [
      '@babel/transform-runtime',
      {
        useESModules: !cjs,
        version: require('./package.json').dependencies[
          '@babel/runtime'
        ].replace(/^[^0-9]*/, ''),
      },
    ],
  ].filter(Boolean),
  assumptions: {
    enumerableModuleMeta: true,
  },
}
