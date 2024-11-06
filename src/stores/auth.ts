import { defineStore } from 'pinia'
import keycloakService from '@/lib/keycloak'
import Keycloak, { type KeycloakProfile } from 'keycloak-js'
// import { useRouter } from 'vue-router'
// import keycloak from '@/keycloak'
// const router = useRouter()
interface User {
  username?: string
  token?: string
  refToken?: string
  userInfo: KeycloakProfile
  isAdmin: boolean
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // isAuthenticated: !!localStorage.getItem('bearerToken'),
    // Retrieve the bearer token from localStorage or set it to an empty string if not found
    // bearerToken: localStorage.getItem('bearerToken') || ''
    authenticated: undefined as boolean | undefined,
    user: {} as User,
    userInfo: {} as KeycloakProfile,
    isAdmin: false,
    initialized: false,
    sessionExpiredNotified: false
    // testString: '' as string
  }),
  persist: {
    omit: ['initialized', 'sessionExpiredNotified']
  },
  actions: {
    // authenticate(token: string): void {
    //   this.isAuthenticated = true
    //   this.bearerToken = token
    //   localStorage.setItem('bearerToken', token)
    // },
    // logout(): void {
    //   this.isAuthenticated = false
    //   this.bearerToken = ''
    //   localStorage.removeItem('bearerToken')
    // },
    async initOauth(keycloak: Keycloak | undefined, clearData = true) {
      if (clearData) {
        this.clearUserData()
      }

      // redirect url after keycloak logout. If the user is on the logout page, the user data gets cleared and the user gets redirected to the home page
      if (window.location.pathname === '/logout') {
        await this.clearUserData()
        // navigate to home page
        window.location.href = '/'
        return
      }

      if (!keycloak || !keycloak.authenticated) {
        this.initialized = true
        return
      }

      keycloak.loadUserProfile().then((userInfo) => {
        this.userInfo = userInfo
      })
      if (keycloak.hasResourceRole('admin')) {
        this.isAdmin = true
      } else if (keycloak.hasResourceRole('user')) {
        this.isAdmin = false
      } else {
        alert('You do not have the correct role to access this application') /// TODO Dialog
        this.clearUserData()
        keycloak.logout()
      }

      this.user.username = keycloak.idTokenParsed?.preferred_username
      this.user.token = keycloak.token
      this.user.refToken = keycloak.refreshToken
      this.authenticated = keycloak.authenticated
      this.initialized = true
    },
    async logout() {
      try {
        // call the logout function from the keycloak service. The redirect is a logout url so the frontend knows on the redirect that the userDate should be cleared as it is no longer valid
        keycloakService.CallLogout(`${import.meta.env.VITE_APP_URL}/logout`)
      } catch (error) {
        console.error(error)
      }
    },
    async refreshUserToken() {
      // tries to refresh the user token
      if(this.sessionExpiredNotified) {
        return
      }

      try {
        // wait until initialized is true
        while (!this.initialized) {
          await new Promise((resolve) => setTimeout(resolve, 100))
        }
        const keycloak = await keycloakService.CallTokenRefresh()
        this.initOauth(keycloak, false)
      } catch (error) {
        // if an error occured, the login is not possible (possibly, the session expired) so the user gets notified, authentication data gets cleared the user has to login again
        this.sessionExpiredNotified = true;
        alert('Session expired. Please login again.')
        this.clearUserData()
        window.location.href = '/login'
      }
    },
    clearUserData() {
      this.authenticated = false
      this.user = {} as User
      this.userInfo = {} as KeycloakProfile
      this.isAdmin = false
      this.initialized = false
    }
  }
})
