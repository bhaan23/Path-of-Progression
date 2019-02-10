import $ from 'jquery';
import TabbingService from './Services/TabbingService.js';
import UserInteractionService from './Services/UserInteractionService.js';
import ProgressionCreationService from './Services/ProgressionCreationService.js';

$(window).on('load', () => {
	new TabbingService().setup();
	new UserInteractionService().setup();
	new ProgressionCreationService().setup();
});