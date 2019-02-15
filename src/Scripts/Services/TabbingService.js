import $ from 'jquery';
import { remote } from 'electron';

export default class TabbingService {

	constructor() {
		this.previousTab = null;
		this.startedWithFile = false;
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
	}

	changeTab(event) { // #newpage?params
		
		let newPage = 'about', query;
		if (event.target.location.hash) {
			newPage = event.target.location.hash.substring(1).split('?')[0];
			query = event.target.location.hash.substring(1).split('?')[1];
		}

		if (newPage != this.previousTab) {
			$(`#mainContainer`).children().not(`#${newPage}`).hide();
			$(`#${newPage}`).show();
			this.previousTab = newPage;
			if (newPage === 'viewProgression' && !this.startedWithFile) {
				remote.getCurrentWindow().send('load-progression');
			} else if (query === 'create') {
				remote.getCurrentWindow().send('create-progression');
			} else if (query) {
				remote.getCurrentWindow().send('start-with-file', query);
				this.startedWithFile = true;
			}
		} else {
			event.preventDefault();
		}
	}
}