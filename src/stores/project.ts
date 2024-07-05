// import { deleteProject } from '@/client/client-old'
// import type { Project } from '@/client/client-old/types.gen'
import { defineStore } from 'pinia'
import type { components } from '../client/types'

interface ProjectState {
  projects: Project[]
  currentProject: Project | null
  currentProjectDetails: ProjectDetails | null
}

export type Project = components['schemas']['Project']
export type UpdateProject = components['schemas']['UpdateProject']
export type ProjectDetails = components['schemas']['ProjectDetails']

export const useProjectStore = defineStore('projects', {
  state: (): ProjectState => ({
    projects: [],
    currentProject: null,
    currentProjectDetails: null
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
    },
    updateProject(updatedProject: Project) {
      const index = this.projects.findIndex((p) => p.id === updatedProject.id)
      if (index !== -1) {
        this.projects[index] = updatedProject
      }
    },
    deleteProject(projectId: number) {
      this.projects = this.projects.filter((p) => p.id !== projectId)
    }
  }
})
