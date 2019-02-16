import ItemService from "./ItemService";
import { SocketColor } from '../Objects/Enums.js';
import { EventEmitter } from 'events';

export default class CharacterInventoryService extends EventEmitter {

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
		
		this.gemLinks = [];

		this.itemService = new ItemService();
	}

	setup() {
		this.itemService.setup();

		this.itemService.on('ItemService.NewItems', (items) => this.parseInventoryData(items));
	}

	start() {
		if (this.itemService.canFetchItems) {
			this.itemService.fetchItems();
			this.interval = setInterval(() => {
				this.itemService.fetchItems();
			}, 1000*60); // One minute	
		}
	}

	stop() {
		clearInterval(this.interval);
	}

	parseInventoryData(items) {
		// Reset items
		this.gemLinks = [];
		this.flasks = [];

		for (let item of items) {

			// Socket groups
			if (item.socketedItems && item.socketedItems.length > 0) {
				
				let currentGroup = [];
				let currentGroupNumber = item.socketedItems[0].socket;

				// Build up each set of gem links
				for (let socketedItem of item.socketedItems) {
					const socketGroup = item.sockets[socketedItem.socket].group;

					if (currentGroupNumber !== socketGroup) {
						this.gemLinks.push(currentGroup);
						currentGroup = [];
						currentGroupNumber = socketGroup;
					}
					currentGroup.push(socketedItem.typeLine);
				}
				this.gemLinks.push(currentGroup);
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
						// TODO tally currency?
					}
					break;
			}
		}

		this.emit('CharacterInventoryService.NewItems');
	}
}