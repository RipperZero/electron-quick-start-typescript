// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.
const versions = window.versions;
const darkMode = window.darkMode;
const electronAPI = window.electronAPI;

const bindPing = () => {
  document.getElementById("button-ping").addEventListener("click", async () => {
    const res = await electronAPI.ping();

    console.log("handleOnClickBtn res ----- " + res);
  });
};

const bindDarkMode = () => {
  document
    .getElementById("toggle-dark-mode")
    .addEventListener("click", async () => {
      const isDarkMode = await darkMode.toggle();
      document.getElementById("theme-source").innerHTML = isDarkMode
        ? "Dark"
        : "Light";
    });

  document
    .getElementById("reset-to-system")
    .addEventListener("click", async () => {
      await darkMode.system();
      document.getElementById("theme-source").innerHTML = "System";
    });
};

const bindElectronAPI = () => {
  const setButton = document.getElementById("button-title");
  const titleInput = document.getElementById("input-title") as HTMLInputElement;

  setButton.addEventListener("click", () => {
    const title = titleInput.value;
    window.electronAPI.setTitle(title);
  });

  const btn = document.getElementById("button-filePath");
  const filePathElement = document.getElementById("filePath");

  btn.addEventListener("click", async () => {
    const filePath = await window.electronAPI.openFile();
    filePathElement.innerText = filePath ?? "";
  });
};

const IIFE = () => {
  const information = document.getElementById("info");
  information.innerText = `本应用正在使用 Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), 和 Electron (v${versions.electron()})`;

  bindPing();
  bindDarkMode();
  bindElectronAPI();
};
IIFE();
