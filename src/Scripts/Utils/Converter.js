import $ from 'jquery';
import _ from 'underscore';
import { GemImageMap } from '../Objects/GemImageMap';
import TileTemplate from '../../Templates/TileTemplate.html';
import eventTriggers from '../Objects/EventTriggers';

export function logMessageToTrigger(type, logData) {
	let trigger;
	switch (type) {
		case 'level':
			trigger = `level|${logData.level}`;
			break;
		case 'area':
			trigger = `area|${logData.name}`;
			break;
		default:
			console.log('Unkown log message: ' + JSON.stringify(logData));
	}
	return trigger;
};

export function hasNodeTriggeredFromItemOrLink(trigger, characterInventory) {
	
	if (trigger.toLowerCase().startsWith('item|')) {
		const triggerParts = trigger.toLowerCase().split('|');
		let itemData;
		switch (triggerParts[1]) { // Find the right item type to search for
			case 'amulet':
				itemData = [characterInventory.amulet];
				break;
			case 'belt':
				itemData = [characterInventory.belt];
				break;
			case 'bodyArmour':
				itemData = [characterInventory.bodyArmour];
				break;
			case 'boots':
				itemData = [characterInventory.boots];
				break;
			case 'flask':
				itemData = characterInventory.flasks.slice(0);
				break;
			case 'gloves':
				itemData = [characterInventory.gloves];
				break;
			case 'helm':
				itemData = [characterInventory.helmet];
				break;
			case 'ring':
				itemData = [characterInventory.ring1, characterInventory.ring2];
				break;
			case 'weapon':
				itemData = [characterInventory.weapon1, characterInventory.offhand1];
				break;
			case 'offhand':
				itemData = [characterInventory.weapon2, characterInventory.offhand2];
				break;
		}

		let compareData = '';
		for (let item of itemData) {
			if (!item) {
				continue;
			}
			
			let textData = [];
			if (item.craftedMods) {
				textData.push(item.craftedMods.join('|'));
			}
			if (item.enchantMods) {
				textData.push(item.enchantMods.join('|'));
			}
			if (item.explicitMods) {
				textData.push(item.explicitMods.join('|'));
			}
			if (item.implicitMods) {
				textData.push(item.implicitMods.join('|'));
			}
			if (item.utilityMods) {
				textData.push(item.utilityMods.join('|'));
			}
			textData.push(item.name + '|');
			compareData = textData.join('|');
		}

		let found = true;
		compareData = compareData.toLowerCase();
		for (let text of triggerParts[2].split(',')) { // Check if we match all text we are looking for
			found = found && compareData.includes(text.trim());
		}
		return found;
	}

	else if (trigger.toLowerCase().startsWith('gems|')) {
		const gemsToComplete = trigger.toLowerCase().split('|')[1].split(',');
		for (let group of characterInventory.gemLinks) {
			if (group.length < gemsToComplete) {
				continue;
			}
			for (let gem of gemsToComplete) {
				if (!includesWithVaalGemCheck(group, gem)) {
					continue;
				}
			}
			return true;
		}
	}

	return false;
};

function includesWithVaalGemCheck(group, gem) {
	let found = false;
	for (let characterGem of group) {
		if (characterGem === gem) {
			found = true;
		} else if (characterGem.replace(/vaal /, '').replace(/impurity/, 'purity') === gem) {
			found = true;
		}
	}

	return found;
};

export function jsonNodeToHtml(nodeMap, topNodeIds) {
	let tops = topNodeIds.length, middles = 0;
	let nodeHtml = $('<div>');
	let queue = [].concat(topNodeIds);
	while (queue.length > 0) {

		let level;
		if (tops > 0) {
			level = 1;
		} else if (middles > 0) {
			level = 2;
		} else {
			level = 3;
		}
		
		const id = queue.shift();
		const node = nodeMap[id];
		queue = queue.concat(node.dependantNodeIds);

		let gems = $();
		if (nodeMap[id].progressionData.completionTrigger.toLowerCase().startsWith('gems|')) {
			const group = $('<div>');
			for (let gemValue of nodeMap[id].progressionData.completionTrigger.split('|')[1].split(',')) {
				group.append(buildGemLookup(gemValue));
			}
			gems = group;
		}

		const tileHtml = _.template(TileTemplate)({ progression: nodeMap[id].progressionData, level, gems });
		nodeHtml.append(tileHtml);
		
		if (tops > 0) {
			tops -= 1;
			middles += node.dependantNodeIds.length;
		} else if (middles > 0) {
			middles -= 1;
		}
	}

	return nodeHtml.children();
};

export function createNode(node, level) {
	let gems = $();
	if (node.completionTrigger.toLowerCase().startsWith('gems|')) {
		gems = createGemHtml(node.completionTrigger);
	}
	return _.template(TileTemplate)({ progression: node, level, gems });
}

export function createGemHtml(completionTrigger) {
	const group = $('<div>');
	for (let gemValue of completionTrigger.split('|')[1].split(',')) {
		group.append(buildGemLookup(gemValue));
	}
	return group;
}

export function buildGemLookup(skillValue) {
	const skillDisplayValue = eventTriggers.gems['Active Skill Gems'][skillValue] || eventTriggers.gems['Support Skill Gems'][skillValue];
	const gem = $('<span>', {
		class: 'gemPreview'
	});

	const img = $('<img>', {
		src: GemImageMap[skillValue]
	});

	const text = $('<span>', {
		text: skillDisplayValue
	});

	gem.append(img);
	gem.append(text);
	return gem;
}