import $ from 'jquery';
import _ from 'underscore';
import AlertTemplate from '../../Templates/AlertTemplate.html';
import { AlertType } from './Enums';

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

		// Only allow for four alerts at a time.
		if ($('#alerts').children() > 4) {
			$('#alerts').first().remove();
		}
		setTimeout(() => {
			alertHtml.addClass('showAlert');
		}, 300);


		let timeout;
		switch (this.type) {
			case AlertType.POSITIVE:
				timeout = 1000*5;
				break;
			case AlertType.WARNING:
				timeout = 1000*10;
				break;
			case AlertType.NEGATIVE:
				timeout = 1000*30;
				break;
			case AlertType.MESSAGE:
				timeout = 1000*60;
				break;
		}

		setTimeout(() => {
			if (alertHtml.hasClass('showAlert')) {
				alertHtml.removeClass('showAlert');
				setTimeout(() => {
					alertHtml.remove();
				}, 800);
			}
		}, timeout+300);
	}
}