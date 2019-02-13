import $ from 'jquery';
const { session, BrowserWindow, getCurrentWindow } = require('electron').remote;

export function isValidSessionId(id, accountName, callback) {
	if (!id) {
		return false;
	}
	resetCookie(id, () => {
		$.ajax(`https://www.pathofexile.com/character-window/get-stash-items?accountName=${encodeURIComponent(accountName)}&league=Standard&tabIndex=0`, {
			method: 'GET',
			dataType: 'json',
		}).then((response) => {
			callback(response.numTabs > 0);
		}, (jqXHR) => {
			callback(false, jqXHR.responseJSON.error);
		});
	});
};

export function resetCookie(sessid, callback) {
	const cookie = {
		url: 'http://www.pathofexile.com',
		name: 'POESESSID',
		value: sessid,
		domain: '.pathofexile.com',
		path: '/',
		secure: false,
		httpOnly: false,
		expirationDate: undefined
	};
	
	session.defaultSession.cookies.remove('http://www.pathofexile.com', 'POESESSID', (error) => {
		
		if (!error) {
			session.defaultSession.cookies.set(cookie, (error) => {
				if (!error) {
					callback();
				}
			});
		}
	});
};

export function addDependantNodes(nodeSelectorHtml) {
	let select = $(nodeSelectorHtml);
	
}

export function checkSaveDontContinue() {
	return false;
}