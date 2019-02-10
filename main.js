import { app, BrowserWindow, session } from 'electron';
import settings from 'electron-settings';

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
	
	// win.maximize();

	// load the home page of the app
	win.loadFile('./src/index.html');

	// Open dev tools for debugging
	win.webContents.openDevTools();

	session.defaultSession.cookies.get({ name: 'POESESSID' }, (error, cookies) => {
		if (cookies[0]) {
			settings.set('POESESSID', cookies[0].value);
		}
	});
}

app.on('ready', createWindow);
app.on('browser-window-created', (e, window) => {
	window.setMenu(null);
});