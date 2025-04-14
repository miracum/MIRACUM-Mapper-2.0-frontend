import { ref } from 'vue'
import type { ParamsOption, RequestBodyOption } from 'openapi-fetch'
import type { paths } from '../../client/types'
import { useQueryWithPathParam, Method } from './query'
import { type CreateCodeSystem, type UpdateCodeSystem, type BaseCodeSystemVersion, type UpdateCodeSystemVersion } from '@/stores/codesystem'

type CodeSystemQueryOptions<T> = ParamsOption<T> & RequestBodyOption<T>

type CodeSystemResponse =
  paths['/codesystems']['get']['responses']['200']['content']['application/json']

export const useCodeSystemQuery = (fetchOptions: CodeSystemQueryOptions<paths['/codesystems']['get']>) => {
  const state = ref<CodeSystemResponse>()
  const path = '/codesystems'
  const method = Method.GET

  return useQueryWithPathParam(state, fetchOptions, method, path)
}

type PostCodeSystemResponse =
  paths['/codesystems']['post']['responses']['200']['content']['application/json']

export const usePostCodeSystemQuery = (createCodeSystem: CreateCodeSystem) => {
  const state = ref<PostCodeSystemResponse>()
  const fetchOptions: CodeSystemQueryOptions<paths['/codesystems']['post']> = { body: createCodeSystem }

  const path = '/codesystems'
  const method = Method.POST

  return useQueryWithPathParam(state, fetchOptions, method, path)
}

type PutCodeSystemResponse =
  paths['/codesystems']['put']['responses']['200']['content']['application/json']

export const usePutCodeSystemQuery = (updateCodeSystem: UpdateCodeSystem) => {
  const state = ref<PutCodeSystemResponse>()
  const fetchOptions: CodeSystemQueryOptions<paths['/codesystems']['put']> = { body: updateCodeSystem }

  const path = '/codesystems'
  const method = Method.PUT

  return useQueryWithPathParam(state, fetchOptions, method, path)
}

type DeleteCodeSystemResponse =
  paths['/codesystems/{codesystem_id}']['delete']['responses']['200']['content']['application/json']

export const useDeleteCodeSystemQuery = (codesystemId: number) => {
  const state = ref<DeleteCodeSystemResponse>()
  const fetchOptions: CodeSystemQueryOptions<paths['/codesystems/{codesystem_id}']['delete']> = {
    params: {
      path: { codesystem_id: codesystemId }
    }
  }
  const path = '/codesystems/{codesystem_id}'
  const method = Method.DELETE

  return useQueryWithPathParam(state, fetchOptions, method, path)
}

type PostCodeSystemVersionResponse =
  paths['/codesystems/{codesystem_id}/versions']['post']['responses']['200']['content']['application/json']

export const usePostCodeSystemVersionQuery = (codesystemId: number, createCodeSystemVersion: BaseCodeSystemVersion) => {
  const state = ref<PostCodeSystemVersionResponse>()
  const fetchOptions: CodeSystemQueryOptions<paths['/codesystems/{codesystem_id}/versions']['post']> = {
    params: {
      path: { codesystem_id: codesystemId }
    },
    body: createCodeSystemVersion
  }
  const path = '/codesystems/{codesystem_id}/versions'
  const method = Method.POST

  return useQueryWithPathParam(state, fetchOptions, method, path)
}

type PutCodeSystemVersionResponse =
  paths['/codesystems/{codesystem_id}/versions']['put']['responses']['200']['content']['application/json']

export const usePutCodeSystemVersionQuery = (codesystemId: number, updateCodeSystemVersion: UpdateCodeSystemVersion) => {
  const state = ref<PutCodeSystemVersionResponse>()
  const fetchOptions: CodeSystemQueryOptions<paths['/codesystems/{codesystem_id}/versions']['put']> = {
    params: {
      path: { codesystem_id: codesystemId }
    },
    body: updateCodeSystemVersion
  }
  const path = '/codesystems/{codesystem_id}/versions'
  const method = Method.PUT

  return useQueryWithPathParam(state, fetchOptions, method, path)
}

type DeleteCodeSystemVersionResponse =
  paths['/codesystems/{codesystem_id}/versions/{codesystem-version_id}']['delete']['responses']['200']['content']['application/json']

export const useDeleteCodeSystemVersionQuery = (codesystemId: number, codesystemVersionId: number) => {
  const state = ref<DeleteCodeSystemVersionResponse>()
  const fetchOptions: CodeSystemQueryOptions<paths['/codesystems/{codesystem_id}/versions/{codesystem-version_id}']['delete']> = {
    params: {
      path: { 'codesystem_id': codesystemId, 'codesystem-version_id': codesystemVersionId }
    }
  }
  const path = '/codesystems/{codesystem_id}/versions/{codesystem-version_id}'
  const method = Method.DELETE

  return useQueryWithPathParam(state, fetchOptions, method, path)
}

type ImportCodeSystemVersionResponse =
  paths['/codesystems/{codesystem_id}/versions/{codesystem-version_id}/import']['post']['responses']['202']['content']['application/json']

export const useImportCodeSystemVersionQuery = (codesystemId: number, codesystemVersionId: number, main_file: File) => {
  const state = ref<ImportCodeSystemVersionResponse>()
  const formData = new FormData()
  formData.append('main', main_file)

  const fetchOptions: CodeSystemQueryOptions<paths['/codesystems/{codesystem_id}/versions/{codesystem-version_id}/import']['post']> = {
    params: {
      path: { 'codesystem_id': codesystemId, 'codesystem-version_id': codesystemVersionId }
    },
    body: formData as unknown as { main: string }
  }
  const path = '/codesystems/{codesystem_id}/versions/{codesystem-version_id}/import'
  const method = Method.POST

  return useQueryWithPathParam(state, fetchOptions, method, path)
}

type ImportCodeSystemVersionJsonResponse =
  paths['/codesystems/{codesystem_id}/versions/{codesystem-version_id}/import-json']['post']['responses']['202']['content']['application/json']

export const useImportCodeSystemVersionJsonQuery = async (codesystemId: number, codesystemVersionId: number, main_file: File) => {
  const state = ref<ImportCodeSystemVersionJsonResponse>()
  const jsonBody = await main_file.text().then(text => JSON.parse(text) as Record<string, never>)

  const fetchOptions: CodeSystemQueryOptions<paths['/codesystems/{codesystem_id}/versions/{codesystem-version_id}/import-json']['post']> = {
    params: {
      path: { 'codesystem_id': codesystemId, 'codesystem-version_id': codesystemVersionId }
    },
    body: jsonBody
  }
  const path = '/codesystems/{codesystem_id}/versions/{codesystem-version_id}/import-json'
  const method = Method.POST

  return useQueryWithPathParam(state, fetchOptions, method, path)
}

type ImportCodeSystemVersionStatusResponse =
  paths['/import-status']['get']['responses']['200']['content']['application/json']

export const useGetImportStatusQuery = () => {
  const state = ref<ImportCodeSystemVersionStatusResponse>()
  const path = '/import-status'
  const method = Method.GET

  return useQueryWithPathParam(state, null, method, path)
}
