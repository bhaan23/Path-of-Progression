import $ from 'jquery';
import { EventEmitter } from 'events';

export default class TypeAheadService extends EventEmitter {

	constructor(input, container, hasGroups) {
		super();
		this.inputBox = $(input);
		this.container = $(container);
		this.items = this.container.find('.typeAheadItem');
		this.selectedItem = null;
		this.hasGroups = hasGroups;
	}

	setup() {

		this.inputBox.on('input', () => {
			const val = `.*${this.inputBox.val().toLowerCase()}.*`;
			let overallCount = 0;

			if (this.hasGroups) {

				this.container.find('.typeAheadGroup').each((j, groupElement) => {
					const groupEl = $(groupElement);
					let count = 0;
					groupEl.find('.typeAheadItem').each((i, element) => {
						let el = $(element);
						if (el.attr('value').match(val) && overallCount < 5) {
							el.removeClass('hidden');
							count += 1;
						} else {
							el.addClass('hidden');
						}
					});
					overallCount += count;
					if (count === 0) {
						groupEl.find('.typeAheadGroupTitle').addClass('hidden');
					} else {
						groupEl.find('.typeAheadGroupTitle').removeClass('hidden');
					}
				});
			}
			else {
				this.container.find('.typeAheadItem').each((i, element) => {
					let el = $(element);
					if (el.attr('value').match(val)) {
						el.removeClass('hidden');
						overallCount += 1;
					} else {
						el.addClass('hidden');
					}
				});
			}
			if (overallCount > 0) {
				this.container.removeClass('hidden');
			} else {
				this.container.addClass('hidden');
			}
			
			if (this.selectedItem) {
				this.selectedItem.removeClass('.typeAheadSelected');
				this.selectedItem = null;
			}
		});

		this.inputBox.on('keydown', (event) => {
			if (!this.container.hasClass('hidden')) {
				switch (event.keyCode) {
					case 13: // Enter key
						this.publish();
						event.preventDefault();
						break;
					case 40: // Down arrow
						this.selectNextItem(1);
						event.preventDefault();
						break;
					case 38: // Up arrow
						this.selectNextItem(-1);
						event.preventDefault();
						break;
				}
			}
		});

		this.inputBox.on('focus', () => {
			this.container.removeClass('hidden');
		});

		this.items.each((index, element) => {
			const el = $(element);
			el.hover(() => {
				this.selectItem(el);
			}, () => {
				this.unselectItem();
			});
			el.on('click', () => {
				this.selectedItem = el;
				this.publish();
			});
			el.on('mousedown', (event) => {
				event.preventDefault();
			});
		});

		this.inputBox.on('focusout', () => {
			this.container.addClass('hidden');
			this.unselectItem();
		});
	}

	unselectItem() {
		if (this.selectedItem) {
			this.selectedItem.removeClass('typeAheadSelected');
			this.selectedItem = null;
		}
	}

	selectItem(element) {
		this.unselectItem();
		this.selectedItem = element;
		this.selectedItem.addClass('typeAheadSelected');
	}

	publish() {
		if (this.selectedItem) {
			this.emit('optionSelected', this.selectedItem.text());
			this.unselectItem();
			this.container.addClass('hidden');
		}
	}

	selectNextItem(direction) {
		const tempItems = this.items.filter(':not(.hidden)');
		if (!this.selectedItem) {
			this.selectItem(tempItems.first());
		} else {
			const index = tempItems.index(this.selectedItem);
			let item;
			if (index === 0 && direction === -1) {
				item = $(tempItems.last());
			} else if (index === tempItems.length-1 && direction === 1) {
				item = $(tempItems.first());
			} else {
				item = $(tempItems.get(index + direction));
			}
			this.selectItem(item);
		}
	}
}