

export const SocketColor = {
	GREEN: Symbol('SocketColor.Green'),
	BLUE: Symbol('SocketColor.Blue'),
	RED: Symbol('SocketColor.Red'),
	WHITE: Symbol('SocketColor.White'),

	lookup: (input) => {
		switch (input.toLowerCase()) {
			case 'g':
			case 'green':
				return SocketColor.GREEN;
			case 'r':
			case 'red':
				return SocketColor.RED;
			case 'b':
			case 'blue':
				return SocketColor.BLUE;
			case 'w':
			case 'white':
				return SocketColor.WHITE;
		}
	}
}
Object.freeze(SocketColor);