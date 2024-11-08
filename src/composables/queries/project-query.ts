import { ref } from 'vue'
import type { ParamsOption, RequestBodyOption } from 'openapi-fetch'
import type { paths } from '../../client/types'
import { useQueryWithPathParam, Method } from './query'
import { type CreateProject, type UpdateCodeSystemRole, type ProjectPermission} from '@/stores/project'

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

type PostProjectResponse =
  paths['/projects']['post']['responses']['200']['content']['application/json']

export const usePostProjectQuery = (createProject: CreateProject) => {
  const state = ref<PostProjectResponse>();
  const fetchOptions: ProjectQueryOptions<paths['/projects']['post']> = { body: createProject};

  const path = '/projects';
  const method = Method.POST;

  return useQueryWithPathParam(state, fetchOptions, method, path);
}

type GetCodeSystemsResponse = paths['/codesystems']['get']['responses']['200']['content']['application/json']

export const useGetCodeSystemsQuery = () => {
  const state = ref<GetCodeSystemsResponse>();
  const path = '/codesystems';
  const method = Method.GET;

  return useQueryWithPathParam(state, null, method, path);
}

type PutCodeSystemRoleResponse = paths['/projects/{project_id}/codesystem-roles']['put']['responses']['200']['content']['application/json']

export const usePutCodeSystemRoleQuery = (updateCodeSystemRole: UpdateCodeSystemRole, projectId: number) => {
  const state = ref<PutCodeSystemRoleResponse>();
  const path = '/projects/{project_id}/codesystem-roles';
  const method = Method.PUT;
  const fetchOptions: ProjectQueryOptions<paths['/projects/{project_id}/codesystem-roles']['put']> = { 
    params: { path: { project_id: projectId } },
    body: updateCodeSystemRole
  };

  return useQueryWithPathParam(state, fetchOptions, method, path);
}



type PostProjectPermissionResponse =
  paths['/projects/{project_id}/permissions']['post']['responses']['200']['content']['application/json']

export const usePostProjectPermissionQuery = (permission: ProjectPermission, projectId: number) => {
  const state = ref<PostProjectPermissionResponse>();
  const path = '/projects/{project_id}/permissions';
  const method = Method.POST;
  const fetchOptions: ProjectQueryOptions<paths['/projects/{project_id}/permissions']['post']> = { 
    params: { path: { project_id: projectId } },
    body: permission
  };

  return useQueryWithPathParam(state, fetchOptions, method, path);
}

type PutProjectPermissionResponse = paths['/projects/{project_id}/permissions']['put']['responses']['200']['content']['application/json']

export const usePutProjectPermissionQuery = (permission: ProjectPermission, projectId: number) => {
  const state = ref<PutProjectPermissionResponse>();
  const path = '/projects/{project_id}/permissions';
  const method = Method.PUT;
  const fetchOptions: ProjectQueryOptions<paths['/projects/{project_id}/permissions']['put']> = { 
    params: { path: { project_id: projectId } },
    body: permission
  };

  return useQueryWithPathParam(state, fetchOptions, method, path);
}

type DeleteProjectPermissionResponse = paths['/projects/{project_id}/permissions/{user_id}']['delete']['responses']['200']['content']['application/json']

export const useDeleteProjectPermissionQuery = (userId: string, projectId: number) => {
  const state = ref<DeleteProjectPermissionResponse>();
  const path = '/projects/{project_id}/permissions/{user_id}';
  const method = Method.DELETE;
  const fetchOptions: ProjectQueryOptions<paths['/projects/{project_id}/permissions/{user_id}']['delete']> = { 
    params: { path: { project_id: projectId, user_id: userId } }
  };

  return useQueryWithPathParam(state, fetchOptions, method, path);
}

type UserResponse = paths['/users']['get']['responses']['200']['content']['application/json']

export const useGetUsersQuery = () => {
  const state = ref<UserResponse>();
  const path = '/users';
  const method = Method.GET;

  return useQueryWithPathParam(state, null, method, path);
}

type LoginResponse = paths['/users/login']['post']['responses']['200']['content']['application/json']

export const useLoginQuery = () => {
  const state = ref<LoginResponse>();
  const path = '/users/login';
  const method = Method.POST;

  return useQueryWithPathParam(state, null, method, path);
}