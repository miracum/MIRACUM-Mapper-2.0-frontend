import keycloakService from '@/lib/keycloak'
import { useAuthStore } from '@/stores/auth'

const authStorePlugin = {
  install(app: any, option: any) {
    const store = useAuthStore(option.pinia)

    app.config.globalProperties.$store = store

    keycloakService.CallInitStore(store)
  }
}

export default authStorePlugin
