<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-sm p-4">
      <div class="container mx-auto flex justify-between items-center">
        <router-link to="/" class="text-2xl font-bold text-gray-800">
          Gestor de Proyectos
        </router-link>
        <div class="space-x-4">
          <router-link
            to="/"
            class="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-200"
            active-class="text-indigo-600 border-b-2 border-indigo-600 pb-1"
          >
            Proyectos
          </router-link>
          <router-link
            to="/tasks"
            class="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-200"
            active-class="text-indigo-600 border-b-2 border-indigo-600 pb-1"
          >
            Todas las Tareas
          </router-link>
        </div>
      </div>
    </nav>
    <main class="py-8">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
// No script needed for App.vue beyond setup
</script>

<style>
/* Transiciones de ruta */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
