import $ from 'jquery';
const { ipcMain } = require('electron').remote;

export default class TabbingService {

	constructor() {
		this.previousTab = null;
	}

	setup() {
		$(window).on('hashchange', (event) => this.changeTab(event));

		// Setup navigation/starting options tabbing
		$('#startingOptions button, #navigation span').each((index, element) => {
			let el = $(element);
			el.on('click', (event) => {
				window.location.hash = el.find('a').attr('href');
				$(window).trigger('hashchange');
				event.preventDefault();
			});
		});

		// Set an initial hash
		window.location.hash = 'about';
		this.previousTab = 'about';

		// If the window is ever closed not by hitting the 'x' icon, send an event to shut things down
		$(window).on('unload', () => {
			ipcMain.emit('app_quit');
		});
	}

	changeTab(event) {
		const newHash = event.target.location.hash;
		const newPage = newHash ? newHash.split('?')[0].substring(1) : 'about';
		if (newPage != this.previousTab) {
			$(`#mainContainer`).children().not(`#${newPage}`).hide();
			$(`#${newPage}`).show();
			this.previousTab = newPage;
			if (newPage === 'viewProgression') {
				$(document).trigger('load-progression-file');
			} else if (newHash.split('?').length > 1) {
				$(document).trigger('start-with-file', newHash.split('?')[1]);
			}
		} else {
			event.preventDefault();
		}
	}
}