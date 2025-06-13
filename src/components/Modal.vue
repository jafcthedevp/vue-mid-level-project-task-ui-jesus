<template>
  <transition name="modal-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      @click.self="closeModal"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out"
        :class="{ 'scale-95 opacity-0': !isOpen }"
      >
        <div class="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-900">{{ title }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <XIcon class="h-6 w-6" />
          </button>
        </div>
        <div class="p-6">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { XIcon } from 'lucide-vue-next';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: 'Modal',
  },
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>