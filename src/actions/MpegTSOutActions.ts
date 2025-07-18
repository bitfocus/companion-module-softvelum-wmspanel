import type { CompanionActionDefinitions } from '@companion-module/base'
import type { ModuleInstance } from '../main.js'

export function getMpegTSOutActions(self: ModuleInstance): CompanionActionDefinitions {
    return {
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
    }
}