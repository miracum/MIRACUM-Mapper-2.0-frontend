import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: !!localStorage.getItem('bearerToken'),
    // Retrieve the bearer token from localStorage or set it to an empty string if not found
    bearerToken: localStorage.getItem('bearerToken') || ''
  }),
  actions: {
    authenticate(token: string): void {
      this.isAuthenticated = true
      this.bearerToken = token
      localStorage.setItem('bearerToken', token)
    },
    logout(): void {
      this.isAuthenticated = false
      this.bearerToken = ''
      localStorage.removeItem('bearerToken')
    }
  }
})
