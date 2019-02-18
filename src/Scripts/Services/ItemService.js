import $ from 'jquery';
import _ from 'underscore';
import { EventEmitter } from 'events';
import Alert from '../Objects/Alert.js';
import { AlertType } from '../Objects/Enums.js';
import SettingsService from './SettingsService.js';
import { StoredSettings } from '../Objects/Enums.js';
import { resetCookie } from '../Utils/UtilFunctions.js';

export default class ItemService extends EventEmitter {

	constructor() {
		super();
		this.sessionId = null;
		this.accountName = null;
		this.characterName = null;
		this.settingsService = SettingsService;
		this.canFetchItems = false;
	}

	setup() {
		let neededValues = [];

		let accountName = this.settingsService.get(StoredSettings.ACCOUNT_NAME);
		if (!accountName) {
			neededValues.push(StoredSettings.ACCOUNT_NAME);
		} else {
			this.accountName = accountName;
		}

		let characterName = this.settingsService.get(StoredSettings.CHARACTER_NAME);
		if (!characterName) {
			neededValues.push(StoredSettings.CHARACTER_NAME);
		} else {
			this.characterName = characterName;
		}

		let sessionId = this.settingsService.get(StoredSettings.SESSION_ID);
		if (!sessionId) {
			neededValues.push(StoredSettings.SESSION_ID);
		} else {
			resetCookie(sessionId, () => {});
		}

		if (neededValues.length > 0) {
			this.canFetchItems = false;
			const alertBody = `We detected that you are looking for things on from your character's inventory. If you do not enter your ${neededValues.join(', ')}, you will not be able to complete these nodes.`;
			new Alert(alertBody, AlertType.WARNING, () => { });
		} else {
			this.canFetchItems = true;
		}
	}

	fetchItems() {
		if (this.canFetchItems) {
			const url = `https://www.pathofexile.com/character-window/get-items?accountName=${this.accountName}&character=${this.characterName}`;
			$.ajax(url, {
				type: 'GET',
				success: (data) => {
					this.emit('ItemService.NewItems', data.items);
				},
				error: (jqXHR, status, error) => console.log(jqXHR, status, error)
			});
		} else {
			new Alert('Missing account data, cannot fetch items.', AlertType.NEGATIVE, () => { });
		}
	}
}