const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let confirmationWindow;
let gameWindow;
let winModal;
let loseTimeModal;
let loseWrongFlowerModal;
let easterEggWindow;
let bouquetWindow;
let defaultBouquetWindow;
let collectedData = { red: [], yellow: [], blue: [], purple: [] }; // Stores collected flowers


app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        frame: false, // Hide default title bar
        webPreferences: {
            preload: path.join(__dirname, "preload.js"), // Correct preload script path
            contextIsolation: true, // Keep context isolation enabled
            enableRemoteModule: false, // Secure setting
            nodeIntegration: false, // Disable direct node integration
        },
    });

    mainWindow.loadFile('index.html');

    ipcMain.on("close-app", () => {
        app.quit();  // This ensures the app fully quits
    });
    
    ipcMain.on('minimize-app', () => {
        if (mainWindow) {
            mainWindow.minimize();
        }
    });    

    ipcMain.on('navigate-to-second-page', () => {
        if (!mainWindow) {
            mainWindow = new BrowserWindow({
                width: 1000,
                height: 700,
                frame: false, // Hide default title bar
                webPreferences: {
                    preload: path.join(__dirname, "preload.js"), // Correct preload script path
                    contextIsolation: true, // Keep context isolation enabled
                    enableRemoteModule: false, // Secure setting
                    nodeIntegration: false, // Disable direct node integration
                },
            });
        }
        mainWindow.loadFile('second-page.html');
    });

    // Handle the set-selections event
    ipcMain.on('set-selections', (event, selections) => {
        console.log("Received selections:", selections);
 
        global.selections = selections;
    });

    // Handle navigation to the confirmation window
    ipcMain.on('open-confirmation-window', () => {
        confirmationWindow = new BrowserWindow({
            width: 400,
            height: 350,
            resizable: false,
            autoHideMenuBar: true,
            parent: mainWindow,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: false,
            },
        });

        confirmationWindow.loadFile('confirmation-window.html');
    });

    ipcMain.on("close-confirmation-window", () => {
        if (confirmationWindow) {
            confirmationWindow.close();
            confirmationWindow = null;
        }
    });

    ipcMain.on('navigate-to-game', (event, data) => {
        // Close any existing windows before opening the game window
        if (confirmationWindow) {
          confirmationWindow.close();
          confirmationWindow = null;
        }
      
        if (mainWindow) {
            mainWindow.close();
            mainWindow = null;
        }

        if (gameWindow) {
            gameWindow.close();
            gameWindow = null;
        }

        if (loseTimeModal) {
            loseTimeModal.close();
            loseTimeModal = null;
        }

        if (loseWrongFlowerModal) {
            loseWrongFlowerModal.close();
            loseWrongFlowerModal = null;
        }

        gameWindow = new BrowserWindow({
          width: 1000,
          height: 700,
          frame: false,
          webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
          },
        });
      
        gameWindow.loadFile('game.html');
      
        // Send the selections to the game window once it finishes loading
        gameWindow.webContents.once('did-finish-load', () => {
            const selectionsData = global.selections;  // Get the selections data from global
            gameWindow.webContents.send('initialize-game', { selections: selectionsData });
        });
    });

    // Store collected images when received
    ipcMain.on("set-collected", (event, collected) => {
        console.log("Received collected images:", collected);
        collectedData = collected; // Store globally
    });

    ipcMain.on('minimize-game', () => {
        if (gameWindow) {
            gameWindow.minimize();
        }
    }); 

    // Handle navigation to the easter egg window
    ipcMain.on('open-easter-egg-window', () => {
        easterEggWindow = new BrowserWindow({
            width: 400,
            height: 350,
            resizable: false,
            autoHideMenuBar: true,
            parent: gameWindow,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: false,
            },
        });

        easterEggWindow.loadFile('easter-egg-window.html');
    });

    ipcMain.on("close-easter-egg-window", () => {
        if (easterEggWindow) {
            easterEggWindow.close();
            easterEggWindow = null;
        }
    });

    ipcMain.on("resume-game", () => {
        if (gameWindow) {
            gameWindow.webContents.send("resume-game"); // Forward to game.js
        }
    });     

    // Handle win "modal"
    ipcMain.on('open-win-modal', () => {
        winModal = new BrowserWindow({
            width: 400,
            height: 350,
            resizable: false,
            autoHideMenuBar: true,
            parent: gameWindow,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: false,
            },
        });

        winModal.loadFile('win.html');
    });

    // Allow bouquet page to fetch collected data
    ipcMain.handle("get-collected", () => {
        return collectedData;
    });

    ipcMain.on('open-bouquet-page', () => {
        // Close any existing windows before opening the game window
        if (winModal) {
            winModal.close();
            winModal = null;
        }
        
        if (gameWindow) {
            gameWindow.close();
            gameWindow = null;
        }
  
        bouquetWindow = new BrowserWindow({
            width: 1000,
            height: 700,
            frame: false,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                contextIsolation: true,
                enableRemoteModule: false,
                nodeIntegration: false
            },
        });
        
        bouquetWindow.loadFile('bouquet.html');     
    });

    ipcMain.on('minimize-bouquet', () => {
        if (bouquetWindow) {
            bouquetWindow.minimize();
        }
    }); 

    // Handle lose-time "modal"
    ipcMain.on('open-lose-time-modal', () => {
        loseTimeModal = new BrowserWindow({
            width: 400,
            height: 350,
            resizable: false,
            autoHideMenuBar: true,
            parent: gameWindow,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: false,
            },
        });

        loseTimeModal.loadFile('lose-time.html');
    });

    // Handle lose-wrong-flower "modal"
    ipcMain.on('open-lose-wrong-flower-modal', () => {
        loseWrongFlowerModal = new BrowserWindow({
            width: 400,
            height: 350,
            resizable: false,
            autoHideMenuBar: true,
            parent: gameWindow,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: false,
            },
        });

        loseWrongFlowerModal.loadFile('lose-wrong-flower.html');
    });

    ipcMain.on('navigate-to-default-bouquet', (event, data) => {
        // Close any existing windows before opening the default bouquet window
        if (easterEggWindow) {
          easterEggWindow.close();
          easterEggWindow = null;
        }
      
        if (gameWindow) {
            gameWindow.close();
            gameWindow = null;
        }

        defaultBouquetWindow = new BrowserWindow({
          width: 1000,
          height: 700,
          frame: false,
          webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
          },
        });
      
        defaultBouquetWindow.loadFile('default-bouquet.html');
    });

    ipcMain.on('minimize-default-bouquet', () => {
        if (defaultBouquetWindow) {
            defaultBouquetWindow.minimize();
        }
    }); 
    
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

