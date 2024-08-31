import type { FetchOptions } from "openapi-fetch";
import type { Type } from "typescript";
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

export const useQueryWithPathParam = (state: any, options: any, method: Method, path: string) => {
  const isReady = ref(false)
  const isFetching = ref(false)
  const error = ref<AppError | undefined>(undefined)

  async function execute() {
    error.value = undefined
    isReady.value = false
    isFetching.value = true

    let response;
      switch (method.toUpperCase()) {
        case 'GET':
          response = await client.GET(path, options);
          break;
        case 'POST':
          response = await client.POST(path, options);
          break;
        case 'PUT':
          response = await client.PUT(path, options);
          break;
        case 'DELETE':
          response = await client.DELETE(path, options);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      const { data, error: fetchError } = response;

    if (fetchError) {
      error.value = { message: fetchError }
    } else {
      state.value = data
      isReady.value = true
    }

    isFetching.value = false
  }

  return {
    state,
    isReady,
    isFetching,
    error,
    execute
  }

}