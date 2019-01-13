import PathOfExileLog from 'poe-log-monitor';
import vars from '../Common/Variables.js';

export default class LogMonitorHandler {
	
	constructor() {
		this.poeLog = new PathOfExileLog({
			'logfile': "C:/Program Files/Steam/steamapps/common/Path of Exile/logs/Client.txt"
		});
	}

	addHandlers() {

		this.poeLog.on('area', (area) => {
			let readyNodes = vars.nodeDependencyGroups[0];
			for (let nodeId of readyNodes) {
				const trigger = vars.progressionNodeMap[nodeId].completionTrigger;
			}
		});

		this.poeLog.on('level', (level) => {
			
		});

		this.poeLog.on('npcEncounter', (npcEncounter) => {
			console.log(npcEncounter);
		});

		this.poeLog.on('masterEncounter', (masterEncounter) => {
			console.log(masterEncounter);
		});

		this.poeLog.parseLog();
		setTimeout(() => {
			this.poeLog.pause();
		}, 20000);
	}
}