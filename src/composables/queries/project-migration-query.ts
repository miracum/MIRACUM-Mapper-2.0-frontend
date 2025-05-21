import { ref } from 'vue'
import type { ParamsOption, RequestBodyOption } from 'openapi-fetch'
import type { paths, components } from '../../client/types'
import { useQueryWithPathParam, Method } from './query'

export type MigrationOptions = components['schemas']['MigrationOptions']
export type CodeSystemRoleMigration = components['schemas']['CodeSystemRoleMigration']
export type MigrationStatus = components['schemas']['MigrationStatus']
export type MigrationChanges = components['schemas']['MigrationChanges']
export type MigrationChangeOldConcept = components['schemas']['MigrationChangeOldConcept']
export type MigrationChangeOldAndNewConcept = components['schemas']['MigrationChangeOldAndNewConcept']
export type MigrateMapping = components['schemas']['MigrateMapping']

type ProjectMigrationQueryOptions<T> = ParamsOption<T> & RequestBodyOption<T>

export type MigrationOptionsResponse = paths['/projects/{project_id}/migration/options']['get']['responses']['200']['content']['application/json']

export const useGetMigrationOptionsQuery = (projectId: number) => {
  const state = ref<MigrationOptionsResponse>()
  const fetchOptions: ProjectMigrationQueryOptions<paths['/projects/{project_id}/migration/options']['get']> = {
    params: {
      path: { project_id: projectId }
    }
  }
  const path = '/projects/{project_id}/migration/options'
  const method = Method.GET
  return useQueryWithPathParam(state, fetchOptions, method, path)
}

export type MigrationStatusResponse = paths['/projects/{project_id}/migration/status']['get']['responses']['200']['content']['application/json']

export const useGetMigrationStatusQuery = (projectId: number) => {
  const state = ref<MigrationStatusResponse>()
  const fetchOptions: ProjectMigrationQueryOptions<paths['/projects/{project_id}/migration/status']['get']> = {
    params: {
      path: { project_id: projectId }
    }
  }
  const path = '/projects/{project_id}/migration/status'
  const method = Method.GET
  return useQueryWithPathParam(state, fetchOptions, method, path)
}

export type StartMigrationResponse = paths['/projects/{project_id}/migration/start']['post']['responses']['200']['content']['application/json']

export const useStartMigrationQuery = (projectId: number, code_system_role_id: number, version_id: number) => {
  const state = ref<StartMigrationResponse>()
  const fetchOptions: ProjectMigrationQueryOptions<paths['/projects/{project_id}/migration/start']['post']> = {
    params: {
      path: { project_id: projectId }
    },
    body: {
      code_system_role_id: code_system_role_id,
      version_id: version_id
    }
  }
  const path = '/projects/{project_id}/migration/start'
  const method = Method.POST
  return useQueryWithPathParam(state, fetchOptions, method, path)
}

export type CancelMigrationResponse = paths['/projects/{project_id}/migration/cancel']['post']['responses']['200']['content']['application/json']

export const useCancelMigrationQuery = (projectId: number) => {
  const state = ref<CancelMigrationResponse>()
  const fetchOptions: ProjectMigrationQueryOptions<paths['/projects/{project_id}/migration/cancel']['post']> = {
    params: {
      path: { project_id: projectId }
    }
  }
  const path = '/projects/{project_id}/migration/cancel'
  const method = Method.POST
  return useQueryWithPathParam(state, fetchOptions, method, path)
}

export type MigrationChangesResponse = paths['/projects/{project_id}/migration/changes']['get']['responses']['200']['content']['application/json']

export const useGetMigrationChangesQuery = (projectId: number) => {
  const state = ref<MigrationChangesResponse>()
  const fetchOptions: ProjectMigrationQueryOptions<paths['/projects/{project_id}/migration/changes']['get']> = {
    params: {
      path: { project_id: projectId }
    }
  }
  const path = '/projects/{project_id}/migration/changes'
  const method = Method.GET
  return useQueryWithPathParam(state, fetchOptions, method, path)
}

export type FinishMigrationResponse = paths['/projects/{project_id}/migration/finish']['post']['responses']['200']['content']['application/json']

export const useFinishMigrationQuery = (projectId: number) => {
  const state = ref<FinishMigrationResponse>()
  const fetchOptions: ProjectMigrationQueryOptions<paths['/projects/{project_id}/migration/finish']['post']> = {
    params: {
      path: { project_id: projectId }
    }
  }
  const path = '/projects/{project_id}/migration/finish'
  const method = Method.POST
  return useQueryWithPathParam(state, fetchOptions, method, path)
}

export type MigrateMigrationResponse = paths['/projects/{project_id}/migration/migrate']['post']['responses']['200']['content']['application/json']
export const useMigrateMigrationQuery = (projectId: number, body: MigrateMapping[]) => {
  const state = ref<MigrateMigrationResponse>()
  const fetchOptions: ProjectMigrationQueryOptions<paths['/projects/{project_id}/migration/migrate']['post']> = {
    params: {
      path: { project_id: projectId }
    },
    body: body
  }
  const path = '/projects/{project_id}/migration/migrate'
  const method = Method.POST
  return useQueryWithPathParam(state, fetchOptions, method, path)
}
