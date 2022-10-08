import {
  BluetoothPairingHandlerHandlerDetails,
  IpcRendererEvent,
} from "electron";

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
    handleCounter: (
      callback: (event: IpcRendererEvent, value: number) => void,
    ) => void;
    bluetoothPairingRequest: (
      callback: (
        event: IpcRendererEvent,
        details: BluetoothPairingHandlerHandlerDetails,
      ) => void,
    ) => void;
    bluetoothPairingResponse: (response: {
      confirmed: boolean;
      pin: string;
    }) => void;
  };
};

declare global {
  interface Window {
    versions: IElectronAPI["versions"];
    darkMode: IElectronAPI["darkMode"];
    electronAPI: IElectronAPI["electronAPI"];
  }
}
