import $ from 'jquery';
import _ from 'underscore';
import NodeService from './NodeService.js';
const { dialog } = require('electron').remote;
import TileTemplate from '../../Templates/TileTemplate.html';
import { getDependantNodes, userWantsToSave, populateSelectionDropdownsWithEventData } from '../Utils/UtilFunctions.js';
// import ProgressionPreviewService from './ProgressionPreviewService.js';

export default class ProgressionCreationService {

	constructor() {
		this.titleInput = $('#titleInput');
		this.hiddenCheckbox = $('#hiddenInput');
		this.completedCheckbox = $('#completedInput');
		this.descriptionInput = $('#descriptionInput');
		this.comletionTypeSelect = $('#completionType');
		this.zoneSelection = $('#areaInput');
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
		this.deleteCurrentNodeButton = $('#deleteCurrentNodeButton');
		this.createProgressionButton = $('#createProgressionCreate');

		this.currentNodeList = $('#allNodesSelection');
		this.dependantNodesContainer = $('#dependantTiles');
		this.creationContainer = $('#nodeInfo');

		this.nodeService = new NodeService();
		
		this.currentTrigger = [];
		this.currentProgressionNode = {};
	}

	setup() {

		// In case the user does not upload a file to start from
		this.nodeService.setupShell();

		this.titleInput.on('input', () => {
			this.titleInput.css('width', `${this.titleInput.val().length*.9}ch`);
			
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
				this.zoneSelection.removeClass('hidden');
				this.zoneSelection.val('');
				this.itemSlotSelection.addClass('hidden');
				this.levelSelection.addClass('hidden');
				this.modSearchInput.addClass('hidden');
				this.currentTrigger = [null, null];
			} else if (val === 'item') {
				this.zoneSelection.addClass('hidden');
				this.itemSlotSelection.removeClass('hidden');
				this.itemSlotSelection.val('');
				this.levelSelection.addClass('hidden');
				this.modSearchInput.addClass('hidden');
				this.currentTrigger = [null, null, null];
			} else if (val === 'level') {
				this.zoneSelection.addClass('hidden');
				this.itemSlotSelection.addClass('hidden');
				this.levelSelection.removeClass('hidden');
				this.levelSelection.val('');
				this.modSearchInput.addClass('hidden');
				this.currentTrigger = [null, null];
			}
			this.currentTrigger[0] = `[${val}]`;
		});

		this.zoneSelection.on('change', () => {
			this.currentTrigger[1] = `[${this.zoneSelection.val()}]`;
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
			let doSave = false;
			if (!this.nodeService.canSave() || !(doSave = userWantsToSave())) {
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
					this.saveButton.removeClass('hidden');
					this.creationContainer.show();
				}
			} else if (doSave) {
				this.nodeService.save();
			}
		});

		this.addNewNodeButton.on('click', () => {
			this.addNewNode();
		});

		this.saveButton.on('click', () => {
			this.nodeService.save();
		});

		this.createProgressionButton.on('click', () => {
			let doSave = false;
			if (!this.nodeService.canSave() || !(doSave = userWantsToSave())) {
				this.resetSelections();
				this.currentProgressionNode = {};
				this.nodeService.setupShell();
				this.addNewNode();
				this.nodeService.createSavePoint();
				this.saveButton.removeClass('hidden');
				this.creationContainer.show();
			} else if (doSave) {
				this.nodeService.save();
			}
		});

		this.deleteCurrentNodeButton.on('click', () => {
			this.deleteCurrentNode();
		});

		this.addDependantNodesButton.on('click', (event) => {
			const selected = this.currentNodeList.val();
			getDependantNodes(this.findPossibleDependantNodes(), (ids) => this.addDependantNodeIds(ids));
			event.stopPropagation();
		});

		this.currentNodeList.on('change', () => {
			this.setCurrentNode(this.nodeService.nodeMap[this.currentNodeList.val()].progressionData);
		});

		populateSelectionDropdownsWithEventData(this.itemSlotSelection, this.levelSelection, this.zoneSelection);
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

	addNewNode() {
		const newId = this.generateSimpleId();
		let newNode = this.nodeService.createEmptyNode();
		newNode.id = newId;
		newNode.title = `New node ${newId}`;
		newNode.description = `Description for node ${newId}`;
		this.addCurrentNode(newNode, true);
		this.setCurrentNode(newNode);
	}

	addCurrentNode(progressionData, newNode) {
		this.currentNodeList.append($('<option>', {
			value: progressionData.id,
			text: progressionData.title
		}));

		if (this.currentNodeList.children().length > 1) {
			this.addDependantNodesButton.prop('disabled', false);
			this.deleteCurrentNodeButton.removeClass('hidden');
		} else {
			this.deleteCurrentNodeButton.addClass('hidden');
			this.addDependantNodesButton.prop('disabled', true);
		}

		if (newNode === true) {
			this.nodeService.addNode(progressionData);
		}
	}

	deleteCurrentNode() {
		this.currentNodeList.find(`option[value="${this.currentProgressionNode.id}"]`).remove();
		this.nodeService.removeNode(this.currentProgressionNode.id);

		if (this.currentNodeList.children().length === 1) {
			this.addDependantNodesButton.prop('disabled', true);
			this.deleteCurrentNodeButton.addClass('hidden');
		}

		const newSelectedNode = this.currentNodeList.children().first();
		newSelectedNode.attr('selected', 'selected');
		this.currentProgressionNode = {};
		this.setCurrentNode(this.nodeService.nodeMap[newSelectedNode.attr('value')].progressionData);
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
					this.zoneSelection.val(triggerParts[1]);
					break;
			}

			if (triggerParts[2]) {
				this.modSearchInput.val(triggerParts[2]);
			}
		}

		this.dependantNodesContainer.html('');
		if (progressionData.nodesNeeded.length > 0) {
			for (let id of progressionData.nodesNeeded) {
				this.addDependantNode(id);
			}
		}

		this.currentTrigger = triggerParts;
	}

	addDependantNodeIds(ids) {
		for (let id of ids) {
			this.currentProgressionNode.nodesNeeded.push(id);
			this.addDependantNode(id);
		}
	}

	addDependantNode(id) {
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

	// Find only the nodes that can be added as dependants
	// This excludes the node we are adding to, plus those that are already added
	findPossibleDependantNodes() {
		const selected = this.currentNodeList.val();
		const dependants = this.currentProgressionNode.nodesNeeded;
		return this.currentNodeList.children().clone().filter((index, element) => {
			return element.value !== selected && !dependants.includes(element.value);
		});
	}

	resetSelections() {
		this.currentNodeList.html('');
		this.itemSlotSelection.val('');
		this.comletionTypeSelect.val('');
		this.zoneSelection.val('');
		this.itemSlotSelection.val('');
		this.modSearchInput.val('');
		this.levelSelection.val('');
	}

	importFromFile(progressionFile) {
		this.nodeService.setup(progressionFile);
		this.currentProgressionNode = {};
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