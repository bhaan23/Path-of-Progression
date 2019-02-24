import $ from 'jquery';
import { existsSync } from 'fs';
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

export function resortTiles(container) {
	container.append(container.children().detach().sort((a, b) => {
		const aLev = $(a).attr('data-level');
		const bLev = $(b).attr('data-level');
		if (aLev > bLev) {
			return 1;
		} else if (aLev < bLev) {
			return -1;
		}
		return $(a).text() > $(b).text();
	}));
}

export function getDependantNodes(nodeSelectorHtml, callback) {
	let select = $('<select>', {
		multiple: 'multiple',
		autofocus: 'autofocus',
		id: 'dependantNodesSelector',
		size: Math.max(Math.min(3, nodeSelectorHtml.length), 7)
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

	addListeners(modalHtml) {
		super.addListeners(modalHtml);
		modalHtml.find('#modalAddButton').on('click', () => {
			const values = modalHtml.find('#dependantNodesSelector').val();
			this.erase();
			this.callback(values);
		});
		modalHtml.find('#modalCancelButton').on('click', () => this.erase());
	}
}

export function propmtForClientLog(callback) {
	const message = `We have detected that your Client.txt log has not been entered, or is no longer valid. This is currently a requirement for all progressions.\n
					Please choose your Client.txt log file to get the base functionality.`;
	new ClientLogModal(message, callback).draw();
}

class ClientLogModal extends Modal {
	constructor(body, callback) {
		super('Choose Client.txt file', body, [{
			id: 'modalShowOpenDialog',
			class: 'primaryButton',
			text: 'Choose Client.txt File'
		}]);
		this.callback = callback;
	}

	addListeners(modalHtml) {
		super.addListeners(modalHtml);
		
		modalHtml.find('#modalShowOpenDialog').on('click', () => {
			const filename = getClientLogFilename();
			this.callback(filename);
			this.erase();
		});
	}
}

export function getClientLogFilename() {
	const clientSuggestedPath = existsSync('C:\\Program Files\\Steam\\steamapps\\common\\Path of Exile\\logs') ?
		'C:\\Program Files\\Steam\\steamapps\\common\\Path of Exile\\logs' : 'C:\\Program Files (x86)\\Grinding Gear Games\\Path of Exile\\logs';
	
	const filenames = dialog.showOpenDialog({
		filters: [{
			name: 'Client.txt Log', extensions: ['txt']
		}],
		properties: [
			'openFile'
		],

		// Two default paths for POE logs to help people out
		defaultPath: clientSuggestedPath
	});

	if (filenames && filenames.length > 0) {
		return filenames[0];
	} else {
		return '';
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

export function populateSelectionDropdownsWithEventData(itemSlotSelection, levelSelection, areaTypeAheadList, gemSelection) {
	
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
	areaTypeAheadList.html('');

	// Populate the other options
	for (let act of Object.keys(EventTriggers.area)) {
		let group = $('<div>', {
			class: 'typeAheadGroup',
		});
		group.append($('<span>', {
			class: "typeAheadGroupTitle",
			text: act
		}));

		for (let zone of Object.keys(EventTriggers.area[act])) {
			group.append($('<span>', {
				class: 'typeAheadItem',
				value: zone,
				text: EventTriggers.area[act][zone]
			}));
		}
		areaTypeAheadList.append(group);
	}

	// Equip gem population
	gemSelection.html('');

	// Default option
	gemSelection.append($('<option>', {
		value: '',
		class: 'hidden',
		text: 'Select gems to link...'
	}));

	// Populate the other options
	for (let skillGemType of Object.keys(EventTriggers.gems)) {
		let group = $('<optgroup>', {
			label: skillGemType
		});
		for (let gem of Object.keys(EventTriggers.gems[skillGemType])) {
			group.append($('<option>', {
				value: gem,
				text: EventTriggers.gems[skillGemType][gem]
			}));
		}
		gemSelection.append(group);
	}
}