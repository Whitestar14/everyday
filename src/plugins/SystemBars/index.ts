import { registerPlugin } from '@capacitor/core'
import type { SystemBarsPlugin } from './definitions'
import { SystemBarsWeb } from './web'

const SystemBars = registerPlugin<SystemBarsPlugin>('SystemBars', {
  web: () => new SystemBarsWeb(),
})

export * from './definitions'
export default SystemBars
