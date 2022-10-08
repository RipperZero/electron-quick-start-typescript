import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
  MenuItem,
  nativeTheme,
  Response,
} from "electron";
import { join } from "path";
// import path = require("path");

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
    },
  });

  // TODO bluetooth
  // bluetooth(mainWindow);

  createCustomMenu(mainWindow);

  // and load the index.html of the app.
  mainWindow.loadFile(join(__dirname, "../index.html"));
  // load from url
  // mainWindow.loadURL("http://localhost:3000/");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // return mainWindow;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  addToIpcMain();
  const mainWindow = createWindow();

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

// IpcMain
const addToIpcMain = () => {
  // darkMode
  ipcMain.handle("dark-mode:toggle", () => {
    const shouldUseDarkColors = nativeTheme.shouldUseDarkColors;

    if (shouldUseDarkColors) {
      nativeTheme.themeSource = "light";
    }

    if (!shouldUseDarkColors) {
      nativeTheme.themeSource = "dark";
    }

    return shouldUseDarkColors;
  });
  ipcMain.handle("dark-mode:system", () => {
    nativeTheme.themeSource = "system";
  });

  // electronAPI
  ipcMain.handle("ping", () => {
    return "pong";
  });
  ipcMain.on("set-title", (event, title) => {
    const webContents = event.sender;

    const mainWindow = BrowserWindow.fromWebContents(webContents);

    // setTimeout(() => {
    //   mainWindow.setTitle(title);
    // }, 3000);
    mainWindow.setTitle(title);
  });
  ipcMain.handle("dialog:openFile", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(undefined);

    if (canceled) {
      return;
    }

    return filePaths[0];
  });
  ipcMain.on("counter-value", (_event, value) => {
    console.log(value);
  });
};

// @see https://www.electronjs.org/zh/docs/latest/tutorial/devices
// TODO bluetooth
const bluetooth = (mainWindow: BrowserWindow) => {
  mainWindow.webContents.on(
    "select-bluetooth-device",
    (event, deviceList, callback) => {
      event.preventDefault();
      if (deviceList && deviceList.length > 0) {
        callback(deviceList[0].deviceId);
      }
    },
  );

  let bluetoothPinCallback: (response: Response) => void;
  mainWindow.webContents.session.setBluetoothPairingHandler(
    (details, callback) => {
      // Send a message to the renderer to prompt the user to confirm the pairing.
      mainWindow.webContents.send("bluetooth-pairing-request", details);
      bluetoothPinCallback = callback;
    },
  );

  // Listen for a message from the renderer to get the response for the Bluetooth pairing.
  ipcMain.on("bluetooth-pairing-response", (_event, response) => {
    bluetoothPinCallback(response);
  });
};

const createCustomMenu = (mainWindow: BrowserWindow) => {
  // const menu = new Menu();
  // menu.append(
  //   new MenuItem({
  //     label: "Electron",
  //     submenu: [
  //       {
  //         role: "help",
  //         accelerator:
  //           process.platform === "darwin" ? "Alt+Cmd+I" : "Alt+Shift+I",
  //         click: () => {
  //           console.log("Electron rocks!");
  //         },
  //       },
  //     ],
  //   }),
  // );
  // Create the Menu(Counter)
  const menu = Menu.buildFromTemplate([
    {
      label: "Electron",
      submenu: [
        {
          role: "help",
          accelerator:
            process.platform === "darwin" ? "Alt+Cmd+I" : "Alt+Shift+I",
          click: () => {
            console.log("Electron rocks!");
          },
        },
      ],
    },
    {
      label: "Counter",
      submenu: [
        {
          label: "Increment",
          click: () => {
            mainWindow.webContents.send("update-counter", 1);
          },
        },
        {
          label: "Decrement",
          click: () => {
            mainWindow.webContents.send("update-counter", -1);
          },
        },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);
};
