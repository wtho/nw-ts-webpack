const helpers = require('./helpers')
const webpackMerge = require('webpack-merge')
const commonConfigFn = require('./webpack.common.js');
const config = require('./config')

// plugins
const DefinePlugin = require('webpack/lib/DefinePlugin')
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin')
const IgnorePlugin = require('webpack/lib/IgnorePlugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin')
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin')
const NoEmitOnErrorsPlugin = require('webpack/lib/NoEmitOnErrorsPlugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

// settings
const ENV = process.env.ENV = process.env.NODE_ENV = 'development'
const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || 3000
const PUBLIC = process.env.PUBLIC_DEV || HOST + ':' + PORT
const HMR = helpers.hasProcessFlag('hot')
const METADATA = {
  host: HOST,
  port: PORT,
  public: PUBLIC,
  ENV: ENV,
  HMR: HMR
}

const commonConfig = commonConfigFn({env: ENV})

Object.keys(commonConfig.entry).forEach(function(name) {
  commonConfig.entry[name] = [helpers.root('config/hotReload')].concat(commonConfig.entry[name])
});

const extractCssPlugin = new ExtractTextPlugin('.dev-client/[name].[hash].css')

module.exports = function (options) {
  return webpackMerge(commonConfig, {
    devtool: 'cheap-module-source-map',

    output: {
      path: helpers.root(config.path.output),
      filename: '[name].bundle.js',
      sourceMapFilename: '[file].map',
      library: 'ac_[name]',
      libraryTarget: 'var',
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
          ])
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
          ])
        },
      ]
    },

    plugins: [
      extractCssPlugin,
      new IgnorePlugin(/nw.gui/),
      new DefinePlugin({
        'ENV': JSON.stringify(METADATA.ENV),
        'HMR': METADATA.HMR,
        'process.env.ENV': JSON.stringify(METADATA.ENV),
        'process.env.NODE_ENV': JSON.stringify(METADATA.ENV),
        'process.env.HMR': METADATA.HMR
      }),
      new LoaderOptionsPlugin({
        debug: true,
        options: {
        }
      }),
      new NoEmitOnErrorsPlugin(),
      new FriendlyErrorsWebpackPlugin(),
      new HotModuleReplacementPlugin()
    ],
    node: {
      global: true,
      crypto: 'empty',
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }

  })
}

