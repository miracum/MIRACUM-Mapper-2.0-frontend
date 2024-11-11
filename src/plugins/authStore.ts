import { useAuthStore } from '@/stores/auth'

const authStorePlugin = {
  async install(app: any, option: any) {
    const store = useAuthStore(option.pinia)

    app.config.globalProperties.$store = store
  }
}

export default authStorePlugin
