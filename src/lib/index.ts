import type { paths } from '../client/types'
import createClient, { type Middleware } from 'openapi-fetch'
import { useAuthStore } from '../stores/auth'

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const authStore = useAuthStore()
    if (authStore?.authenticated) {
      const accessToken: string | undefined = authStore?.user?.token

      if (!accessToken) {
        console.error('No access token')
      }

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
        await authStore.refreshUserToken() //instead of this, wait until a new token is received (refresh token is executed in the background automatically. If the token is expired, the refresh token is executed and the new token is stored in the store)
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
