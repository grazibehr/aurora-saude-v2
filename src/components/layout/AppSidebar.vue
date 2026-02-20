<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Home,
  ClipboardList,
  History,
  BarChart3,
  Settings,
  LogOut,
  X,
  Sparkles,
  HeartPulse,
  Heart
} from 'lucide-vue-next'
import { useAuth } from '../../composables/useAuth'
import { BaseButton, BaseIconButton } from '../ui'

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const route = useRoute()
const { user, logout } = useAuth()

const navigationItems = [
  { name: 'Início', path: '/', icon: Home },
  { name: 'Registrar Sintoma', path: '/sintomas', icon: ClipboardList },
  { name: 'Ficha Médica', path: '/ficha-medica', icon: HeartPulse },
  { name: 'Bem-estar', path: '/bem-estar', icon: Heart },
  { name: 'Histórico', path: '/historico', icon: History },
  { name: 'Insights', path: '/insights', icon: BarChart3 }
]

const settingsItems = [
  { name: 'Configurações', path: '/configuracoes', icon: Settings }
]

const isActive = (path) => {
  return route.path === path
}

const handleNavClick = () => {
  emit('close')
}

const handleLogout = () => {
  logout()
}
</script>

<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-30 w-64',
      'bg-white/95 backdrop-blur-xl border-r border-gray-200/50',
      'transform transition-all duration-500 ease-out',
      'lg:translate-x-0 shadow-xl shadow-gray-200/20',
      isOpen ? 'translate-x-0' : '-translate-x-full'
    ]"
    :aria-hidden="!isOpen"
    role="navigation"
    aria-label="Menu principal"
  >
    <div class="flex flex-col h-full">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
            <Sparkles class="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <h1 class="font-semibold text-gray-900">Aurora Saúde</h1>
            <p class="text-xs text-gray-500">Monitoramento</p>
          </div>
        </div>
        <BaseIconButton
          variant="ghost"
          size="md"
          label="Fechar menu"
          class="lg:hidden"
          @click="$emit('close')"
        >
          <X class="w-5 h-5 text-gray-500" />
        </BaseIconButton>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
        <p class="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Menu
        </p>

        <router-link
          v-for="item in navigationItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
            'focus:ring-2 focus:ring-teal-500 focus:ring-offset-2',
            isActive(item.path)
              ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md shadow-teal-500/25 font-medium'
              : 'text-gray-600 hover:bg-teal-50 hover:text-teal-700 hover:translate-x-1'
          ]"
          :aria-current="isActive(item.path) ? 'page' : undefined"
          @click="handleNavClick"
        >
          <component
            :is="item.icon"
            :class="[
              'w-5 h-5 transition-colors duration-200',
              isActive(item.path) ? 'text-white' : 'text-gray-400'
            ]"
            aria-hidden="true"
          />
          <span>{{ item.name }}</span>
        </router-link>

        <hr class="my-4 border-gray-200/50" />

        <p class="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Configurações
        </p>

        <router-link
          v-for="item in settingsItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
            'focus:ring-2 focus:ring-teal-500 focus:ring-offset-2',
            isActive(item.path)
              ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md shadow-teal-500/25 font-medium'
              : 'text-gray-600 hover:bg-teal-50 hover:text-teal-700 hover:translate-x-1'
          ]"
          :aria-current="isActive(item.path) ? 'page' : undefined"
          @click="handleNavClick"
        >
          <component
            :is="item.icon"
            :class="[
              'w-5 h-5 transition-colors duration-200',
              isActive(item.path) ? 'text-white' : 'text-gray-400'
            ]"
            aria-hidden="true"
          />
          <span>{{ item.name }}</span>
        </router-link>
      </nav>

      <!-- User section -->
      <div class="p-4 border-t border-gray-200">
        <div class="flex items-center gap-3 mb-3">
          <!-- Avatar com foto ou inicial -->
          <div
            v-if="user?.avatar"
            class="w-10 h-10 rounded-full overflow-hidden ring-2 ring-teal-100"
          >
            <img
              :src="user.avatar"
              alt="Foto de perfil"
              class="w-full h-full object-cover"
            />
          </div>
          <div
            v-else
            class="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center"
          >
            <span class="text-sm font-medium text-teal-700">
              {{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ user?.name || 'Usuário' }}
            </p>
            <p class="text-xs text-gray-500 truncate">
              {{ user?.email || '' }}
            </p>
          </div>
        </div>

        <BaseButton
          variant="ghost"
          full-width
          class="!justify-start !text-red-600 hover:!bg-red-50"
          @click="handleLogout"
        >
          <template #icon-left>
            <LogOut class="w-5 h-5" />
          </template>
          Sair
        </BaseButton>
      </div>
    </div>
  </aside>
</template>
