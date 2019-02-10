import Settings from 'electron-settings';

class SettingsService {

	constructor() {
		this.settings = Settings;
	}

	set(settingName, value) {
		this.settings.set(settingName, value);
	}

	get(settingName) {
		return this.settings.get(settingName);
	}
}

export default new SettingsService();