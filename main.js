import { app, BrowserWindow } from 'electron';

let win;

function createWindow() {

	// Create the browser window
	win = new BrowserWindow();
	
	// Until css is better, this is how it's gonna be
	win.maximize();

	// load the home page of the app
	win.loadFile('./pages/viewProgression.html');

	// Open dev tools for debugging
	win.webContents.openDevTools();
}

app.on('ready', createWindow);