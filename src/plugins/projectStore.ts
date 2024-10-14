import { useProjectStore } from '@/stores/project'

const projectStorePlugin = {
  install(app: any, option: any) {
    app.config.globalProperties.$store = useProjectStore(option.pinia)
  }
}

export default projectStorePlugin
