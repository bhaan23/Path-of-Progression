import $ from 'jquery';
const { session } = require('electron').remote;

export async function isValidSessionId(id, accountName, characterName) {
	if (!id) {
		return false;
	}
	resetCookie(id);
	return $.ajax(`https://www.pathofexile.com/character-window/get-stash-items?accountName=${encodeURIComponent(accountName)}&league=Standard&tabIndex=0`, {
		method: 'GET',
		success: (response) => {
			return true;
		},
		error: (xhr, status, error) => {
			alert('Your session id was not valid.');
			console.log(status, error);
			return false;
		},
		dataType: 'json'
	}).promise();
};

export function resetCookie(sessid) {
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
		session.defaultSession.cookies.set(cookie, (error) => {
			console.log(error);
		});
	});
};