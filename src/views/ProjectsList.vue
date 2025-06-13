<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Gestión de Proyectos</h1>

    <FilterBar
      :filters="projectFiltersConfig"
      v-model="currentFilters"
      @apply-filters="applyFilters"
    />

    <div class="flex justify-end mb-4">
      <button
        @click="openCreateModal"
        class="px-6 py-3 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
      >
        <PlusIcon class="inline-block w-5 h-5 mr-2" /> Crear Nuevo Proyecto
      </button>
    </div>

    <div v-if="projectStore.isLoading" class="text-center py-8">
      <Loader2Icon class="animate-spin w-8 h-8 text-indigo-500 mx-auto" />
      <p class="text-gray-600 mt-2">Cargando proyectos...</p>
    </div>
    <div v-else-if="projectStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline">{{ projectStore.error }}</span>
    </div>
    <Table v-else :headers="projectTableHeaders" :data="displayedProjects">
      <template #cell-name="{ item }">
        <router-link :to="{ name: 'TaskList', params: { projectId: item.id } }" class="text-indigo-600 hover:underline font-medium">
          {{ item.name }}
        </router-link>
      </template>
      <template #cell-isActive="{ item }">
        <span
          :class="[
            'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
            item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
          ]"
        >
          {{ item.isActive ? 'Activo' : 'Inactivo' }}
        </span>
      </template>
      <template #cell-actions="{ item }">
        <div class="flex space-x-2">
          <button @click="openEditModal(item)" class="text-indigo-600 hover:text-indigo-900">
            <PencilIcon class="w-5 h-5" />
          </button>
          <button @click="deleteProject(item.id)" class="text-red-600 hover:text-red-900">
            <Trash2Icon class="w-5 h-5" />
          </button>
        </div>
      </template>
    </Table>

    <Modal :is-open="isModalOpen" :title="modalTitle" @close="closeModal">
      <ProjectForm
        :initial-project="currentProject"
        :is-submitting="isFormSubmitting"
        :form-error="formError"
        @submit="handleProjectSubmit"
        @cancel="closeModal"
      />
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useProjectStore } from '../store/projects'; 
import Table from '../components/Table.vue';
import FilterBar from '../components/FilterBar.vue';
import Modal from '../components/Modal.vue';
import ProjectForm from '../components/ProjectForm.vue';
import { PlusIcon, PencilIcon, Trash2Icon, Loader2Icon } from 'lucide-vue-next';

const projectStore = useProjectStore();

const isModalOpen = ref(false);
const modalTitle = ref('');
const currentProject = ref(null);
const isFormSubmitting = ref(false);
const formError = ref(null);

const currentFilters = ref({
  name: '',
  status: '',
});

const projectFiltersConfig = [
  { key: 'name', label: 'Nombre', type: 'text', placeholder: 'Filtrar por nombre...' },
  {
    key: 'status',
    label: 'Estado',
    type: 'select',
    placeholder: 'Todos',
    options: [
      { label: 'Activo', value: true },
      { label: 'Inactivo', value: false },
    ],
  },
];

const projectTableHeaders = [
  { key: 'name', label: 'Nombre' },
  { key: 'description', label: 'Descripción' },
  { key: 'isActive', label: 'Estado' },
  { key: 'createdAt', label: 'Fecha Creación' },
  { key: 'actions', label: 'Acciones' },
];

const displayedProjects = computed(() => {
  return projectStore.filteredProjects(currentFilters.value);
});

const openCreateModal = () => {
  currentProject.value = { name: '', description: '', isActive: true };
  modalTitle.value = 'Crear Nuevo Proyecto';
  formError.value = null;
  isModalOpen.value = true;
};

const openEditModal = (project) => {
  currentProject.value = { ...project }; // Crea una copia para evitar mutación directa
  modalTitle.value = 'Editar Proyecto';
  formError.value = null;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  currentProject.value = null;
  formError.value = null;
};

const handleProjectSubmit = async (projectData) => {
  isFormSubmitting.value = true;
  formError.value = null;
  try {
    if (projectData.id) {
      await projectStore.updateProject(projectData.id, projectData);
    } else {
      await projectStore.createProject(projectData);
    }
    closeModal();
  } catch (err) {
    formError.value = err.message || 'Error al guardar el proyecto.';
  } finally {
    isFormSubmitting.value = false;
  }
};

const deleteProject = async (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
    await projectStore.deleteProject(id);
  }
};

onMounted(() => {
  projectStore.fetchProjects(); 
});
</script>
