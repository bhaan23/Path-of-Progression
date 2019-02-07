import $ from 'jquery';

export default class TabbingService {

	constructor() { }

	setup() {
		$(window).on('hashchange', (event) => this.changeTab(event));
	}

	changeTab(event) {
		const newHash = event.target.location.hash;
		const newPage = newHash ? newHash.split('?')[0].substring(1) : 'about';
		$(`#mainContainer`).children().hide();
		$(`#${newPage}`).show();
	}
}