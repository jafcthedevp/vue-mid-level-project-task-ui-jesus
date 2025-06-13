<template>
  <form @submit.prevent="submitForm" class="space-y-4">
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700">Nombre del Proyecto</label>
      <input
        type="text"
        id="name"
        v-model="v$.project.name.$model"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
      />
      <span v-if="v$.project.name.$error" class="text-red-500 text-xs mt-1">
        {{ v$.project.name.$errors[0].$message }}
      </span>
    </div>

    <div>
      <label for="description" class="block text-sm font-medium text-gray-700">Descripción</label>
      <textarea
        id="description"
        v-model="v$.project.description.$model"
        rows="3"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
      ></textarea>
      <span v-if="v$.project.description.$error" class="text-red-500 text-xs mt-1">
        {{ v$.project.description.$errors[0].$message }}
      </span>
    </div>

    <div>
      <label for="isActive" class="block text-sm font-medium text-gray-700">Estado</label>
      <select
        id="isActive"
        v-model="v$.project.isActive.$model"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
      >
        <option :value="true">Activo</option>
        <option :value="false">Inactivo</option>
      </select>
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
        {{ isSubmitting ? 'Guardando...' : (project.id ? 'Actualizar' : 'Crear') }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, watch, defineProps, defineEmits } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength } from '@vuelidate/validators';

const props = defineProps({
  initialProject: {
    type: Object,
    default: () => ({
      name: '',
      description: '',
      isActive: true,
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

const project = reactive({ ...props.initialProject });

// Watch for changes in initialProject to update the form when editing
watch(() => props.initialProject, (newVal) => {
  Object.assign(project, newVal);
}, { deep: true });

const rules = {
  project: {
    name: {
      required,
      minLength: minLength(3),
      maxLength: maxLength(100),
      $message: 'El nombre es requerido y debe tener entre 3 y 100 caracteres.',
    },
    description: {
      required,
      minLength: minLength(10),
      maxLength: maxLength(500),
      $message: 'La descripción es requerida y debe tener entre 10 y 500 caracteres.',
    },
    isActive: { required },
  },
};

const v$ = useVuelidate(rules, { project });

const submitForm = async () => {
  const isValid = await v$.value.$validate();
  if (isValid) {
    emit('submit', { ...project });
  } else {
    console.log('Formulario inválido', v$.value.$errors);
  }
};
</script>