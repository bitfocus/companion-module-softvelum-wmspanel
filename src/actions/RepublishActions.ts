import type { CompanionActionDefinitions} from '@companion-module/base'
import type { ModuleInstance } from '../main.js'   

export function getRepublishActions(self: ModuleInstance): CompanionActionDefinitions {
    return {
        CreateRepublishRoute: {
			name: 'Create Republish Route',
			options: [
				{
					id: 'server_id',
					type: 'dropdown',
					label: 'Select Server',
					choices: self.serverCache,
					default: self.serverCache[0]?.id ?? '',
				},
				{ id: 'src_app', type: 'textinput', label: 'Source App Name', default: 'nimble-app' },
				{ id: 'src_strm', type: 'textinput', label: 'Source Stream Name (optional)', default: '' },
				{ id: 'dest_addr', type: 'textinput', label: 'Destination Address', default: '' },
				{
					id: 'dest_port',
					type: 'number',
					label: 'Destination Port (optional)',
					default: 1935,
					min: 0,
					max: 65535,
				},
				{ id: 'dest_app', type: 'textinput', label: 'Destination App Name', default: 'live' },
				{ id: 'dest_strm', type: 'textinput', label: 'Destination Stream Name (optional)', default: '' },
				{ id: 'dest_app_params', type: 'textinput', label: 'Destination App Params (optional)', default: '' },
				{ id: 'dest_strm_params', type: 'textinput', label: 'Destination Stream Params (optional)', default: '' },
				{ id: 'description', type: 'textinput', label: 'Description (optional)', default: '' },
				{ id: 'tags', type: 'textinput', label: 'Tags (comma separated)', default: '' },
				{
					id: 'auth_schema',
					type: 'dropdown',
					label: 'Auth Schema (optional)',
					choices: [
						{ id: 'NONE', label: 'NONE' },
						{ id: 'NIMBLE', label: 'NIMBLE' },
						{ id: 'AKAMAI', label: 'AKAMAI' },
						{ id: 'LIMELIGHT', label: 'LIMELIGHT' },
						{ id: 'PERISCOPE', label: 'PERISCOPE' },
						{ id: 'TELEGRAM', label: 'TELEGRAM' },
						{ id: 'RTMP', label: 'RTMP' },
						{ id: 'TWITCH', label: 'TWITCH' },
					],
					default: 'NONE',
				},
				{ id: 'dest_login', type: 'textinput', label: 'Destination Login (optional)', default: '' },
				{ id: 'dest_password', type: 'textinput', label: 'Destination Password (optional)', default: '' },
				{ id: 'akamai_stream_id', type: 'textinput', label: 'Akamai Stream ID (optional)', default: '' },
				{
					id: 'paused',
					type: 'checkbox',
					label: 'Paused',
					default: false,
				},
				{
					id: 'keep_src_stream_params',
					type: 'checkbox',
					label: 'Keep Source Stream Params',
					default: false,
				},
				{
					id: 'ssl',
					type: 'checkbox',
					label: 'Use SSL',
					default: false,
				},
				{
					id: 'other_servers_to_apply',
					type: 'textinput',
					label: 'Other Server IDs (comma separated, max 20)',
					default: '',
				},
			],
			callback: async (event) => {
				const o = event.options

				const body: any = {
					src_app: await self.parseVariablesInString(String(o.src_app ?? '')),
					dest_addr: await self.parseVariablesInString(String(o.dest_addr ?? '')),
					dest_app: await self.parseVariablesInString(String(o.dest_app ?? '')),
				}

				if (o.src_strm) body.src_strm = await self.parseVariablesInString(String(o.src_strm))
				if (o.dest_port !== undefined) {
					const destPortStr = await self.parseVariablesInString(String(o.dest_port))
					body.dest_port = parseInt(destPortStr)
				}
				if (o.dest_strm) body.dest_strm = await self.parseVariablesInString(String(o.dest_strm))
				if (o.dest_app_params) body.dest_app_params = await self.parseVariablesInString(String(o.dest_app_params))
				if (o.dest_strm_params) body.dest_strm_params = await self.parseVariablesInString(String(o.dest_strm_params))
				if (o.description) body.description = await self.parseVariablesInString(String(o.description))
				if (o.tags) {
					const parsedTags = (await self.parseVariablesInString(String(o.tags))).split(',').map((tag) => tag.trim())
					body.tags = parsedTags
				}
				if (o.auth_schema && o.auth_schema !== 'NONE') body.auth_schema = o.auth_schema
				if (o.dest_login) body.dest_login = await self.parseVariablesInString(String(o.dest_login))
				if (o.dest_password) body.dest_password = await self.parseVariablesInString(String(o.dest_password))
				if (o.akamai_stream_id) body.akamai_stream_id = await self.parseVariablesInString(String(o.akamai_stream_id))
				if (typeof o.paused === 'boolean') body.paused = o.paused
				if (typeof o.keep_src_stream_params === 'boolean') body.keep_src_stream_params = o.keep_src_stream_params
				if (typeof o.ssl === 'boolean') body.ssl = o.ssl
				if (o.other_servers_to_apply) {
					const serverIds = (await self.parseVariablesInString(String(o.other_servers_to_apply)))
						.split(',')
						.map((id) => id.trim())
						.filter((id) => id.length > 0)
					body.other_servers_to_apply = serverIds
				}

				const apiPath = `server/${o.server_id}/rtmp/republish`
				await self.apiPost(apiPath, body)
			},
		},
		UpdateRepublishRoute: {
			name: 'Update Republish Route',
			options: [
				{
					id: 'rule_combined_id',
					type: 'dropdown',
					label: 'Select Republish Rule',
					choices: self.ruleCache,
					default: self.ruleCache[0]?.id ?? '',
				},
				{ id: 'src_app', type: 'textinput', label: 'Source App Name', default: '' },
				{ id: 'src_strm', type: 'textinput', label: 'Source Stream Name', default: '' },
				{ id: 'dest_addr', type: 'textinput', label: 'Destination Address', default: '' },
				{
					id: 'dest_port',
					type: 'number',
					label: 'Destination Port',
					default: 1935,
					min: 0,
					max: 65535,
				},
				{ id: 'dest_app', type: 'textinput', label: 'Destination App Name', default: '' },
				{ id: 'dest_strm', type: 'textinput', label: 'Destination Stream Name', default: '' },
				{ id: 'dest_app_params', type: 'textinput', label: 'Destination App Params', default: '' },
				{ id: 'dest_strm_params', type: 'textinput', label: 'Destination Stream Params', default: '' },
				{ id: 'description', type: 'textinput', label: 'Description', default: '' },
				{ id: 'tags', type: 'textinput', label: 'Tags (comma separated)', default: '' },
				{
					id: 'auth_schema',
					type: 'dropdown',
					label: 'Auth Schema',
					choices: [
						{ id: 'NONE', label: 'NONE' },
						{ id: 'NIMBLE', label: 'NIMBLE' },
						{ id: 'AKAMAI', label: 'AKAMAI' },
						{ id: 'LIMELIGHT', label: 'LIMELIGHT' },
						{ id: 'PERISCOPE', label: 'PERISCOPE' },
						{ id: 'TELEGRAM', label: 'TELEGRAM' },
						{ id: 'RTMP', label: 'RTMP' },
						{ id: 'TWITCH', label: 'TWITCH' },
					],
					default: 'NONE',
				},
				{ id: 'dest_login', type: 'textinput', label: 'Destination Login', default: '' },
				{ id: 'dest_password', type: 'textinput', label: 'Destination Password', default: '' },
				{ id: 'akamai_stream_id', type: 'textinput', label: 'Akamai Stream ID', default: '' },
				{
					id: 'paused',
					type: 'checkbox',
					label: 'Paused',
					default: false,
				},
				{
					id: 'keep_src_stream_params',
					type: 'checkbox',
					label: 'Keep Source Stream Params',
					default: false,
				},
				{
					id: 'ssl',
					type: 'checkbox',
					label: 'Use SSL',
					default: false,
				},
				{
					id: 'other_servers_to_apply',
					type: 'textinput',
					label: 'Other Server IDs (comma separated, max 20)',
					default: '',
				},
			],

			callback: async (event) => {
				const o = event.options
				const body: any = {}

				const addField = async (key: string, value: any, parse = true) => {
					if (value !== undefined && value !== '') {
						body[key] = parse ? await self.parseVariablesInString(String(value)) : value
					}
				}

				await addField('src_app', o.src_app)
				await addField('src_strm', o.src_strm)
				await addField('dest_addr', o.dest_addr)
				if (o.dest_port !== undefined) {
					const destPortStr = await self.parseVariablesInString(String(o.dest_port))
					body.dest_port = parseInt(destPortStr)
				}
				await addField('dest_app', o.dest_app)
				await addField('dest_strm', o.dest_strm)
				await addField('dest_app_params', o.dest_app_params)
				await addField('dest_strm_params', o.dest_strm_params)
				await addField('description', o.description)

				if (o.tags) {
					const parsedTags = (await self.parseVariablesInString(String(o.tags)))
						.split(',')
						.map((tag) => tag.trim())
						.filter((tag) => tag.length > 0)
					body.tags = parsedTags
				}

				if (o.auth_schema && o.auth_schema !== 'NONE') body.auth_schema = o.auth_schema
				await addField('dest_login', o.dest_login)
				await addField('dest_password', o.dest_password)
				await addField('akamai_stream_id', o.akamai_stream_id)
				body.paused = !!o.paused
				body.keep_src_stream_params = !!o.keep_src_stream_params
				body.ssl = !!o.ssl

				if (o.other_servers_to_apply) {
					const serverIds = (await self.parseVariablesInString(String(o.other_servers_to_apply)))
						.split(',')
						.map((id) => id.trim())
						.filter((id) => id.length > 0)
					body.other_servers_to_apply = serverIds
				}

				if (!o.rule_combined_id) {
					self.log('error', 'No Republish Rule selected, aborting update.')
					return
				}

				const [serverId, ruleId] = String(o.rule_combined_id).split('::')
				const apiPath = `server/${serverId}/rtmp/republish/${ruleId}`
				await self.apiPut(apiPath, body)
			},

			learn: async (action) => {
				const o = action.options

				if (!o.rule_combined_id) {
					self.log('error', 'No Republish Rule selected for Learn operation.')
					return undefined
				}

				const [serverId, ruleId] = String(o.rule_combined_id).split('::')

				try {
					const resp = await self.apiGet(`server/${serverId}/rtmp/republish/${ruleId}`)
					const data = resp?.rule

					if (!data || typeof data !== 'object') {
						self.log(
							'error',
							`No rule data found for Rule ${ruleId} on Server ${serverId}. Response: ${JSON.stringify(resp)}`,
						)
						return undefined
					}

					self.log('info', `Learn fetched rule data for Rule ${ruleId}: ${JSON.stringify(data)}`)

					return {
						...o,
						src_app: data.src_app ?? o.src_app,
						src_strm: data.src_strm ?? o.src_strm,
						dest_addr: data.dest_addr ?? o.dest_addr,
						dest_port: data.dest_port ?? o.dest_port,
						dest_app: data.dest_app ?? o.dest_app,
						dest_strm: data.dest_strm ?? o.dest_strm,
						dest_app_params: data.dest_app_params ?? o.dest_app_params,
						dest_strm_params: data.dest_strm_params ?? o.dest_strm_params,
						description: data.description ?? o.description,
						tags: Array.isArray(data.tags) ? data.tags.join(', ') : o.tags,
						auth_schema: data.auth_schema ?? o.auth_schema,
						dest_login: data.dest_login ?? o.dest_login,
						dest_password: data.dest_password ?? o.dest_password,
						akamai_stream_id: data.akamai_stream_id ?? o.akamai_stream_id,
						paused: data.paused ?? o.paused,
						keep_src_stream_params: data.keep_src_stream_params ?? o.keep_src_stream_params,
						ssl: data.ssl ?? o.ssl,
					}
				} catch (error) {
					self.log('error', `Learn failed for Rule ${ruleId}: ${error}`)
					return undefined
				}
			},
		},

		RestartRepublishRule: {
			name: 'Restart Republish Rule',
			options: [
				{
					id: 'rule_combined_id',
					type: 'dropdown',
					label: 'Select Republish Rule',
					choices: self.ruleCache,
					default: self.ruleCache[0]?.id ?? '',
				},
			],
			callback: async (event) => {
				const o = event.options

				const combinedId = String(o.rule_combined_id ?? '')
				const [serverId, ruleId] = combinedId.split('::')

				if (!serverId || !ruleId) {
					self.log('error', `Invalid or no Republish Rule selected: "${combinedId}", aborting restart.`)
					return
				}

				const apiPath = `server/${serverId}/rtmp/republish/${ruleId}/restart`
				await self.apiGet(apiPath)
			},
		},
		DeleteRepublishRule: {
			name: 'Delete Republish Rule',
			options: [
				{
					id: 'rule_combined_id',
					type: 'dropdown',
					label: 'Select Republish Rule',
					choices: self.ruleCache,
					default: self.ruleCache[0]?.id ?? '',
				},
			],
			callback: async (event) => {
				const o = event.options

				const combinedId = String(o.rule_combined_id ?? '')
				const [serverId, ruleId] = combinedId.split('::')

				if (!serverId || !ruleId) {
					self.log('error', `Invalid or no Republish Rule selected: "${combinedId}", aborting delete.`)
					return
				}

				const apiPath = `server/${serverId}/rtmp/republish/${ruleId}`
				await self.apiDelete(apiPath, {})
			},
		},
    }
}