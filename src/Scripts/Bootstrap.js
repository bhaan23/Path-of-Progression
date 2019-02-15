import $ from 'jquery';
import TabbingService from './Services/TabbingService.js';
import UserInteractionService from './Services/UserInteractionService.js';
import ProgressionCreationService from './Services/ProgressionCreationService.js';
import ExternalService from './Services/ExternalService.js';

$(window).on('load', () => {
	new ExternalService().setup();
	new TabbingService().setup();
	new UserInteractionService().setup();
	new ProgressionCreationService().setup();
});