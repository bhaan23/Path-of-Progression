import $ from 'jquery';
const { shell } = require('electron');

export default class ExternalLinkService {

	constructor() {	}

	setup() {
		$('*[data-linkout]').each((index, element) => {
			let el = $(element);
			el.on('click', () => {
				shell.openExternal(el.attr('data-linkout'));
			})
		})

		const githubLink = $('#githubLink');
		githubLink.on('click', () => {
			shell.openExternal(githubLink.find('a').attr('data-linkOut'));
		});
	}
}