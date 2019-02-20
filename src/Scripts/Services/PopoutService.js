import $ from 'jquery';
import { ipcRenderer, remote } from 'electron';
import { resortTiles } from '../Utils/UtilFunctions.js';

$(window).on('load', () => {
	new PopoutService().setup();
});

class PopoutService {

	constructor() {
		this.body = $('#popoutBody');
	}

	setup() {
		$('#popoutClose').on('click', () => {
			remote.getCurrentWindow().close();
		});

		ipcRenderer.on('tile-data', (event, tileHtml) => {
			$('#popoutBody').html(tileHtml);
			
			$('.tile .closeIcon').each((index, element) => {
				$(element).text('X');
				$(element).on('click', () => {
					const tile = $(element).closest('.tile');
					ipcRenderer.send('overlay-node-removed', tile.attr('id'));
					tile.remove();
				});
			});
		});

		ipcRenderer.on('overlay-node-reorder', (event, nodeChanges) => {
			$(`#${nodeChanges.nodeRemoved}`).remove();
			for (let tileId of Object.keys(nodeChanges.levelChanges)) {
				$(tileId).attr('data-level', nodeChanges.levelChanges[tileId]);
			}
			resortTiles(this.body);
		});

		remote.getCurrentWindow().show();
	}
}