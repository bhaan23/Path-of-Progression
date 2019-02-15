import $ from 'jquery';
import _ from 'underscore';
import AlertTemplate from '../../Templates/AlertTemplate.html';

export default class Alert {

	constructor(message, type, listenerCallback) {
		this.message = message;
		this.type = type;
		this.listenerCallback = listenerCallback;

		// Proxy to the draw method on initialization
		setTimeout(() => this._draw(), 0);
	}

	_draw() {
		const alertHtml = $(_.template(AlertTemplate)({
			alertType: this.type,
			alertBody: this.message
		}));

		alertHtml.find('.closeIcon').on('click', () => {
			alertHtml.removeClass('showAlert');
			setTimeout(() => {
				alertHtml.remove();
			}, 800);
		});

		this.listenerCallback(alertHtml);
		$('#alerts').append(alertHtml);
		html.addClass('showAlert');
	}
}