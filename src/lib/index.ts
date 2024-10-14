import type { paths } from '../client/types'
import createClient, { type Middleware } from 'openapi-fetch'
import { useAuthStore } from '../stores/auth'
import KeycloakService from './keycloak'

// const accessToken: string | undefined = authStore.bearerToken
// 'eyJhbGciOiJFUzI1NiIsImtpZCI6ImZha2Uta2V5LWlkIiwidHlwIjoiSldUIn0.eyJhdWQiOlsiZXhhbXBsZS11c2VycyJdLCJpc3MiOiJmYWtlLWlzc3VlciIsInBlcm0iOlsiYWRtaW4iXX0.sCmBfqBgu1qDvqUSWvJejMFcgvjfdiy-wFiLDf66LbzBfr97YC88WKCip-ZG0rlD4xI4sIzqVwK-KiZl7dvQvQ'

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const authStore = useAuthStore()
    if (authStore?.authenticated) {
      const accessToken: string | undefined = authStore?.user?.token

      if (!accessToken) {
        console.error('No access token')
      }

      // add Authorization header to every request
      request.headers.set('Authorization', `Bearer ${accessToken}`)
    }
    return request
  },
  async onResponse({ response, request }) {
    if (response.status === 401) {
      const authStore = useAuthStore()
      if (authStore?.authenticated) {
        const refreshToken: string | undefined = authStore?.user?.refToken
        if (!refreshToken) {
          console.error('No refresh token')
        }

        // refresh token
        await authStore.refreshUserToken()
        const accessToken: string | undefined = authStore?.user?.token

        if (!accessToken) {
          console.error('No access token')
          return response
        }

        request.headers.set('Authorization', `Bearer ${authStore.user.token}`)
        return fetch(request)
      }
    }
    return response
  }
}

const client = createClient<paths>({ baseUrl: `${import.meta.env.VITE_API_URL}` })
client.use(authMiddleware)

export default client
