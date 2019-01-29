import vars from './Variables.js';

export function buildDependencyTree() {
	let allNodes = {};
	let nodeLookup = {};
	let completedNodes = [];
	for (let progressionNode of vars.progressionNodes) {
		if (progressionNode.title && progressionNode.description) {
			if (progressionNode.completed) {
				completedNodes.push(progressionNode);
			}
			allNodes[progressionNode.id] = new Node(progressionNode.id, progressionNode);
			nodeLookup[progressionNode.id] = progressionNode;
		}
	}
	
	let topNodes = [];
	for (let id in allNodes) {
		for (let dependantId of nodeLookup[id].nodesNeeded) {
			allNodes[dependantId].addDependantNode(allNodes[id]);
		}
		if (nodeLookup[id].nodesNeeded.length === 0) {
			topNodes.push(allNodes[id]);
		}
	}

	vars.nodeLookup = nodeLookup;
	vars.topNodes = topNodes;
	vars.completedNodes = completedNodes;
}

class Node {
	constructor(id, data) {
		this.id = id;
		this.data = data;
		this.dependantNodes = [];
	}

	addDependantNode(id) {
		this.dependantNodes.push(id);
	}

	getDependantNodes() {
		return this.dependantNodes;
	}

	getNodeData() {
		return this.data;
	}
}

export class Queue {
	constructor() {
		this.items = [];
	}

	enqueue(element) {
		this.items.push(element);
	}

	dequeue() {
		if (this.items.length) {
			return this.items.shift();
		}
		throw new Exception('No elements to dequeue');
	}

	size() {
		return this.items.length;
	}
}