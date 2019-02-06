import $ from 'jquery';
import _ from 'underscore';

export function logMessageToTrigger(type, logData) {
	let trigger;
	switch (type) {
		case 'level':
			trigger = `[level][${logData.level}]`;
			break;
		case 'area':
			trigger = `[area][${logData.name}]`;
			break;
		default:
			console.log('Unkown log message: ' + JSON.stringify(logData));
	}
	return trigger;
};

export function hasNodeTriggeredFromItem(trigger, characterInventory) {
				
	const match = trigger.match(/\[equip\]\[(\w+)\]\[(\w+)\]\[(.+)\]/i);
	let itemData;
	switch (match[1].toLowerCase()) { // Find the right item type to search for
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
			itemData = characterInventory.flasks.splice(0);
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
			itemData = [characterInventory.weapon1, characterInventory.weapon2];
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
			found = found && compareData.includes(text.trim());
		}
		return found;
	}
};

export function jsonNodeToHtml(nodeMap, topNodeIds) {
	let tops = topNodeIds.length, middles = 0;
	let nodeHtml = $();
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
		queue.concat(node.dependantNodeIds);
		nodeHtml.add(_.template(`<div class="tile <% if (progression.hidden) { print('hidden') } %>" data-level="<%=level%>" id="tile_<%=progression.id%>">
									<div class="flexRow pushapart tileHeaders">
										<span></span>
										<span class="tileName"><%=progression.title%></span>
										<span class="closeIcon">x</span>
									</div>
									<p class="tileDescription"><%=progression.description%></p>
								</div>`))({ progresion: nodeMap[id].progressionData, level });
		
		if (tops > 0) {
			tops -= 1;
			middles += node.dependantNodeIds.length;
		} else if (middles > 0) {
			middles -= 1;
		}
	}

	return nodeHtml;
};