import type { CompanionActionDefinitions } from '@companion-module/base'
import type { ModuleInstance } from '../main.js'

export function getUDPStreamingActions(self: ModuleInstance): CompanionActionDefinitions {
    return {
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
    }
}