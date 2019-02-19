import $ from 'jquery';
import path from 'path';
import { existsSync } from 'fs';
import { ipcRenderer } from 'electron';
import Alert from '../Objects/Alert.js';
import Settings from './SettingsService.js';
const { dialog } = require('electron').remote;
import { AlertType } from '../Objects/Enums.js';
import { StoredSettings } from '../Objects/Enums.js';
import ProgressionService from './ProgressionService.js';
import { isValidSessionId, userWantsToSave, getClientLogFilename, propmtForClientLog } from '../Utils/UtilFunctions.js';

export default class UserInteractionService {
	
	constructor() {
		this.accountNameInput = $('#accountNameInput');
		this.characterNameDropdown = $('#characterNamesDropdown');
		this.characterNameUpdate = $('#characterNamesUpdateButton');
		this.sessionIdInput = $('#sessionIdInput');
		this.sessionIdUpdate = $('#sessionIdUpdateButton');
		this.progressionFileDisplay = $('#currentProgressionFile');
		this.progressionFileHelpPath = null;
		this.progressionFileUploadButton = $('#progressionFileUploadButton');
		this.clientFileLogPath = null;
		this.clientFileDisplay = $('#currentClientFile');
		this.clientFileUploadButton = $('#clientFileUploadButton');
		this.saveButton = $('#saveButton');

		this.noFileSelectedText = this.clientFileDisplay.text();

		this.settings = Settings;
		this.progressionService = null;
	}

	setup() {
		const settingsAccountName = this.settings.get(StoredSettings.ACCOUNT_NAME);
		if (settingsAccountName) {
			this.accountNameInput.val(settingsAccountName);
			this.characterNameUpdate.prop('disabled', false);
			this.sessionIdUpdate.prop('disabled', false);
		}

		const settingsCharacterName = this.settings.get(StoredSettings.CHARACTER_NAME);
		if (settingsCharacterName) {
			this.characterNameDropdown.append($('<option>', {
				value: settingsCharacterName,
				text: settingsCharacterName
			}));
			this.characterNameDropdown.prop('disabled', false);
		}

		const settingsSessionId = this.settings.get(StoredSettings.SESSION_ID);
		if (settingsSessionId) {
			this.sessionIdInput.val(settingsSessionId);
		}

		const settingsProgressionFile = this.settings.get(StoredSettings.PROGRESSION_FILE);
		if (settingsProgressionFile && existsSync(settingsProgressionFile)) {
			this.progressionFileHelpPath = settingsProgressionFile.substring(0, settingsProgressionFile.lastIndexOf('\\'));
		}

		const settingsClientLogFile = this.settings.get(StoredSettings.CLIENT_FILE_LOCATION);
		if (settingsClientLogFile && existsSync(settingsClientLogFile)) {
			this.clientFileDisplay.text(settingsClientLogFile.substring(settingsClientLogFile.lastIndexOf('\\')+1));
			this.progressionFileUploadButton.prop('disabled', false);
			this.clientFileLogPath = settingsClientLogFile;
		}

		this.accountNameInput.on('input', () => {
			// Remove any letters that aren't able to be part of an account name
			this.accountNameInput.val(this.accountNameInput.val().replace(/[^a-zA-Z0-9_]/g, ''));
			if (this.accountNameInput.val().length > 0) {
				this.characterNameUpdate.prop('disabled', false);
				this.sessionIdUpdate.prop('disabled', false);
			} else {
				this.characterNameUpdate.prop('disabled', true);
				this.sessionIdUpdate.prop('disabled', true);
			}
		});

		this.characterNameDropdown.on('change', () => {
			const charName = this.characterNameDropdown.val();
			if (charName) {
				this.settings.set(StoredSettings.CHARACTER_NAME, charName);
			}
		});

		this.characterNameUpdate.on('click', () => {
			const accountName = this.accountNameInput.val();
			this.updateCharacterNames(accountName);
		});

		this.sessionIdInput.on('input', () => {
			// Remove any spaces because they shouldn't be in the session id + substring to the length of a session id
			this.sessionIdInput.val(this.sessionIdInput.val().replace(/\s/g, '').substring(0, 32));
		});

		this.sessionIdUpdate.on('click', () => {
			const accountName = this.settings.get(StoredSettings.ACCOUNT_NAME) || this.accountNameInput.val();
			if (!accountName) {
				new Alert('Please enter a valid account name to validate your session id.', AlertType.WARNING, () => { });
			} else {
				isValidSessionId(this.sessionIdInput.val(), accountName, (isValid, response) => {
					if (isValid) {
						this.settings.set(StoredSettings.SESSION_ID, this.sessionIdInput.val());
						this.settings.set(StoredSettings.ACCOUNT_NAME, accountName);
						new Alert('Your session id was updated successfully.', AlertType.POSITIVE, () => { });
					} else {
						new Alert(`Your session id was invalid. Here's why: ${response.message}`, AlertType.NEGATIVE, () => { });
					}
				});
				this.updateCharacterNames(accountName);
			}
		});

		this.progressionFileUploadButton.on('click', () => {
			if (this.clientFileDisplay.text() === this.noFileSelectedText) {
				new Alert('You cannot track a progression without uploading your Client.txt file.', AlertType.NEGATIVE, () => { });
			} else {
				const filenames = dialog.showOpenDialog({
					filters: [{
						name: 'JSON', extensions: ['json']
					}],
					properties: [
						'openFile'
					],
					defaultPath: this.progressionFileHelpPath ? this.progressionFileHelpPath : null
				});

				if (filenames && filenames.length > 0) {
					this.setupProgressionService(filenames[0], true);
					this.saveButton.removeClass('hidden');
				} else {
					this.progressionFileDisplay.text(this.noFileSelectedText);
					this.saveButton.addClass('hidden');
				}
			}
		});

		this.clientFileUploadButton.on('click', () => {
			const filename = getClientLogFilename();
			this.validateClientLog(filename);
		});

		this.saveButton.on('click', () => {
			this.progressionService.save();
			this.progressionFileDisplay.text(this.progressionService.nodeService.progressionFileLocation.substr(
				this.progressionService.nodeService.progressionFileLocation.lastIndexOf('\\')+1));
		});

		// Check if the user wants to save data before the app closes
		$(window).on('beforeunload', (event) => {
			if (this.progressionService.canSave()) {
				if (userWantsToSave()) { // Yes
					event.preventDefault();
					event.returnValue = false;
					setTimeout(() => { $('#saveButton').click(); }, 1000);
					return false;
				}
			}
		});

		// One time function for reloading your last file
		ipcRenderer.once('load-progression', () => {
			if (!this.clientFileLogPath) {
				propmtForClientLog((filename) => {
					if (this.validateClientLog(filename)) {
						const lastFileUsed = this.settings.get(StoredSettings.PROGRESSION_FILE);
						if (existsSync(lastFileUsed)) {
							this.loadKnownProgression(lastFileUsed);
							this.saveButton.removeClass('hidden');
						}
					}
				});
			}
		});

		// Function for handling the about page button clicks
		ipcRenderer.on('start-with-file', (event, file) => {
			if (file === 'EEGuide' || file === 'Speed') {
				this.loadKnownProgression(path.resolve(__dirname, `..\\..\\..\\${file}.json`));
				this.saveButton.removeClass('hidden');
			}
		});
	}

	updateCharacterNames(accountName) {
		if (accountName) {
			this.settings.set(StoredSettings.ACCOUNT_NAME, accountName);
			$.ajax(`https://www.pathofexile.com/character-window/get-characters?accountName=${encodeURIComponent(accountName)}`, {
				method: 'GET',
				success: (response) => this.populateCharacterNames(response),
				error: (xhr, status, error) => {
					new Alert('There was an error retrieving characters', AlertType.NEGATIVE, () => { });
					console.log(status, error);
				},
				dataType: 'json'
			});
		} else {
			new Alert('Please enter a valid account name to update your character selection.', AlertType.WARNING, () => { });
		}
	}

	loadKnownProgression(progressionFile) {
		if (this.clientFileLogPath) {
			this.setupProgressionService(progressionFile, false);
			this.progressionService.nodeService.progressionFileLocation = ''; // Don't allow overwritting of base files
		} else {
			propmtForClientLog((filename) => {
				if (this.validateClientLog(filename)) {
					this.loadKnownProgression(progressionFile);
				}
			})
		}
	}

	setupProgressionService(filename, saveProgressionFileLocation) {
		// Clean the infinitely running functions before creating new ones 
		if (this.progressionService) {
			this.progressionService.shutdown();
		}
		this.progressionService = new ProgressionService($('#tiles'));
		this.progressionService.setup(filename);
		this.progressionFileDisplay.text(filename.substring(filename.lastIndexOf('\\')+1));
		if (saveProgressionFileLocation) {
			this.settings.set(StoredSettings.PROGRESSION_FILE, filename);
		}
	}

	validateClientLog(filename) {
		if (filename) {
			if (existsSync(filename) && filename.toLowerCase().endsWith('client.txt')) {
				this.settings.set(StoredSettings.CLIENT_FILE_LOCATION, filename);
				this.clientFileDisplay.text(filename.substring(filename.lastIndexOf('\\')+1));
				this.progressionFileUploadButton.prop('disabled', false);
				this.clientFileLogPath = filename;
				return true;
			} else {
				this.progressionFileDisplay.text(this.noFileSelectedText);
			}
		}
		return false;
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