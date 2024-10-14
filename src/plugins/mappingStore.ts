import { useMappingStore } from '@/stores/mappings'

const mappingStorePlugin = {
  install(app: any, option: any) {
    app.config.globalProperties.$store = useMappingStore(option.pinia)
  }
}

export default mappingStorePlugin
