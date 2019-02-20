import $ from 'jquery';
import Alert from '../Objects/Alert.js';
import NodeService from './NodeService.js';
import Settings from './SettingsService.js';
import PathOfExileLog from 'poe-log-monitor';
import { AlertType } from '../Objects/Enums.js';
import { StoredSettings } from '../Objects/Enums.js';
import { resortTiles } from '../Utils/UtilFunctions.js';
import CharacterInventoryService from './CharacterInventoryService';
import { logMessageToTrigger, jsonNodeToHtml, hasNodeTriggeredFromItemOrLink } from '../Utils/Converter.js';
import { ipcRenderer } from 'electron';

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
			const alertBody = 'No log file found. Cannot continue setting up progression.';
			new Alert(alertBody, AlertType.NEGATIVE, () => { });
			throw Error(alertBody);
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
				if (el.attr('data-level') === '1') {
					this.completeNode(el.attr('id').replace(/^tile_/, ''));
				}
			});
		});

		// Trigger the event to close the node out if the user removed the node from the overlay
		ipcRenderer.on('overlay-node-removed', (event, tileId) => {
			$(`#${tileId}`).find('.closeIcon').click();
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
		if (this.characterInventoryService) {
			this.characterInventoryService.stop();
		}
		if (this.poeLog) {
			this.poeLog.pause();
		}
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
			if (hasNodeTriggeredFromItemOrLink(this.nodeService.nodeMap[nodeId].progressionData.completionTrigger, this.characterInventoryService)) {
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
		tile.addClass('fadeout');
		setTimeout(() => {
			tile.remove();
		}, 1300);

		let nodeChanges = {
			nodeRemoved: `tile_${nodeId}`,
			levelChanges: {}
		};

		// Create a map of index changes to send to the overlay
		this.createIndexMap(nodeId, 0, nodeChanges);

		// Sort the tiles into the correct order
		resortTiles(this.tilesParent);

		// Send the data to the overlay to do the same
		ipcRenderer.send('overlay-node-reorder', nodeChanges);
	}

	createIndexMap(nodeId, level, nodeChanges) {
		
		// We don't update nodes level 3 and upwards
		if (level === 3) { return; }

		// If we are not on the initial removed node, find where the possible new index is
		if (level > 0) {

			// Check to make sure that only a node that has all dependants completed can be pushed to the top
			if (level === 1) {
				let allCompete = true;
				for (let dependantNodeId of this.nodeService.nodeMap[nodeId].progressionData.nodesNeeded) {
					if (!this.nodeService.completedNodeIds.includes(dependantNodeId)) {
						allCompete = false;
						break;
					}
				}
				if (!allCompete) { return; }
			}

			// We know we need to change the level
			this.tilesParent.find(`#tile_${nodeId}`).attr('data-level', level);
			nodeChanges.levelChanges[`#tile_${nodeId}`] = level;
		}

		// If we are not on the last depth of nodes
		if (level < 3) {

			// Update this node's dependant nodes up one level if possible
			for (let dependantNodeId of this.nodeService.nodeMap[nodeId].dependantNodeIds) {
				this.createIndexMap(dependantNodeId, level+1, nodeChanges);
			}
		}
	}

	// Wrapper for node service
	save() {
		this.nodeService.save();
	}

	// Wrapper for node service
	canSave() {
		return this.nodeService.canSave();
	}
}