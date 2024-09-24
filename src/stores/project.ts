// import { deleteProject } from '@/client/client-old'
// import type { Project } from '@/client/client-old/types.gen'
import { defineStore } from 'pinia'
import type { components } from '../client/types'
// import { getProject } from '@/client/client-old'
// import type { ComponentCustomProperties } from 'vue'

interface ProjectState {
  projects: Project[]
  currentProject: Project | null
  currentProjectDetails: ProjectDetails | null
  currentLookupCodeSystemRoleIds: { [key: number]: number } | null
}

export type Project = components['schemas']['Project']
export type CreateProject = components['schemas']['CreateProjectDetails']
export type UpdateProject = components['schemas']['UpdateProject']
export type ProjectDetails = components['schemas']['ProjectDetails']
export type CodeSystemRole = components['schemas']['CodeSystemRole']
export type CodeSystem = components['schemas']['CodeSystem']

export const useProjectStore = defineStore('projects', {
  state: (): ProjectState => ({
    projects: [],
    currentProject: null,
    currentProjectDetails: null,
    currentLookupCodeSystemRoleIds: null
  }),
  actions: {
    setProjects(projects: Project[]) {
      this.projects = projects
    },
    setCurrentProject(projectId: number) {
      this.currentProject = this.projects.find((p) => p.id === projectId) || null
    },
    setCurrentProjectDetails(projectDetails: ProjectDetails) {
      this.currentProjectDetails = projectDetails

      // Create a lookup table for code system roles
      this.currentLookupCodeSystemRoleIds = {}
      const roles = projectDetails.code_system_roles
      for (let i = 0; i < roles.length; i++) {
        this.currentLookupCodeSystemRoleIds[roles[i].id] = roles[i].system.id
      }
    },
    updateProject(updatedProject: Project) {
      const index = this.projects.findIndex((p) => p.id === updatedProject.id)
      if (index !== -1) {
        this.projects[index] = updatedProject
      }
    },
    deleteProject(projectId: number) {
      this.projects = this.projects.filter((p) => p.id !== projectId)
    },
    getProject(projectId: number) {
      return this.projects.find((p) => p.id === projectId)
    }
  }
})
