import { app, ipcMain } from "electron";
import { createCapacitorElectronApp } from "@capacitor-community/electron";
import { autoUpdater } from "electron-updater";
import log from "electron-log";
import isDev from "electron-is-dev";
log.transports.file.level = "debug";
autoUpdater.logger = log;

// process.env.JULEB_ODOO_INTERNAL_URL = "http://localhost";
// The MainWindow object can be accessed via myCapacitorApp.getMainWindow(

autoUpdater.on("checking-for-update", () => {
  log.info("checking-for-update");
});
autoUpdater.on("update-available", (info) => {
  log.info("update-available", info);
});
autoUpdater.on("update-not-available", (info) => {
  log.info("update-not-available", info);
});
autoUpdater.on("error", (err) => {
  log.info("err", err);
});
autoUpdater.on("download-progress", (progressObj) => {
  console.log(`Progress ${Math.floor(progressObj.percent)}`);
  log.info("download progress", progressObj);
});
autoUpdater.on("update-downloaded", (info) => {
  log.info("update-downloaded", info);
  autoUpdater.quitAndInstall();
});

const myCapacitorApp = createCapacitorElectronApp({
  mainWindow: {
    windowOptions: {
      height: 400,
      width: 400,
      webPreferences: {
        webSecurity: false,
      },
    },
  },
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some Electron APIs can only be used after this event occurs.
app.on("ready", () => {
  myCapacitorApp.init();
  if (!isDev) {
    autoUpdater.checkForUpdates();
  }
});

app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");
// app.commandLine.appendSwitch("disable-site-isolation-trials");
// app.commandLine.appendSwitch("disable-account-consistency");
// Quit when all windows are closed.
app.on("window-all-closed", function () {
  app.quit();
});

app.on("activate", function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (myCapacitorApp.getMainWindow().isDestroyed()) myCapacitorApp.init();
});

// Define any IPC or other custom functionality below here
ipcMain.on("app_version", (event) => {
  event.sender.send("app_version", { version: app.getVersion() });
});
