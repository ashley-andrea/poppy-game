// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Expose `ipcRenderer` methods to the renderer process securely
contextBridge.exposeInMainWorld('electron', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
});

contextBridge.exposeInMainWorld("myApp", {

    // First page
    closeApp: () => ipcRenderer.send("close-app"),
    minimizeApp: () => ipcRenderer.send("minimize-app"),
    navigateToSecondPage: () => ipcRenderer.send("navigate-to-second-page"),

    // Selection page
    openConfirmationWindow: () => ipcRenderer.send("open-confirmation-window"),
    closeConfirmationWindow: () => ipcRenderer.send("close-confirmation-window"),
    navigateToGame: () => ipcRenderer.send("navigate-to-game"),
    setSelections: (selections) => ipcRenderer.send('set-selections', selections),

    // Game page
    minimizeGame: () => ipcRenderer.send("minimize-game"),
    initializeGame: (callback) => ipcRenderer.on("initialize-game", (event, data) => callback(data)),
    setCollected: (collected) => ipcRenderer.send('set-collected', collected),
    openEasterEggWindow: () => ipcRenderer.send("open-easter-egg-window"),
    openWinModal: () => ipcRenderer.send("open-win-modal"),
    openLoseTimeModal: () => ipcRenderer.send("open-lose-time-modal"),
    openLoseWrongFlowerModal: () => ipcRenderer.send("open-lose-wrong-flower-modal"),

    // Modals
    openBouquetPage: () => ipcRenderer.send("open-bouquet-page"),
    restartGame: () => ipcRenderer.send("restart-game"),
    resetGame: () => ipcRenderer.send("reset-game"),

    // Easter egg page
    closeEasterEggWindow: () => ipcRenderer.send("close-easter-egg-window"),
    resumeGame: () => ipcRenderer.send("resume-game"),
    navigateToDefaultBouquet: () => ipcRenderer.send("navigate-to-default-bouquet"),

    // Bouquet pages
    getCollected: () => ipcRenderer.invoke("get-collected"),
    minimizeDefaultPage: () => ipcRenderer.send("minimize-default-bouquet"),
    minimizeBouquetPage: () => ipcRenderer.send("minimize-bouquet")
});
