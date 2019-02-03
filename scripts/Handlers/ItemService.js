import $ from 'jquery';
import vars from '../Common/Variables.js';
import Settings from 'electron-settings';
const { dialog, session } = require('electron').remote;
import electronPrompt from 'electron-prompt';
import { EventEmitter } from 'events';

export default class ItemService extends EventEmitter {

	constructor() {
		super();
		this.settings = Settings;
		this.canFetchItems = false;
		this.shouldFetchItems = false;
	}

	setup() {
		// Verify session id for tracking items
		if (!this.settings.get('POESESSID')) {
			electronPrompt({
				label: 'No POESESSID was provided. Please provide one if you want to be able to track the items you obtain. If not, then click continue'
			}).then((result) => {
				if (result && result.trim() && result.length === 32) {
					this.settings.set('POESESSID', result);
					this.setCookie(result);
				} else {
					this.canFetchItems = false;
				}
			});
		} else {
			session.defaultSession.cookies.get({ name: 'POESESSID' }, (error, storedCookies) => {
				if (!storedCookies[0]) {
					this.setCookie(this.settings.get('POESESSID'));
				}
			});
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
		const url = `https://www.pathofexile.com/character-window/get-items?accountName=${vars.accountName}&character=${vars.characterName}`;
		$.ajax(url, {
			type: 'GET',
			success: (data) => {
				this.emit('ItemService.NewItems', data.items);
			},
			error: (jqXHR, status, error) => console.log(jqXHR, status, error)
		})
	}

	start() {
		this.fetchItems();
		this.interval = setInterval(() => {
			this.fetchItems();
		}, 60000); // One minute
	}

	stop() {
		clearInterval(this.interval);
	}

	setCookie(sessid) {
		const cookie = {
			url: 'http://www.pathofexile.com',
			name: 'POESESSID',
			value: sessid,
			domain: '.pathofexile.com',
			path: '/',
			secure: false,
			httpOnly: false,
			expirationDate: undefined
		}
		session.defaultSession.cookies.set(cookie, (error) => {
			console.log(error);
		});
	}
}