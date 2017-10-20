
const nwPackageJson = {
  "main": "index.html",
  "name": "nw-ts-webpack",
  "chomium-args": "--enable-logging=stdout",
  "window": {
    "show": false,
    "toolbar": false,
    "frame": false,
    "width": 600,
    "height": 200,
    "resizable": false,
    "show_in_taskbar": false,
    "transparent": true
  }
}

const production = {
  title: 'nw-ts-starter',
  nwPackageJson: {
    ...nwPackageJson
  },
  path: {
    main: 'src/app/app.ts',
    mainTemplate: 'src/app/index.html',
    output: 'dist'
  }
}

const development = {
  ...production,
  server: {
    port: 8081
  }
}


module.exports = (process.env.NODE_ENV === 'development') 
  ? development 
  : production
