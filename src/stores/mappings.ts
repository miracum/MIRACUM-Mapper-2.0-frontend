import type { components } from '../client/types'
import { defineStore } from 'pinia'

interface MappingState {
  mappings: Mapping[]
  currentMapping: Mapping | null
}

export type Mapping = components['schemas']['Mapping']

export const useMappingStore = defineStore('mappings', {
  state: (): MappingState => ({
    mappings: [],
    currentMapping: null
  }),
  actions: {
    setMappings(mappings: Mapping[]) {
      this.mappings = mappings
    },
    setCurrentMapping(mappingId: number) {
      this.currentMapping = this.mappings.find((m) => m.id === mappingId) || null
    },
    updateMapping(updatedMapping: Mapping) {
      const index = this.mappings.findIndex((m) => m.id === updatedMapping.id)
      if (index !== -1) {
        this.mappings[index] = updatedMapping
      }
    },
    deleteMapping(mappingId: number) {
      this.mappings = this.mappings.filter((m) => m.id !== mappingId)
    }
  }
})
