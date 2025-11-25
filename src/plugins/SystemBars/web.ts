import { WebPlugin } from '@capacitor/core'

export class SystemBarsWeb extends WebPlugin {
  async setBarsColor(options: {
    statusColor: string
    navColor: string
    styles: string
  }): Promise<void> {
    const { statusColor } = options

    let metaThemeColor = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]'
    )
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta')
      metaThemeColor.name = 'theme-color'
      document.head.appendChild(metaThemeColor)
    }
    metaThemeColor.content = statusColor
  }
}
