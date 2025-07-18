import type { ModuleInstance } from './main.js'
//import { Regex } from '@companion-module/base'

export function UpdateActions(self: ModuleInstance): void {
	self.setActionDefinitions({
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

		//MPEGTS IN
		CreateIncomingMpegtsStream: {
			name: 'Create MPEGTS IN Stream',
			options: [
				{
					id: 'server_id',
					type: 'dropdown',
					label: 'Select Server',
					choices: self.serverCache,
					default: self.serverCache[0]?.id ?? '',
				},
				{
					id: 'protocol',
					type: 'dropdown',
					label: 'Protocol',
					choices: [
						{ id: 'http', label: 'HTTP' },
						{ id: 'hls', label: 'HLS' },
						{ id: 'udp', label: 'UDP' },
						{ id: 'srt', label: 'SRT' },
						{ id: 'rist', label: 'RIST' },
						{ id: 'zixi', label: 'Zixi' },
					],
					default: 'udp',
				},
				{ id: 'ip', type: 'textinput', label: 'IP', default: '' },
				{ id: 'port', type: 'number', label: 'Port', default: 1234, min: 0, max: 65535 },
				{ id: 'url', type: 'textinput', label: 'URL', default: '' },
				{ id: 'fallback_urls', type: 'textinput', label: 'Fallback URLs (comma separated, deprecated)', default: '' },
				{ id: 'fallbacks', type: 'textinput', label: 'Fallbacks (JSON array, optional)', default: '' },
				{ id: 'probe_interval', type: 'number', label: 'Probe Interval (sec)', default: 0, min: 0, max: 65535 },
				{ id: 'name', type: 'textinput', label: 'Name', default: '' },
				{ id: 'description', type: 'textinput', label: 'Description', default: '' },
				{ id: 'tags', type: 'textinput', label: 'Tags (comma separated)', default: '' },
				{
					id: 'socket_reuse',
					type: 'dropdown',
					label: 'Socket Reuse',
					choices: [
						{ id: 'Enabled', label: 'Enabled' },
						{ id: 'Disabled', label: 'Disabled' },
						{ id: 'Default', label: 'Default' },
					],
					default: 'Default',
				},
				{ id: 'multicast_ip', type: 'textinput', label: 'Multicast IP', default: '' },
				{ id: 'multicast_source_ip', type: 'textinput', label: 'Multicast Source IP', default: '' },
				{
					id: 'add_outgoing_stream',
					type: 'checkbox',
					label: 'Add Outgoing Stream',
					default: false,
				},
				{ id: 'outgoing_app_name', type: 'textinput', label: 'Outgoing App Name', default: '' },
				{ id: 'outgoing_stream_name', type: 'textinput', label: 'Outgoing Stream Name', default: '' },
				{
					id: 'receive_mode',
					type: 'dropdown',
					label: 'Receive Mode',
					choices: [
						{ id: '', label: 'None' },
						{ id: 'listen', label: 'Listen' },
						{ id: 'pull', label: 'Pull' },
						{ id: 'rendezvous', label: 'Rendezvous' },
					],
					default: '',
				},
				{ id: 'rendezvous_ip', type: 'textinput', label: 'Rendezvous IP', default: '' },
				{ id: 'rendezvous_port', type: 'number', label: 'Rendezvous Port', default: 0, min: 0, max: 65535 },
				{ id: 'parameters', type: 'textinput', label: 'Parameters (JSON object)', default: '' },
				{ id: 'redundancy_addresses', type: 'textinput', label: 'Redundancy Addresses (JSON array)', default: '' },
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

				body.protocol = o.protocol
				await addField('ip', o.ip)
				if (o.port !== undefined) {
					body.port = Number(o.port)
				}
				await addField('url', o.url)
				if (o.fallback_urls) {
					body.fallback_urls = (await self.parseVariablesInString(String(o.fallback_urls)))
						.split(',')
						.map((url) => url.trim())
						.filter((url) => url.length > 0)
				}
				if (o.fallbacks) {
					try {
						body.fallbacks = JSON.parse(await self.parseVariablesInString(String(o.fallbacks)))
					} catch {
						self.log('error', 'Invalid JSON for fallbacks, skipping.')
					}
				}
				if (o.probe_interval !== undefined) {
					body.probe_interval = Number(o.probe_interval)
				}
				await addField('name', o.name)
				await addField('description', o.description)
				if (o.tags) {
					body.tags = (await self.parseVariablesInString(String(o.tags)))
						.split(',')
						.map((tag) => tag.trim())
						.filter((tag) => tag.length > 0)
				}
				if (o.socket_reuse && o.socket_reuse !== 'Default') {
					body.socket_reuse = o.socket_reuse
				}
				await addField('multicast_ip', o.multicast_ip)
				await addField('multicast_source_ip', o.multicast_source_ip)
				body.add_outgoing_stream = !!o.add_outgoing_stream
				await addField('outgoing_app_name', o.outgoing_app_name)
				await addField('outgoing_stream_name', o.outgoing_stream_name)
				if (o.receive_mode) {
					body.receive_mode = o.receive_mode
				}
				await addField('rendezvous_ip', o.rendezvous_ip)
				if (o.rendezvous_port !== undefined && o.rendezvous_port !== 0) {
					body.rendezvous_port = Number(o.rendezvous_port)
				}
				if (o.parameters) {
					try {
						body.parameters = JSON.parse(await self.parseVariablesInString(String(o.parameters)))
					} catch {
						self.log('error', 'Invalid JSON for parameters, skipping.')
					}
				}
				if (o.redundancy_addresses) {
					try {
						body.redundancy_addresses = JSON.parse(await self.parseVariablesInString(String(o.redundancy_addresses)))
					} catch {
						self.log('error', 'Invalid JSON for redundancy_addresses, skipping.')
					}
				}
				if (o.other_servers_to_apply) {
					body.other_servers_to_apply = (await self.parseVariablesInString(String(o.other_servers_to_apply)))
						.split(',')
						.map((id) => id.trim())
						.filter((id) => id.length > 0)
				}

				if (!o.server_id) {
					self.log('error', 'No server selected, aborting.')
					return
				}

				const apiPath = `server/${o.server_id}/mpegts/incoming`
				await self.apiPost(apiPath, body)
			},
		},
		UpdateMpegtsInStream: {
			name: 'Update MPEGTS IN Stream',
			options: [
				{
					id: 'stream_combined_id',
					type: 'dropdown',
					label: 'Select MPEGTS IN Stream',
					choices: self.mpegtsInCache,
					default: self.mpegtsInCache[0]?.id ?? '',
				},
				{
					id: 'protocol',
					type: 'dropdown',
					label: 'Protocol',
					choices: [
						{ id: 'http', label: 'HTTP' },
						{ id: 'hls', label: 'HLS' },
						{ id: 'udp', label: 'UDP' },
						{ id: 'srt', label: 'SRT' },
						{ id: 'rist', label: 'RIST' },
						{ id: 'zixi', label: 'Zixi' },
					],
					default: '',
				},
				{ id: 'ip', type: 'textinput', label: 'IP Address', default: '' },
				{ id: 'port', type: 'number', label: 'Port', default: 0, min: 0, max: 65535 },
				{ id: 'url', type: 'textinput', label: 'URL', default: '' },
				{ id: 'name', type: 'textinput', label: 'Name', default: '' },
				{ id: 'description', type: 'textinput', label: 'Description', default: '' },
				{ id: 'tags', type: 'textinput', label: 'Tags (comma separated)', default: '' },
				{
					id: 'socket_reuse',
					type: 'dropdown',
					label: 'Socket Reuse',
					choices: [
						{ id: 'Enabled', label: 'Enabled' },
						{ id: 'Disabled', label: 'Disabled' },
						{ id: 'Default', label: 'Default' },
					],
					default: '',
				},
				{ id: 'multicast_ip', type: 'textinput', label: 'Multicast IP', default: '' },
				{ id: 'multicast_source_ip', type: 'textinput', label: 'Multicast Source IP', default: '' },
				{ id: 'add_outgoing_stream', type: 'checkbox', label: 'Add Outgoing Stream', default: false },
				{ id: 'outgoing_app_name', type: 'textinput', label: 'Outgoing App Name', default: '' },
				{ id: 'outgoing_stream_name', type: 'textinput', label: 'Outgoing Stream Name', default: '' },
				{
					id: 'receive_mode',
					type: 'dropdown',
					label: 'Receive Mode',
					choices: [
						{ id: '', label: 'None' },
						{ id: 'listen', label: 'Listen' },
						{ id: 'pull', label: 'Pull' },
						{ id: 'rendezvous', label: 'Rendezvous' },
					],
					default: '',
				},
				{ id: 'rendezvous_ip', type: 'textinput', label: 'Rendezvous IP', default: '' },
				{ id: 'rendezvous_port', type: 'number', label: 'Rendezvous Port', default: 0, min: 0, max: 65535 },
				{ id: 'parameters', type: 'textinput', label: 'Parameters (JSON object)', default: '' },
				{ id: 'redundancy_addresses', type: 'textinput', label: 'Redundancy Addresses (JSON array)', default: '' },
				{ id: 'other_servers_to_apply', type: 'textinput', label: 'Other Servers (comma separated)', default: '' },
			],
			callback: async (event) => {
				const o = event.options
				const body: any = {}

				const addField = async (key: string, value: any, parse = true) => {
					if (value !== undefined && value !== '') {
						body[key] = parse ? await self.parseVariablesInString(String(value)) : value
					}
				}

				await addField('protocol', o.protocol, false)
				await addField('ip', o.ip)
				if (o.port !== undefined && o.port !== 0) {
					body.port = Number(o.port)
				}
				await addField('url', o.url)
				await addField('name', o.name)
				await addField('description', o.description)

				if (o.tags) {
					const parsedTags = (await self.parseVariablesInString(String(o.tags)))
						.split(',')
						.map((t) => t.trim())
						.filter((t) => t.length > 0)
					body.tags = parsedTags
				}

				await addField('socket_reuse', o.socket_reuse, false)
				await addField('multicast_ip', o.multicast_ip)
				await addField('multicast_source_ip', o.multicast_source_ip)
				body.add_outgoing_stream = !!o.add_outgoing_stream
				await addField('outgoing_app_name', o.outgoing_app_name)
				await addField('outgoing_stream_name', o.outgoing_stream_name)
				await addField('receive_mode', o.receive_mode, false)
				await addField('rendezvous_ip', o.rendezvous_ip)
				if (o.rendezvous_port !== undefined && o.rendezvous_port !== 0) {
					body.rendezvous_port = Number(o.rendezvous_port)
				}

				if (o.parameters) {
					try {
						body.parameters = JSON.parse(await self.parseVariablesInString(String(o.parameters)))
					} catch {
						self.log('error', 'Invalid JSON for parameters, skipping.')
					}
				}

				if (o.redundancy_addresses) {
					try {
						body.redundancy_addresses = JSON.parse(await self.parseVariablesInString(String(o.redundancy_addresses)))
					} catch {
						self.log('error', 'Invalid JSON for redundancy_addresses, skipping.')
					}
				}

				if (o.other_servers_to_apply) {
					const servers = (await self.parseVariablesInString(String(o.other_servers_to_apply)))
						.split(',')
						.map((t) => t.trim())
						.filter((t) => t.length > 0)
					body.other_servers_to_apply = servers
				}

				if (!o.stream_combined_id) {
					self.log('error', 'No MPEGTS IN Stream selected, aborting update.')
					return
				}

				const [serverId, streamId] = String(o.stream_combined_id).split('::')
				const apiPath = `server/${serverId}/mpegts/incoming/${streamId}`

				await self.apiPut(apiPath, body)
			},

			learn: async (action) => {
				const o = action.options
				if (!o.stream_combined_id) {
					self.log('error', 'No MPEGTS IN Stream selected for Learn.')
					return undefined
				}

				const [serverId, streamId] = String(o.stream_combined_id).split('::')
				try {
					const resp = await self.apiGet(`server/${serverId}/mpegts/incoming/${streamId}`)
					const data = resp?.stream
					if (!data || typeof data !== 'object') {
						self.log('error', `No data found for MPEGTS IN Stream ${streamId} on Server ${serverId}.`)
						return undefined
					}

					self.log('info', `Learn fetched MPEGTS IN Stream data: ${JSON.stringify(data)}`)

					return {
						...o,
						protocol: data.protocol ?? o.protocol,
						ip: data.ip ?? o.ip,
						port: data.port ?? o.port,
						url: data.url ?? o.url,
						name: data.name ?? o.name,
						description: data.description ?? o.description,
						tags: Array.isArray(data.tags) ? data.tags.join(', ') : o.tags,
						socket_reuse: data.socket_reuse ?? o.socket_reuse,
						multicast_ip: data.multicast_ip ?? o.multicast_ip,
						multicast_source_ip: data.multicast_source_ip ?? o.multicast_source_ip,
						add_outgoing_stream: data.add_outgoing_stream ?? o.add_outgoing_stream,
						outgoing_app_name: data.outgoing_app_name ?? o.outgoing_app_name,
						outgoing_stream_name: data.outgoing_stream_name ?? o.outgoing_stream_name,
						receive_mode: data.receive_mode ?? o.receive_mode,
						rendezvous_ip: data.rendezvous_ip ?? o.rendezvous_ip,
						rendezvous_port: data.rendezvous_port ?? o.rendezvous_port,
						parameters: data.parameters ? JSON.stringify(data.parameters) : o.parameters,
						redundancy_addresses: data.redundancy_addresses
							? JSON.stringify(data.redundancy_addresses)
							: o.redundancy_addresses,
					}
				} catch (error) {
					self.log('error', `Learn failed for MPEGTS IN Stream ${streamId}: ${error}`)
					return undefined
				}
			},
		},

		PauseMpegtsInStream: {
			name: 'Pause MPEGTS IN Stream',
			options: [
				{
					id: 'stream_combined_id',
					type: 'dropdown',
					label: 'Select MPEGTS IN Stream',
					choices: self.mpegtsInCache,
					default: self.mpegtsInCache[0]?.id ?? '',
				},
			],
			callback: async (event) => {
				const o = event.options
				if (!o.stream_combined_id) {
					self.log('error', 'No MPEGTS IN Stream selected for pause.')
					return
				}
				const [serverId, streamId] = String(o.stream_combined_id).split('::')
				const apiPath = `server/${serverId}/mpegts/incoming/${streamId}/pause`
				await self.apiGet(apiPath)
			},
		},
		ResumeMpegtsInStream: {
			name: 'Resume MPEGTS IN Stream',
			options: [
				{
					id: 'stream_combined_id',
					type: 'dropdown',
					label: 'Select MPEGTS IN Stream',
					choices: self.mpegtsInCache,
					default: self.mpegtsInCache[0]?.id ?? '',
				},
			],
			callback: async (event) => {
				const o = event.options
				if (!o.stream_combined_id) {
					self.log('error', 'No MPEGTS IN Stream selected for resume.')
					return
				}
				const [serverId, streamId] = String(o.stream_combined_id).split('::')
				const apiPath = `server/${serverId}/mpegts/incoming/${streamId}/resume`
				await self.apiGet(apiPath)
			},
		},
		RestartMpegtsInStream: {
			name: 'Restart MPEGTS IN Stream',
			options: [
				{
					id: 'stream_combined_id',
					type: 'dropdown',
					label: 'Select MPEGTS IN Stream',
					choices: self.mpegtsInCache,
					default: self.mpegtsInCache[0]?.id ?? '',
				},
			],
			callback: async (event) => {
				const o = event.options
				if (!o.stream_combined_id) {
					self.log('error', 'No MPEGTS IN Stream selected for restart.')
					return
				}
				const [serverId, streamId] = String(o.stream_combined_id).split('::')
				const apiPath = `server/${serverId}/mpegts/incoming/${streamId}/restart`
				await self.apiGet(apiPath)
			},
		},

		DeleteMpegtsInStream: {
			name: 'Delete MPEGTS IN Stream',
			options: [
				{
					id: 'stream_combined_id',
					type: 'dropdown',
					label: 'Select MPEGTS IN Stream',
					choices: self.mpegtsInCache,
					default: self.mpegtsInCache[0]?.id ?? '',
				},
			],
			callback: async (event) => {
				const o = event.options
				if (!o.stream_combined_id) {
					self.log('error', 'No MPEGTS IN Stream selected for deletion.')
					return
				}
				const [serverId, streamId] = String(o.stream_combined_id).split('::')
				const apiPath = `server/${serverId}/mpegts/incoming/${streamId}`
				await self.apiDelete(apiPath, {})
			},
		},

		//MPEGTS OUT
		CreateOutgoingMpegtsStream: {
			name: 'Create MPEGTS Out Stream',
			options: [
				{
					id: 'server_id',
					type: 'dropdown',
					label: 'Select Server',
					choices: self.serverCache,
					default: self.serverCache[0]?.id ?? '',
				},
				{ id: 'application', type: 'textinput', label: 'Application Name', default: '' },
				{ id: 'stream', type: 'textinput', label: 'Stream Name', default: '' },
				{ id: 'description', type: 'textinput', label: 'Description (optional)', default: '' },
				{ id: 'tags', type: 'textinput', label: 'Tags (comma separated, optional)', default: '' },

				// Raw Source ID Dropdown (optional)
				{
					id: 'raw_source_id',
					type: 'dropdown',
					label: 'Raw Source ID (optional)',
					choices: [{ id: '', label: '--- None ---' }, ...self.mpegtsInSourceCache],
					default: '',
				},

				// Video Source Fields
				{
					id: 'video_source_id',
					type: 'dropdown',
					label: 'Video Source ID (optional)',
					choices: [{ id: '', label: '--- None ---' }, ...self.mpegtsInSourceCache],
					default: '',
				},
				{
					id: 'video_source_pid',
					type: 'number',
					label: 'Video Source PID (optional)',
					default: 0,
					min: 0,
					max: 8191,
				},
				{
					id: 'video_source_index',
					type: 'number',
					label: 'Video Source Index (optional)',
					default: 0,
					min: 0,
					max: 64,
				},

				// Audio Source Fields
				{
					id: 'audio_source_id',
					type: 'dropdown',
					label: 'Audio Source ID (optional)',
					choices: [{ id: '', label: '--- None ---' }, ...self.mpegtsInSourceCache],
					default: '',
				},
				{
					id: 'audio_source_pid',
					type: 'number',
					label: 'Audio Source PID (optional)',
					default: 0,
					min: 0,
					max: 8191,
				},
				{
					id: 'audio_source_index',
					type: 'number',
					label: 'Audio Source Index (optional)',
					default: 0,
					min: 0,
					max: 64,
				},
				{
					id: 'audio_source_language_code',
					type: 'textinput',
					label: 'Audio Language Code (optional, e.g. eng)',
					default: '',
				},

				// Other Servers
				{
					id: 'other_servers_to_apply',
					type: 'textinput',
					label: 'Other Servers (comma separated, optional)',
					default: '',
				},
			],

			callback: async (event) => {
				const o = event.options

				if (!o.server_id) {
					self.log('error', 'No server selected, aborting.')
					return
				}

				const body: any = {}

				const addField = async (key: string, value: any, parse = true) => {
					if (value !== undefined && value !== '' && !(typeof value === 'number' && value === 0)) {
						body[key] = parse ? await self.parseVariablesInString(String(value)) : value
					}
				}

				await addField('application', o.application)
				await addField('stream', o.stream)
				await addField('description', o.description)

				if (o.tags) {
					const parsedTags = (await self.parseVariablesInString(String(o.tags)))
						.split(',')
						.map((t) => t.trim())
						.filter((t) => t.length > 0)
					body.tags = parsedTags
				}

				await addField('raw_source_id', o.raw_source_id, false)

				// Video Source
				if (o.video_source_id || o.video_source_pid || o.video_source_index) {
					body.video_source = {}
					if (o.video_source_id) body.video_source.id = await self.parseVariablesInString(String(o.video_source_id))
					if (o.video_source_pid && o.video_source_pid !== 0) body.video_source.pid = Number(o.video_source_pid)
					if (o.video_source_index && o.video_source_index !== 0) body.video_source.index = Number(o.video_source_index)
				}

				// Audio Source
				if (o.audio_source_id || o.audio_source_pid || o.audio_source_index || o.audio_source_language_code) {
					body.audio_source = {}
					if (o.audio_source_id) body.audio_source.id = await self.parseVariablesInString(String(o.audio_source_id))
					if (o.audio_source_pid && o.audio_source_pid !== 0) body.audio_source.pid = Number(o.audio_source_pid)
					if (o.audio_source_index && o.audio_source_index !== 0) body.audio_source.index = Number(o.audio_source_index)
					if (o.audio_source_language_code)
						body.audio_source.language_code = await self.parseVariablesInString(String(o.audio_source_language_code))
				}

				if (o.other_servers_to_apply) {
					const servers = (await self.parseVariablesInString(String(o.other_servers_to_apply)))
						.split(',')
						.map((t) => t.trim())
						.filter((t) => t.length > 0)
					body.other_servers_to_apply = servers
				}

				const apiPath = `server/${o.server_id}/mpegts/outgoing`
				await self.apiPost(apiPath, body)
			},
		},

		UpdateOutgoingMpegtsStream: {
			name: 'Update MPEGTS Out Stream',
			options: [
				{
					id: 'stream_combined_id',
					type: 'dropdown',
					label: 'Select Outgoing MPEGTS Stream',
					choices: self.mpegtsOutCache,
					default: self.mpegtsOutCache[0]?.id ?? '',
				},
				{ id: 'application', type: 'textinput', label: 'Application Name (optional)', default: '' },
				{ id: 'stream', type: 'textinput', label: 'Stream Name (optional)', default: '' },
				{ id: 'description', type: 'textinput', label: 'Description (optional)', default: '' },
				{ id: 'tags', type: 'textinput', label: 'Tags (comma separated, optional)', default: '' },

				// Raw Source ID Dropdown (optional)
				{
					id: 'raw_source_id',
					type: 'dropdown',
					label: 'Raw Source ID (optional)',
					choices: [{ id: '', label: '--- None ---' }, ...self.mpegtsInSourceCache],
					default: '',
				},

				// Video Source Fields
				{
					id: 'video_source_id',
					type: 'dropdown',
					label: 'Video Source ID (optional)',
					choices: [{ id: '', label: '--- None ---' }, ...self.mpegtsInSourceCache],
					default: '',
				},
				{
					id: 'video_source_pid',
					type: 'number',
					label: 'Video Source PID (optional)',
					default: 0,
					min: 0,
					max: 8191,
				},
				{
					id: 'video_source_index',
					type: 'number',
					label: 'Video Source Index (optional)',
					default: 0,
					min: 0,
					max: 64,
				},

				// Audio Source Fields
				{
					id: 'audio_source_id',
					type: 'dropdown',
					label: 'Audio Source ID (optional)',
					choices: [{ id: '', label: '--- None ---' }, ...self.mpegtsInSourceCache],
					default: '',
				},
				{
					id: 'audio_source_pid',
					type: 'number',
					label: 'Audio Source PID (optional)',
					default: 0,
					min: 0,
					max: 8191,
				},
				{
					id: 'audio_source_index',
					type: 'number',
					label: 'Audio Source Index (optional)',
					default: 0,
					min: 0,
					max: 64,
				},
				{
					id: 'audio_source_language_code',
					type: 'textinput',
					label: 'Audio Language Code (optional, e.g. eng)',
					default: '',
				},

				// Other Servers
				{
					id: 'other_servers_to_apply',
					type: 'textinput',
					label: 'Other Servers (comma separated, optional)',
					default: '',
				},
			],

			callback: async (event) => {
				const o = event.options

				if (!o.stream_combined_id) {
					self.log('error', 'No Outgoing MPEGTS Stream selected for update.')
					return
				}

				const [serverId, streamId] = String(o.stream_combined_id).split('::')
				const body: any = {}

				const addField = async (key: string, value: any, parse = true) => {
					if (value !== undefined && value !== '' && !(typeof value === 'number' && value === 0)) {
						body[key] = parse ? await self.parseVariablesInString(String(value)) : value
					}
				}

				await addField('application', o.application)
				await addField('stream', o.stream)
				await addField('description', o.description)

				if (o.tags) {
					const parsedTags = (await self.parseVariablesInString(String(o.tags)))
						.split(',')
						.map((t) => t.trim())
						.filter((t) => t.length > 0)
					body.tags = parsedTags
				}

				await addField('raw_source_id', o.raw_source_id, false)

				// Video Source
				if (o.video_source_id || o.video_source_pid || o.video_source_index) {
					body.video_source = {}
					if (o.video_source_id) body.video_source.id = await self.parseVariablesInString(String(o.video_source_id))
					if (o.video_source_pid && o.video_source_pid !== 0) body.video_source.pid = Number(o.video_source_pid)
					if (o.video_source_index && o.video_source_index !== 0) body.video_source.index = Number(o.video_source_index)
				}

				// Audio Source
				if (o.audio_source_id || o.audio_source_pid || o.audio_source_index || o.audio_source_language_code) {
					body.audio_source = {}
					if (o.audio_source_id) body.audio_source.id = await self.parseVariablesInString(String(o.audio_source_id))
					if (o.audio_source_pid && o.audio_source_pid !== 0) body.audio_source.pid = Number(o.audio_source_pid)
					if (o.audio_source_index && o.audio_source_index !== 0) body.audio_source.index = Number(o.audio_source_index)
					if (o.audio_source_language_code)
						body.audio_source.language_code = await self.parseVariablesInString(String(o.audio_source_language_code))
				}

				if (o.other_servers_to_apply) {
					const servers = (await self.parseVariablesInString(String(o.other_servers_to_apply)))
						.split(',')
						.map((t) => t.trim())
						.filter((t) => t.length > 0)
					body.other_servers_to_apply = servers
				}

				const apiPath = `server/${serverId}/mpegts/outgoing/${streamId}`
				await self.apiPut(apiPath, body)
			},

			learn: async (action) => {
				const o = action.options
				if (!o.stream_combined_id) {
					self.log('error', 'No Outgoing MPEGTS Stream selected for learn.')
					return undefined
				}

				const [serverId, streamId] = String(o.stream_combined_id).split('::')
				const resp = await self.apiGet(`server/${serverId}/mpegts/outgoing/${streamId}`)

				if (!resp || !resp.stream) {
					self.log(
						'error',
						`No stream data found for stream ${streamId} on server ${serverId}. Response: ${JSON.stringify(resp)}`,
					)
					return undefined
				}

				const s = resp.stream
				return {
					...o,
					application: s.application ?? '',
					stream: s.stream ?? '',
					description: s.description ?? '',
					tags: s.tags?.join(', ') ?? '',
					raw_source_id: s.raw_source_id ?? '',
					video_source_id: s.video_source?.id ?? '',
					video_source_pid: s.video_source?.pid ?? 0,
					video_source_index: s.video_source?.index ?? 0,
					audio_source_id: s.audio_source?.id ?? '',
					audio_source_pid: s.audio_source?.pid ?? 0,
					audio_source_index: s.audio_source?.index ?? 0,
					audio_source_language_code: s.audio_source?.language_code ?? '',
				}
			},
		},
		PauseOutgoingMpegtsStream: {
			name: 'Pause MPEGTS Out Stream',
			options: [
				{
					id: 'stream_combined_id',
					type: 'dropdown',
					label: 'Select Outgoing MPEGTS Stream',
					choices: self.mpegtsOutCache,
					default: self.mpegtsOutCache[0]?.id ?? '',
				},
			],
			callback: async (event) => {
				const o = event.options
				if (!o.stream_combined_id) {
					self.log('error', 'No Outgoing MPEGTS Stream selected for pause.')
					return
				}
				const [serverId, streamId] = String(o.stream_combined_id).split('::')
				const apiPath = `server/${serverId}/mpegts/outgoing/${streamId}/pause`
				await self.apiGet(apiPath)
			},
		},
		ResumeOutgoingMpegtsStream: {
			name: 'Resume MPEGTS Out Stream',
			options: [
				{
					id: 'stream_combined_id',
					type: 'dropdown',
					label: 'Select Outgoing MPEGTS Stream',
					choices: self.mpegtsOutCache,
					default: self.mpegtsOutCache[0]?.id ?? '',
				},
			],
			callback: async (event) => {
				const o = event.options
				if (!o.stream_combined_id) {
					self.log('error', 'No Outgoing MPEGTS Stream selected for resume.')
					return
				}
				const [serverId, streamId] = String(o.stream_combined_id).split('::')
				const apiPath = `server/${serverId}/mpegts/outgoing/${streamId}/resume`
				await self.apiGet(apiPath)
			},
		},

		RestartOutgoingMpegtsStream: {
			name: 'Restart MPEGTS Out Stream',
			options: [
				{
					id: 'stream_combined_id',
					type: 'dropdown',
					label: 'Select Outgoing MPEGTS Stream',
					choices: self.mpegtsOutCache,
					default: self.mpegtsOutCache[0]?.id ?? '',
				},
			],
			callback: async (event) => {
				const o = event.options
				if (!o.stream_combined_id) {
					self.log('error', 'No Outgoing MPEGTS Stream selected for restart.')
					return
				}
				const [serverId, streamId] = String(o.stream_combined_id).split('::')
				const apiPath = `server/${serverId}/mpegts/outgoing/${streamId}/restart`
				await self.apiGet(apiPath)
			},
		},
		DeleteOutgoingMpegtsStream: {
			name: 'Delete Outgoing MPEGTS Stream',
			options: [
				{
					id: 'stream_combined_id',
					type: 'dropdown',
					label: 'Select Outgoing MPEGTS Stream',
					choices: self.mpegtsOutCache,
					default: self.mpegtsOutCache[0]?.id ?? '',
				},
			],
			callback: async (event) => {
				const o = event.options
				if (!o.stream_combined_id) {
					self.log('error', 'No Outgoing MPEGTS Stream selected for deletion.')
					return
				}
				const [serverId, streamId] = String(o.stream_combined_id).split('::')
				const apiPath = `server/${serverId}/mpegts/outgoing/${streamId}`
				await self.apiDelete(apiPath, {})
			},
		},
		//UDP Streaming
		CreateUdpStream: {
			name: 'Create UDP Stream',
			description: 'Create a UDP/SRT/RIST/Zixi MPEG-TS stream with advanced mux, CBR and detailed source handling.',
			options: [
				{
					id: 'server_id',
					type: 'dropdown',
					label: 'Select Server',
					choices: self.serverCache,
					default: self.serverCache[0]?.id ?? '',
				},
				{
					id: 'protocol',
					type: 'dropdown',
					label: 'Protocol (optional)',
					choices: [
						{ id: '', label: 'Default (UDP)' },
						{ id: 'udp', label: 'UDP' },
						{ id: 'srt', label: 'SRT' },
						{ id: 'rist', label: 'RIST' },
						{ id: 'zixi', label: 'Zixi' },
					],
					default: '',
				},
				{ id: 'ip', type: 'textinput', label: 'Target IP Address', default: '' },
				{ id: 'port', type: 'number', label: 'Target Port', default: 0, min: 0, max: 65535 },
				{ id: 'name', type: 'textinput', label: 'Name (optional)', default: '' },
				{ id: 'description', type: 'textinput', label: 'Description (optional)', default: '' },
				{ id: 'tags', type: 'textinput', label: 'Tags (comma separated, optional)', default: '' },
				{ id: 'local_ip', type: 'textinput', label: 'Local IP (optional)', default: '' },
				{ id: 'local_port', type: 'number', label: 'Local Port (optional)', default: 0, min: 0, max: 65535 },
				{
					id: 'set_mux_rate',
					type: 'checkbox',
					label: 'Enable Mux Rate Settings',
					default: false,
				},
				{ id: 'mux_delay', type: 'number', label: 'Mux Delay (ms, optional)', default: 0, min: 0, max: 214748364 },
				{
					id: 'max_mux_delay',
					type: 'number',
					label: 'Max Mux Delay (ms, optional)',
					default: 0,
					min: 0,
					max: 214748364,
				},
				{ id: 'mux_rate', type: 'number', label: 'Mux Rate (Kbit/sec, optional)', default: 0, min: 0, max: 214748364 },
				{
					id: 'join_audio_frames',
					type: 'checkbox',
					label: 'Join Audio Frames',
					default: false,
				},
				{
					id: 'start_cbr_buffer',
					type: 'number',
					label: 'Start CBR Buffer (ms, optional)',
					default: 0,
					min: 0,
					max: 214748364,
				},
				{
					id: 'max_cbr_buffer',
					type: 'number',
					label: 'Max CBR Buffer (ms, optional)',
					default: 0,
					min: 0,
					max: 214748364,
				},
				{
					id: 'send_mode',
					type: 'dropdown',
					label: 'Send Mode (optional)',
					choices: [
						{ id: '', label: '--- None ---' },
						{ id: 'listen', label: 'listen' },
						{ id: 'push', label: 'push' },
						{ id: 'rendezvous', label: 'rendezvous' },
					],
					default: '',
				},
				{ id: 'rendezvous_ip', type: 'textinput', label: 'Rendezvous IP (optional)', default: '' },
				{ id: 'rendezvous_port', type: 'number', label: 'Rendezvous Port (optional)', default: 0, min: 0, max: 65535 },
				{ id: 'ttl', type: 'number', label: 'TTL (optional)', default: 0, min: 0, max: 214748364 },
				{
					id: 'paused',
					type: 'checkbox',
					label: 'Paused on Creation',
					default: false,
				},
				{
					id: 'transport_stream_id',
					type: 'number',
					label: 'Transport Stream ID (optional)',
					default: 0,
					min: 0,
					max: 8190,
				},
				{
					id: 'original_network_id',
					type: 'number',
					label: 'Original Network ID (optional)',
					default: 0,
					min: 0,
					max: 8190,
				},
				{ id: 'parameters_json', type: 'textinput', label: 'Parameters JSON (optional)', default: '' },

				// Sources Handling
				{
					id: 'source_id',
					type: 'dropdown',
					label: 'Source ID (optional, disables below if set)',
					choices: [{ id: '', label: '--- None ---' }, ...self.mpegtsInSourceCache],
					default: '',
				},

				// Source Streams
				{
					id: 'src_application',
					type: 'textinput',
					label: 'Source Application (if using source_streams)',
					default: '',
				},
				{ id: 'src_stream', type: 'textinput', label: 'Source Stream (if using source_streams)', default: '' },
				{ id: 'src_pmt_pid', type: 'number', label: 'PMT PID (16-8190)', default: 0, min: 0, max: 8190 },
				{ id: 'src_video_pid', type: 'number', label: 'Video PID (16-8190)', default: 0, min: 0, max: 8190 },
				{ id: 'src_audio_pid', type: 'number', label: 'Audio PID (16-8190)', default: 0, min: 0, max: 8190 },
				{ id: 'src_program_number', type: 'number', label: 'Program Number (optional)', default: 0, min: 0, max: 8190 },
				{
					id: 'src_service_type',
					type: 'number',
					label: 'Service Type (1-65535, optional)',
					default: 0,
					min: 1,
					max: 65535,
				},
				{ id: 'src_provider_name', type: 'textinput', label: 'Provider Name (optional)', default: '' },
				{ id: 'src_service_name', type: 'textinput', label: 'Service Name (optional)', default: '' },
			],
			callback: async (event) => {
				const o = event.options

				if (!o.server_id) {
					self.log('error', 'No server selected for Create UDP Stream.')
					return
				}

				const body: any = {}

				const addField = async (key: string, value: any, parse = true) => {
					if (value !== undefined && value !== '' && !(typeof value === 'number' && value === 0)) {
						body[key] = parse ? await self.parseVariablesInString(String(value)) : value
					}
				}

				await addField('protocol', o.protocol, false)
				await addField('ip', o.ip)
				if (o.port && o.port !== 0) body.port = Number(o.port)
				await addField('name', o.name)
				await addField('description', o.description)

				if (o.tags) {
					const parsedTags = (await self.parseVariablesInString(String(o.tags)))
						.split(',')
						.map((t) => t.trim())
						.filter((t) => t.length > 0)
					body.tags = parsedTags
				}

				await addField('local_ip', o.local_ip)
				if (o.local_port && o.local_port !== 0) body.local_port = Number(o.local_port)
				body.set_mux_rate = !!o.set_mux_rate
				if (o.mux_delay && o.mux_delay !== 0) body.mux_delay = Number(o.mux_delay)
				if (o.max_mux_delay && o.max_mux_delay !== 0) body.max_mux_delay = Number(o.max_mux_delay)
				if (o.mux_rate && o.mux_rate !== 0) body.mux_rate = Number(o.mux_rate)
				body.join_audio_frames = !!o.join_audio_frames
				if (o.start_cbr_buffer && o.start_cbr_buffer !== 0) body.start_cbr_buffer = Number(o.start_cbr_buffer)
				if (o.max_cbr_buffer && o.max_cbr_buffer !== 0) body.max_cbr_buffer = Number(o.max_cbr_buffer)
				await addField('send_mode', o.send_mode, false)
				await addField('rendezvous_ip', o.rendezvous_ip)
				if (o.rendezvous_port && o.rendezvous_port !== 0) body.rendezvous_port = Number(o.rendezvous_port)
				if (o.ttl && o.ttl !== 0) body.ttl = Number(o.ttl)
				body.paused = !!o.paused
				if (o.transport_stream_id && o.transport_stream_id !== 0)
					body.transport_stream_id = Number(o.transport_stream_id)
				if (o.original_network_id && o.original_network_id !== 0)
					body.original_network_id = Number(o.original_network_id)

				// parameters JSON
				if (o.parameters_json) {
					try {
						const parsed = JSON.parse(await self.parseVariablesInString(String(o.parameters_json)))
						body.parameters = parsed
					} catch (e) {
						self.log('error', `Invalid Parameters JSON: ${e}`)
					}
				}

				// Source handling
				if (o.source_id) {
					body.source_id = o.source_id
				} else if (o.src_application && o.src_stream && o.src_pmt_pid && o.src_video_pid && o.src_audio_pid) {
					const source_stream: any = {
						application: await self.parseVariablesInString(String(o.src_application)),
						stream: await self.parseVariablesInString(String(o.src_stream)),
						pmt_pid: Number(o.src_pmt_pid),
						video_pid: Number(o.src_video_pid),
						audio_pid: Number(o.src_audio_pid),
					}
					if (o.src_program_number && o.src_program_number !== 0)
						source_stream.program_number = Number(o.src_program_number)
					if (o.src_service_type && o.src_service_type !== 0) source_stream.service_type = Number(o.src_service_type)
					if (o.src_provider_name)
						source_stream.provider_name = await self.parseVariablesInString(String(o.src_provider_name))
					if (o.src_service_name)
						source_stream.service_name = await self.parseVariablesInString(String(o.src_service_name))
					body.source_streams = [source_stream]
				} else {
					self.log('error', 'You must either provide a Source ID or complete Source Stream fields.')
					return
				}

				const apiPath = `server/${o.server_id}/mpegts/udp`
				await self.apiPost(apiPath, body)
			},
		},
		UpdateUdpStream: {
			name: 'Update UDP Stream',
			description: 'Update an existing UDP MPEG-TS stream with advanced options and full source configuration.',
			options: [
				{
					id: 'stream_combined_id',
					type: 'dropdown',
					label: 'Select UDP Stream',
					choices: self.udpStreamCache,
					default: self.udpStreamCache[0]?.id ?? '',
				},
				{ id: 'ip', type: 'textinput', label: 'Target IP Address', default: '' },
				{ id: 'port', type: 'number', label: 'Target Port', default: 0, min: 0, max: 65535 },
				{ id: 'name', type: 'textinput', label: 'Name (optional)', default: '' },
				{ id: 'description', type: 'textinput', label: 'Description (optional)', default: '' },
				{ id: 'tags', type: 'textinput', label: 'Tags (comma separated, optional)', default: '' },
				{ id: 'local_ip', type: 'textinput', label: 'Local IP (optional)', default: '' },
				{ id: 'local_port', type: 'number', label: 'Local Port (optional)', default: 0, min: 0, max: 65535 },
				{
					id: 'set_mux_rate',
					type: 'checkbox',
					label: 'Enable Mux Rate Settings',
					default: false,
				},
				{ id: 'mux_delay', type: 'number', label: 'Mux Delay (ms, optional)', default: 0, min: 0, max: 214748364 },
				{
					id: 'max_mux_delay',
					type: 'number',
					label: 'Max Mux Delay (ms, optional)',
					default: 0,
					min: 0,
					max: 214748364,
				},
				{ id: 'mux_rate', type: 'number', label: 'Mux Rate (Kbit/sec, optional)', default: 0, min: 0, max: 214748364 },
				{
					id: 'join_audio_frames',
					type: 'checkbox',
					label: 'Join Audio Frames',
					default: false,
				},
				{
					id: 'start_cbr_buffer',
					type: 'number',
					label: 'Start CBR Buffer (ms, optional)',
					default: 0,
					min: 0,
					max: 214748364,
				},
				{
					id: 'max_cbr_buffer',
					type: 'number',
					label: 'Max CBR Buffer (ms, optional)',
					default: 0,
					min: 0,
					max: 214748364,
				},
				{
					id: 'send_mode',
					type: 'dropdown',
					label: 'Send Mode (optional)',
					choices: [
						{ id: '', label: '--- None ---' },
						{ id: 'listen', label: 'listen' },
						{ id: 'push', label: 'push' },
						{ id: 'rendezvous', label: 'rendezvous' },
					],
					default: '',
				},
				{ id: 'rendezvous_ip', type: 'textinput', label: 'Rendezvous IP (optional)', default: '' },
				{ id: 'rendezvous_port', type: 'number', label: 'Rendezvous Port (optional)', default: 0, min: 0, max: 65535 },
				{ id: 'ttl', type: 'number', label: 'TTL (optional)', default: 0, min: 0, max: 214748364 },
				{
					id: 'paused',
					type: 'checkbox',
					label: 'Paused',
					default: false,
				},
				{
					id: 'transport_stream_id',
					type: 'number',
					label: 'Transport Stream ID (optional)',
					default: 0,
					min: 0,
					max: 8190,
				},
				{
					id: 'original_network_id',
					type: 'number',
					label: 'Original Network ID (optional)',
					default: 0,
					min: 0,
					max: 8190,
				},
				{ id: 'parameters_json', type: 'textinput', label: 'Parameters JSON (optional)', default: '' },

				// Source Handling
				{
					id: 'source_id',
					type: 'dropdown',
					label: 'Source ID (optional, disables source_streams if set)',
					choices: [{ id: '', label: '--- None ---' }, ...self.mpegtsInSourceCache],
					default: '',
				},

				// FULL SOURCE STREAMS IMPLEMENTATION
				{ id: 'src_application', type: 'textinput', label: 'Source Application (source_streams)', default: '' },
				{ id: 'src_stream', type: 'textinput', label: 'Source Stream (source_streams)', default: '' },
				{ id: 'src_pmt_pid', type: 'number', label: 'PMT PID (16-8190)', default: 0, min: 0, max: 8190 },
				{ id: 'src_video_pid', type: 'number', label: 'Video PID (16-8190)', default: 0, min: 0, max: 8190 },
				{ id: 'src_audio_pid', type: 'number', label: 'Audio PID (16-8190)', default: 0, min: 0, max: 8190 },
				{ id: 'src_program_number', type: 'number', label: 'Program Number (optional)', default: 0, min: 0, max: 8190 },
				{
					id: 'src_service_type',
					type: 'number',
					label: 'Service Type (1-65535, optional)',
					default: 0,
					min: 1,
					max: 65535,
				},
				{ id: 'src_provider_name', type: 'textinput', label: 'Provider Name (optional)', default: '' },
				{ id: 'src_service_name', type: 'textinput', label: 'Service Name (optional)', default: '' },
			],
			callback: async (event) => {
				const o = event.options
				if (!o.stream_combined_id) {
					self.log('error', 'No UDP stream selected for update.')
					return
				}

				const [serverId, streamId] = String(o.stream_combined_id).split('::')
				const body: any = {}

				const addField = async (key: string, value: any, parse = true) => {
					if (value !== undefined && value !== '' && !(typeof value === 'number' && value === 0)) {
						body[key] = parse ? await self.parseVariablesInString(String(value)) : value
					}
				}

				await addField('ip', o.ip)
				if (o.port) body.port = Number(o.port)
				await addField('name', o.name)
				await addField('description', o.description)
				if (o.tags) {
					const parsedTags = (await self.parseVariablesInString(String(o.tags)))
						.split(',')
						.map((t) => t.trim())
						.filter((t) => t.length > 0)
					body.tags = parsedTags
				}
				await addField('local_ip', o.local_ip)
				if (o.local_port) body.local_port = Number(o.local_port)
				body.set_mux_rate = !!o.set_mux_rate
				if (o.mux_delay) body.mux_delay = Number(o.mux_delay)
				if (o.max_mux_delay) body.max_mux_delay = Number(o.max_mux_delay)
				if (o.mux_rate) body.mux_rate = Number(o.mux_rate)
				body.join_audio_frames = !!o.join_audio_frames
				if (o.start_cbr_buffer) body.start_cbr_buffer = Number(o.start_cbr_buffer)
				if (o.max_cbr_buffer) body.max_cbr_buffer = Number(o.max_cbr_buffer)
				await addField('send_mode', o.send_mode, false)
				await addField('rendezvous_ip', o.rendezvous_ip)
				if (o.rendezvous_port) body.rendezvous_port = Number(o.rendezvous_port)
				if (o.ttl) body.ttl = Number(o.ttl)
				body.paused = !!o.paused
				if (o.transport_stream_id) body.transport_stream_id = Number(o.transport_stream_id)
				if (o.original_network_id) body.original_network_id = Number(o.original_network_id)
				if (o.parameters_json) {
					try {
						body.parameters = JSON.parse(await self.parseVariablesInString(String(o.parameters_json)))
					} catch (e) {
						self.log('error', `Invalid JSON in Parameters: ${e}`)
					}
				}

				// Handle Source Logic
				if (o.source_id) {
					body.source_id = o.source_id
				} else if (o.src_application && o.src_stream && o.src_pmt_pid && o.src_video_pid && o.src_audio_pid) {
					const sourceStream: any = {
						application: await self.parseVariablesInString(String(o.src_application)),
						stream: await self.parseVariablesInString(String(o.src_stream)),
						pmt_pid: Number(o.src_pmt_pid),
						video_pid: Number(o.src_video_pid),
						audio_pid: Number(o.src_audio_pid),
					}
					if (o.src_program_number) sourceStream.program_number = Number(o.src_program_number)
					if (o.src_service_type) sourceStream.service_type = Number(o.src_service_type)
					if (o.src_provider_name)
						sourceStream.provider_name = await self.parseVariablesInString(String(o.src_provider_name))
					if (o.src_service_name)
						sourceStream.service_name = await self.parseVariablesInString(String(o.src_service_name))
					body.source_streams = [sourceStream]
				} else {
					self.log('info', 'No valid source_id or source_streams provided, sources will remain unchanged.')
				}

				const apiPath = `server/${serverId}/mpegts/udp/${streamId}`
				await self.apiPut(apiPath, body)
			},
			learn: async (action) => {
				try {
					if (!action.options.stream_combined_id) {
						self.log('warn', 'Learn aborted: No UDP stream selected.')
						return
					}

					const [serverId, streamId] = String(action.options.stream_combined_id).split('::')
					const resp = await self.apiGet(`server/${serverId}/mpegts/udp/${streamId}`)

					if (!resp || typeof resp !== 'object' || !('setting' in resp) || !resp.setting) {
						self.log(
							'error',
							`Learn failed: No UDP setting data found for stream ${streamId} on server ${serverId}. Response: ${JSON.stringify(resp)}`,
						)
						return
					}

					const s = resp.setting

					const newOptions: any = { ...action.options }

					newOptions.ip = s.ip ?? ''
					newOptions.port = s.port ?? 0
					newOptions.name = s.name ?? ''
					newOptions.description = s.description ?? ''
					newOptions.tags = Array.isArray(s.tags) ? s.tags.join(', ') : ''
					newOptions.local_ip = s.local_ip ?? ''
					newOptions.local_port = s.local_port ?? 0
					newOptions.set_mux_rate = !!s.set_mux_rate
					newOptions.mux_delay = s.mux_delay ?? 0
					newOptions.max_mux_delay = s.max_mux_delay ?? 0
					newOptions.mux_rate = s.mux_rate ?? 0
					newOptions.join_audio_frames = !!s.join_audio_frames
					newOptions.start_cbr_buffer = s.start_cbr_buffer ?? 0
					newOptions.max_cbr_buffer = s.max_cbr_buffer ?? 0
					newOptions.send_mode = s.send_mode ?? ''
					newOptions.rendezvous_ip = s.rendezvous_ip ?? ''
					newOptions.rendezvous_port = s.rendezvous_port ?? 0
					newOptions.ttl = s.ttl ?? 0
					newOptions.paused = !!s.paused
					newOptions.transport_stream_id = s.transport_stream_id ?? 0
					newOptions.original_network_id = s.original_network_id ?? 0
					newOptions.parameters_json = s.parameters ? JSON.stringify(s.parameters, null, 2) : ''

					if (s.source_id) {
						newOptions.source_id = s.source_id
						newOptions.src_application = ''
						newOptions.src_stream = ''
						newOptions.src_pmt_pid = 0
						newOptions.src_video_pid = 0
						newOptions.src_audio_pid = 0
						newOptions.src_program_number = 0
						newOptions.src_service_type = 0
						newOptions.src_provider_name = ''
						newOptions.src_service_name = ''
					} else if (Array.isArray(s.source_streams) && s.source_streams.length > 0) {
						const src = s.source_streams[0]
						newOptions.source_id = ''
						newOptions.src_application = src.application ?? ''
						newOptions.src_stream = src.stream ?? ''
						newOptions.src_pmt_pid = src.pmt_pid ?? 0
						newOptions.src_video_pid = src.video_pid ?? 0
						newOptions.src_audio_pid = src.audio_pid ?? 0
						newOptions.src_program_number = src.program_number ?? 0
						newOptions.src_service_type = src.service_type ?? 0
						newOptions.src_provider_name = src.provider_name ?? ''
						newOptions.src_service_name = src.service_name ?? ''
					}

					return newOptions
				} catch (error) {
					self.log('error', `Error learning options: ${error}`)
				}
			},
		},
		DeleteUdpStream: {
			name: 'Delete UDP Stream',
			options: [
				{
					id: 'stream_combined_id',
					type: 'dropdown',
					label: 'Select UDP Stream to Delete',
					choices: self.udpStreamCache,
					default: self.udpStreamCache[0]?.id ?? '',
				},
			],
			callback: async (event) => {
				const o = event.options

				if (!o.stream_combined_id) {
					self.log('warn', 'Delete aborted: No UDP stream selected.')
					return
				}

				const [serverId, streamId] = String(o.stream_combined_id).split('::')
				const apiPath = `server/${serverId}/mpegts/udp/${streamId}`

				try {
					await self.apiDelete(apiPath, {})
					self.log('info', `Deleted UDP Stream ${streamId} on server ${serverId}.`)
					// Optional: Cache aktualisieren
					await self.syncAllUdpStreamChoices()
				} catch (error) {
					self.log('error', `Failed to delete UDP Stream ${streamId} on server ${serverId}: ${error}`)
				}
			},
		},
		PauseTranscoder: {
			name: 'Pause Transcoder',
			options: [
				{
					id: 'transcoder_combined_id',
					type: 'dropdown',
					label: 'Select Transcoder',
					choices: self.transcoderCache,
					default: self.transcoderCache[0]?.id ?? '',
				},
			],
			callback: async (event) => {
				const o = event.options
				const combinedId = String(o.transcoder_combined_id ?? '')
				const [serverId, transcoderId] = combinedId.split('::')

				if (!serverId || !transcoderId) {
					self.log('error', `Invalid transcoder selection: "${combinedId}"`)
					return
				}

				const apiPath = `transcoder/${transcoderId}/pause`
				try {
					const result = await self.apiGet(`${apiPath}`)
					if (result?.status === 'Ok') {
						self.log('info', `Paused transcoder ${transcoderId} on server ${serverId}`)
					} else {
						self.log('warn', `Pause failed: ${JSON.stringify(result)}`)
					}
				} catch (err) {
					self.log('error', `Failed to pause transcoder: ${err}`)
				}
			},
		},
		ResumeTranscoder: {
			name: 'Resume Transcoder',
			options: [
				{
					id: 'transcoder_combined_id',
					type: 'dropdown',
					label: 'Select Transcoder',
					choices: self.transcoderCache,
					default: self.transcoderCache[0]?.id ?? '',
				},
			],
			callback: async (event) => {
				const o = event.options
				const combinedId = String(o.transcoder_combined_id ?? '')
				const [serverId, transcoderId] = combinedId.split('::')

				if (!serverId || !transcoderId) {
					self.log('error', `Invalid transcoder selection: "${combinedId}"`)
					return
				}

				const apiPath = `transcoder/${transcoderId}/resume`
				try {
					const result = await self.apiGet(`${apiPath}`)
					if (result?.status === 'Ok') {
						self.log('info', `Resumed transcoder ${transcoderId} on server ${serverId}`)
					} else {
						self.log('warn', `Resume failed: ${JSON.stringify(result)}`)
					}
				} catch (err) {
					self.log('error', `Failed to Resume transcoder: ${err}`)
				}
			},
		},
		DeleteTranscoder: {
			name: 'Delete Transcoder',
			options: [
				{
					id: 'transcoder_combined_id',
					type: 'dropdown',
					label: 'Select Transcoder',
					choices: self.transcoderCache,
					default: self.transcoderCache[0]?.id ?? '',
				},
			],
			callback: async (event) => {
				const o = event.options
				const combinedId = String(o.transcoder_combined_id ?? '')
				const [serverId, transcoderId] = combinedId.split('::')

				if (!serverId || !transcoderId) {
					self.log('error', `Invalid transcoder selection: "${combinedId}"`)
					return
				}

				const apiPath = `transcoder/${transcoderId}`
				try {
					const result = await self.apiDeleteWithoutBody(`${apiPath}`) as {status?: string}
					if (result?.status === 'Ok') {
						self.log('info', `Paused transcoder ${transcoderId} on server ${serverId}`)
					} else {
						self.log('warn', `Pause failed: ${JSON.stringify(result)}`)
					}
				} catch (err) {
					self.log('error', `Failed to pause transcoder: ${err}`)
				}
			},
		},
	})
}
