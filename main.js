const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');

let win;

function createWindow() {

	// Create the browser window
	win = new BrowserWindow({
		width: 1400,
		height: 800,
		minWidth: 850,
		minHeight: 600,
		center: true,
		title: 'Path of Progression'
	});
	
	win.maximize();

	// load the home page of the app
	win.loadFile('./src/index.html');

	// Open dev tools for debugging
	win.webContents.openDevTools();

	win.on('close', () => { win = null; });
}

// Start app
app.on('ready', () => {
	createWindow();
	// autoUpdater.checkForUpdates();
});

autoUpdater.on('update-available', (info) => { });

// Send a message to the window that a new update is ready
autoUpdater.on('update-downloaded', () => {
	ipcMain.send('update-ready', { callback: autoUpdater.quitAndInstall });
});


// Get rid of menu on load
app.on('browser-window-created', (e, window) => {
	window.setMenu(null);
});

app.on('window-all-closed', () => {
	app.quit();
});

ipcMain.on('app_quit', (event, info) => {
	app.quit();
});