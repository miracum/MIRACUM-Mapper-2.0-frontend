import { ref } from 'vue'
import client from '@/lib'
import type { paths } from '@/client/types'
import type { PathsWithMethod } from 'openapi-typescript-helpers'

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

export const useQueryWithPathParam = (
  state: any,
  options: any,
  method: Method,
  path: string,
  timeout: number = 5000
) => {
  const isReady = ref(false)
  const isFetching = ref(false)
  const error = ref<AppError | undefined>(undefined)

  async function execute() {
    error.value = undefined
    isReady.value = false
    isFetching.value = true

    const fetchWithTimeout = async <T>(promise: Promise<T>): Promise<T> => {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), timeout)
      );
      return Promise.race([promise, timeoutPromise]);
    };

    const fetchPromise = (async () => {
      switch (method) {
        case Method.GET:
          return await client.GET(path as PathsWithMethod<paths, "get">, options);
        case Method.POST:
          return await client.POST(path as PathsWithMethod<paths, "post">, options);
        case Method.PUT:
          return await client.PUT(path as PathsWithMethod<paths, "put">, options);
        case Method.DELETE:
          return await client.DELETE(path as PathsWithMethod<paths, "delete">, options);
      }
    })();

    try {
      const { data, error: fetchError } = await fetchWithTimeout(fetchPromise)

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

  return { isReady, isFetching, state, error, execute }
}
