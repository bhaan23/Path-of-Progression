import $ from 'jquery';
import _ from 'underscore';
import { EventEmitter } from 'events';
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
			this.characterName = this.settingsService.get(StoredSettings.CHARACTER_NAME);
		}

		let sessionId = this.settingsService.get(StoredSettings.SESSION_ID);
		if (!sessionId) {
			neededValues.push(StoredSettings.SESSION_ID);
		} else {
			resetCookie(sessionId, () => {});
		}

		if (neededValues.length > 0) {
			this.canFetchItems = false;
			// new Modal("You're missing some data!", ``, ``).draw();
			alert("We detected that you are looking for things on from your character's inventory. If you do not enter the needed fields, you will not be able to complete these nodes.");
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
			alert('Missing account data, cannot fetch items.');
		}
	}
}