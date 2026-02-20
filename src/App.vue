<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from './components/layout/AppLayout.vue'

const route = useRoute()

const showLayout = computed(() => {
  return route.name !== 'Login'
})
</script>

<template>
  <a href="#main-content" class="skip-link">
    Pular para o conteúdo principal
  </a>

  <AppLayout v-if="showLayout">
    <router-view />
  </AppLayout>

  <router-view v-else />
</template>
