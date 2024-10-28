// import keycloakService from '@/lib/keycloak'
import { useAuthStore } from '@/stores/auth'

const authStorePlugin = {
  async install(app: any, option: any) {
    const store = useAuthStore(option.pinia)

    app.config.globalProperties.$store = store

    // await keycloakService.CallInit(store)

    // await keycloakService.CallInitStore(store)
  }
}

export default authStorePlugin
