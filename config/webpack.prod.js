
const helpers = require('./helpers')
const webpackMerge = require('webpack-merge')
const commonConfig = require('./webpack.common')

const config = require('./config')

// Plugins
const DefinePlugin = require('webpack/lib/DefinePlugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HashedModuleIdsPlugin = require('webpack/lib/HashedModuleIdsPlugin')
const IgnorePlugin = require('webpack/lib/IgnorePlugin')
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin')
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin')
const ProvidePlugin = require('webpack/lib/ProvidePlugin')
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeJsPlugin = require('optimize-js-plugin')
const EmitJsonFilePlugin = require('emit-json-file-webpack-plugin')

const extractCssPlugin = new ExtractTextPlugin('./[name].[hash].css')

// Settings
const ENV = process.env.NODE_ENV = process.env.ENV = 'production'
const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || 8080
const METADATA = {
  host: HOST,
  port: PORT,
  ENV: ENV,
  HMR: false
}

module.exports = function (env) {
  return webpackMerge(commonConfig({
    env: ENV
  }), {

    output: {
      path: helpers.root('dist'),
      filename: '[name].[chunkhash].bundle.js',
      sourceMapFilename: '[file].map',
      chunkFilename: '[name].[chunkhash].chunk.js'
    },

    module: {
      rules: [
        {
          test: /\.css$/,
          use: extractCssPlugin.extract([
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                config: {
                  path: './config'
                }
              }
            }
          ]),
          include: [helpers.root('src')]
        },
        {
          test: /\.scss$/,
          use: extractCssPlugin.extract([
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                config: {
                  path: './config'
                }
              }
            },
            'sass-loader'
          ]),
          include: [helpers.root('src')]          
        }
      ]
    },

    plugins: [

      new ModuleConcatenationPlugin(),

      new OptimizeJsPlugin({
        sourceMap: false
      }),

      extractCssPlugin,
      new DefinePlugin({
        'ENV': JSON.stringify(METADATA.ENV),
        'HMR': METADATA.HMR,
        'process.env.ENV': JSON.stringify(METADATA.ENV),
        'process.env.NODE_ENV': JSON.stringify(METADATA.ENV),
        'process.env.HMR': METADATA.HMR
      }),

      new UglifyJsPlugin({
        parallel: true,
        uglifyOptions: {
          ie8: false,
          ecma: 6,
          warnings: true,
          mangle: true, // debug false
          output: {
            comments: false,
            beautify: false,  // debug true
          }
        },
        warnings: true,
      }),

      new HashedModuleIdsPlugin(),
      new LoaderOptionsPlugin({
        minimize: true,
        debug: false,
        options: {
          htmlLoader: {
            minimize: true,
            removeAttributeQuotes: false,
            caseSensitive: true,
          }
        }
      }),

      new EmitJsonFilePlugin([
        {
          path: 'package.json',
          content: config.nwPackageJson
        }
      ])

    ],

    node: {
      global: true,
      crypto: 'empty',
      process: false,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }
  })
}
