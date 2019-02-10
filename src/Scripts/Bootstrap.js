import $ from 'jquery';
import TabbingService from './Services/TabbingService.js';
import UserInteractionService from './Services/UserInteractionService.js';

$(window).on('load', () => {
	new TabbingService().setup();
	new UserInteractionService().setup();
});