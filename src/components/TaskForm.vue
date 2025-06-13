<template>
  <form @submit.prevent="submitForm" class="space-y-4">
    <div>
      <label for="title" class="block text-sm font-medium text-gray-700">Título de la Tarea</label>
      <input
        type="text"
        id="title"
        v-model="v$.task.title.$model"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
      />
      <span v-if="v$.task.title.$error" class="text-red-500 text-xs mt-1">
        {{ v$.task.title.$errors[0].$message }}
      </span>
    </div>

    <div>
      <label for="description" class="block text-sm font-medium text-gray-700">Descripción</label>
      <textarea
        id="description"
        v-model="v$.task.description.$model"
        rows="3"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
      ></textarea>
      <span v-if="v$.task.description.$error" class="text-red-500 text-xs mt-1">
        {{ v$.task.description.$errors[0].$message }}
      </span>
    </div>

    <div>
      <label for="status" class="block text-sm font-medium text-gray-700">Estado</label>
      <select
        id="status"
        v-model="v$.task.status.$model"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
      >
        <option value="pending">Pendiente</option>
        <option value="in-progress">En Progreso</option>
        <option value="done">Hecho</option>
      </select>
      <span v-if="v$.task.status.$error" class="text-red-500 text-xs mt-1">
        {{ v$.task.status.$errors[0].$message }}
      </span>
    </div>

    <div>
      <label for="priority" class="block text-sm font-medium text-gray-700">Prioridad</label>
      <select
        id="priority"
        v-model="v$.task.priority.$model"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
      >
        <option value="low">Baja</option>
        <option value="medium">Media</option>
        <option value="high">Alta</option>
      </select>
      <span v-if="v$.task.priority.$error" class="text-red-500 text-xs mt-1">
        {{ v$.task.priority.$errors[0].$message }}
      </span>
    </div>

    <div v-if="formError" class="text-red-600 text-sm text-center">{{ formError }}</div>

    <div class="flex justify-end space-x-3">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Cancelar
      </button>
      <button
        type="submit"
        :disabled="isSubmitting"
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isSubmitting ? 'Guardando...' : (task.id ? 'Actualizar' : 'Crear') }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, watch, defineProps, defineEmits } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength } from '@vuelidate/validators';

const props = defineProps({
  initialTask: {
    type: Object,
    default: () => ({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      projectId: null, // This should be set by the parent component
    }),
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
  formError: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(['submit', 'cancel']);

const task = reactive({ ...props.initialTask });

// Watch for changes in initialTask to update the form when editing
watch(() => props.initialTask, (newVal) => {
  Object.assign(task, newVal);
}, { deep: true });

const rules = {
  task: {
    title: {
      required,
      minLength: minLength(3),
      maxLength: maxLength(100),
      $message: 'El título es requerido y debe tener entre 3 y 100 caracteres.',
    },
    description: {
      required,
      minLength: minLength(10),
      maxLength: maxLength(500),
      $message: 'La descripción es requerida y debe tener entre 10 y 500 caracteres.',
    },
    status: { required, $message: 'El estado es requerido.' },
    priority: { required, $message: 'La prioridad es requerida.' },
  },
};

const v$ = useVuelidate(rules, { task });

const submitForm = async () => {
  const isValid = await v$.value.$validate();
  if (isValid) {
    emit('submit', { ...task });
  } else {
    console.log('Formulario inválido', v$.value.$errors);
  }
};
</script>