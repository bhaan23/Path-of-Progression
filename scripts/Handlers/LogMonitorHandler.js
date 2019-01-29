import $ from 'jquery';
import vars from '../Common/Variables.js';
import PathOfExileLog from 'poe-log-monitor';

export default class LogMonitorHandler {
	
	constructor() {
		this.poeLog = new PathOfExileLog({
			'logfile': "C:/Program Files/Steam/steamapps/common/Path of Exile/logs/Client.txt"
		});

		this.queue = new Queue();
	}

	addHandlers() {

		this.poeLog.on('area', (area) => this.checkNodes('area', area));
		this.poeLog.on('level', (level) => this.checkNodes('level', level))

		this.poeLog.on('npcEncounter', (npcEncounter) => {});
		this.poeLog.on('masterEncounter', (masterEncounter) => {});

		// This is to deal with any innacuracies in the logger.
		// A user can manually close an event
		$('.tile .closeIcon').on('click', (event) => {
			const tile = $(event.currentTarget).closest('.tile');
			this.findNode(tile.attr('id'));
		});

		// this.poeLog.parseLog();
	}

	checkNodes(type, data) {
		let key;
		switch (type) {
			case 'level':
				key = `[level][${data.level}]`;
				break;
			case 'area':
				key = `[area][${data.name}]`;
				break;
		}
		
		for (let i = vars.topNodes.length-1; i > -1; i--) {
			const node = vars.topNodes[i];
			const trigger = node.getNodeData().completionTrigger;
			if (key === trigger) {
				this.findNode(node.id, i);
			}
		}
	}

	findNode(id, index) {
		let node;
		if (index != null) {
			node = vars.topNodes.splice(index, 1)[0];
		} else {
			for (let i = vars.topNodes.length-1; i > -1; i--) {
				if (vars.topNodes[i].id.toString() === id) {
					node = vars.topNodes[i];
					vars.topNodes.splice(i, 1);
					i = -1;
				}
			}
		}
		if (node) {
			this.hideTile($(`#${node.getNodeData().id}`));
			this.completeNode(node);
		}
	}

	hideTile(tile) {
		tile.addClass('fadeOut');
		setTimeout(function () {
			tile.addClass('hidden');
		}, 1300);
	}

	completeNode(node) {
		node.completed = true;
		vars.completedNodes.push(node);
		for (let dependantNode of node.getDependantNodes()) {
			vars.topNodes.push(dependantNode);
		}
	}
}