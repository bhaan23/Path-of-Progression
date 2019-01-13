import $ from 'jquery';
import _ from 'underscore';
import vars from '../Common/Variables.js';
import LogMonitorHandler from './LogMonitorHandler.js';
import { buildProgressionMap, buildNodeDependencyGroups } from '../Common/Utils.js';
// import progressionNodeTemplate from './progressionNodeTemplate.html'; TODO: import string template

export default class ProgressionNodesHandler {

	constructor(parentEl) {
		this.parentEl = $(parentEl);
		
		this.largestParentLevel = {};
	}

	drawNodes() {
		for (let progression of this._createNodeTree()) {
			if (!progression.completed) {
				const progressionNodeHtml = _.template(`<div class="tile" data-severity="1" id="<%=progression.id%>">
															<div class="flexRow pushapart tileHeaders">
																<span></span>
																<span class="tileName"><%=progression.title%></span>
																<span class="closeIcon">x</span>
															</div>
															<p class="tileDescription"><%=progression.description%></p>
														</div>`)({ progression });
				this.parentEl.append(progressionNodeHtml);
			}
		}

		$('.tile .closeIcon').on('click', (event) => {
			const tile = $(event.currentTarget).closest('.tile');
			tile.addClass('fadeOut');
			setTimeout(function () {
				tile.addClass('hidden');
			}, 1300);
		});

		new LogMonitorHandler().addHandlers();
	}

	_createNodeTree() {
		buildProgressionMap();
		buildNodeDependencyGroups();

		let finalList = [];
		for (let key of Object.keys(vars.numDependentGroups).sort()) {
			for (let node of vars.numDependentGroups[key]) {
				finalList.push(node);
			}
		}
		return finalList;
	}
}