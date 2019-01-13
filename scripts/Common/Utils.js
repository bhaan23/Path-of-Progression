import vars from './Variables.js';

export function buildProgressionMap() {
	let progressionNodeMap = {};
	for (let progressionNode of vars.progressionNodes) {
		vars.progressionNodeMap[progressionNode.id] = progressionNode;
	}
	vars.progressionNodeMap = progressionNodeMap;
}

export function buildNodeDependencyGroups() {
	let nodeDependencyGroups = {};
	vars.largestParentLevel = {};
	for (let id in progressionNodeMap) {

		// Check for now for irrelevant nodes sitting empty in a progression file
		if (!progressionNodeMap[id].title) { continue; }
		
		const level = _getLargestParentLevels(progressionNodeMap[id]);
		if (nodeDependencyGroups[level]) {
			nodeDependencyGroups[level].push(id);
		} else {
			nodeDependencyGroups[level] = [id];
		}
	}
	vars.largestParentLevel = null;
	vars.nodeDependencyGroups = nodeDependencyGroups;
}

function _getLargestParentLevels(node) {
	let levels = [];
	for (let needed of node.nodesNeeded) {
		levels.push(_getLargestParentLevel(needed));
	}
	const maxValue = levels.length ? Math.max(levels) : 0;
	vars.largestParentLevel[node] = maxValue;
	return maxValue;
}

function _getLargestParentLevel(node) {
	
	// 'Cache'
	if (vars.largestParentLevel[node]) {
		return vars.largestParentLevel[node];
	} else {
		if (vars.progressionNodeMap[node].nodesNeeded.length) {
			return 1 + _getLargestParentLevels(vars.progressionNodeMap[node])
		} else {
			return 0;
		}
	}
}

export function buildDependencyTree(progressionNodes) {
	let progressionNodeMap = {};
	for (let progressionNode of progressionNodes) {
		progressionNodeMap[progressionNode.id] = new Node(progressionNode.id, progressionNode.completed);
	}
	for (let key of progressionNodeMap) {
		let progressionNode = progressionNodeMap[key];
		for (let id of progressionNode.nodesNeeded) {
			if (!progressionNodeMap[id].completed) {
				progressionNode.addDependantNode(progressionNodeMap[id]);
			}
		}
	}
}

class Node {
	constructor(id, completed) {
		this.id = id;
		this.completed = completed;
		this.dependantOn = [];
		this.completedNodes = [];
	}

	addDependantNode(node) {
		this.dependantOn.push(node);
	}

	removeDependantNode(node) {
		for (let i = this.dependantOnNodes.length-1; i > -1; i--) {
			if (node.id === this.dependantOnNodes[i].id) {
				this.completedNodes.push(node);
				this.dependantOnNodes.splice(i, i);
				break;
			}
		}
		this.inNodes.filter((value, index, arr) => {
			return value.id !== node.id;
		});
	}
}