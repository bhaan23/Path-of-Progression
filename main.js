const { autoUpdater } = require('electron-updater');
const { app, BrowserWindow, ipcMain } = require('electron');

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
	// win.webContents.openDevTools();

	win.on('close', () => { win = null; app.quit(); });
}

try {
	// Start app
	app.on('ready', () => {
		createWindow();
		setTimeout(() => {
			autoUpdater.checkForUpdates();
		}, 60000); // Let everything load before checking for an update
	});

	// autoUpdater.on('update-downloaded', (info) => {});
	// autoUpdater.on('checking-for-update', (info) => {});
	// autoUpdater.on('update-not-available', (info) => {});
	// autoUpdater.on('download-progress', (progress) => {});


	// Send a message to the window that a new update is downloaded
	autoUpdater.on('update-downloaded', (info) => {
		win.webContents.send('update-downloaded');
	});

	autoUpdater.on('error', (error) => {
		console.log(error);
	});

	// Get rid of menu on load
	app.on('browser-window-created', (e, window) => {
		window.setMenu(null);
	});

	app.on('window-all-closed', () => {
		app.quit();
	});

	ipcMain.on('quit-and-install', () => {
		autoUpdater.quitAndInstall();
	});

	ipcMain.on('app_quit', (event, info) => {
		app.quit();
	});

} catch (e) {
	console.log(e);
}