import { deleteProject } from '@/client'
import type { Project } from '@/client/types.gen'
import { defineStore } from 'pinia'

interface ProjectState {
  projects: Project[]
  currentProject: Project | null
}

export const useProjectStore = defineStore('projects', {
  state: (): ProjectState => ({
    projects: [],
    currentProject: null
  }),
  actions: {
    setProjects(projects: Project[]) {
      this.projects = projects
    },
    setCurrentProject(projectId: number) {
      this.currentProject = this.projects.find((p) => p.id === projectId) || null
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
