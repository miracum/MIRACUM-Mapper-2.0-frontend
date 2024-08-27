import client from '../../lib'
import { ref } from 'vue'
import type { ParamsOption, RequestBodyOption } from 'openapi-fetch'
import type { paths, components } from '../../client/types'
import { useQueryWithPathParam, Method } from './query'


type ProjectQueryOptions<T> = ParamsOption<T> & RequestBodyOption<T>

export type ProjectResponse =
  paths['/projects']['get']['responses']['200']['content']['application/json']

export const useProjectQuery = (fetchOptions: ProjectQueryOptions<paths['/projects']['get']>) => {
  const state = ref<ProjectResponse>();
  const path = '/projects';
  const method = Method.GET;

  return useQueryWithPathParam(state, fetchOptions, method, path);
}

type PutProjectResponse =
  paths['/projects']['put']['responses']['200']['content']['application/json']

export const usePutProjectQuery = (
  fetchOptions: ProjectQueryOptions<paths['/projects']['put']>
) => {
  const state = ref<PutProjectResponse>();
  
  const path = '/projects';
  const method = Method.PUT;

  return useQueryWithPathParam(state, fetchOptions, method, path);
}

type DeleteProjectResponse =
  paths['/projects/{project_id}']['delete']['responses']['200']['content']['application/json']

export const useDeleteProjectQuery = (projectId: number) => {
  const state = ref<DeleteProjectResponse>()
  const fetchOptions: ProjectQueryOptions<paths['/projects/{project_id}']['delete']> = {
    params: {
      path: { project_id: projectId }
    }
  }
  const path = '/projects/{project_id}'
  const method = Method.DELETE

  return useQueryWithPathParam(state, fetchOptions, method, path)
}

type ProjectDetailsResponse =
  paths['/projects/{project_id}']['get']['responses']['200']['content']['application/json']

export const useGetProjectDetailsQuery = (projectId: number) => {
  const state = ref<ProjectDetailsResponse>()
  const fetchOptions: ProjectQueryOptions<paths['/projects/{project_id}']['get']> = {
    params: {
      path: { project_id: projectId }
    }
  }
  const path = '/projects/{project_id}'
  const method = Method.GET

  return useQueryWithPathParam(state, fetchOptions, method, path)
}
