import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('api', {
  parse: (str) => ipcRenderer.invoke('parse', str),
  copyToClipboard: (str) => ipcRenderer.invoke('copyToClipboard', str),
})