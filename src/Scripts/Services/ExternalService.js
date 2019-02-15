import $ from 'jquery';
import Alert from '../Objects/Alert';
import { AlertType } from '../Objects/Enums';
const { shell, ipcRenderer } = require('electron');

export default class ExternalService {

	constructor() {	}

	setup() {
		$('*[data-linkout]').each((index, element) => {
			let el = $(element);
			el.on('click', () => {
				shell.openExternal(el.attr('data-linkout'));
			})
		})

		ipcRenderer.on('update-ready', (event, data) => {
			const alertBody = 'An update is available. Click <a class="normalLink">here</a> to restart now';
			new Alert(alertBody, AlertType.MESSAGE, (html) => {
				html.find('a').on('click', () => { data.callback(); });
			});
		});
	}
}