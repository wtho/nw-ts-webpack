import { Window } from 'nw.gui';
import { execSync } from 'child_process'

import './app.scss'

console.log('hello world')

declare var nw: any;

const win = <Window> nw.Window.get()
// win.moveTo(0, 0)

win.resizeTo(400, 300)
win.show()

// devTools only if you use nw.js+sdk
// win.showDevTools()

addToBody('Working Directory: ' + execSync('pwd').toString())
addToBody('Files:')
execSync('ls').toString().split('\n').forEach(addToBody)

function addToBody(text: string) {
  const fileName = document.createTextNode(text)
  const div = document.createElement('div')
  div.appendChild(fileName)
  document.getElementsByTagName('body')[0].appendChild(div)
}

