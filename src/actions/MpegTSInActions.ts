import type { CompanionActionDefinitions } from '@companion-module/base'
import type { ModuleInstance } from '../main.js'

export function getMpegTSInActions(self: ModuleInstance): CompanionActionDefinitions {
    return {
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
    }
}