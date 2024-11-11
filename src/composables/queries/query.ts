import type { FetchOptions } from 'openapi-fetch'
import type { Type } from 'typescript'
import { ref } from 'vue'
import client from '../../lib'

// enum to choose from (get, post, put, delete)
export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

export interface AppError {
  //   code: number
  message: string
}

type PathsWithMethod<Paths, Method extends keyof Paths> = Paths[Method]

interface Paths {
  get: string
  post: string
  put: string
  delete: string
}

export const useQueryWithPathParam = <P extends Paths>(
  state: any,
  options: any,
  method: Method,
  path: PathsWithMethod<P, Lowercase<Method>>
) => {
  const isReady = ref(false)
  const isFetching = ref(false)
  const error = ref<AppError | undefined>(undefined)

  async function execute() {
    error.value = undefined
    isReady.value = false
    isFetching.value = true

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), 5000)
    )

    const fetchPromise = (async () => {
      let response
      switch (method.toUpperCase()) {
        case 'GET':
          response = await client.GET(path, options)
          break
        case 'POST':
          response = await client.POST(path, options)
          break
        case 'PUT':
          response = await client.PUT(path, options)
          break
        case 'DELETE':
          response = await client.DELETE(path, options)
          break
        default:
          throw new Error(`Unsupported method: ${method}`)
      }
      return response
    })()

    try {
      const response = await Promise.race([timeoutPromise, fetchPromise])
      const { data, error: fetchError } = response

      if (fetchError) {
        error.value = { message: fetchError }
      } else {
        state.value = data
        isReady.value = true
      }
    } catch (err: any) {
      error.value = { message: err.message }
    } finally {
      isFetching.value = false
    }
  }

  return {
    state,
    isReady,
    isFetching,
    error,
    execute
  }
}
