import $ from 'jquery';
import _ from 'underscore';
import { EventEmitter } from 'events';
import SettingsService from './SettingsService.js';
import { StoredSettings } from '../Objects/Enums.js';
import Modal from '../Objects/Modal.js';
const { session } = require('electron').remote;

export default class ItemService extends EventEmitter {

	constructor() {
		super();
		this.sessionId = null;
		this.accountName = null;
		this.characterName = null;
		this.settingsService = SettingsService;
		this.poeSessionIdName = 'POESESSID';
		this.canFetchItems = false;
	}

	setup() {
		let neededValues = [];

		let i = 0;
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
			} else {
				this.sessionId = sessionId;
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
			if (accountName) {
				this.accountName = accountName;
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
			if (characterName) {
				this.characterName = characterName;
			}
		}
		
		if (neededValues.length > 0) {
			this.canFetchItems = false;
			new Modal("You're missing some data!", ``, ``).draw();
			alert('Missing values');
		} else {
			this.canFetchItems = true;
		}
	}

	verifyPoeSessionId(id) {
		if (!id) {
			return false;
		}
		return true; // TODO find a way to verify
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

	resetCookie(sessid) {
		const cookie = {
			url: 'http://www.pathofexile.com',
			name: this.poeSessionIdName,
			value: sessid,
			domain: '.pathofexile.com',
			path: '/',
			secure: false,
			httpOnly: false,
			expirationDate: undefined
		};
		session.defaultSession.cookies.remove('http://www.pathofexile.com', this.poeSessionIdName, (error) => {
			session.defaultSession.cookies.set(cookie, (error) => {
				console.log(error);
			});
		});
	}
}