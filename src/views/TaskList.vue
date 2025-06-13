<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">
      Tareas
      <span v-if="projectId"> para el Proyecto: <span class="text-indigo-600">{{ projectName }}</span></span>
    </h1>

    <FilterBar
      :filters="taskFiltersConfig"
      v-model="currentFilters"
      @apply-filters="applyFilters"
    />

    <div class="flex justify-end mb-4">
      <button
        @click="openCreateModal"
        class="px-6 py-3 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
      >
        <PlusIcon class="inline-block w-5 h-5 mr-2" /> Crear Nueva Tarea
      </button>
    </div>

    <div v-if="taskStore.isLoading" class="text-center py-8">
      <Loader2Icon class="animate-spin w-8 h-8 text-indigo-500 mx-auto" />
      <p class="text-gray-600 mt-2">Cargando tareas...</p>
    </div>
    <div v-else-if="taskStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline">{{ taskStore.error }}</span>
    </div>
    <Table v-else :headers="taskTableHeaders" :data="displayedTasks">
      <template #cell-status="{ item }">
        <span
          :class="[
            'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
            item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            item.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
            'bg-green-100 text-green-800',
          ]"
        >
          {{ item.status }}
        </span>
      </template>
      <template #cell-priority="{ item }">
        <span
          :class="[
            'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
            item.priority === 'high' ? 'bg-red-100 text-red-800' :
            item.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
            'bg-gray-100 text-gray-800',
          ]"
        >
          {{ item.priority }}
        </span>
      </template>
      <template #cell-actions="{ item }">
        <div class="flex space-x-2">
          <button @click="openEditModal(item)" class="text-indigo-600 hover:text-indigo-900">
            <PencilIcon class="w-5 h-5" />
          </button>
          <button @click="deleteTask(item.id)" class="text-red-600 hover:text-red-900">
            <Trash2Icon class="w-5 h-5" />
          </button>
        </div>
      </template>
    </Table>

    <Modal :is-open="isModalOpen" :title="modalTitle" @close="closeModal">
      <TaskForm
        :initial-task="currentTask"
        :is-submitting="isFormSubmitting"
        :form-error="formError"
        @submit="handleTaskSubmit"
        @cancel="closeModal"
      />
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useTasksStore } from '../store/tasks';
import { useProjectStore } from '../store/projects';
import Table from '../components/Table.vue';
import FilterBar from '../components/FilterBar.vue';
import Modal from '../components/Modal.vue';
import TaskForm from '../components/TaskForm.vue';
import { PlusIcon, PencilIcon, Trash2Icon, Loader2Icon } from 'lucide-vue-next';

const route = useRoute();
const taskStore = useTasksStore();
const projectStore = useProjectStore();

const projectId = computed(() => route.params.projectId || null);
const projectName = computed(() => {
  if (projectId.value) {
    const project = projectStore.projects.find(p => p.id === projectId.value);
    return project ? project.name : 'Cargando...';
  }
  return '';
});

const currentFilters = ref({
  status: '',
  priority: '',
});

watch(projectId, (newProjectId) => {
  taskStore.fetchTasks(newProjectId);
}, { immediate: true });

onMounted(() => {
  projectStore.fetchProjects();
});

const isModalOpen = ref(false);
const modalTitle = ref('');
const currentTask = ref(null);
const isFormSubmitting = ref(false);
const formError = ref(null);



const taskFiltersConfig = [
  {
    key: 'status',
    label: 'Estado',
    type: 'select',
    placeholder: 'Todos',
    options: [
      { label: 'Pendiente', value: 'pending' },
      { label: 'En Progreso', value: 'in-progress' },
      { label: 'Hecho', value: 'done' },
    ],
  },
  {
    key: 'priority',
    label: 'Prioridad',
    type: 'select',
    placeholder: 'Todas',
    options: [
      { label: 'Alta', value: 'high' },
      { label: 'Media', value: 'medium' },
      { label: 'Baja', value: 'low' },
    ],
  },
];

const taskTableHeaders = [
  { key: 'title', label: 'Título' },
  { key: 'description', label: 'Descripción' },
  { key: 'status', label: 'Estado' },
  { key: 'priority', label: 'Prioridad' },
  { key: 'createdAt', label: 'Fecha Creación' },
  { key: 'actions', label: 'Acciones' },
];

const displayedTasks = computed(() => {
  return taskStore.filteredTasks(currentFilters.value);
});

const openCreateModal = () => {
  currentTask.value = {
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    projectId: projectId.value,
  };
  modalTitle.value = 'Crear Nueva Tarea';
  formError.value = null;
  isModalOpen.value = true;
};

const openEditModal = (task) => {
  currentTask.value = { ...task };
  modalTitle.value = 'Editar Tarea';
  formError.value = null;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  currentTask.value = null;
  formError.value = null;
};

const handleTaskSubmit = async (taskData) => {
  isFormSubmitting.value = true;
  formError.value = null;
  try {
    if (taskData.id) {
      await taskStore.updateTask(taskData.id, taskData);
    } else {
      await taskStore.addTask(taskData);
    }
    closeModal();
  } catch (err) {
    formError.value = err.message || 'Error al guardar la tarea.';
  } finally {
    isFormSubmitting.value = false;
  }
};

const deleteTask = async (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
    await taskStore.deleteTask(id);
  }
};
</script>
