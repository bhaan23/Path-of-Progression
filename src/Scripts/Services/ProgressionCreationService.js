import $ from 'jquery';
// import ProgressionPreviewService from './ProgressionPreviewService.js';

export default class ProgressionCreationService {

	constructor() {
		this.titleInput = $('#titleInput');
		this.hiddenCheckbox = $('#hiddenInput');
		this.completedCheckbox = $('#completedInput');
		this.descriptionInput = $('#descriptionInput');
		this.comletionTypeSelect = $('#completionType');
		this.areaNameInput = $('#areaInput');
		this.areaNameTypeahead = $('#areaInputTypeaheadList');
		this.itemSlotSelection = $('#itemSlotSelection');
		this.levelSelection = $('#levelSelection');
		this.modSearchInput = $('#modSearchInput');
		this.previewTitle = $('#nodePreview .tileTitle');
		this.previewDescription = $('#nodePreview .tileDescription');
		this.progressionPreview = $('#progressionPreview');
		
		this.currentTrigger = [];
		this.currentProgression = {};
		this.currentProgressionNode = {};
	}

	setup() {
		this.titleInput.on('input', () => {
			this.modSearchInput.css('width', `${this.modSearchInput.val().length*.9}ch`);
			
			const text = this.titleInput.val() || '';
			this.previewTitle.text(text);
			this.currentProgressionNode.title = text;
		});

		this.hiddenCheckbox.on('change', () => {
			this.currentProgressionNode.hidden = this.hiddenCheckbox.is(':checked');
		});

		this.completedCheckbox.on('change', () => {
			this.currentProgressionNode.completed = this.hiddenCheckbox.is(':checked');
		});

		this.descriptionInput.on('input', () => {
			const text = this.descriptionInput.val() || '';
			this.previewDescription.text(text);
			this.currentProgressionNode.description = text;
		});

		this.comletionTypeSelect.on('change', () => {
			const val = this.comletionTypeSelect.val() || '';
			if (val === 'area') {
				this.areaNameInput.removeClass('hidden');
				this.areaNameInput.val('');
				this.itemSlotSelection.addClass('hidden');
				this.levelSelection.addClass('hidden');
				this.modSearchInput.addClass('hidden');
				this.currentTrigger = [null, null];
			} else if (val === 'item') {
				this.areaNameInput.addClass('hidden');
				this.itemSlotSelection.removeClass('hidden');
				this.itemSlotSelection.val('');
				this.levelSelection.addClass('hidden');
				this.modSearchInput.addClass('hidden');
				this.currentTrigger = [null, null, null];
			} else if (val === 'level') {
				this.areaNameInput.addClass('hidden');
				this.itemSlotSelection.addClass('hidden');
				this.levelSelection.removeClass('hidden');
				this.levelSelection.val('');
				this.modSearchInput.addClass('hidden');
				this.currentTrigger = [null, null];
			}
			this.currentTrigger[0] = `[${val}]`;
		});

		this.areaNameInput.on('input', () => {
			// typeahead
			this.currentTrigger[1] = `[${this.areaNameInput.val()}]`;
		});

		this.itemSlotSelection.on('change', () => {
			const val = this.itemSlotSelection.val();
			this.currentTrigger[1] = `[${val}]`;
			this.modSearchInput.removeClass('hidden');
		});

		this.levelSelection.on('change', () => {
			this.currentTrigger[1] = `[${this.levelSelection.val()}]`;
		});

		this.modSearchInput.on('input', () => {
			this.modSearchInput.css('width', `${this.modSearchInput.val().length*.9}ch`);
		});
	}

	import(progressionNodes) {
		
	}
}