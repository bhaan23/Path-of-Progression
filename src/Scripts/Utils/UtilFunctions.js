import $ from 'jquery';
import Modal from '../Objects/Modal.js';
const { session, dialog } = require('electron').remote;
import EventTriggers from '../Objects/EventTriggers.js';

export function isValidSessionId(id, accountName, callback) {
	if (!id) {
		return false;
	}
	resetCookie(id, () => {
		$.ajax(`https://www.pathofexile.com/character-window/get-stash-items?accountName=${encodeURIComponent(accountName)}&league=Standard&tabIndex=0`, {
			method: 'GET',
			dataType: 'json',
		}).then((response) => {
			callback(response.numTabs > 0);
		}, (jqXHR) => {
			callback(false, jqXHR.responseJSON.error);
		});
	});
};

export function resetCookie(sessid, callback) {
	const cookie = {
		url: 'http://www.pathofexile.com',
		name: 'POESESSID',
		value: sessid,
		domain: '.pathofexile.com',
		path: '/',
		secure: false,
		httpOnly: false,
		expirationDate: undefined
	};
	
	session.defaultSession.cookies.remove('http://www.pathofexile.com', 'POESESSID', (error) => {
		
		if (!error) {
			session.defaultSession.cookies.set(cookie, (error) => {
				if (!error) {
					callback();
				}
			});
		}
	});
};

export function getDependantNodes(nodeSelectorHtml, callback) {
	let select = $('<select>', {
		multiple: 'multiple',
		autofocus: 'autofocus',
		id: 'dependantNodesSelector',
		size: nodeSelectorHtml.length > 10 ? 10 : nodeSelectorHtml.length
	});
	select.html(nodeSelectorHtml);

	new DepdantNodesModal(select[0].outerHTML, callback).draw();
}

class DepdantNodesModal extends Modal {
	constructor(body, callback) {
		super('Select Dependant Nodes', body, [{
			id: 'modalAddButton',
			class: 'primaryButton',
			text: 'Add'
		}, {
			id: 'modalCancelButton',
			class: 'secondaryButton',
			text: 'Cancel'
		}]);
		this.callback = callback;
	}

	addListeners() {
		super.addListeners();
		$('#modalAddButton').on('click', () => {
			const values = $('#dependantNodesSelector').val();
			this.erase();
			this.callback(values);
		});
		$('#modalCancelButton').on('click', () => this.erase());
	}
}

export function userWantsToSave() {
	const result = dialog.showMessageBox({
		type: 'question',
		buttons: ['Yes', 'No'],
		message: 'Changes have been made, would you like to save?'
	});
	return result === 0; // They said yes
}

export function populateSelectionDropdownsWithEventData(itemSlotSelection, levelSelection, zoneSelection) {
	
	// Item slot population
	itemSlotSelection.html('');

	// Default option
	itemSlotSelection.append($('<option>', {
		value: '',
		class: 'hidden',
		selected: 'selected',
		text: 'Select a slot...'
	}));

	// Populate all other options
	for (let key of Object.keys(EventTriggers.item)) {
		itemSlotSelection.append($('<option>', {
			value: key,
			text: EventTriggers.item[key]
		}));
	}

	// Level population
	levelSelection.html('');

	// Default option
	levelSelection.append($('<option>', {
		value: '',
		class: 'hidden',
		selected: 'selected',
		text: 'Select a level...'
	}));

	// Populate all other options
	for (let key of Object.keys(EventTriggers.level)) {
		levelSelection.append($('<option>', {
			value: key,
			text: key
		}));
	}

	// Zone population
	zoneSelection.html('');

	// Default option
	zoneSelection.append($('<option>', {
		value: '',
		class: 'hidden',
		selected: 'selected',
		text: 'Select an area...'
	}));

	// Populate the other options
	for (let act of Object.keys(EventTriggers.area)) {
		let group = $('<optgroup>', {
			label: act
		});
		for (let zone of Object.keys(EventTriggers.area[act])) {
			group.append($('<option>', {
				value: zone,
				text: EventTriggers.area[act][zone]
			}));
		}
		zoneSelection.append(group);
	}
}