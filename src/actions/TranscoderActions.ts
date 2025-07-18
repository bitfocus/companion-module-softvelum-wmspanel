import type { CompanionActionDefinitions } from '@companion-module/base'
import type { ModuleInstance } from '../main.js'

export function getTranscoderActions(self: ModuleInstance): CompanionActionDefinitions {
    return {
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
        CloneTranscoder: {
            name: 'Clone Transcoder',
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

                const apiPath = `transcoder/${transcoderId}/clone`
                try {
                    const result = await self.apiGet(`${apiPath}`)
                    if (result?.status === 'Ok') {
                        self.log('info', `Cloned transcoder ${transcoderId} on server ${serverId}`)
                    } else {
                        self.log('warn', `Clone failed: ${JSON.stringify(result)}`)
                    }
                } catch (err) {
                    self.log('error', `Failed to Clone transcoder: ${err}`)
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
                    const result = await self.apiDeleteWithoutBody(`${apiPath}`) as { status?: string }
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
    }
}