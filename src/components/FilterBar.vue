<template>
  <div class="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap gap-4 items-end">
    <div v-for="filter in filters" :key="filter.key" class="flex-grow min-w-[150px] max-w-[250px]">
      <label :for="filter.key" class="block text-sm font-medium text-gray-700 mb-1">
        {{ filter.label }}
      </label>
      <input
        v-if="filter.type === 'text'"
        :id="filter.key"
        v-model="localFilters[filter.key]"
        type="text"
        :placeholder="filter.placeholder"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        @input="emitFilters"
      />
      <select
        v-else-if="filter.type === 'select'"
        :id="filter.key"
        v-model="localFilters[filter.key]"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        @change="emitFilters"
      >
        <option value="">{{ filter.placeholder || 'Seleccionar...' }}</option>
        <option v-for="option in filter.options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
    <button
      @click="resetFilters"
      class="ml-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
    >
      Limpiar Filtros
    </button>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';

const props = defineProps({
  filters: {
    type: Array,
    required: true,
    validator: (value) => value.every(f => f.key && f.label && f.type),
  },
});

const emit = defineEmits(['update:modelValue', 'apply-filters']);

const initialFilterState = props.filters.reduce((acc, filter) => {
  acc[filter.key] = ''; // Default empty string for all filter types
  return acc;
}, {});

const localFilters = ref({ ...initialFilterState });

const emitFilters = () => {
  emit('update:modelValue', localFilters.value);
  emit('apply-filters', localFilters.value);
};

const resetFilters = () => {
  localFilters.value = { ...initialFilterState };
  emitFilters();
};

watch(() => props.filters, (newFilters) => {
  const newInitialState = newFilters.reduce((acc, filter) => {
    acc[filter.key] = '';
    return acc;
  }, {});
  localFilters.value = { ...newInitialState };
}, { deep: true });
</script>