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
	win.webContents.openDevTools();
}

// Start app
app.on('ready', createWindow);

// Get rid of menu on load
app.on('browser-window-created', (e, window) => {
	window.setMenu(null);
});

// Call to make sure the app closes if closed in an odd way
ipcMain.on('app_quit', (event, info) => {
	app.quit();
});