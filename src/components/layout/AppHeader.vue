<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Menu, Bell } from 'lucide-vue-next'
import { BaseIconButton } from '../ui'
import NotificationPanel from '../NotificationPanel.vue'
import { useNotifications, useAutoNotifications } from '../../composables/useNotifications'

const emit = defineEmits(['toggle-sidebar'])

const route = useRoute()
const { unreadCount } = useNotifications()
const { checkAndNotify } = useAutoNotifications()

const showNotifications = ref(false)

const pageTitle = computed(() => {
  const titles = {
    '/': 'Início',
    '/sintomas': 'Registrar Sintoma',
    '/historico': 'Histórico',
    '/insights': 'Insights',
    '/configuracoes': 'Configurações'
  }
  return titles[route.path] || 'Aurora Saúde'
})

const today = computed(() => {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

// Verificar notificações automáticas ao montar
onMounted(() => {
  // Pequeno delay para não bloquear a renderização inicial
  setTimeout(() => {
    checkAndNotify()
  }, 1000)
})
</script>

<template>
  <header class="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm shadow-gray-100/50">
    <div class="flex items-center justify-between h-16 px-4 sm:px-6">
      <div class="flex items-center gap-4">
        <BaseIconButton
          variant="ghost"
          size="md"
          label="Abrir menu"
          class="lg:hidden -ml-2"
          @click="$emit('toggle-sidebar')"
        >
          <Menu class="w-5 h-5 text-gray-600" />
        </BaseIconButton>

        <div>
          <h1 class="text-lg font-semibold text-gray-900">
            {{ pageTitle }}
          </h1>
          <p class="hidden sm:block text-sm text-gray-500 capitalize">
            {{ today }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <div class="relative">
          <BaseIconButton
            variant="ghost"
            size="md"
            label="Notificações"
            :class="{ '!bg-teal-100': showNotifications }"
            @click="toggleNotifications"
          >
            <Bell :class="['w-5 h-5', showNotifications ? 'text-teal-600' : 'text-gray-600']" />
          </BaseIconButton>

          <!-- Badge de contagem -->
          <span
            v-if="unreadCount > 0"
            class="absolute -top-1 -right-1 min-w-5 h-5 px-1.5 flex items-center justify-center text-xs font-bold bg-teal-600 text-white rounded-full pointer-events-none"
          >
            {{ unreadCount > 9 ? '9+' : unreadCount }}
          </span>

          <!-- Painel de notificações -->
          <NotificationPanel
            :is-open="showNotifications"
            @close="showNotifications = false"
          />
        </div>
      </div>
    </div>
  </header>
</template>
