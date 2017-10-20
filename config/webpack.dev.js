const helpers = require('./helpers')
const webpackMerge = require('webpack-merge')
const commonConfigFn = require('./webpack.common.js');
const config = require('./config')

/**
 * Webpack Plugins
 */
const DefinePlugin = require('webpack/lib/DefinePlugin')
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin')
const IgnorePlugin = require('webpack/lib/IgnorePlugin')
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin')
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin')
const NoEmitOnErrorsPlugin = require('webpack/lib/NoEmitOnErrorsPlugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

/**
 * Webpack Constants
 */
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


// const DllBundlesPlugin = require('webpack-dll-bundles-plugin').DllBundlesPlugin
const commonConfig = commonConfigFn({env: ENV})

Object.keys(commonConfig.entry).forEach(function(name) {
  commonConfig.entry[name] = [helpers.root('config/hotReload')].concat(commonConfig.entry[name])
});

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function (options) {
  return webpackMerge(commonConfig, {

    /**
     * Developer tool to enhance debugging
     *
     * See: http://webpack.github.io/docs/configuration.html#devtool
     * See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
     */
    devtool: 'cheap-module-source-map',

    /**
     * Options affecting the output of the compilation.
     *
     * See: http://webpack.github.io/docs/configuration.html#output
     */
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
          use: ['style-loader', 'css-loader'],
          include: [helpers.root('src', 'styles')]
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
          include: [helpers.root('src', 'styles')]
        },
      ]
    },

    plugins: [
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

    devServer: {
      port: METADATA.port,
      host: METADATA.host,
      hot: METADATA.HMR,
      public: METADATA.public,
      watchOptions: {
        ignored: /node_modules/
      }
    },
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

