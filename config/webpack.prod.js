
const helpers = require('./helpers')
const webpackMerge = require('webpack-merge')
const commonConfig = require('./webpack.common')

const config = require('./config')

// Plugins
const DefinePlugin = require('webpack/lib/DefinePlugin')
const HashedModuleIdsPlugin = require('webpack/lib/HashedModuleIdsPlugin')
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin')
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin')
const OptimizeJsPlugin = require('optimize-js-plugin')
const EmitJsonFilePlugin = require('emit-json-file-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');


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
    mode: 'production',

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
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: true
              },
            },
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                config: {
                  path: './config'
                }
              }
            }
          ],
          include: [helpers.root('src')]
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: true
              },
            },
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
          ],
          include: [helpers.root('src')]          
        }
      ]
    },

    plugins: [

      new ModuleConcatenationPlugin(),

      new OptimizeJsPlugin({
        sourceMap: false
      }),

      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),

      new DefinePlugin({
        'ENV': JSON.stringify(METADATA.ENV),
        'HMR': METADATA.HMR,
        'process.env.ENV': JSON.stringify(METADATA.ENV),
        'process.env.NODE_ENV': JSON.stringify(METADATA.ENV),
        'process.env.HMR': METADATA.HMR
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

    optimization: {
      minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },


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
