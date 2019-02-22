import $ from 'jquery';
import _ from 'underscore';
import { ipcRenderer } from 'electron';
import NodeService from './NodeService.js';
const { dialog } = require('electron').remote;
import { getDependantNodes, userWantsToSave, populateSelectionDropdownsWithEventData } from '../Utils/UtilFunctions.js';
import { buildGemLookup } from '../Utils/Converter.js';
import { createNode } from '../Utils/Converter.js';
// import ProgressionPreviewService from './ProgressionPreviewService.js';

export default class ProgressionCreationService {

	constructor() {
		this.titleInput = $('#titleInput');
		this.hiddenCheckbox = $('#hiddenInput');
		this.completedCheckbox = $('#completedInput');
		this.descriptionInput = $('#descriptionInput');
		this.completionTypeSelect = $('#completionType');
		this.zoneSelection = $('#areaInput');
		this.itemSlotSelection = $('#itemSlotSelection');
		this.levelSelection = $('#levelSelection');
		this.modSearchInput = $('#modSearchInput');
		this.gemSelection = $('#gemSelection');
		this.gemSelectionPreview = $('#gemSelectionPreview');
		this.previewTitle = $('#nodePreview .tileTitle');
		this.previewDescription = $('#nodePreview .tileDescription');
		this.progressionPreview = $('#progressionPreview');
		this.currentSaveFile = $('#currentSaveFile');

		this.group2 = $('#group2');
		this.group3 = $('#group3');

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
			this.currentNodeList.find(':selected').text(text);
		});

		this.hiddenCheckbox.on('change', () => {
			this.currentProgressionNode.hidden = this.hiddenCheckbox.is(':checked');
		});

		this.completedCheckbox.on('change', () => {
			this.currentProgressionNode.completed = this.completedCheckbox.is(':checked');
		});

		this.descriptionInput.on('input', () => {
			const text = this.descriptionInput.val() || '';
			this.previewDescription.text(text);
			this.currentProgressionNode.description = text;
		});

		this.completionTypeSelect.on('change', () => {
			const val = this.completionTypeSelect.val() || '';
			this.group2.children().addClass('hidden');
			this.group3.children().addClass('hidden');
			this.gemSelectionPreview.addClass('hidden');
			this.gemSelectionPreview.html('');
			if (val === 'area') {
				this.zoneSelection.removeClass('hidden');
				this.zoneSelection.val('');
				this.currentProgressionNode.completionTrigger = [null, null];
			} else if (val === 'item') {
				this.itemSlotSelection.removeClass('hidden');
				this.itemSlotSelection.val('');
				this.currentProgressionNode.completionTrigger = [null, null, null];
			} else if (val === 'level') {
				this.levelSelection.removeClass('hidden');
				this.levelSelection.val('');
				this.currentProgressionNode.completionTrigger = [null, null];
			} else if (val === 'gems') {
				this.gemSelection.removeClass('hidden');
				this.gemSelection.val('');
				this.gemSelectionPreview.removeClass('hidden');
				this.currentProgressionNode.completionTrigger = [null, null];
			} else if (!val) {
				return;
			}
			this.currentProgressionNode.completionTrigger[0] = `${val}`;
		});

		this.zoneSelection.on('change', () => {
			this.currentProgressionNode.completionTrigger[1] = this.zoneSelection.val();
		});

		this.gemSelection.on('change', () => {
			const values = this.gemSelection.val();
			this.currentProgressionNode.completionTrigger[1] = values.join(',');
			this.gemSelectionPreview.html('');
			for (let value of values) {
				this.gemSelectionPreview.append(buildGemLookup(value));
			}
		});

		this.itemSlotSelection.on('change', () => {
			this.currentProgressionNode.completionTrigger[1] = this.itemSlotSelection.val();
			this.modSearchInput.removeClass('hidden');
		});

		this.levelSelection.on('change', () => {
			this.currentProgressionNode.completionTrigger[1] = this.levelSelection.val();
		});

		this.modSearchInput.on('input', () => {
			const val = this.modSearchInput.val();
			this.modSearchInput.css('width', `${val.length*.9}ch`);
			this.currentProgressionNode.completionTrigger[2] = val;
		});

		this.uploadButton.on('click', () => {
			let doSave = false;
			this.saveCurrentNode();
			if (!this.nodeService.canSave() || !(doSave = userWantsToSave())) {
				const filenames = dialog.showOpenDialog({
					filters: [{
						name: 'JSON', extensions: ['json']
					}],
					properties: [
						'openFile'
					]
				});
	
				if (filenames && filenames.length > 0) {
					this.importFromFile(filenames[0]);
					this.currentSaveFile.text(filenames[0].substr(filenames[0].lastIndexOf('\\')+1));
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
			this.saveCurrentNode();
			this.nodeService.save();
			this.currentSaveFile.text(this.nodeService.progressionFileLocation.substr(this.nodeService.progressionFileLocation.lastIndexOf('\\')+1));
		});

		ipcRenderer.on('create-progression', () => {
			this.nodeService.setupShell();
			this.createProgressionButton.click();
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

		populateSelectionDropdownsWithEventData(this.itemSlotSelection, this.levelSelection, this.zoneSelection, this.gemSelection);
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
		
		for (let node of Object.keys(this.nodeService.nodeMap)) {
			const index = this.nodeService.nodeMap[node].progressionData.nodesNeeded.indexOf(this.currentProgressionNode.id);
			if (index > -1) {
				this.nodeService.nodeMap[node].progressionData.nodesNeeded = this.nodeService.nodeMap[node].progressionData.nodesNeeded.filter((value, arrIndex) => { return index != arrIndex; })
			}
		}

		this.currentNodeList.find(`option[value="${this.currentProgressionNode.id}"]`).remove();
		this.nodeService.removeNode(this.currentProgressionNode.id);
		const newSelectedNode = this.currentNodeList.children().first();
		newSelectedNode.attr('selected', 'selected');
		if (this.currentNodeList.children().length === 1) {
			this.addDependantNodesButton.prop('disabled', true);
			this.deleteCurrentNodeButton.addClass('hidden');
		}
		
		this.currentProgressionNode = {};
		this.setCurrentNode(this.nodeService.nodeMap[newSelectedNode.attr('value')].progressionData);
	}

	setCurrentNode(progressionData) {

		if (this.currentProgressionNode.title) {
			this.saveCurrentNode();
		}

		this.currentProgressionNode = progressionData;

		this.currentNodeList.val(progressionData.id);
		this.titleInput.val(progressionData.title);
		this.titleInput.trigger('input');
		this.descriptionInput.val(progressionData.description);
		this.descriptionInput.trigger('input');
		this.hiddenCheckbox.attr('checked', progressionData.hidden);
		this.hiddenCheckbox.change();
		this.completedCheckbox.attr('checked', progressionData.completed);
		this.completedCheckbox.change();
		
		const triggerParts = progressionData.completionTrigger.toLowerCase().split('|');
		this.gemSelectionPreview.html('');
		if (triggerParts.length > 1) {
			this.completionTypeSelect.val(triggerParts[0]);
			this.completionTypeSelect.change();
			this.modSearchInput.val('');

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
				case 'gems':
					this.gemSelection.val(triggerParts[1].split(','));
					this.gemSelection.change();
					break;
			}

			if (triggerParts[2]) {
				this.modSearchInput.val(triggerParts[2]);
			}
		} else {
			this.completionTypeSelect.val('');
			this.completionTypeSelect.change();
			this.modSearchInput.val('');
		}

		this.dependantNodesContainer.html('');
		if (progressionData.nodesNeeded.length > 0) {
			for (let id of progressionData.nodesNeeded) {
				this.addDependantNode(id);
			}
		}

		this.currentProgressionNode.completionTrigger = triggerParts || [];
	}

	addDependantNodeIds(ids) {
		for (let id of ids) {
			this.addDependantNode(id);
			this.currentProgressionNode.nodesNeeded.push(id);
		}
	}

	addDependantNode(id) {
		let dependant = $(createNode({
			hidden: false,
			id,
			title: this.nodeService.nodeMap[id].progressionData.title,
			description: this.nodeService.nodeMap[id].progressionData.description,
			completionTrigger: this.nodeService.nodeMap[id].progressionData.completionTrigger
		}, '1'));

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
		return this.currentNodeList.children().clone().sort((a, b) => {
			const aVal = parseInt(a.value);
			const bVal = parseInt(b.value);
			if (aVal < bVal) {
				return 1;
			} else if (aVal > bVal) {
				return -1;
			}
			return 0;
		}).filter((index, element) => {
			return element.value !== selected && !dependants.includes(element.value);
		});
	}

	saveCurrentNode() {
		if (!$.isEmptyObject(this.currentProgressionNode)) {
			this.nodeService.nodeMap[this.currentProgressionNode.id].progressionData = this.currentProgressionNode;
			this.nodeService.nodeMap[this.currentProgressionNode.id].progressionData.completionTrigger = 
					this.currentProgressionNode.completionTrigger instanceof Array ? this.currentProgressionNode.completionTrigger.join('|') : this.currentProgressionNode.completionTrigger;
		}
	}

	resetSelections() {
		this.currentNodeList.html('');
		this.itemSlotSelection.val('');
		this.completionTypeSelect.val('');
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
		return newId.toString();
	}
}