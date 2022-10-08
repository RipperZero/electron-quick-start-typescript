// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// window.addEventListener("DOMContentLoaded", () => {
//   const replaceText = (selector: string, text: string) => {
//     const element = document.getElementById(selector);
//     if (element) {
//       element.innerText = text;
//     }
//   };

//   for (const type of ["chrome", "node", "electron"]) {
//     replaceText(`${type}-version`, process.versions[type as keyof NodeJS.ProcessVersions]);
//   }
// });
// const { contextBridge, ipcRenderer } = require("electron");
import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

// 能暴露的不仅仅是函数，我们还可以暴露变量
contextBridge.exposeInMainWorld("versions", {
  node: () => {
    return process.versions.node;
  },
  chrome: () => {
    return process.versions.chrome;
  },
  electron: () => {
    return process.versions.electron;
  },
});

contextBridge.exposeInMainWorld("darkMode", {
  toggle: () => {
    return ipcRenderer.invoke("dark-mode:toggle");
  },
  system: () => {
    return ipcRenderer.invoke("dark-mode:system");
  },
});

contextBridge.exposeInMainWorld("electronAPI", {
  ping: () => {
    return ipcRenderer.invoke("ping");
  },
  setTitle: (title: string) => {
    ipcRenderer.send("set-title", title);
  },
  openFile: () => {
    return ipcRenderer.invoke("dialog:openFile");
  },
  handleCounter: (
    callback: (event: IpcRendererEvent, value: number) => void,
  ) => {
    ipcRenderer.on("update-counter", callback);
  },
  bluetoothPairingRequest: (callback: any) => {
    ipcRenderer.on("bluetooth-pairing-request", callback);
  },
  bluetoothPairingResponse: (response: { confirmed: boolean; pin: string }) => {
    ipcRenderer.send("bluetooth-pairing-response", response);
  },
});
