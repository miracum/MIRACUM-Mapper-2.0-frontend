import { useCodeSystemStore } from '@/stores/codesystem'

const codesystemStorePlugin = {
  install(app: any, option: any) {
    app.config.globalProperties.$store = useCodeSystemStore(option.pinia)
  }
}

export default codesystemStorePlugin
