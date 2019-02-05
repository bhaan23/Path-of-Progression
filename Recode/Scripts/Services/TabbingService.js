import $ from 'jquery';
import { shell } from 'electron';

export default class TabbingService {

	constructor() { }

	setup() {
		$(window).on('hashchange', (event) => this.changeTab(event));

		// This will also handle the link out to the github page
		let github = $('#githubLink');
		github.on('click', () => {
			shell.openExternal(github.find('a').attr('data-linkOut'));
		});
	}

	changeTab(event) {
		const newHash = event.target.location.hash;
		const newPage = newHash ? newHash.split('?')[0].substring(1) : 'about';
		$(`#mainContainer`).children().hide();
		$(`#${newPage}`).show();
	}
}