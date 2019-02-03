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

			vars.accountName = accountName;

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

		this.characterNameSelection.on('change', () => {
			vars.characterName = this.characterNameSelection.find('option:selected').text();
		});
	}

	populateCharacterNames(characters) {
		this.characterNameSelection.empty();

		characters.sort((a, b) => {
			if (a.experience == b.experience) {
				return 0;
			}
			return a.experience < b.experience ? -1 : 1
		});

		for (let character of characters) {
			this.characterNameSelection.append($('<option>', {
				value: character.name,
				text: character.name
			}));
		}

		// Set initial character name
		vars.characterName = characters[0].name;

		if (this.characterNameSelection.children.length) {
			this.characterNameSelection.prop('disabled', false);
		} else {
			this.characterNameSelection.prop('disabled', true);
		}
	}
}