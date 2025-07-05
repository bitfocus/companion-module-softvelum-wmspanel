import { InstanceBase, runEntrypoint, InstanceStatus, SomeCompanionConfigField } from '@companion-module/base'
import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpdateVariableDefinitions } from './variables.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'

import fetch from 'node-fetch'

export class ModuleInstance extends InstanceBase<ModuleConfig> {
	dynamicVariables: string[] = []
	variableUpdateEnabled: boolean = false
	config!: ModuleConfig // Setup in init()
	private pollTimer: NodeJS.Timeout | undefined
	currentStatus: any = null
	serverCache: { id: string; label: string }[] = []
	serverCacheRawIds: Set<string> = new Set()
	ruleCache: { id: string; label: string }[] = []
	ruleCacheRawIds: Set<string> = new Set()
	mpegtsInCache: { id: string; label: string }[] = []
	mpegtsInCacheRawIds: Set<string> = new Set()
	mpegtsInSourceCache: { id: string; label: string }[] = []
	mpegtsInSourceCacheRawIds: Set<string> = new Set()
	mpegtsOutCache: { id: string; label: string }[] = []
	mpegtsOutCacheRawIds: Set<string> = new Set()
	udpStreamCache: { id: string; label: string }[] = []
	udpStreamCacheRawIds: Set<string> = new Set()

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: ModuleConfig, _isFirstInit: boolean): Promise<void> {
		this.config = config
		this.dynamicVariables = []

		this.updateStatus(InstanceStatus.Ok)

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		void this.pollStatus() //initial Status Poll
		this.pollTimer = setInterval(() => {
			void this.pollStatus()
		}, config.refreshRate * 1000)
	}
	// When module gets deleted
	async destroy(): Promise<void> {
		this.variableUpdateEnabled = false

		if (this.pollTimer) {
			clearInterval(this.pollTimer)
			this.pollTimer = undefined
		}

		this.log('debug', 'destroy')
	}

	async configUpdated(config: ModuleConfig): Promise<void> {
		this.config = config
	}

	// Return config fields for web config
	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	updateActions(): void {
		UpdateActions(this)
	}

	updateFeedbacks(): void {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
	}

	async pollStatus(): Promise<void> {
		try {
			this.checkFeedbacks()

			//List Updates
			await this.syncServerChoices()
			await this.syncAllRepublishRuleChoices()
			await this.syncAllMpegtsInChoices()
			await this.syncAllMpegtsOutChoices()
			await this.syncAllUdpStreamChoices()
			await this.checkConnection()
		} catch (error) {
			this.log('error', `Polling error: ${error}`)
		}
	}

	async apiGet(apimethod: string): Promise<any> {
		this.log('debug', `Send GET request to ${apimethod}`)
		const url = `${this.config.api_url}/v1/${apimethod}?client_id=${this.config.client_id}&api_key=${this.config.api_key}`
		this.log('debug', `API Url: ${url}`)
		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
				},
			})

			if (!response.ok) {
				this.log('error', `GET ${apimethod} failed with status ${response.status} ${response.statusText}`)
				return null
			}

			try {
				const data = await response.json()
				this.log('debug', `Response JSON: ${JSON.stringify(data)}`)
				return data
			} catch (jsonError) {
				this.log('warn', `Response is not valid JSON, attempting to read as text. Error: ${jsonError}`)
				const text = await response.text()
				this.log('debug', `Response Text: ${text}`)
				return text
			}
		} catch (error) {
			this.log('error', `GET ${apimethod} failed: ${error}`)
			return null
		}
	}

	async apiPost(apimethod: string, body: Record<string, unknown>): Promise<unknown> {
		this.log('debug', `Send POST request to ${apimethod}`)
		const url = `${this.config.api_url}/v1/${apimethod}?client_id=${this.config.client_id}&api_key=${this.config.api_key}`
		this.log('debug', `API Url: ${url}`)
		this.log('debug', `Request-Body: ${JSON.stringify(body)}`)

		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			})

			const text = await response.text()
			this.log('debug', `Response-Text: ${text}`)

			try {
				return JSON.parse(text)
			} catch {
				return text
			}
		} catch (error) {
			this.log('error', `POST ${apimethod} failed: ${error}`)
			return null
		}
	}
	async apiPut(apimethod: string, body: Record<string, unknown>): Promise<unknown> {
		this.log('debug', `Send PUT request to ${apimethod}`)
		const url = `${this.config.api_url}/v1/${apimethod}?client_id=${this.config.client_id}&api_key=${this.config.api_key}`
		this.log('debug', `API Url: ${url}`)
		this.log('debug', `Request-Body: ${JSON.stringify(body)}`)

		try {
			const response = await fetch(url, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			})

			const text = await response.text()
			this.log('debug', `Response-Text: ${text}`)

			try {
				return JSON.parse(text)
			} catch {
				return text
			}
		} catch (error) {
			this.log('error', `PUT ${apimethod} failed: ${error}`)
			return null
		}
	}

	async apiDelete(apimethod: string, body: Record<string, unknown>): Promise<unknown> {
		this.log('debug', `Send DELETE request to ${apimethod}`)
		const url = `${this.config.api_url}/v1/${apimethod}?client_id=${this.config.client_id}&api_key=${this.config.api_key}`
		this.log('debug', `API Url: ${url}`)
		this.log('debug', `Request-Body: ${JSON.stringify(body)}`)

		try {
			const response = await fetch(url, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			})

			const text = await response.text()
			this.log('debug', `Response-Text: ${text}`)

			try {
				return JSON.parse(text)
			} catch {
				return text
			}
		} catch (error) {
			this.log('error', `DELETE ${apimethod} failed: ${error}`)
			return null
		}
	}

	async syncServerChoices(): Promise<void> {
		try {
			const data = await this.apiGet('server')

			// Prüfen, ob "servers" existiert und ein Array ist
			if (!data || !Array.isArray(data.servers)) {
				this.log('error', 'Servers API returned unexpected data')
				return
			}

			const servers = data.servers
			const newIds = new Set<string>(servers.map((item: any) => item.id))

			const idsEqual =
				newIds.size === this.serverCacheRawIds.size && [...newIds].every((id: any) => this.serverCacheRawIds.has(id))

			if (!idsEqual) {
				this.serverCache = servers.map((item: any) => ({
					id: item.id,
					label: item.name,
				}))
				this.serverCacheRawIds = newIds

				this.log('info', `Updated Servers Cache with ${servers.length} entries`)
				this.updateActions()
			} else {
				this.log('debug', 'Servers unchanged, no update needed.')
			}
		} catch (error) {
			this.log('error', `Failed to sync Servers: ${error}`)
		}
	}
	async syncAllRepublishRuleChoices(): Promise<void> {
		try {
			const combinedRules: { id: string; label: string }[] = []
			const combinedIds = new Set<string>()

			for (const server of this.serverCache) {
				const serverId = server.id
				const serverName = server.label

				try {
					const data = await this.apiGet(`server/${serverId}/rtmp/republish`)

					if (!data || !Array.isArray(data.rules)) {
						this.log('error', `Republish Rules API returned unexpected data for server ${serverName} (${serverId})`)
						continue
					}

					for (const item of data.rules) {
						const ruleId = item.id

						const label = `[${serverName}] ${item.description} - ${item.src_app}/${item.src_strm || '*'} → ${item.dest_app}/${item.dest_strm || '*'}${item.paused ? ' (paused)' : ''}`

						combinedRules.push({
							id: `${serverId}::${ruleId}`,
							label,
						})
						combinedIds.add(`${serverId}::${ruleId}`)
					}
				} catch (error) {
					this.log('error', `Failed to load Republish Rules for server ${serverName} (${serverId}): ${error}`)
				}
			}

			const idsEqual =
				combinedIds.size === this.ruleCacheRawIds.size && [...combinedIds].every((id) => this.ruleCacheRawIds.has(id))

			if (!idsEqual) {
				this.ruleCache = combinedRules
				this.ruleCacheRawIds = combinedIds

				this.log(
					'info',
					`Updated combined Republish Rules Cache with ${combinedRules.length} entries across all servers.`,
				)
				this.updateActions()
			} else {
				this.log('debug', 'Combined Republish Rules unchanged, no update needed.')
			}
		} catch (error) {
			this.log('error', `Failed to sync combined Republish Rules across all servers: ${error}`)
		}
	}

	async syncAllMpegtsInChoices(): Promise<void> {
		try {
			const newPairs: { id: string; label: string }[] = []
			const newIds = new Set<string>()

			const newSourcePairs: { id: string; label: string }[] = []
			const newSourceIds = new Set<string>()

			for (const server of this.serverCache) {
				const resp = await this.apiGet(`server/${server.id}/mpegts/incoming`)
				if (!resp || !Array.isArray(resp.streams)) {
					this.log('warn', `No MPEGTS IN streams found for server ${server.label}. Response: ${JSON.stringify(resp)}`)
					continue
				}

				for (const stream of resp.streams) {
					const combinedId = `${server.id}::${stream.id}`
					newPairs.push({
						id: combinedId,
						label: `${server.label} - ${stream.name || stream.id}`,
					})
					newIds.add(combinedId)

					// Source Cache: ID only (for video_source.id, audio_source.id, raw_source_id)
					newSourcePairs.push({
						id: stream.id,
						label: `${server.label} - ${stream.name || stream.id}`,
					})
					newSourceIds.add(stream.id)
				}
			}

			// Check and update mpegtsInCache for Update/Delete/Control
			const idsEqual =
				newIds.size === this.mpegtsInCacheRawIds?.size && [...newIds].every((id) => this.mpegtsInCacheRawIds.has(id))

			if (!idsEqual) {
				this.mpegtsInCache = newPairs
				this.mpegtsInCacheRawIds = newIds
				this.log('info', `Updated MPEGTS IN Cache with ${newPairs.length} entries.`)
				this.updateActions()
			} else {
				this.log('debug', 'MPEGTS IN unchanged, no update needed.')
			}

			// Check and update mpegtsInSourceCache for Create Outgoing MPEGTS Sources
			const sourceIdsEqual =
				newSourceIds.size === this.mpegtsInSourceCacheRawIds?.size &&
				[...newSourceIds].every((id) => this.mpegtsInSourceCacheRawIds.has(id))

			if (!sourceIdsEqual) {
				this.mpegtsInSourceCache = newSourcePairs
				this.mpegtsInSourceCacheRawIds = newSourceIds
				this.log('info', `Updated MPEGTS IN Source Cache with ${newSourcePairs.length} entries.`)
				this.updateActions()
			} else {
				this.log('debug', 'MPEGTS IN Sources unchanged, no update needed.')
			}
		} catch (error) {
			this.log('error', `Failed to sync MPEGTS IN Cache: ${error}`)
		}
	}

	async syncAllMpegtsOutChoices(): Promise<void> {
		try {
			const newPairs: { id: string; label: string }[] = []
			const newIds = new Set<string>()

			for (const server of this.serverCache) {
				const resp = await this.apiGet(`server/${server.id}/mpegts/outgoing`)
				if (!resp || !Array.isArray(resp.streams)) {
					this.log('warn', `No MPEGTS OUT streams found for server ${server.label}. Response: ${JSON.stringify(resp)}`)
					continue
				}

				for (const stream of resp.streams) {
					const combinedId = `${server.id}::${stream.id}`
					const label = `[${server.label}] ${stream.description || ''} ${stream.application || ''}/${stream.stream || ''}`
					newPairs.push({
						id: combinedId,
						label,
					})
					newIds.add(combinedId)
				}
			}

			const idsEqual =
				newIds.size === this.mpegtsOutCacheRawIds?.size && [...newIds].every((id) => this.mpegtsOutCacheRawIds.has(id))

			if (!idsEqual) {
				this.mpegtsOutCache = newPairs
				this.mpegtsOutCacheRawIds = newIds
				this.log('info', `Updated MPEGTS OUT Cache with ${newPairs.length} entries.`)
				this.updateActions()
			} else {
				this.log('debug', 'MPEGTS OUT unchanged, no update needed.')
			}
		} catch (error) {
			this.log('error', `Failed to sync MPEGTS OUT Cache: ${error}`)
		}
	}
	async syncAllUdpStreamChoices(): Promise<void> {
		try {
			const newPairs: { id: string; label: string }[] = []
			const newIds = new Set<string>()

			for (const server of this.serverCache) {
				const resp = await this.apiGet(`server/${server.id}/mpegts/udp`)
				if (!resp || !Array.isArray(resp.settings)) {
					this.log('warn', `No UDP streams found for server ${server.label}. Response: ${JSON.stringify(resp)}`)
					continue
				}

				for (const stream of resp.settings) {
					const combinedId = `${server.id}::${stream.id}`
					const displayName = `${server.label} - ${stream.name || ''} ${stream.description ? `(${stream.description})` : ''} ${stream.ip ?? ''}:${stream.port ?? ''}`
					newPairs.push({
						id: combinedId,
						label: displayName.trim(),
					})
					newIds.add(combinedId)
				}
			}

			const idsEqual =
				newIds.size === this.udpStreamCacheRawIds?.size && [...newIds].every((id) => this.udpStreamCacheRawIds.has(id))

			if (!idsEqual) {
				this.udpStreamCache = newPairs
				this.udpStreamCacheRawIds = newIds
				this.log('info', `Updated UDP Stream Cache with ${newPairs.length} entries.`)
				this.updateActions()
			} else {
				this.log('debug', 'UDP streams unchanged, no update needed.')
			}
		} catch (error) {
			this.log('error', `Failed to sync UDP Stream Cache: ${error}`)
		}
	}
	async checkConnection(): Promise<void> {
		try {
			this.updateStatus(InstanceStatus.Connecting, 'Checking API connection...')

			const resp = await this.apiGet('data_slices')

			if (!resp || resp.status !== 'Ok' || !Array.isArray(resp.data_slices)) {
				this.updateStatus(
					InstanceStatus.ConnectionFailure,
					'API responded, but invalid data received. Check API Key or IP-Whitelist',
				)
				this.log('warn', `Connection check failed: ${JSON.stringify(resp)}`)
				return
			}

			const sliceCount = resp.data_slices.length
			this.updateStatus(InstanceStatus.Ok, `Connected to API (${sliceCount} data slices found)`)
			this.log('info', `Connection successful. Found ${sliceCount} data slices.`)
		} catch (error) {
			this.updateStatus(InstanceStatus.ConnectionFailure, 'API unreachable')
			this.log('error', `API connection test failed: ${error}`)
		}
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
