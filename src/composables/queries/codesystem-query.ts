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

type ImportCodeSystemVersionGenericResponse =
  paths['/codesystems/{codesystem_id}/versions/{codesystem-version_id}/import/generic']['post']['responses']['202']['content']['application/json']

export const useImportCodeSystemVersionGenericQuery = (codesystemId: number, codesystemVersionId: number, mainFile: File, replaceByFile: File | null) => {
  const state = ref<ImportCodeSystemVersionGenericResponse>()
  const formData = new FormData()
  formData.append('main', mainFile)
  if (replaceByFile) {
    formData.append('replace_by', replaceByFile)
  }

  const fetchOptions: CodeSystemQueryOptions<paths['/codesystems/{codesystem_id}/versions/{codesystem-version_id}/import/generic']['post']> = {
    params: {
      path: { 'codesystem_id': codesystemId, 'codesystem-version_id': codesystemVersionId }
    },
    body: formData as unknown as { main: string, replace_by?: string }
  }
  const path = '/codesystems/{codesystem_id}/versions/{codesystem-version_id}/import/generic'
  const method = Method.POST

  return useQueryWithPathParam(state, fetchOptions, method, path)
}

type ImportCodeSystemVersionLoincResponse =
  paths['/codesystems/{codesystem_id}/versions/{codesystem-version_id}/import/loinc']['post']['responses']['202']['content']['application/json']

export const useImportCodeSystemVersionLoincQuery = (codesystemId: number, codesystemVersionId: number, mainFile: File, replaceByFile: File) => {
  const state = ref<ImportCodeSystemVersionLoincResponse>()
  const formData = new FormData()
  formData.append('loinc', mainFile)
  formData.append('map_to', replaceByFile)

  const fetchOptions: CodeSystemQueryOptions<paths['/codesystems/{codesystem_id}/versions/{codesystem-version_id}/import/loinc']['post']> = {
    params: {
      path: { 'codesystem_id': codesystemId, 'codesystem-version_id': codesystemVersionId }
    },
    body: formData as unknown as { loinc: string, map_to: string }
  }
  const path = '/codesystems/{codesystem_id}/versions/{codesystem-version_id}/import/loinc'
  const method = Method.POST

  return useQueryWithPathParam(state, fetchOptions, method, path)
}

type ImportCodeSystemVersionIcdResponse =
  paths['/codesystems/{codesystem_id}/versions/{codesystem-version_id}/import/icd10gm']['post']['responses']['202']['content']['application/json']

export const useImportCodeSystemVersionIcdQuery = async (codesystemId: number, codesystemVersionId: number, codeSystemFile: File, conceptMapFile: File) => {
  const state = ref<ImportCodeSystemVersionIcdResponse>()
  const codeSystemData = await codeSystemFile.text().then(text => JSON.parse(text) as Record<string, never>)
  const conceptMapData = await conceptMapFile.text().then(text => JSON.parse(text) as Record<string, never>)
  const jsonBody = {
    codeSystem: codeSystemData,
    conceptMap: conceptMapData
  } as unknown as Record<string, never>

  const fetchOptions: CodeSystemQueryOptions<paths['/codesystems/{codesystem_id}/versions/{codesystem-version_id}/import/icd10gm']['post']> = {
    params: {
      path: { 'codesystem_id': codesystemId, 'codesystem-version_id': codesystemVersionId }
    },
    body: jsonBody
  }
  const path = '/codesystems/{codesystem_id}/versions/{codesystem-version_id}/import/icd10gm'
  const method = Method.POST

  return useQueryWithPathParam(state, fetchOptions, method, path)
}

type ImportCodeSystemVersionSnomedResponse =
  paths['/codesystems/{codesystem_id}/versions/{codesystem-version_id}/import/snomedct']['post']['responses']['202']['content']['application/json']
export const useImportCodeSystemVersionSnomedQuery = (codesystemId: number, codesystemVersionId: number, conceptFile: File, descriptionFile: File) => {
  const state = ref<ImportCodeSystemVersionSnomedResponse>()
  const formData = new FormData()
  formData.append('concept', conceptFile)
  formData.append('description', descriptionFile)

  const fetchOptions: CodeSystemQueryOptions<paths['/codesystems/{codesystem_id}/versions/{codesystem-version_id}/import/snomedct']['post']> = {
    params: {
      path: { 'codesystem_id': codesystemId, 'codesystem-version_id': codesystemVersionId }
    },
    body: formData as unknown as { concept: string, description: string }
  }
  const path = '/codesystems/{codesystem_id}/versions/{codesystem-version_id}/import/snomedct'
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
