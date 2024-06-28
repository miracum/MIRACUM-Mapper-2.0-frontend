import { defineStore } from 'pinia'

export const useProjectStore = defineStore('projects', {
  state: () => ({
    projects: [],
    currentProject: null
  }),
  actions: {
    setProjects(projects) {
      this.projects = projects
    },
    setCurrentProject(projectId) {
      this.currentProject = this.projects.find((p) => p.id === projectId) || null
    },
    updateProject(updatedProject) {
      const index = this.projects.findIndex((p) => p.id === updatedProject.id)
      if (index !== -1) {
        this.projects[index] = updatedProject
      }
    }
  }
})
