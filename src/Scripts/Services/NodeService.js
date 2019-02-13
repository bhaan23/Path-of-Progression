import fs from 'fs';
const { dialog } = require('electron').remote;

export default class NodeService {

	constructor() {
		this.topNodeIds = null;
		this.allNodes = null;
		this.nodeMap = null;
		this.completedNodeIds = null;
		this.needsItemLookup = false;
		this.progressionFileLocation = null;

		this.lastSave = null;
	}

	setup(progressionFile) {
		this.setupShell();
		this.progressionFileLocation = progressionFile;

		const progressionData = fs.readFileSync(progressionFile, { encoding: 'utf-8' });
		if (progressionData) {
			this.allNodes = JSON.parse(progressionData).progression;
			this.createNodeMap();
			this.createDependencyGraph();
		}

		this.createSavePoint();
	}

	setupShell() {
		this.progressionFileLocation = null;
		this.needsItemLookup = false;
		this.topNodeIds = [];
		this.allNodes = [];
		this.nodeMap = {};
		this.completedNodeIds = [];

		this.createSavePoint();
	}

	createEmptyNode() {
		return {
			id: '',
			title: '',
			completionTrigger: '',
			description: '',
			nodesNeeded: [],
			hidden: false,
			completed: false
		}
	}

	addNode(progressionNode) {
		this.allNodes.push(progressionNode);
		this.nodeMap[progressionNode.id] = {
			dependantNodeIds: [],
			progressionData: progressionNode
		}
	}

	removeNode(id) {
		delete this.allNodes[id];
		delete this.nodeMap[id];
	}

	createNodeMap() {
		for (let progressionNode of this.allNodes) {
			if (progressionNode.title) {
				if (Object.keys(this.nodeMap).includes(progressionNode.id)) {
					alert(`Two nodes with the same id:[${progressionNode.id}] have been found. Stopping creation...`);
					throw Error(`A node with id:[${progressionNode.id}] already exists.`);
				}
				if (progressionNode.completed) {
					this.completedNodeIds.push(progressionNode.id);
				} else if (progressionNode.completionTrigger.toLowerCase().startsWith('item|')) {
					this.needsItemLookup = true;
				}
				this.nodeMap[progressionNode.id] = {
					dependantNodeIds: [],
					progressionData: progressionNode
				}
			}
		}
	}

	createDependencyGraph() {
		for (let id of Object.keys(this.nodeMap)) {
			const dependantNodeIds = this.nodeMap[id].progressionData.nodesNeeded;
			let i = 0;
			for (let dependantId of dependantNodeIds) {
				if (!this.completedNodeIds.includes(dependantId)) {
					this.nodeMap[dependantId].dependantNodeIds.push(id);
					i += 1;
				}
			}

			// Top level node
			if (i === 0 && !this.completedNodeIds.includes(id)) {
				this.topNodeIds.push(id);
			}
		}
	}

	createSaveObject() {
		let outputList = [];
		for (let node of this.allNodes) {
			if (this.nodeMap[node.id]) {
				outputList.push(this.nodeMap[node.id].progressionData);
			}
		}

		return JSON.stringify({ progression: outputList }, null, 2);
	}

	createSavePoint() {
		this.lastSave = this.createSaveObject();
	}

	save(filename) {
		const saveData = this.createSaveObject();

		if (filename || this.progressionFileLocation) {
			this._writeSaveData(filename, saveData);
		} else {
			filename = dialog.showSaveDialog({
				filters: [{
					name: 'Progression File', extensions: ['json']
				}]
			});
			if (filename) {
				this._writeSaveData(filename, saveData);
				this.progressionFileLocation = filename;
			}
		}
	}

	_writeSaveData(filename, saveData) {
		fs.writeFile(filename, saveData, { encoding: 'utf-8' }, (error) => {
			if (error) {
				alert('There was an error saving the progression.');
			} else {
				this.lastSave = saveData;
				alert('Your progression was saved as ' + filename);
			}
		});
	}

	canSave() {
		return this.lastSave !== this.createSaveObject();
	}
}