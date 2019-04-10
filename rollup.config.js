import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import nodeResolve from 'rollup-plugin-node-resolve'
import bundleSize from 'rollup-plugin-bundle-size'
import uglify from 'rollup-plugin-uglify'
import string from 'rollup-plugin-string'
import replace from 'rollup-plugin-replace'
import ignore from 'rollup-plugin-ignore'
import pkg from './package.json'

const cjs = {
  exports: 'named',
  format: 'cjs'
}

const esm = {
  format: 'es'
}

const getCJS = override => Object.assign({}, cjs, override)
const getESM = override => Object.assign({}, esm, override)

const configBase = {
  input: 'lib/index.js',
  plugins: [
    nodeResolve(),
    json(),
    string({ include: '**/*.afm' }),
    babel({
      babelrc: false,
      presets: [
        [
          'env',
          {
            modules: false,
            targets: {
              ie: '11'
            }
          }
        ]
      ],
      plugins: ['external-helpers'],
      runtimeHelpers: true
    }),
    bundleSize()
  ],
  external: Object.keys(pkg.dependencies)
}

const serverConfig = Object.assign({}, configBase, {
  output: [getESM({ file: 'dist/pdfkit.es.js' }), getCJS({ file: 'dist/pdfkit.cjs.js' })],
  plugins: configBase.plugins.concat(
    replace({
      BROWSER: JSON.stringify(false)
    })
  ),
  external: configBase.external.concat(['fs'])
})

const serverProdConfig = Object.assign({}, serverConfig, {
  output: [getESM({ file: 'dist/pdfkit.es.min.js' }), getCJS({ file: 'dist/pdfkit.cjs.min.js' })],
  plugins: serverConfig.plugins.concat(uglify())
})

const browserConfig = Object.assign({}, configBase, {
  output: [getESM({ file: 'dist/pdfkit.browser.es.js' }), getCJS({ file: 'dist/pdfkit.browser.cjs.js' })],
  plugins: configBase.plugins.concat(
    replace({
      BROWSER: JSON.stringify(true)
    }),
    ignore(['fs'])
  )
})

const browserProdConfig = Object.assign({}, browserConfig, {
  output: [getESM({ file: 'dist/pdfkit.browser.es.min.js' }), getCJS({ file: 'dist/pdfkit.browser.cjs.min.js' })],
  plugins: browserConfig.plugins.concat(uglify())
})

export default [serverConfig, serverProdConfig, browserConfig, browserProdConfig]
