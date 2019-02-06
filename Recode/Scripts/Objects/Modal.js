import _ from 'underscore';
// import ModalTemplate from '../../Templates/ModalTemplate.html';

export default class Modal {

	constructor(title, mainHtml, footerHtml) {
		this.title = title;
		this.mainHtml = mainHtml || '';
		this.footerHtml = footerHtml || '';
	}

	draw() {
		const modalTemplate = ``;
		const modalHtml = $(_.template(modalTemplate, {
			title: this.title,
			mainHtml: this.mainHtml,
			footerHtml: this.footerHtml
		}));

		addListeners(modalHtml);
		$('body').prepend(modalHtml);
	}

	erase() {
		$('body').children().first().remove();
	}

	addListeners(modalHtml) {
		
	}
}