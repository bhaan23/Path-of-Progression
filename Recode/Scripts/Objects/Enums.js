class SocketColorEnum {
	
	constructor() {
		this.GREEN = Symbol('SocketColor.Green');
		this.BLUE = Symbol('SocketColor.Blue');
		this.RED = Symbol('SocketColor.Red');
		this.WHITE = Symbol('SocketColor.White');
	}

	lookup(input) {
		switch (input.toLowerCase()) {
			case 'g':
			case 'green':
				return this.GREEN;
			case 'r':
			case 'red':
				return this.RED;
			case 'b':
			case 'blue':
				return this.BLUE;
			case 'w':
			case 'white':
				return this.WHITE;
		}
	}
};

export const SocketColor = new SocketColorEnum();


class StoredSettingsEnum {

	constructor() {
		this.ACCOUNT_NAME = 'accountName';
		this.CHARACTER_NAME = 'characterName';
		this.SESSION_ID = 'sessionId';
		this.PROGRESSION_FILE = 'progressionFile';
		this.CLIENT_FILE_LOCATION = 'clientFileLocation';
	}
}

export const StoredSettings = new StoredSettingsEnum();