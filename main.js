import { app, BrowserWindow, session } from 'electron';
import settings from 'electron-settings';

let win;

function createWindow() {

	// Create the browser window
	win = new BrowserWindow({
		'minWidth': 850,
		'minHeight': 600 
	});
	
	// Until css is better, this is how it's gonna be
	win.maximize();

	// load the home page of the app
	// win.loadFile('./pages/viewProgression.html');
	win.loadFile('./Recode/index.html');

	// Open dev tools for debugging
	win.webContents.openDevTools();

	session.defaultSession.cookies.get({ name: 'POESESSID' }, (error, cookies) => {
		if (cookies[0]) {
			settings.set('POESESSID', cookies[0].value);
		}
	});
}

app.on('ready', createWindow);