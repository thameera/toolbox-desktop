import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('api', {
  parse: (str) => ipcRenderer.invoke('parse', str),
})