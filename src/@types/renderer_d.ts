// TODO change file type to d.ts
export interface IElectronAPI  {
    versions: {
        node: () => string
        chrome: () => string
        electron: () => string
        ping: () => Promise<string>
    }
    darkMode: {
      toggle: () => Promise<boolean>
      system: () => Promise<void>
    }
}

declare global {
    interface Window {
      versions: IElectronAPI['versions']
      darkMode: IElectronAPI['darkMode']
    }
  }