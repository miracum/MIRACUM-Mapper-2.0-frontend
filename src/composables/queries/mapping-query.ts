import client from '../../lib'
import { ref } from 'vue'
import type { ParamsOption, RequestBodyOption } from 'openapi-fetch'
import type { paths, components } from '../../client/types'
import type { CreateMapping, UpdateMapping } from '@/stores/mappings'
import { useQueryWithPathParam, Method } from './query'
import { type AppError } from './query'

type MappingQueryOptions<T> = ParamsOption<T> & RequestBodyOption<T>

type MappingsResponse =
  paths['/projects/{project_id}/mappings']['get']['responses']['200']['content']['application/json'];

export const useGetMappingsQuery = (project_id: number) => {
  const state = ref<MappingsResponse>();
  const fetchOptions: MappingQueryOptions<paths['/projects/{project_id}/mappings']['get']> = {
    params: {
      path: { project_id: project_id }
    }
  };
  const path = '/projects/{project_id}/mappings';
  const method = Method.GET;

  return useQueryWithPathParam(state, fetchOptions, method, path);
}

type DeleteMappingResponse =
  paths['/projects/{project_id}/mappings/{mapping_id}']['delete']['responses']['200']['content']['application/json'];

// export const useDeleteMappingQuery = (project_id: number, mapping_id: number) => {
//   const state = ref<DeleteMappingResponse>();
//   const fetchOptions: MappingQueryOptions<
//     paths['/projects/{project_id}/mappings/{mapping_id}']['delete']
//   > = {
//     params: {
//       path: { project_id: project_id, mapping_id: mapping_id }
//     }
//   };
//   const path = '/projects/{project_id}/mappings/{mapping_id}';
//   const method = Method.DELETE;

//   return useQueryWithPathParam(state, fetchOptions, method, path);
// }

export const useDeleteMappingQuery = (project_id: number, mapping_id: number) => {
  const state = ref<DeleteMappingResponse>()
  const isReady = ref(false)
  const isFetching = ref(false)
  const error = ref<AppError | undefined>(undefined)

  async function execute() {
    error.value = undefined
    isReady.value = false
    isFetching.value = true

    const fetchOptions: MappingQueryOptions<
      paths['/projects/{project_id}/mappings/{mapping_id}']['delete']
    > = {
      params: {
        path: { project_id: project_id, mapping_id: mapping_id }
      }
    }

    const { data, error: fetchError } = await client.DELETE(
      '/projects/{project_id}/mappings/{mapping_id}',
      fetchOptions
    )

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

type UpdateMappingResponse =
  paths['/projects/{project_id}/mappings']['put']['responses']['200']['content']['application/json']

export const useUpdateMappingQuery = (project_id: number, updateMapping: UpdateMapping) => {
  const state = ref<UpdateMappingResponse>();
  const fetchOptions: MappingQueryOptions<paths['/projects/{project_id}/mappings']['put']> = {
    params: {
      path: { project_id: project_id }
    },
    body: updateMapping
  };
  const path = '/projects/{project_id}/mappings';
  const method = Method.PUT;

  return useQueryWithPathParam(state, fetchOptions, method, path);
}

type CreateMappingResponse =
  paths['/projects/{project_id}/mappings']['post']['responses']['200']['content']['application/json']

export const useCreateMappingQuery = (project_id: number, createMapping: CreateMapping) => {
  const state = ref<CreateMappingResponse>()
  const fetchOptions: MappingQueryOptions<paths['/projects/{project_id}/mappings']['post']> = {
    params: {
      path: { project_id: project_id }
    },
    body: createMapping
  }
  const path = '/projects/{project_id}/mappings'
  const method = Method.POST
  
  return useQueryWithPathParam(state, fetchOptions, method, path)
}


type ConceptQueryOptions<T> = ParamsOption<T> & RequestBodyOption<T>

type ConceptsResponse =
  paths['/codesystems/{codesystem_id}/concepts']['get']['responses']['200']['content']['application/json']
  
export const useGetConceptsQuery = (
  codesystem_id: number,
  code: string | null,
  meaning: string | null,
  pageSize: number
) => {
  const state = ref<ConceptsResponse>()
  const query: Record<string, any> = { pageSize: pageSize }
  if (code !== null) {
    query.codeSearch = code
  }
  if (meaning !== null) {
    query.meaningSearch = meaning
  }

  const fetchOptions: ConceptQueryOptions<paths['/codesystems/{codesystem_id}/concepts']['get']> ={
    params: {
      path: { codesystem_id: codesystem_id },
      query: query
    }
  }
  const path = '/codesystems/{codesystem_id}/concepts'
  const method = Method.GET
     
  return useQueryWithPathParam(state, fetchOptions, method, path)
}
