import { Window, App, Shell } from 'nw.gui'

import { AppComponent } from './app/app.component'
import { Context } from './context'

// tell typescript that nw exists
declare var nw: any

// cast nw fields tp nw.js type
const win = nw.Window.get() as Window
const nwApp = nw.App as App
const shell = nw.Shell as Shell

const ctx = new Context(win, nwApp, shell)
const x = new AppComponent(ctx)
