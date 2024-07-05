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

  // execute()

  return {
    state,
    isReady,
    isFetching,
    error,
    execute
  }
}

type PutProjectResponse =
  paths['/projects']['put']['responses']['200']['content']['application/json']

export const usePutProjectQuery = (
  fetchOptions: ProjectQueryOptions<paths['/projects']['put']>
) => {
  const state = ref<PutProjectResponse>()
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

type DeleteProjectResponse =
  paths['/projects/{project_id}']['delete']['responses']['200']['content']['application/json']

export const useDeleteProjectQuery = (projectId: number) => {
  const isReady = ref(false)
  const isFetching = ref(false)
  const error = ref<AppError | undefined>(undefined)
  const state = ref<DeleteProjectResponse>()

  async function execute() {
    error.value = undefined
    isReady.value = false
    isFetching.value = true

    const { error: fetchError } = await client.DELETE('/projects/{project_id}', {
      params: {
        path: { project_id: projectId }
      }
    })

    if (fetchError) {
      error.value = { message: fetchError }
    } else {
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

type ProjectDetailsResponse =
  paths['/projects/{project_id}']['get']['responses']['200']['content']['application/json']

export const useGetProjectDetailsQuery = (projectId: number) => {
  const state = ref<ProjectDetailsResponse>()
  const isReady = ref(false)
  const isFetching = ref(false)
  const error = ref<AppError | undefined>(undefined)

  async function execute() {
    error.value = undefined
    isReady.value = false
    isFetching.value = true

    const fetchOptions: ProjectQueryOptions<paths['/projects/{project_id}']['get']> = {
      params: {
        path: { project_id: projectId }
      }
    }

    const { data, error: fetchError } = await client.GET(`/projects/{project_id}`, fetchOptions)

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
