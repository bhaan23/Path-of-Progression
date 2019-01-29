import fs from 'fs';
import $ from 'jquery';
import vars from '../Common/Variables.js';
import BaseHandlers from './BaseHandlers.js';
import ProgressionNodesHandler from './ProgressionNodesHandler.js';
const dialog = require('electron').remote.dialog; // Electron dialog is special

export default class ViewProgressionHandlers extends BaseHandlers {

	constructor() {
		super();

		this.accountNameUpdateButton = $('#accountNameUpdate');
		this.accountNameInput = $('#accountName')
		this.characterNameSelection = $('#characterNames');
		this.progressionFileUpload = $('#progressionFile');
	}

	addHandlers() {
		super.addHandlers();

		this.progressionFileUpload.on('click', () => {

			const result = dialog.showOpenDialog({
				filters: [{
					name: 'Progression File', extensions: ['json']
				}],
				properties: [
					'openFile'
				]
			});
			
			if (result) {
				fs.readFile(result[0], { encoding: 'utf-8' }, (error, data) => {
					const progressionNodes = JSON.parse(data);
					vars.progressionNodes = progressionNodes.progression;
					new ProgressionNodesHandler($('#tiles')).drawNodes();
				});
			}
		});

		this.accountNameUpdateButton.on('click', () => {
			const accountName = this.accountNameInput.val();
			if (!accountName) {
				// TODO: Change to some other electron dialog
				alert('You must enter an account name');
				return;
			}

			$.ajax(`https://www.pathofexile.com/character-window/get-characters?accountName=${encodeURIComponent(accountName)}`, {
				method: 'GET',
				success: (response) => this.populateCharacterNames(response),
				error: (xhr, status, error) => {
					alert('There was an error retrieving characters');
					console.log(status, error);
				},
				dataType: 'json'
			});
		});
	}

	populateCharacterNames(response) {
		this.characterNameSelection.empty();

		response.sort((a, b) => {
			if (a.league === 'Betrayal' && b.league === 'Betrayal') {
				return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
			} else if (a.league === 'Betrayal') {
				return -1;
			} else if (b.league === 'Betrayal') {
				return 1;
			} else {
				return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
			}
		});

		for (let character of response) {
			this.characterNameSelection.append($('<option>', {
				value: character.name,
				text: character.name
			}));
		}

		if (this.characterNameSelection.children.length) {
			this.characterNameSelection.prop('disabled', false);
		} else {
			this.characterNameSelection.prop('disabled', true);
		}
	}
}