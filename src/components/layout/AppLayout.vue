<script setup>
import { ref } from 'vue'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'

const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Overlay para mobile -->
    <Transition name="fade">
      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 z-20 bg-black/50 lg:hidden"
        @click="closeSidebar"
        aria-hidden="true"
      />
    </Transition>

    <!-- Sidebar -->
    <AppSidebar
      :is-open="isSidebarOpen"
      @close="closeSidebar"
    />

    <!-- Main content -->
    <div class="lg:pl-64 flex flex-col min-h-screen">
      <AppHeader @toggle-sidebar="toggleSidebar" />

      <main
        id="main-content"
        class="flex-1 p-4 sm:p-6 lg:p-8"
        tabindex="-1"
      >
        <slot />
      </main>

      <footer class="py-4 px-6 text-center text-sm text-gray-500 border-t border-gray-200">
        <p>
          Aurora Saúde &copy; {{ new Date().getFullYear() }} - Monitoramento de Saúde
        </p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
