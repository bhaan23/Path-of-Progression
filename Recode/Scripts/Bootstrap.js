import $ from 'jquery';
import TabbingService from './Services/TabbingService.js';

$(window).on('load', () => {
	new TabbingService().setup();
});