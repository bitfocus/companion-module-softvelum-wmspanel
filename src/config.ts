import { Regex, type SomeCompanionConfigField } from '@companion-module/base'

export interface ModuleConfig {
	client_id: string,
	api_key: string,
	api_url: string,
	refreshRate: number,
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [

		{
			type: 'textinput',
			id: 'client_id',
			label: 'Client ID',
			width: 60,
			regex: Regex.SOMETHING,
		},
		{
			type: 'textinput',
			id: 'api_key',
			label: 'API-Key',
			width: 60,
			regex: Regex.SOMETHING,
		},
		{
			type: 'textinput',
			id: 'api_url',
			label: 'API Url',
			tooltip: 'Only change if you know what you are doing. Used for exampled if you need to set up an API Proxy',
			width: 200,
			regex: Regex.SOMETHING,
			default: 'https://api.wmspanel.com',
		},
		{
			type: 'number',
			id: 'refreshRate',
			label: 'API Refresh Rate (s)',
			tooltip: 'Attention: Can lead to massive API-Calls and hit the API Limit very fast. Default 30',
			default: 30,
			min: 0,
			max: 3600,
			width: 4,
		},
	]
}
