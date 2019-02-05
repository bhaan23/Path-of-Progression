import ItemService from "./ItemService";
import { SocketColor } from '../Common/Enums.js';
import { EventEmitter } from 'events';

export default class CharacterInventory extends EventEmitter {

	constructor() {
		super();

		this.weapon1 = null;
		this.weapon2 = null;
		this.offhand1 = null;
		this.offhand2 = null;
		this.helmet = null;
		this.bodyArmour = null;
		this.ring1 = null;
		this.ring2 = null;
		this.amulet = null;
		this.gloves = null;
		this.boots = null;
		this.belt = null;

		this.flasks = [];
		this.gemLinkGroups = {};
		this.socketGroups = {};

		this.itemService = new ItemService(this.parseInventoryData);
	}

	setup() {
		this.itemService.setup();

		this.itemService.on('ItemService.NewItems', (items) => this.parseInventoryData(items));
	}

	parseInventoryData(items) {
		this.gemLinkGroups = {};
		this.socketGroups = {};
		this.flasks = [];
		for (let item of items) {

			// Socket groups
			if (item.sockets) {
				let groups = {};
				let gemGroups = {};

				// Loop through sockets and create a map of socket group to colors in that socket group
				for (let socket of item.sockets) {
					if (groups[socket.group]) {
						groups[socket.group].push(SocketColor.lookup(socket.sColour));
					} else {
						groups[socket.group] = [SocketColor.lookup(socket.sColour)];
						gemGroups[socket.group] = [];
					}
				}

				// Add those socket groups to the overall map
				for (let groupKey of Object.keys(groups)) {
					const group = groups[groupKey];
					if (this.socketGroups[group.length]) {
						this.socketGroups[group.length].push(group);
					} else {
						this.socketGroups[group.length] = [group];
					}
				}

				// Loop through the socketed items and add them to their respective groups
				for (let socketItem of item.socketedItems) {
					gemGroups[socketItem.socket].push(socketItem.typeLine); // Place only the name of the skill gem in the list
				}

				// Add those gem groups to the overall map
				for (let gemGroupKey of Object.keys(gemGroups)) {
					const group = groups[gemGroupKey];
					if (this.socketGroups[group.length]) {
						this.socketGroups[group.length].push(group);
					} else {
						this.socketGroups[group.length] = [group];
					}
				}
			}

			const parsedItem = {
				craftedMods: item.craftedMods,
				enchantMods: item.enchantMods,
				explicitMods: item.explicitMods,
				implicitMods: item.implicitMods,
				utilityMods: item.utilityMods,
				name: (item.name + ' ' + item.typeLine).trim()
			};

			switch (item.inventoryId) {
				case 'Amulet':
					this.amulet = parsedItem;
					break;
				case 'Belt':
					this.belt = parsedItem;
					break;
				case 'BodyArmour':
					this.bodyArmour = parsedItem;
					break;
				case 'Boots':
					this.boots = parsedItem;
					break;
				case 'Flask':
					this.flasks.push(parsedItem);
					break;
				case 'Gloves':
					this.gloves = parsedItem;
					break;
				case 'Helm':
					this.helmet = parsedItem;
					break;
				case 'Offhand':
					this.offhand1 = parsedItem;
					break;
				case 'Offhand2':
					this.offhand2 = parsedItem;
					break;
				case 'Ring':
					this.ring1 = parsedItem;
					break;
				case 'Ring2':
					this.ring2 = parsedItem;
					break;
				case 'Weapon':
					this.weapon1 = parsedItem;
					break;
				case 'Weapon2':
					this.weapon2 = parsedItem;
					break;
				case 'MainInventory':
					if (item.category.currency) {
						// TODO tally currency
					}
					break;
			}
		}

		this.emit('CharacterInventory.NewItems');
	}
}