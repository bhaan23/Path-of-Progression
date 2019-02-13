import $ from 'jquery';
import _ from 'underscore';
import NodeService from './NodeService.js';
const { dialog } = require('electron').remote;
import EventTriggers from '../Objects/EventTriggers.js';
import TileTemplate from '../../Templates/TileTemplate.html';
import { addDependantNodes } from '../Utils/UtilFunctions.js';
// import ProgressionPreviewService from './ProgressionPreviewService.js';

export default class ProgressionCreationService {

	constructor() {
		this.titleInput = $('#titleInput');
		this.hiddenCheckbox = $('#hiddenInput');
		this.completedCheckbox = $('#completedInput');
		this.descriptionInput = $('#descriptionInput');
		this.comletionTypeSelect = $('#completionType');
		this.areaNameInput = $('#areaInput');
		this.areaNameTypeahead = $('#areaInputTypeaheadList');
		this.itemSlotSelection = $('#itemSlotSelection');
		this.levelSelection = $('#levelSelection');
		this.modSearchInput = $('#modSearchInput');
		this.previewTitle = $('#nodePreview .tileTitle');
		this.previewDescription = $('#nodePreview .tileDescription');
		this.progressionPreview = $('#progressionPreview');

		this.uploadButton = $('#createProgressionUpload');
		this.saveButton = $('#createProgressionSave');
		this.addDependantNodesButton = $('#addDependantNodesButton');
		this.addNewNodeButton = $('#addNewNodeButton');

		this.currentNodeList = $('#allNodesSelection');
		this.dependantNodesContainer = $('#dependantTiles');

		this.nodeService = new NodeService();
		
		this.currentTrigger = [];
		this.currentProgressionNode = {};
	}

	setup() {

		// In case the user does not upload a file to start from
		this.nodeService.setupShell();

		this.titleInput.on('input', () => {
			this.modSearchInput.css('width', `${this.modSearchInput.val().length*.9}ch`);
			
			const text = this.titleInput.val() || '';
			this.previewTitle.text(text);
			this.currentProgressionNode.title = text;
		});

		this.hiddenCheckbox.on('change', () => {
			this.currentProgressionNode.hidden = this.hiddenCheckbox.is(':checked');
		});

		this.completedCheckbox.on('change', () => {
			this.currentProgressionNode.completed = this.hiddenCheckbox.is(':checked');
		});

		this.descriptionInput.on('input', () => {
			const text = this.descriptionInput.val() || '';
			this.previewDescription.text(text);
			this.currentProgressionNode.description = text;
		});

		this.comletionTypeSelect.on('change', () => {
			const val = this.comletionTypeSelect.val() || '';
			if (val === 'area') {
				this.areaNameInput.removeClass('hidden');
				this.areaNameInput.val('');
				this.itemSlotSelection.addClass('hidden');
				this.levelSelection.addClass('hidden');
				this.modSearchInput.addClass('hidden');
				this.currentTrigger = [null, null];
			} else if (val === 'item') {
				this.areaNameInput.addClass('hidden');
				this.itemSlotSelection.removeClass('hidden');
				this.itemSlotSelection.val('');
				this.levelSelection.addClass('hidden');
				this.modSearchInput.addClass('hidden');
				this.currentTrigger = [null, null, null];
			} else if (val === 'level') {
				this.areaNameInput.addClass('hidden');
				this.itemSlotSelection.addClass('hidden');
				this.levelSelection.removeClass('hidden');
				this.levelSelection.val('');
				this.modSearchInput.addClass('hidden');
				this.currentTrigger = [null, null];
			}
			this.currentTrigger[0] = `[${val}]`;
		});

		this.areaNameInput.on('change', () => {
			this.currentTrigger[1] = `[${this.areaNameInput.val()}]`;
		});

		this.itemSlotSelection.on('change', () => {
			const val = this.itemSlotSelection.val();
			this.currentTrigger[1] = `[${val}]`;
			this.modSearchInput.removeClass('hidden');
		});

		this.levelSelection.on('change', () => {
			this.currentTrigger[1] = `[${this.levelSelection.val()}]`;
		});

		this.modSearchInput.on('input', () => {
			this.modSearchInput.css('width', `${this.modSearchInput.val().length*.9}ch`);
		});

		this.uploadButton.on('click', () => {
			const filenames = dialog.showOpenDialog({
				filters: [{
					name: 'Progression', extensions: ['json']
				}],
				properties: [
					'openFile'
				],
				defaultPath: this.progressionFileHelpPath ? this.progressionFileHelpPath : null
			});

			if (filenames && filenames.length > 0) {
				this.importFromFile(filenames[0]);
				this.saveButton.prop('disabled', false);
			}
		});

		this.addNewNodeButton.on('click', () => {
			const newId = this.generateSimpleId();
			let newNode = this.nodeService.createEmptyNode();
			newNode.id = newId;
			newNode.title = `New node ${newId}`;
			this.addCurrentNode(newNode, true);
			this.setCurrentNode(newNode);
		});

		this.saveButton.on('click', () => {
			this.nodeService.save();
		});

		this.addDependantNodesButton.on('click', () => {
			addDependantNodes(this.currentNodeList.children().not(':selected'));
		});

		this.currentNodeList.on('change', () => {
			this.setCurrentNode(this.nodeService.nodeMap[this.currentNodeList.val()].progressionData);
		});

		this.populateItemSlotsDropdown();
		this.populateLevelDropdown();
		this.populateZones();
	}

	populateItemSlotsDropdown() {
		this.itemSlotSelection.html('');

		// Default option
		this.itemSlotSelection.append($('<option>', {
			value: '',
			class: 'hidden',
			selected: 'selected',
			text: 'Select a slot...'
		}));

		// Populate all other options
		for (let key of Object.keys(EventTriggers.item)) {
			this.itemSlotSelection.append($('<option>', {
				value: key,
				text: EventTriggers.item[key]
			}));
		}
	}

	populateLevelDropdown() {
		this.levelSelection.html('');

		// Default option
		this.levelSelection.append($('<option>', {
			value: '',
			class: 'hidden',
			selected: 'selected',
			text: 'Select a level...'
		}));

		// Populate all other options
		for (let key of Object.keys(EventTriggers.level)) {
			this.levelSelection.append($('<option>', {
				value: key,
				text: key
			}));
		}
	}

	populateZones() {
		this.areaNameInput.html('');

		// Default option
		this.areaNameInput.append($('<option>', {
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
			this.areaNameInput.append(group);
		}
	}

	populateCurrentNodes() {
		this.currentNodeList.html('');
		for (let key of Object.keys(this.nodeService.nodeMap)) {
			this.addCurrentNode(this.nodeService.nodeMap[key].progressionData);
		}
		
		const firstNodeId = this.nodeService.topNodeIds[0];
		if (firstNodeId) {
			this.setCurrentNode(this.nodeService.nodeMap[firstNodeId].progressionData);
		}
	}

	addCurrentNode(progressionData, newNode) {
		this.currentNodeList.append($('<option>', {
			value: progressionData.id,
			text: progressionData.title
		}));

		if (this.currentNodeList.children().length > 1) {
			this.addDependantNodesButton.prop('disabled', false);
		}

		if (newNode === true) {
			this.nodeService.addNode(progressionData);
		}
	}

	setCurrentNode(progressionData) {

		if (this.currentProgressionNode.title) {
			this.nodeService.nodeMap[this.currentProgressionNode.id].progressionData = this.currentProgressionNode;
		}

		this.currentProgressionNode = progressionData;

		this.currentNodeList.val(progressionData.id);
		this.titleInput.val(progressionData.title);
		this.titleInput.trigger('input');
		this.descriptionInput.val(progressionData.description);
		this.descriptionInput.trigger('input');
		this.hiddenCheckbox.attr('checked', progressionData.hidden);
		this.completedCheckbox.attr('checked', progressionData.completed);
		
		const triggerParts = progressionData.completionTrigger.toLowerCase().split('|');
		if (triggerParts.length > 1) {
			this.comletionTypeSelect.val(triggerParts[0]);
			this.comletionTypeSelect.change();

			switch (triggerParts[0]) {
				case 'item':
					this.itemSlotSelection.val(triggerParts[1]);
					this.itemSlotSelection.change();
					break;
				case 'level':
					this.levelSelection.val(triggerParts[1]);
					break;
				case 'area':
					this.areaNameInput.val(triggerParts[1]);
					break;
			}

			if (triggerParts[2]) {
				this.modSearchInput.val(triggerParts[2]);
			}
		}

		this.dependantNodesContainer.html('');
		if (progressionData.nodesNeeded.length > 0) {
			for (let id of progressionData.nodesNeeded) {
				let dependant = $(_.template(TileTemplate)({
					level: '1',
					progression: {
						hidden: false,
						id,
						title: this.nodeService.nodeMap[id].progressionData.title,
						description: this.nodeService.nodeMap[id].progressionData.description
					}
				}));

				// Close icon removes the node
				dependant.find('.closeIcon').on('click', () => {

					// Remove from it's dependant nodes
					this.nodeService.nodeMap[this.currentProgressionNode.id].progressionData.nodesNeeded = this.nodeService.nodeMap[this.currentProgressionNode.id].progressionData.nodesNeeded.filter((value) => { return value != id; });

					// Remove the html
					dependant.remove();
				});
				this.dependantNodesContainer.append(dependant);
			}
		}

		this.currentTrigger = triggerParts;
	}

	importFromFile(progressionFile) {
		this.nodeService.setup(progressionFile);
		this.populateCurrentNodes();
	}

	generateSimpleId() {
		let newId = 1;
		const idList = this.nodeService.nodeMap ? Object.keys(this.nodeService.nodeMap) : [];
		while (idList.includes(newId.toString())) {
			newId += 1;
		}
		return newId;
	}
}