import { defineStore } from "pinia"
import api from "../store/api"

export const useTasksStore = defineStore("tasks", {
  state: () => ({
    tasks: [],
    isLoading: false,
    error: null,
  }),
  getters: {
    filteredTasks: (state) => (filters) => {
      let filtered = state.tasks

      if (filters.status) {
        filtered = filtered.filter((task) => task.status === filters.status)
      }
      if (filters.priority) {
        filtered = filtered.filter((task) => task.priority === filters.priority)
      }
      return filtered
    },
  },
  actions: {
    async fetchTasks(projectId = null) {
      // Elimina 'filters' de los parámetros
      this.isLoading = true
      this.error = null
      try {
        // Elimina la construcción de 'params' ya que el filtrado se hará en el cliente
        let url = "/tasks"
        if (projectId) {
          url = `/projects/${projectId}/tasks`
        }

        const response = await api.get(url) // No se pasan parámetros de filtro aquí
        this.tasks = response.data
      } catch (err) {
        this.error = "Error al cargar tareas: " + (err.response?.data?.message || err.message)
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    async addTask(task) {
      try {
        const response = await api.post("/tasks", task)
        this.tasks.push(response.data)
      } catch (err) {
        this.error = "Error al agregar tarea: " + (err.response?.data?.message || err.message)
        console.error(err)
      }
    },
    async updateTask(id, updatedTask) {
      try {
        await api.put(`/tasks/${id}`, updatedTask)
        const index = this.tasks.findIndex((task) => task.id === id)
        if (index !== -1) {
          this.tasks[index] = { ...this.tasks[index], ...updatedTask }
        }
      } catch (err) {
        this.error = "Error al actualizar tarea: " + (err.response?.data?.message || err.message)
        console.error(err)
      }
    },
    async deleteTask(id) {
      try {
        await api.delete(`/tasks/${id}`)
        this.tasks = this.tasks.filter((task) => task.id !== id)
      } catch (err) {
        this.error = "Error al eliminar tarea: " + (err.response?.data?.message || err.message)
        console.error(err)
      }
    },
  },
})
