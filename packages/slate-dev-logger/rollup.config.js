import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import pkg from './package.json'

const umdConfig = {
  input: 'src/index.js',
  output: {
    file: pkg.browser,
    name: 'slate-dev-logger',
    format: 'umd',
    exports: 'named',
  },
  plugins: [
    resolve(),
    commonjs({
      exclude: ['src/**'],
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    babel({
      include: ['src/**']
    }),
  ]
}

const umdConfigMin = Object.assign({}, umdConfig)
umdConfigMin.output = Object.assign({}, umdConfig.output, { file: pkg.browserMin })
umdConfigMin.plugins = umdConfig.plugins.slice(0).concat(uglify())

export default [
  // UMD build for browsers
  umdConfig,
  umdConfigMin,

  // CommonJS (for Node) and ES module (for bundlers) build.
  {
    input: 'src/index.js',
    output: [
      { file: pkg.main, format: 'cjs', exports: 'named' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
      resolve(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      babel({
        include: ['src/**']
      }),
    ]
  }
]
