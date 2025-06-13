<template>
  <div class="container">
    <h1>Task List</h1>
    <div class="filters">
      <label for="status">Status:</label>
      <select id="status" v-model="currentFilters.status">
        <option value="">All</option>
        <option value="open">Open</option>
        <option value="in progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <label for="priority">Priority:</label>
      <select id="priority" v-model="currentFilters.priority">
        <option value="">All</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
    </div>

    <button @click="applyFilters">Apply Filters</button>

    <div v-if="taskStore.loading">Loading tasks...</div>
    <div v-else-if="taskStore.tasks.length === 0">No tasks found.</div>
    <Table v-else :headers="taskTableHeaders" :data="displayedTasks">
      <template #default="{ item }">
        <tr>
          <td>{{ item.title }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.status }}</td>
          <td>{{ item.priority }}</td>
        </tr>
      </template>
    </Table>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useTasksStore } from '../store/tasks';
import Table from '../components/Table.vue';
import { useRoute } from 'vue-router';

const taskStore = useTasksStore();
const route = useRoute();
const projectId = computed(() => route.params.id);

const currentFilters = ref({
  status: '',
  priority: '',
});

const taskTableHeaders = [
  { text: 'Title', key: 'title' },
  { text: 'Description', key: 'description' },
  { text: 'Status', key: 'status' },
  { text: 'Priority', key: 'priority' },
];



const displayedTasks = computed(() => {
  return taskStore.filteredTasks(currentFilters.value);
});

onMounted(() => {
  watch(projectId, (newProjectId) => {
    taskStore.fetchTasks(newProjectId); // Llama sin filtros
  }, { immediate: true });
});
</script>

<style scoped>
.container {
  padding: 20px;
}

.filters {
  margin-bottom: 20px;
}

label {
  margin-right: 10px;
}

select {
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button {
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #3e8e41;
}
</style>
