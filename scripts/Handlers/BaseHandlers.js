import $ from 'jquery';
import { shell } from 'electron';

export default class BaseHandlers {

	constructor() {
		this.githubLink = $('#githubRepo');
	}

	addHandlers() {
		this.githubLink.on('click', () => {
			shell.openExternal(this.githubLink.attr('data-linkOut'));
		});
	}
}