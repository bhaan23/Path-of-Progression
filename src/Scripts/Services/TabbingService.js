import $ from 'jquery';

export default class TabbingService {

	constructor() { }

	setup() {
		$(window).on('hashchange', (event) => this.changeTab(event));

		// Setup navigation/starting options tabbing
		$('#startingOptions button, #navigation span').each((index, element) => {
			let el = $(element);
			el.on('click', () => {
				window.location.hash = el.find('a').attr('href');
				$(window).trigger('hashchange');
			});
		});
	}

	changeTab(event) {
		const newHash = event.target.location.hash;
		const newPage = newHash ? newHash.split('?')[0].substring(1) : 'about';
		$(`#mainContainer`).children().not(`#${newPage}`).hide();
		$(`#${newPage}`).show();
	}
}