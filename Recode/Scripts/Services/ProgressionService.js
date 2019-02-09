import $ from 'jquery';
import NodeService from './NodeService.js';
import Settings from './SettingsService.js';
import PathOfExileLog from 'poe-log-monitor';
import { StoredSettings } from '../Objects/Enums.js';
import CharacterInventoryService from './CharacterInventoryService';
import { logMessageToTrigger, hasNodeTriggeredFromItem, jsonNodeToHtml } from '../Utils/Converter.js';

export default class ProgressionService {

	constructor(tilesParent) {
		this.tilesParent = $(tilesParent);
		this.settings = Settings;
		this.nodeService = new NodeService();

		this.poeLog = null;
		this.characterInventoryService = null;
	}

	setup(progressionFile) {
		
		// Parse progression file
		this.nodeService.setup(progressionFile);

		// Set up log monitor
		let logFileLocation = this.settings.get(StoredSettings.CLIENT_FILE_LOCATION);
		if (!logFileLocation) {
			alert('no log file found. Cannot continue setting up progression.');
			throw Error('no log file found. Cannot continue setting up progression.');
		} else {
			this.poeLog = new PathOfExileLog({
				'logfile': logFileLocation
			});

			this.poeLog.on('area', (area) => this.checkTopNodes(logMessageToTrigger('area', area)));
			this.poeLog.on('level', (level) => this.checkTopNodes(logMessageToTrigger('level', level)));
		}

		// Draw the progression nodes
		const progressionTileHtml = jsonNodeToHtml(this.nodeService.nodeMap, this.nodeService.topNodeIds);
		this.tilesParent.html('');
		this.tilesParent.append(progressionTileHtml);
		progressionTileHtml.each((index, element) => {
			let el = $(element);
			el.find('.closeIcon').on('click', () => {
				if (el.attr('data-level').toString() === "1") { // Only allow the user to close top level nodes
					this.completeNode(el.attr('id').replace(/^tile_/, ''));
				}
			});
		});

		// If we need to search for items within the progression, start up that service
		if (this.nodeService.needsItemLookup) {
			this.characterInventoryService = new CharacterInventoryService();
			this.characterInventoryService.setup();
			this.characterInventoryService.start();
			this.characterInventoryService.on('CharacterInventoryService.NewItems', () => this.checkNodesForItems());
		}
	}

	shutdown() {
		this.characterInventoryService.stop();
		this.poeLog.pause();
	}

	checkTopNodes(trigger) {

		// Go backwards since can remove some items
		for (let i = this.nodeService.topNodeIds.length -1; i > -1; i--) {
			const nodeId = this.nodeService.topNodeIds[i];
			if (trigger.toLowerCase() === this.nodeService.nodeMap[nodeId].progressionData.completionTrigger.toLowerCase()) {
				this.completeNode(nodeId);
			}
		}
	}

	checkNodesForItems() {

		// Go backwards since can remove some items
		for (let i = this.nodeService.topNodeIds.length -1; i > -1; i--) {
			const nodeId = this.nodeService.topNodeIds[i];
			if (hasNodeTriggeredFromItem(this.nodeService.nodeMap[nodeId].progressionData.completionTrigger, this.characterInventoryService)) {
				this.completeNode(nodeId);
			}
		}
	}

	completeNode(nodeId) {

		// Set the node as complete
		this.nodeService.completedNodeIds.push(nodeId);
		this.nodeService.nodeMap[nodeId].progressionData.completed = true;

		// Remove the node from the top nodes
		this.nodeService.topNodeIds.splice(this.nodeService.topNodeIds.indexOf(nodeId), 1);
		
		// Add dependants to the top nodes
		this.nodeService.topNodeIds = this.nodeService.topNodeIds.concat(this.nodeService.nodeMap[nodeId].dependantNodeIds);

		// Hide tile
		const tile = this.tilesParent.find(`#tile_${nodeId}`);
		tile.addClass('fadeOut');
		setTimeout(() => {
			tile.toggleClass('hidden', true);
		}, 1300);
	}
}