import client from '../../lib'
import { ref } from 'vue'
import type { ParamsOption, RequestBodyOption } from 'openapi-fetch'
import type { paths, components } from '../../client/types'

export interface AppError {
  //   code: number
  message: string
}

type ProjectQueryOptions<T> = ParamsOption<T> & RequestBodyOption<T>

export type ProjectResponse =
  paths['/projects']['get']['responses']['200']['content']['application/json']

export const useProjectQuery = (fetchOptions: ProjectQueryOptions<paths['/projects']['get']>) => {
  const state = ref<ProjectResponse>()
  const isReady = ref(false)
  const isFetching = ref(false)
  const error = ref<AppError | undefined>(undefined)

  async function execute() {
    error.value = undefined
    isReady.value = false
    isFetching.value = true

    const { data, error: fetchError } = await client.GET('/projects', fetchOptions)

    if (fetchError) {
      error.value = { message: fetchError }
    } else {
      state.value = data
      isReady.value = true
    }

    isFetching.value = false
  }

  execute()

  return {
    state,
    isReady,
    isFetching,
    error,
    execute
  }
}

export const usePutProjectQuery = (
  fetchOptions: ProjectQueryOptions<paths['/projects']['put']>
) => {
  const state = ref<components['schemas']['Project']>()
  const isReady = ref(false)
  const isFetching = ref(false)
  const error = ref<AppError | undefined>(undefined)

  async function execute() {
    error.value = undefined
    isReady.value = false
    isFetching.value = true

    const { data, error: fetchError } = await client.PUT('/projects', fetchOptions)

    if (fetchError) {
      error.value = { message: fetchError }
    } else {
      state.value = data
      isReady.value = true
    }

    isFetching.value = false
  }

  // execute()

  return {
    state,
    isReady,
    isFetching,
    error,
    execute
  }
}

export const deleteProjectQuery = async (projectId: number) => {
  const { error: fetchError } = await client.DELETE(`/projects/${projectId}`)

  if (fetchError) {
    return { error: { message: fetchError } }
  }

  return { error: undefined }
}
