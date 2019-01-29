import $ from 'jquery';
import _ from 'underscore';
import vars from '../Common/Variables.js';
import LogMonitorHandler from './LogMonitorHandler.js';
import { buildDependencyTree, Queue } from '../Common/Utils.js';
// import progressionNodeTemplate from './progressionNodeTemplate.html';

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

		new LogMonitorHandler().addHandlers();
	}

	_createNodeTree() {
		buildDependencyTree();

		let q = new Queue();
		for (let node of vars.topNodes) {
			q.enqueue(node);
		}

		let nodeProgression = [];
		while (q.size() > 0) {
			const next = q.dequeue();
			nodeProgression.push(next.getNodeData());
			for (let node of next.getDependantNodes()) {
				q.enqueue(node);
			}
		}

		return nodeProgression;
	}
}