// preload.js

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('steam', {
  isEnabled() {
    return ipcRenderer.invoke('is-steam')
  },
  activateAchievement(name) {
    return ipcRenderer.invoke('activate-steam-achievement', name)
  },
  getName() {
    return ipcRenderer.invoke('get-steam-name')
  },
})
