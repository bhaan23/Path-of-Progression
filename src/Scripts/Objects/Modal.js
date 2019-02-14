import $ from 'jquery';
import _ from 'underscore';
import ModalTemplate from '../../Templates/ModalTemplate.html';

export default class Modal {

	constructor(header, body, footerButtons) {
		this.header = header;
		this.body = body;
		this.footerButtons = footerButtons;
	}

	draw() {
		const modalHtml = $(_.template(ModalTemplate)({
			header: this.header,
			body: this.body,
			footerButtons: this.footerButtons
		}));

		$('body').prepend(modalHtml);
		this.addListeners();
	}

	erase() {
		$('#modal').remove();
	}

	addListeners() {
		$('#modal').on('click', (event) => {
			event.stopPropagation();
		});
		$('#modalCloseIcon').on('click', () => this.erase());
	}
}