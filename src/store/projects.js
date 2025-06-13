import { defineStore } from "pinia"
import api from "../store/api"

export const useProjectStore = defineStore("projects", {
  state: () => ({
    projects: [],
    isLoading: false,
    error: null,
  }),
  getters: {
    filteredProjects: (state) => (filters) => {
      let filtered = state.projects

      if (filters.name) {
        const searchTerm = filters.name.toLowerCase()
        filtered = filtered.filter((project) => project.name.toLowerCase().includes(searchTerm))
      }
      if (filters.status !== undefined && filters.status !== null && filters.status !== "") {
        // Convertir el valor del filtro a booleano si viene como string 'true'/'false'
        const filterStatus = typeof filters.status === "string" ? filters.status === "true" : filters.status
        filtered = filtered.filter((project) => project.isActive === filterStatus)
      }
      return filtered
    },
  },
  actions: {
    async fetchProjects() {
      // Elimina 'filters' de los parámetros
      this.isLoading = true
      this.error = null
      try {
        const response = await api.get("/projects") // No se pasan parámetros de filtro aquí
        this.projects = response.data
      } catch (err) {
        this.error = "Error al cargar proyectos: " + (err.response?.data?.message || err.message)
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    async createProject(projectData) {
      this.isLoading = true
      this.error = null
      try {
        const response = await api.post("/projects", projectData)
        this.projects.push(response.data)
        return response.data
      } catch (err) {
        this.error = "Error al crear proyecto: " + (err.response?.data?.message || err.message)
        console.error(err)
        throw err // Re-throw to allow component to handle
      } finally {
        this.isLoading = false
      }
    },
    async updateProject(id, projectData) {
      this.isLoading = true
      this.error = null
      try {
        const response = await api.put(`/projects/${id}`, projectData)
        const index = this.projects.findIndex((p) => p.id === id)
        if (index !== -1) {
          this.projects[index] = response.data
        }
        return response.data
      } catch (err) {
        this.error = "Error al actualizar proyecto: " + (err.response?.data?.message || err.message)
        console.error(err)
        throw err
      } finally {
        this.isLoading = false
      }
    },
    async deleteProject(id) {
      this.isLoading = true
      this.error = null
      try {
        await api.delete(`/projects/${id}`)
        this.projects = this.projects.filter((p) => p.id !== id)
      } catch (err) {
        this.error = "Error al eliminar proyecto: " + (err.response?.data?.message || err.message)
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
  },
})
