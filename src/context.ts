import { Window, App, Shell } from 'nw.gui'

export class Context {
  constructor(
    public win: Window,
    public nwApp: App,
    public shell: Shell) { }
}
