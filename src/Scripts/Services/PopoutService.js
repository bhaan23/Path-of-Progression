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
		$('#popoutClose').text('');
		$('#popoutClose').on('click', () => {
			remote.getCurrentWindow().close();
		});

		ipcRenderer.on('tile-data', (event, tileHtml) => {
			$('#popoutBody').html(tileHtml);

			$('.tile').each((_, tileElement) => {
				const tile = $(tileElement);
				tile.find('.closeIcon').on('click', () => {
					ipcRenderer.send('overlay-node-removed', tile.attr('id'));
					tile.remove();
				});

				tile.find('.toggle').on('click', () => {
					tile.toggleClass('collapsed').toggleClass('expanded');
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