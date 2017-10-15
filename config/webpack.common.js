const webpack = require('webpack')
const path = require('path')
const helpers = require('./helpers')
const config = require('./config')


/**
 * webpack plugins
 */
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCssPlugin = new ExtractTextPlugin('css/[name].[hash].css')
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin')
// const lessLoader = extractCssPlugin.extract(['css-loader','autoprefixer-loader', 'less-loader'])
// const stylusLoader = extractCssPlugin.extract(['css-loader','autoprefixer-loader', 'stylus-loader'])

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function (options) {
  isProd = options.env === 'production'
  return {

    /**
     * Cache generated modules and chunks to improve performance for multiple incremental builds.
     * This is enabled by default in watch mode.
     * You can pass false to disable it.
     *
     * See: http://webpack.github.io/docs/configuration.html#cache
     */
    //cache: false,

    /**
     * The entry point for the bundle
     * Our Angular.js app
     *
     * See: http://webpack.github.io/docs/configuration.html#entry
     */
    entry: {
      'app': helpers.root(`${config.path.main}/app.ts`)
    },

    /**
     * Options affecting the resolving of modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#resolve
     */
    resolve: {

      /**
       * An array of extensions that should be used to resolve modules.
       *
       * See: http://webpack.github.io/docs/configuration.html#resolve-extensions
       */
      extensions: ['.ts', '.js', '.json'],

      /**
       * An array of directory names to be resolved to the current directory
       */
      modules: [helpers.root('src'), helpers.root('node_modules')],

    },

    /**
     * Options affecting the normal modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#module
     */
    module: {

      rules: [
        {
          test: /\.ts$/,
          use: [
            {
              loader: 'awesome-typescript-loader',
              options: {
                silent: true,
                instance: 'web-bar-loader',
                configFileName: 'tsconfig.webpack.json',
                useCache: !isProd
              }
            },
          ],
          exclude: [/\.(spec|e2e)\.ts$/]
        },
        {
          test: /\.css$/,
          use: extractCssPlugin.extract(['css-loader','autoprefixer-loader'])
        },
        {
          test: /\.scss$/,
          use: extractCssPlugin.extract(['css-loader','autoprefixer-loader', 'sass-loader'])
        },
        {
          test: /\.html$/,
          use: 'html-loader'
        },
        {
          test: /\.(jpg|png|gif)$/,
          use: 'file-loader'
        },
        {
          test: /\.(eot|woff2?|svg|ttf)([\?]?.*)$/,
          use: 'file-loader'
        }

      ],

    },

    /**
     * Add additional plugins to the compiler.
     *
     * See: http://webpack.github.io/docs/configuration.html#plugins
     */
    plugins: [
      new CheckerPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(config.path.main, 'index.html'),
        filename: 'index.html',
        inject: 'true',
        title: config.title
      }),

      new LoaderOptionsPlugin({}),
    ],

    /**
     * Include polyfills or mocks for various node stuff
     * Description: Node configuration
     *
     * See: https://webpack.github.io/docs/configuration.html#node
     */
    node: {
      global: true,
      crypto: 'empty',
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }

  }
}
