import { Context } from '../context'
import { execSync } from 'child_process'

import './app.scss'

export class AppComponent {
  constructor(private ctx: Context) {

    this.init()
    this.addFilesToBody()
  }

  protected init() {
    this.ctx.win.resizeTo(400, 300)
    this.ctx.win.show()

    // devTools only if you use nw.js+sdk
    this.ctx.win.showDevTools()
  }

  protected addFilesToBody() {
    this.addToBody(this.ctx.win.title)
    this.addToBody('Working Directory: ' + execSync('pwd').toString())
    this.addToBody('Files:')
    execSync('ls').toString().split('\n').forEach(this.addToBody)
  }

  protected addToBody(text: string) {
    const fileName = document.createTextNode(text)
    const div = document.createElement('div')
    div.appendChild(fileName)
    document.getElementsByTagName('body')[0].appendChild(div)
  }
}
