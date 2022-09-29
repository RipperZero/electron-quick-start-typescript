export type IElectronAPI = {
  versions: {
    node: () => string;
    chrome: () => string;
    electron: () => string;
  };
  darkMode: {
    toggle: () => Promise<boolean>;
    system: () => Promise<void>;
  };
  electronAPI: {
    ping: () => Promise<string>;
    setTitle: (title: string) => void;
    openFile: () => Promise<string | undefined>;
  };
};

declare global {
  interface Window {
    versions: IElectronAPI["versions"];
    darkMode: IElectronAPI["darkMode"];
    electronAPI: IElectronAPI["electronAPI"];
  }
}
