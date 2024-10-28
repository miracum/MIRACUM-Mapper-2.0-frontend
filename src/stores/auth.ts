import { defineStore } from 'pinia'
import keycloakService from '@/lib/keycloak'
import Keycloak, { type KeycloakProfile } from 'keycloak-js'
// import keycloak from '@/keycloak'

interface User {
  username?: string
  token?: string
  refToken?: string
  userInfo: KeycloakProfile
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // isAuthenticated: !!localStorage.getItem('bearerToken'),
    // Retrieve the bearer token from localStorage or set it to an empty string if not found
    // bearerToken: localStorage.getItem('bearerToken') || ''
    authenticated: undefined as boolean | undefined,
    user: {} as User,
    userInfo: {} as KeycloakProfile
    // testString: '' as string
  }),
  persist: true,
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
        await this.clearUserData()
      }

      // if router is on /logout page, reset the user data
      if (window.location.pathname === '/logout') {
        await this.clearUserData()
        // naviagte to home page
        window.location.href = '/'
        return
      }

      if (!keycloak || !keycloak.authenticated) {
        return
      }

      this.authenticated = keycloak.authenticated
      this.user.username = keycloak.idTokenParsed?.preferred_username
      this.user.token = keycloak.token
      this.user.refToken = keycloak.refreshToken
    },
    async logout() {
      try {
        await keycloakService.CallLogout(`${import.meta.env.VITE_APP_URL}/logout`)
        // await this.clearUserData()
      } catch (error) {
        console.error(error)
      }
    },
    async refreshUserToken() {
      try {
        const keycloak = await keycloakService.CallTokenRefresh()
        this.initOauth(keycloak, false)
      } catch (error) {
        // login sso
        console.error(error)
        // keycloakService.CallLogin(this)
      }
    },
    clearUserData() {
      this.authenticated = false
      this.user = {} as User
      this.userInfo = {} as KeycloakProfile
    }
  }
})
