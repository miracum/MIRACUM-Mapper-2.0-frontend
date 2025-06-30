import { defineStore } from 'pinia'
import type { components } from '../client/types'
import { useCodeSystemQuery, useDeleteCodeSystemQuery, useDeleteCodeSystemVersionQuery, usePostCodeSystemQuery, usePostCodeSystemVersionQuery, usePutCodeSystemQuery, usePutCodeSystemVersionQuery } from '@/composables/queries/codesystem-query';
import { computed, ref, watch } from 'vue';

export interface CodeSystemState {
    codeSystems: GetCodeSystem[]
}

export type GetCodeSystem = components['schemas']['GetCodeSystem']
export type CreateCodeSystem = components['schemas']['CreateCodeSystem']
export type UpdateCodeSystem = components['schemas']['CodeSystem']

export type BaseCodeSystemVersion = components['schemas']['BaseCodeSystemVersion']
export type GetCodeSystemVersion = components['schemas']['CodeSystemVersion']
export type UpdateCodeSystemVersion = components['schemas']['UpdateCodeSystemVersion']

export type ImportStatus = components['schemas']['ImportStatus']

export type Concept = components['schemas']['Concept']
export type ReplaceBy = components['schemas']['ConceptReplaceBy']

export type CodeSystemVersionWithConcepts = components['schemas']['CodeSystemVersionWithConcepts']


export const useCodeSystemStore = defineStore('codesystems', {
    state: (): CodeSystemState => ({
        codeSystems: [],
    }),
    persist: true,
    actions: {
        refreshState() {
            const { isFetching, state, error, execute } = useCodeSystemQuery({})
            watch(isFetching, (newVal) => {
                if (!newVal && !error.value) {
                    this.codeSystems = state.value
                }
            });
            execute();
            return { isFetching, error }
        },
        getCodeSystem(codeSystemId: number) {
            return this.codeSystems.find((cs) => cs.id === codeSystemId)
        },
        addCodeSystem(codeSystem: CreateCodeSystem) {
            const { isFetching, state, error, execute } = usePostCodeSystemQuery(codeSystem)
            watch(isFetching, (newVal) => {
                if (!newVal && !error.value) {
                    const newCodeSystem = {
                        ...state.value,
                        versions: [] as GetCodeSystemVersion[]
                    }
                    this.codeSystems.push(newCodeSystem)
                }
            });
            execute();
            return { isFetching, error }
        },
        updateCodeSystem(codeSystem: UpdateCodeSystem) {
            const oldCodeSystem = this.getCodeSystem(codeSystem.id)
            const index = this.codeSystems.findIndex((cs) => cs.id === codeSystem.id)
            if (!oldCodeSystem || index === -1) {
                return { isFetching: ref(false), error: ref({message: 'Code system not found'}) }
            }
            const { isFetching, state, error, execute } = usePutCodeSystemQuery(codeSystem)
            watch(isFetching, (newVal) => {
                if (!newVal && !error.value) {
                    const updatedCodeSystem = {
                        ...state.value,
                        versions: oldCodeSystem.versions
                    }

                    this.codeSystems[index] = updatedCodeSystem
                }
            });
            execute();
            return { isFetching, error }
        },
        deleteCodeSystem(codeSystemId: number) {
            const codeSystem = this.getCodeSystem(codeSystemId)
            if (!codeSystem) {
                return { isFetching: ref(false), error: ref({message: 'Code system not found'}) }
            }
            const { isFetching, error, execute } = useDeleteCodeSystemQuery(codeSystemId)
            watch(isFetching, (newVal) => {
                if (!newVal && !error.value) {
                    this.codeSystems = this.codeSystems.filter((cs) => cs.id !== codeSystemId)
                }
            });
            execute();
            return { isFetching, error }
        },
        getVersion(codeSystemId: number, versionId: number) {
            const codeSystem = this.codeSystems.find((cs) => cs.id === codeSystemId)
            if (!codeSystem) {
                return undefined
            }
            return codeSystem.versions.find((v) => v.id === versionId)
        },
        getVersions(codeSystemId: number) {
            return computed(() => {
                const codeSystem = this.codeSystems.find((cs) => cs.id === codeSystemId)
                if (!codeSystem) {
                    return []
                }
                return codeSystem.versions.sort((a, b) => {
                    return new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
                })
            })
        },
        addVersion(codeSystemId: number, version: BaseCodeSystemVersion) {
            const codeSystem = this.getCodeSystem(codeSystemId)
            if (!codeSystem) {
                return { isFetching: ref(false), error: ref({message: 'Code system not found'}) }
            }
            const { isFetching, state, error, execute } = usePostCodeSystemVersionQuery(codeSystemId, version)
            watch(isFetching, (newVal) => {
                if (!newVal && !error.value) {
                    codeSystem.versions.push(state.value)
                }
            });
            execute();
            return { isFetching, error }
        },
        updateVersion(codeSystemId: number, version: UpdateCodeSystemVersion) {
            const codeSystem = this.codeSystems.find((cs) => cs.id === codeSystemId)
            if (!codeSystem) {
                return { isFetching: ref(false), error: ref({message: 'Code system not found'}) }
            }
            const index = codeSystem.versions.findIndex((v) => v.id === version.id)
            if (index === -1) {
                return { isFetching: ref(false), error: ref({message: 'Version not found'}) }
            }
            const { isFetching, state, error, execute } = usePutCodeSystemVersionQuery(codeSystemId, version)
            watch(isFetching, (newVal) => {
                if (!newVal && !error.value) {
                    codeSystem.versions[index] = state.value
                }
            });
            execute();
            return { isFetching, error }
        },
        deleteVersion(codeSystemId: number, versionId: number) {
            const codeSystem = this.codeSystems.find((cs) => cs.id === codeSystemId)
            if (!codeSystem) {
                return { isFetching: ref(false), error: ref({message: 'Code system not found'}) }
            }
            const version = codeSystem.versions.find((v) => v.id === versionId)
            if (!version) {
                return { isFetching: ref(false), error: ref({message: 'Version not found'}) }
            }
            const { isFetching, error, execute } = useDeleteCodeSystemVersionQuery(codeSystemId, versionId)
            watch(isFetching, (newVal) => {
                if (!newVal && !error.value) {
                    codeSystem.versions = codeSystem.versions.filter((v) => v.id !== versionId)
                }
            });
            execute();
            return { isFetching, error }
        },
        setVersionImported(codeSystemId: number, versionId: number) {
            const codeSystem = this.codeSystems.find((cs) => cs.id === codeSystemId)
            if (codeSystem) {
                const version = codeSystem.versions.find((v) => v.id === versionId)
                if (version) {
                    version.imported = true
                }
            }
        }
    }
})
