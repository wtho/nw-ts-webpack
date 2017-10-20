# nw.js - TypeScript - Webpack Starter

A starter for a Desktop-App-project written in TypeScript and Sass, running in nw.js, bundled and hot-deployed by Webpack.

| <a href="https://nwjs.io/"><img src="http://seeklogo.com/images/N/nwjs-aka-nodewebkit-logo-8B8DF3F5A5-seeklogo.com.png" width="64" height="64" ></a> | <a style="background-color: #294E80" href="http://typescriptlang.org"><img width="64" height="64" src="https://raw.githubusercontent.com/remojansen/logo.ts/master/ts.png" ></a> | <a href="https://sass-lang.com"><img src="https://avatars2.githubusercontent.com/u/317889?v=3&s=400" width="64" height="64" ></a> | <a href="http://webpack.js.org"><img width="64" height="64" src="https://camo.githubusercontent.com/d18f4a7a64244f703efcb322bf298dcb4ca38856/68747470733a2f2f7765627061636b2e6a732e6f72672f6173736574732f69636f6e2d7371756172652d6269672e737667" ></a>  | <a href="http://mochajs.org"><img width="64" height="64" src="https://cldup.com/xFVFxOioAU.svg" ></a> | <a href="http://chaijs.com"><img width="64" height="64" src="https://camo.githubusercontent.com/431283cc1643d02167aac31067137897507c60fc/687474703a2f2f636861696a732e636f6d2f696d672f636861692d6c6f676f2e706e67" ></a> | <a href="http://sinonjs.org"><img width="64" height="64" src="http://sinonjs.org/assets/images/logo.png" ></a> | 
|---------------------------|-----------------------------------------|-------------------------------|------------------------|-----------------------------|---------------------------|-----------------------------|
| [nw.js](https://nwjs.io/) | [TypeScript](http://typescriptlang.org) | [Sass](https://sass-lang.com) | [Webpack](http://webpack.js.org) | [Mocha](http://mochajs.org) | [Chai](http://chaijs.com) | [Sinon](http://sinonjs.org) |

This starter sets up a development environment for a Desktop-App with the following features:

| Feature | Command |
|---------|---------|
| Linter (TSLint) | ``npm run lint`` | 
| Build App | ``npm run build`` | 
| Dev Server with Hot Reload | ``npm run server`` |
| **[WIP]** Tests run in Node | ``npm run test:node`` | 
| **[WIP]** Tests run in nw.js | ``npm run test:nw`` | 


An example of how to access the node-tools is given in the included [``app.component.ts``](src/app/app.component.ts).

If you like to use another CSS-Preprocessor, simply modify the webpack config files.

If you prefer Vanilla-JavaScript instead of TypeScript, better check out [this repository](https://github.com/jarden-liu/node-webkit-webpack-starter).

