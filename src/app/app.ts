const gui = require('nw.gui')

console.log('hello world')

const win = gui.window.get()
win.moveTo(0, 0)
win.resizeTo(400, 300)
win.show()
