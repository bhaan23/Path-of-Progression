import $ from 'jquery';
import { EventEmitter } from 'events';
import vars from '../Common/Variables.js';
import electronPrompt from 'electron-prompt';
import SettingsService from './SettingsService.js';
import { StoredSettings } from '../Objects/Enums.js';
const { dialog, session } = require('electron').remote;

export default class ItemService extends EventEmitter {

	constructor() {
		super();
		this.settingsService = SettingsService;
		this.poeSessionIdName = 'POESESSID';
		this.canFetchItems = false;
	}

	setup() {
		let neededValues = [];

		let i = 0, sessionId;
		while (i < 3 || sessionId) {
			switch (i) {
				case 0:
					sessionId = $('#sessionIdInput').val();
					break;
				case 1:
					sessionId = this.settingsService.get(StoredSettings.SESSION_ID);
					break;
				case 2:
					neededValues.push(StoredSettings.SESSION_ID);
					break;
			}
			if (!isValidSessionId(sessionId)) {
				sessionId = null;
			}
		}

		let i = 0, accountName;
		while (i < 3 || accountName) {
			switch (i) {
				case 0:
					accountName = $('accountNameInput').val();
					break;
				case 1:
					accountName = this.settingsService.get(StoredSettings.ACCOUNT_NAME);
					break;
				case 2:
					neededValues.push(StoredSettings.ACCOUNT_NAME);
					break;
			}
		}

		let i = 0, characterName;
		while (i < 3 || characterName) {
			switch (i) {
				case 0:
					characterName = $('characterNamesDropdown option:selected').text();
					break;
				case 1:
					characterName = this.settingsService.get(StoredSettings.CHARACTER_NAME);
					break;
				case 2:
					neededValues.push(StoredSettings.CHARACTER_NAME);
					break;
			}
		}

		if (neededValues.length > 0) {
			this.canFetchItems = false;
		} else {
			this.canFetchItems = true;
		}
	}

	verifyPoeSessionId(id) {
		if (!id) {
			return false;
		}
		return true;// TODO find a way to verify
	}

	fetchItems() {
		const url = `https://www.pathofexile.com/character-window/get-items?accountName=${this.accountName}&character=${this.characterName}`;
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
			name: this.poeSessionIdName,
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