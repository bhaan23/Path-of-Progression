import $ from 'jquery';
import Settings from './SettingsService.js';
import { StoredSettings } from '../Objects/Enums.js';
const { shell, dialog } = require('electron').remote;
import ProgressionService from './ProgressionService.js';
import { isValidSessionId } from '../Utils/UtilFunctions.js';

export default class UserInteractionService {
	
	constructor() {
		this.githubLink = $('#githubLink');
		this.accountNameInput = $('#accountNameInput');
		this.characterNameDropdown = $('#characterNamesDropdown');
		this.characterNameUpdate = $('#characterNamesUpdateButton');
		this.sessionIdInput = $('#sessionIdInput');
		this.sessionIdUpdate = $('#sessionIdUpdateButton');
		this.progressionFileDisplay = $('#currentProgressionFile');
		this.progressionFileUploadButton = $('#progressionFileUploadButton');

		this.settings = Settings;
		this.progressionService = null;
	}

	setup() {
		const settingsAccountName = this.settings.get(StoredSettings.ACCOUNT_NAME);
		if (settingsAccountName) {
			this.accountNameInput.val(settingsAccountName);
		}

		const settingsCharacterName = this.settings.get(StoredSettings.CHARACTER_NAME);
		if (settingsCharacterName) {
			this.characterNameDropdown.append($('<option>', {
				value: settingsCharacterName,
				text: settingsCharacterName
			}));
		}

		const settingsSessionId = this.settings.get(StoredSettings.SESSION_ID);
		if (settingsSessionId) {
			this.sessionIdInput.val(settingsSessionId);
		}


		this.githubLink.on('click', () => {
			shell.openExternal(this.githubLink.find('a').attr('data-linkOut'));
		});

		this.accountNameInput.on('input', () => {
			// Remove any letters that aren't able to be part of an account name
			this.accountNameInput.val(this.accountNameInput.val().replace(/[^a-zA-Z0-9_]/g, ''));
		});

		this.characterNameDropdown.on('change', () => {
			const charName = this.characterNameDropdown.val();
			if (charName) {
				this.settings.set(StoredSettings.CHARACTER_NAME, charName);
			}
		});

		this.characterNameUpdate.on('click', () => {
			const accountName = this.accountNameInput.val();
			if (accountName) {
				this.settings.set(StoredSettings.ACCOUNT_NAME, accountName);
				$.ajax(`https://www.pathofexile.com/character-window/get-characters?accountName=${encodeURIComponent(accountName)}`, {
					method: 'GET',
					success: (response) => this.populateCharacterNames(response),
					error: (xhr, status, error) => {
						alert('There was an error retrieving characters');
						console.log(status, error);
					},
					dataType: 'json'
				});
			} else {
				alert('Please enter a valid account name to update your character selection.');
			}
		})

		this.sessionIdInput.on('input', () => {
			// Remove any spaces because they shouldn't be in the session id + substring to the length of a session id
			this.sessionIdInput.val(this.sessionIdInput.val().replace(/\s/g, '').substring(0, 32));
		});

		this.sessionIdUpdate.on('click', () => {
			isValidSessionId(this.sessionIdInput.val(), this.settings.get(StoredSettings.ACCOUNT_NAME), (isValid, response) => {
				if (isValid) {
					this.settings.set(StoredSettings.SESSION_ID, this.sessionIdInput.val());
					alert('Your session id was updated successfully.');
				} else {
					alert(`Your session id was invalid. Here's why it was invalid: ${response.message}`);
				}
			});
		});

		this.progressionFileUploadButton.on('click', () => {
			const filename = dialog.showOpenDialog({
				filters: [{
					name: 'Progression File', extensions: ['json']
				}],
				properties: [
					'openFile'
				]
			});

			if (filename.length > 0) {

				// Clean the infinitely running functions before creating new ones 
				if (this.progressionService) {
					this.progressionService.shutdown();
				}
				this.progressionService = new ProgressionService($('#tiles'));
				this.progressionService.setup(filename[0]);
			}
		});
	}

	populateCharacterNames(characters) {

		// Sort the characters by experience so the lowest level is on top
		characters.sort((a, b) => {
			if (a.experience == b.experience) {
				return 0;
			}
			return a.experience < b.experience ? -1 : 1
		});

		// Clear out the old, bring in the new
		this.characterNameDropdown.empty();
		for (let character of characters) {
			this.characterNameDropdown.append($('<option>', {
				value: character.name,
				text: character.name
			}));
		}

		// Set initial character name
		this.characterNameDropdown.change();

		// Enable the character selection if we have options
		if (this.characterNameDropdown.children.length) {
			this.characterNameDropdown.prop('disabled', false);
		} else {
			this.characterNameDropdown.prop('disabled', true);
		}
	}
}