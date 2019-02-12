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
		this.progressionFileLocation = progressionFile;
		this.needsItemLookup = false;
		this.topNodeIds = [];
		this.allNodes = [];
		this.nodeMap = {};
		this.completedNodeIds = [];

		const progressionData = fs.readFileSync(progressionFile, { encoding: 'utf-8' });
		if (progressionData) {
			this.allNodes = JSON.parse(progressionData).progression;
			this.createNodeMap();
			this.createDependencyGraph();
		}
	}

	createNodeMap() {
		for (let progressionNode of this.allNodes) {
			if (progressionNode.title) {
				if (Object.keys(this.nodeMap).includes(progressionNode.id)) {
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
				if (!this.topNodeIds.includes(id)) { // Watch for duplicates
					this.topNodeIds.push(id);
				}
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
		return JSON.stringify({ progression: outputList });
	}

	save() {
		const saveData = this.createSaveObject();

		const filename = dialog.showSaveDialog({
			filters: [{
				name: 'Progression File', extensions: ['json']
			}],
			defaultPath: this.progressionFileLocation
		});
		if (filename) {
			fs.writeFile(filename, saveData, { encoding: 'utf-8' }, (error) => {
				if (error) {
					alert('There was an error saving the progression.');
				} else {
					this.lastSave = saveData;
					alert('Your progression was saved as ' + filename);
				}
			});
		}
	}

	canSave() {
		return this.lastSave && this.lastSave !== this.createSaveObject();
	}
}