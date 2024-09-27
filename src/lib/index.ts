import type { paths } from '../client/types'
import createClient, { type Middleware } from 'openapi-fetch'
import { useAuthStore } from '../stores/auth';



// const accessToken: string | undefined = authStore.bearerToken
  // 'eyJhbGciOiJFUzI1NiIsImtpZCI6ImZha2Uta2V5LWlkIiwidHlwIjoiSldUIn0.eyJhdWQiOlsiZXhhbXBsZS11c2VycyJdLCJpc3MiOiJmYWtlLWlzc3VlciIsInBlcm0iOlsiYWRtaW4iXX0.sCmBfqBgu1qDvqUSWvJejMFcgvjfdiy-wFiLDf66LbzBfr97YC88WKCip-ZG0rlD4xI4sIzqVwK-KiZl7dvQvQ'



const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const authStore = useAuthStore();
    const accessToken: string | undefined = authStore.bearerToken
    // fetch token, if it doesn’t exist
    if (!authStore.bearerToken) {
      //   const authRes = await someAuthFunc()
      //   if (authRes.accessToken) {
      //     accessToken = authRes.accessToken
      //   } else {
      //     // handle auth error
      //   }
      console.error('No access token')
    }

    // refresh token when it expires

    // add Authorization header to every request
    request.headers.set('Authorization', `Bearer ${accessToken}`)
    return request
  }
}

const client = createClient<paths>({ baseUrl: 'http://localhost:8080/' })
client.use(authMiddleware)

export default client
