export interface SystemBarsPlugin {
  setBarsColor(options: {
    statusColor: string
    navColor: string
    styles: string
  }): Promise<void>
}
