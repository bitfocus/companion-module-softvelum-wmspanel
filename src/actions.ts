import type { ModuleInstance } from './main.js'
//import { Regex } from '@companion-module/base'

import { getRepublishActions } from './actions/RepublishActions.js'
import { getMpegTSInActions } from './actions/MpegTSInActions.js'
import { getMpegTSOutActions } from './actions/MpegTSOutActions.js'
import { getUDPStreamingActions } from './actions/UDPStreamingActions.js'
import { getTranscoderActions } from './actions/TranscoderActions.js'

export function UpdateActions(self: ModuleInstance): void {
	self.setActionDefinitions({
		...getRepublishActions(self),
		...getMpegTSInActions(self),
		...getMpegTSOutActions(self),
		...getUDPStreamingActions(self),
		...getTranscoderActions(self),
	})
}
