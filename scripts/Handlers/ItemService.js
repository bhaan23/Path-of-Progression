import $ from 'jquery';
import vars from '../Common/Variables.js';
import Settings from 'electron-settings';
const { dialog } = require('electron').remote;
import electronPrompt from 'electron-prompt';

export default class ItemService {

	constructor(callback) {
		this.settings = Settings;
		this.canFetchItems = false;
		this.shouldFetchItems = false;
		this.callback = callback;
	}

	setup() {
		// Verify session id for tracking items
		if (!localStorage.getItem('POESESSID') && !this.settings.get('POESESSID')) {
			electronPrompt.prompt({
				label: 'No POESESSID was provided. Please provide one if you want to be able to track the items you obtain. If not, then click continue'
			}).then((result) => {
				if (result && result.trim() && result.length === 32) {
					localStorage.setItem('POESESSID', result);
					this.settings.set('POESESSID', result);
				} else {
					this.canFetchItems = false;
				}
			});
		} else if (this.settings.get('POESESSID')) {
			localStorage.setItem('POESESSID', this.settings.get('POESESSID'));
		}

		// Verify account+character name
		if (!vars.accountName || vars.characterName) {
			dialog.showErrorBox('Missing account data', 'You have not set your character or account name. Without this information there is no way to track the items you obtain. Please enter this information if you want to recieve this data.');
		}
	}

	verifyPoeSessionId(id) {
		return true;// TODO find a way to verify
	}

	fetchItems() {
		const url = `www.pathofexile.com/character-window/get-items?accountName=${vars.accountName}&character=${vars.characterName}`;
		$.ajax(url, {
			type: 'GET',
			success: (data) => {
				if (this.callback) {
					this.callback(data);
				}
			},
			error: (jqXHR, status, error) => console.log(jqXHR, status, error)
		})
	}

	start() {
		this.shouldFetchItems = true;
		this.interval = setInterval(() => {
			if (this.canFetchItems) {
				this.fetchItems();
			}
		}, 60000); // One minute
	}

	stop() {
		clearInterval(this.interval);
	}
}