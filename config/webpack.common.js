const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CheckerPlugin } = require('awesome-typescript-loader')
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin')

const helpers = require('./helpers')
const config = require('./config')


module.exports = function (options) {
  isProd = options.env === 'production'
  return {
    entry: {
      'app': helpers.root(config.path.main)
    },
    target: 'node-webkit',
    resolve: {
      extensions: ['.ts', '.js', '.json'],
      modules: [helpers.root('src'), helpers.root('node_modules')],
    },

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

    plugins: [
      new CheckerPlugin(),
      new HtmlWebpackPlugin({
        template: config.path.mainTemplate,
        filename: 'index.html',
        inject: 'true',
        title: config.title
      }),
      new LoaderOptionsPlugin({}),
    ],

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
