const { autoUpdater } = require('electron-updater');
const { app, BrowserWindow, ipcMain } = require('electron');

let win, popout;

function createMainWindow() {

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

	win.on('close', () => {
		win = null;
		if (popout) {
			popout.close();
		}
		app.quit();
	});
}

function createPopoutWindow(tileHtml) {
	popout = new BrowserWindow({
		height: 120,
		width: 250,
		minWidth: 150,
		minHeight: 80,
		maxWidth: 500,
		maxHeight: 500,
		frame: false,
		resizable: true,
		alwaysOnTop: true,
		skipTaskbar: true,
		show: false
	});

	popout.loadFile('./src/popout.html');
	// popout.webContents.openDevTools();

	popout.once('show', () => {
		popout.webContents.send('tile-data', tileHtml);
	});
	popout.on('close', () => {
		popout = null;
		win.webContents.send('popout-closed');
	});
}

try {
	// Start app
	app.on('ready', () => {
		createMainWindow();
		setTimeout(() => {
			autoUpdater.checkForUpdates();
		}, 20000); // Let everything load before checking for an update
	});

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

	ipcMain.on('app_quit', () => {
		app.quit();
	});

	// For creating an overlay window
	ipcMain.on('create-popout-window', (event, tileHtml) => {
		createPopoutWindow(tileHtml);
	});
	
	// For republishing events from the overlay to the main window
	ipcMain.on('overlay-node-removed', (event, tileId) => {
		win.webContents.send('overlay-node-removed', tileId);
	});

	// For republishing events from the main window to the overlay
	ipcMain.on('overlay-node-reorder', (event, nodeChanges) => {
		if (popout) {
			popout.webContents.send('overlay-node-reorder', nodeChanges);
		}
	});

} catch (e) {
	console.log(e);
}