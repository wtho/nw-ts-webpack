const express = require('express')
const fs = require('fs')
const webpack = require('webpack')
const WebpackDevMiddleware = require('webpack-dev-middleware')
const WebpackHotMiddleware = require('webpack-hot-middleware')
const ora = require('ora')
const chalk = require('chalk')
const jsonFormat = require('json-format')
const shell = require('shelljs')
const argv = require('yargs').argv
let spinner = ora({text: 'compiling', spinner: 'dots2'})

const config = require('./config')
const webpackConfigFn = require('./webpack.dev')
const helpers = require('./helpers')


const webpackConfig = webpackConfigFn(argv.env, argv)
const compiler = webpack(webpackConfig)

const devMiddleware = new WebpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

const hotMiddleware = new WebpackHotMiddleware(compiler, {log: false})

let firstRun = true
compiler.plugin('done', stats => {
  const error = stats.compilation.errors.length > 0
  if (firstRun) {
    if (error) {
      spinner.fail('compilation failed')
      process.stdout.write(stats.toString({colors: true, modules: false, children: false, chunks: false, chunkModules: false}) + '\n') 
    } else {
      spinner.succeed('compilation successful')
      process.stdout.write(chalk.bold('Local dev server : '))
      process.stdout.write(chalk.underline(`http://localhost:${config.server.port}`) + '\n')
      startNwjsClient()
      firstRun = false
    }
  }
})

compiler.plugin('compilation', function(compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function(data, cb) {
    hotMiddleware.publish({action: 'reload'})
    cb()
  })
})


function startNwjsClient() {
  const nwjsConfig = config.nwPackageJson
  nwjsConfig['node-remote'] = nwjsConfig.main = `http://localhost:${config.server.port}/${nwjsConfig.main}`
  shell.rm('-rf', helpers.root('.dev_client'))
  shell.exec('mkdir .dev_client', {async: false})
  fs.writeFile(helpers.root(`.dev_client/package.json`), jsonFormat(nwjsConfig), (err) => {
    const nwjsFolder = shell.ls().find(folder => folder.startsWith('nwjs-sdk'))
    if (err)
      throw err
    if (nwjsFolder && fs.existsSync(helpers.root(nwjsFolder, 'nw'))) {
      shell.exec(`./${nwjsFolder}/nw .dev_client`, {async: true})
    } else if (!shell.which('nw')) {
      shell.echo('Sorry, this client requires nw, maybe you try \'sudo npm install -g nw\'')
      shell.exit(1)
    }else{
      shell.exec('nw .dev_client', {async: true})
    }
  })
}

const app = express()
app.use(devMiddleware)
app.use(hotMiddleware)

app.listen(config.server.port, (err) => {
  err && console.log(err)
  spinner.start()
})

