<template>
  <div class="overflow-x-auto bg-white shadow-md rounded-lg">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            v-for="header in headers"
            :key="header.key"
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ header.label }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-if="data.length === 0">
          <td :colspan="headers.length" class="px-6 py-4 whitespace-nowrap text-center text-gray-500">
            No hay datos disponibles.
          </td>
        </tr>
        <tr v-for="(item, index) in data" :key="item.id || index">
          <td
            v-for="header in headers"
            :key="header.key"
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
          >
            <slot :name="`cell-${header.key}`" :item="item">
              {{ item[header.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  headers: {
    type: Array,
    required: true,
    validator: (value) => value.every(h => h.key && h.label),
  },
  data: {
    type: Array,
    required: true,
  },
});
</script>