<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Bell,
  BellOff,
  X,
  Check,
  CheckCheck,
  Trash2,
  Clock,
  Lightbulb,
  AlertTriangle,
  Award,
  TrendingUp
} from 'lucide-vue-next'
import { useNotifications, NOTIFICATION_TYPES, NOTIFICATION_CONFIG } from '../composables/useNotifications'
import { BaseButton, BaseIconButton } from './ui'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const router = useRouter()
const {
  notifications,
  unreadCount,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAll,
  formatRelativeTime
} = useNotifications()

const panelRef = ref(null)

// Ícone por tipo de notificação
const getIcon = (type) => {
  const icons = {
    [NOTIFICATION_TYPES.REMINDER]: Clock,
    [NOTIFICATION_TYPES.INSIGHT]: TrendingUp,
    [NOTIFICATION_TYPES.ACHIEVEMENT]: Award,
    [NOTIFICATION_TYPES.ALERT]: AlertTriangle,
    [NOTIFICATION_TYPES.TIP]: Lightbulb
  }
  return icons[type] || Bell
}

// Configuração de estilo por tipo
const getConfig = (type) => {
  return NOTIFICATION_CONFIG[type] || NOTIFICATION_CONFIG[NOTIFICATION_TYPES.TIP]
}

// Ação da notificação
const handleAction = (notification) => {
  markAsRead(notification.id)
  if (notification.action?.route) {
    router.push(notification.action.route)
    emit('close')
  }
}

// Clicar na notificação
const handleNotificationClick = (notification) => {
  if (!notification.read) {
    markAsRead(notification.id)
  }
}

// Fechar ao clicar fora
const handleClickOutside = (event) => {
  if (panelRef.value && !panelRef.value.contains(event.target)) {
    emit('close')
  }
}

// Fechar com ESC
const handleEscape = (event) => {
  if (event.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <Transition name="notification-panel">
    <div
      v-if="isOpen"
      ref="panelRef"
      class="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
      role="dialog"
      aria-label="Painel de notificações"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div class="flex items-center gap-2">
          <Bell class="w-5 h-5 text-teal-600" aria-hidden="true" />
          <h2 class="font-semibold text-gray-900">Notificações</h2>
          <span
            v-if="unreadCount > 0"
            class="px-2 py-0.5 text-xs font-medium bg-teal-100 text-teal-700 rounded-full"
          >
            {{ unreadCount }} nova{{ unreadCount > 1 ? 's' : '' }}
          </span>
        </div>

        <div class="flex items-center gap-1">
          <BaseIconButton
            v-if="unreadCount > 0"
            variant="ghost"
            size="sm"
            label="Marcar todas como lidas"
            @click="markAllAsRead"
          >
            <CheckCheck class="w-4 h-4 text-gray-500" />
          </BaseIconButton>

          <BaseIconButton
            variant="ghost"
            size="sm"
            label="Fechar"
            @click="$emit('close')"
          >
            <X class="w-4 h-4 text-gray-500" />
          </BaseIconButton>
        </div>
      </div>

      <!-- Notification list -->
      <div class="max-h-96 overflow-y-auto">
        <!-- Empty state -->
        <div
          v-if="notifications.length === 0"
          class="py-12 px-4 text-center"
        >
          <BellOff class="w-12 h-12 text-gray-300 mx-auto mb-3" aria-hidden="true" />
          <p class="text-gray-500 font-medium">Nenhuma notificação</p>
          <p class="text-sm text-gray-400 mt-1">
            Suas notificações aparecerão aqui
          </p>
        </div>

        <!-- Notifications -->
        <ul v-else class="divide-y divide-gray-100" role="list">
          <li
            v-for="notification in notifications"
            :key="notification.id"
            :class="[
              'relative p-4 transition-colors',
              notification.read ? 'bg-white' : 'bg-teal-50'
            ]"
          >
            <div class="flex gap-3">
              <!-- Icon -->
              <div
                :class="[
                  'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                  getConfig(notification.type).bgColor
                ]"
              >
                <component
                  :is="getIcon(notification.type)"
                  :class="['w-5 h-5', getConfig(notification.type).textColor]"
                  aria-hidden="true"
                />
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <button
                    class="text-left flex-1"
                    @click="handleNotificationClick(notification)"
                  >
                    <p
                      :class="[
                        'font-medium text-sm',
                        notification.read ? 'text-gray-700' : 'text-gray-900'
                      ]"
                    >
                      {{ notification.title }}
                    </p>
                    <p class="text-sm text-gray-500 mt-0.5 line-clamp-2">
                      {{ notification.message }}
                    </p>
                  </button>

                  <BaseIconButton
                    variant="ghost"
                    size="sm"
                    label="Remover notificação"
                    class="shrink-0 opacity-0 group-hover:opacity-100 hover:!opacity-100"
                    @click="removeNotification(notification.id)"
                  >
                    <X class="w-3.5 h-3.5 text-gray-400" />
                  </BaseIconButton>
                </div>

                <!-- Footer -->
                <div class="flex items-center justify-between mt-2">
                  <span class="text-xs text-gray-400">
                    {{ formatRelativeTime(notification.createdAt) }}
                  </span>

                  <BaseButton
                    v-if="notification.action"
                    variant="link"
                    size="xs"
                    class="!p-0 !h-auto"
                    @click="handleAction(notification)"
                  >
                    {{ notification.action.label }}
                  </BaseButton>
                </div>
              </div>

              <!-- Unread indicator -->
              <div
                v-if="!notification.read"
                class="absolute left-1.5 top-1/2 -translate-y-1/2 w-2 h-2 bg-teal-500 rounded-full"
                aria-label="Não lida"
              />
            </div>
          </li>
        </ul>
      </div>

      <!-- Footer -->
      <div
        v-if="notifications.length > 0"
        class="px-4 py-3 bg-gray-50 border-t border-gray-200"
      >
        <BaseButton
          variant="ghost"
          size="sm"
          full-width
          class="!text-red-600 hover:!bg-red-50"
          @click="clearAll"
        >
          <template #icon-left>
            <Trash2 class="w-4 h-4" />
          </template>
          Limpar todas
        </BaseButton>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.notification-panel-enter-active,
.notification-panel-leave-active {
  transition: all 0.2s ease;
}

.notification-panel-enter-from,
.notification-panel-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

li:hover .opacity-0 {
  opacity: 1;
}
</style>
