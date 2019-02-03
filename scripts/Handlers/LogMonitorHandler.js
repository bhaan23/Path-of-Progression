import $ from 'jquery';
import vars from '../Common/Variables.js';
import PathOfExileLog from 'poe-log-monitor';
import CharacterInventory from './CharacterInventory.js';
import { Queue } from '../Common/Utils.js';

export default class LogMonitorHandler {
	
	constructor() {
		this.poeLog = new PathOfExileLog({
			'logfile': "C:/Program Files/Steam/steamapps/common/Path of Exile/logs/Client.txt"
		});

		this.characterInventory = new CharacterInventory();
		this.queue = new Queue();
	}

	addHandlers() {

		this.characterInventory.setup();
		this.characterInventory.on('CharacterInventory.NewItems', () => this.checkItemData());

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

		// Check to see if we should start searching for items
		for (let node of vars.topNodes) {
			if (node.data.completionTrigger.startsWith('[equip]')) {
				this.characterInventory.itemService.start();
			}
		}

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
				if (vars.topNodes[i].id.toString() == id) {
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
			if (dependantNode.data.completionTrigger.startsWith('[equip]')) {
				this.characterInventory.itemService.start();
			}
		}
	}

	checkItemData() {
		for (let node of vars.topNodes) {
			if (node.data.completionTrigger.startsWith('[equip]')) {
				
				const match = node.data.completionTrigger.match(/\[equip\]\[(\w+)\]\[(\w+)\]\[(.+)\]/i);
				let itemData;
				switch (match[1].toLowerCase()) { // Find the right item type to search for
					case 'amulet':
						itemData = [this.characterInventory.amulet];
						break;
					case 'belt':
						itemData = [this.characterInventory.belt];
						break;
					case 'bodyArmour':
						itemData = [this.characterInventory.bodyArmour];
						break;
					case 'boots':
						itemData = [this.characterInventory.boots];
						break;
					case 'flask':
						itemData = this.characterInventory.flasks.splice(0);
						break;
					case 'gloves':
						itemData = [this.characterInventory.gloves];
						break;
					case 'helm':
						itemData = [this.characterInventory.helmet];
						break;
					case 'ring':
						itemData = [this.characterInventory.ring1, this.characterInventory.ring2];
						break;
					case 'weapon':
						itemData = [this.characterInventory.weapon1, this.characterInventory.weapon2];
						break;
				}

				for (let item of itemData) {
					if (!item) {
						continue;
					}
					let compareData;
					switch (match[2].toLowerCase()) { // Find where to look within the item
						case 'mod':
							compareData = [];
							if (item.craftedMods) {
								compareData.push(item.craftedMods.join('|'));
							}
							if (item.enchantMods) {
								compareData.push(item.enchantMods.join('|'));
							}
							if (item.explicitMods) {
								compareData.push(item.explicitMods.join('|'));
							}
							if (item.implicitMods) {
								compareData.push(item.implicitMods.join('|'));
							}
							if (item.utilityMods) {
								compareData.push(item.utilityMods.join('|'));
							}
							compareData = compareData.join('|');
							break;
						case 'base':
							compareData = item.name;
							break;
					}

					let found = true;
					for (let text of match[3].split(',')) { // Check if we match all text we are looking for
						found &= compareData.includes(text.trim());
					}

					if (found) {
						this.findNode(node.id);
						break;
					}
				}
			}
		}
	}
}