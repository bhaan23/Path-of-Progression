import $ from 'jquery';
import Alert from '../Objects/Alert';
import { AlertType } from '../Objects/Enums';
import { shell, ipcRenderer } from 'electron';
const { app } = require('electron').remote;

export default class ExternalService {

	constructor() {	}

	setup() {
		$('*[data-linkout]').each((index, element) => {
			let el = $(element);
			el.on('click', () => {
				shell.openExternal(el.attr('data-linkout'));
			})
		});

		ipcRenderer.on('update-downloaded', (event, data) => {
			const alertBody = 'An update is available. Click <a class="normalLink">here</a> to restart now.';
			new Alert(alertBody, AlertType.MESSAGE, (html) => {
				html.find('a').on('click', () => { ipcRenderer.sendSync('quit-and-install'); });
			});
		});

		$('#version').text(app.getVersion());
	}
}