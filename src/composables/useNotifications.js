import { ref, computed, watch } from 'vue'
import { useSymptoms } from './useSymptoms'
import {
  generateId,
  sanitizeInput,
  safeLocalStorageGet,
  safeLocalStorageSet,
  validateNotificationsData
} from '../utils/security'

// Tipos de notificação
export const NOTIFICATION_TYPES = {
  REMINDER: 'reminder',
  INSIGHT: 'insight',
  ACHIEVEMENT: 'achievement',
  ALERT: 'alert',
  TIP: 'tip'
}

// Tipos válidos para validação
const VALID_NOTIFICATION_TYPES = new Set(Object.values(NOTIFICATION_TYPES))

// Configuração de ícones e cores por tipo
export const NOTIFICATION_CONFIG = {
  [NOTIFICATION_TYPES.REMINDER]: {
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200'
  },
  [NOTIFICATION_TYPES.INSIGHT]: {
    color: 'teal',
    bgColor: 'bg-teal-100',
    textColor: 'text-teal-600',
    borderColor: 'border-teal-200'
  },
  [NOTIFICATION_TYPES.ACHIEVEMENT]: {
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-600',
    borderColor: 'border-green-200'
  },
  [NOTIFICATION_TYPES.ALERT]: {
    color: 'amber',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-600',
    borderColor: 'border-amber-200'
  },
  [NOTIFICATION_TYPES.TIP]: {
    color: 'teal',
    bgColor: 'bg-teal-100',
    textColor: 'text-teal-600',
    borderColor: 'border-teal-200'
  }
}

// Estado global das notificações
const notifications = ref([])
const isLoaded = ref(false)

const STORAGE_KEY = 'aurora_notifications'

// Carregar notificações do localStorage com validação
const loadNotifications = () => {
  if (isLoaded.value) return

  notifications.value = safeLocalStorageGet(STORAGE_KEY, [], validateNotificationsData)
  isLoaded.value = true
}

// Salvar notificações no localStorage de forma segura
const saveNotifications = () => {
  // Manter apenas as últimas 50 notificações
  const toSave = notifications.value.slice(0, 50)
  safeLocalStorageSet(STORAGE_KEY, toSave)
}

export function useNotifications() {
  loadNotifications()

  // Computed para notificações não lidas
  const unreadCount = computed(() => {
    return notifications.value.filter(n => !n.read).length
  })

  // Computed para notificações ordenadas (mais recentes primeiro)
  const sortedNotifications = computed(() => {
    return [...notifications.value].sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
    )
  })

  // Adicionar nova notificação
  const addNotification = ({ type, title, message, action = null }) => {
    // Validação do tipo
    if (!VALID_NOTIFICATION_TYPES.has(type)) {
      console.warn('Tipo de notificação inválido:', type)
      return null
    }

    // Sanitiza título e mensagem
    const sanitizedTitle = sanitizeInput(title, 100)
    const sanitizedMessage = sanitizeInput(message, 500)

    if (!sanitizedTitle) {
      console.warn('Título de notificação vazio')
      return null
    }

    // Valida action se fornecida
    let validAction = null
    if (action && typeof action === 'object') {
      const label = sanitizeInput(action.label || '', 50)
      const route = typeof action.route === 'string' && action.route.startsWith('/')
        ? action.route
        : null

      if (label && route) {
        validAction = { label, route }
      }
    }

    const notification = {
      id: generateId(),
      type,
      title: sanitizedTitle,
      message: sanitizedMessage,
      action: validAction,
      read: false,
      createdAt: new Date().toISOString()
    }

    // Verificar se já existe uma notificação similar recente (últimos 5 minutos)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    const isDuplicate = notifications.value.some(n =>
      n.type === type &&
      n.title === sanitizedTitle &&
      n.createdAt > fiveMinutesAgo
    )

    if (!isDuplicate) {
      notifications.value.unshift(notification)
      saveNotifications()
    }

    return notification
  }

  // Marcar notificação como lida
  const markAsRead = (notificationId) => {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
      saveNotifications()
    }
  }

  // Marcar todas como lidas
  const markAllAsRead = () => {
    notifications.value.forEach(n => {
      n.read = true
    })
    saveNotifications()
  }

  // Remover notificação
  const removeNotification = (notificationId) => {
    const index = notifications.value.findIndex(n => n.id === notificationId)
    if (index !== -1) {
      notifications.value.splice(index, 1)
      saveNotifications()
    }
  }

  // Limpar todas as notificações
  const clearAll = () => {
    notifications.value = []
    saveNotifications()
  }

  // Formatar data relativa
  const formatRelativeTime = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now - date
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMinutes < 1) return 'Agora mesmo'
    if (diffMinutes < 60) return `${diffMinutes} min atrás`
    if (diffHours < 24) return `${diffHours}h atrás`
    if (diffDays === 1) return 'Ontem'
    if (diffDays < 7) return `${diffDays} dias atrás`

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    })
  }

  return {
    notifications: sortedNotifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    formatRelativeTime,
    NOTIFICATION_TYPES,
    NOTIFICATION_CONFIG
  }
}

// Composable para gerar notificações automáticas baseadas em sintomas
export function useAutoNotifications() {
  const { symptoms, stats } = useSymptoms()
  const { addNotification, NOTIFICATION_TYPES } = useNotifications()

  // Verificar e gerar notificações baseadas no estado atual
  const checkAndNotify = () => {
    const today = new Date().toISOString().split('T')[0]
    const lastCheck = localStorage.getItem('aurora_last_notification_check')

    // Evitar verificações muito frequentes (máximo 1 por hora)
    if (lastCheck) {
      const lastCheckDate = new Date(lastCheck)
      const hourAgo = new Date(Date.now() - 60 * 60 * 1000)
      if (lastCheckDate > hourAgo) return
    }

    localStorage.setItem('aurora_last_notification_check', new Date().toISOString())

    // 1. Lembrete de registro diário
    const todaySymptoms = symptoms.value.filter(s => s.date === today)
    if (todaySymptoms.length === 0) {
      const hour = new Date().getHours()
      if (hour >= 10 && hour <= 21) {
        addNotification({
          type: NOTIFICATION_TYPES.REMINDER,
          title: 'Lembrete diário',
          message: 'Você ainda não registrou nenhum sintoma hoje. Como está se sentindo?',
          action: { label: 'Registrar agora', route: '/sintomas' }
        })
      }
    }

    // 2. Conquista: primeiro registro
    if (symptoms.value.length === 1) {
      addNotification({
        type: NOTIFICATION_TYPES.ACHIEVEMENT,
        title: 'Primeiro passo!',
        message: 'Parabéns pelo seu primeiro registro! Continue acompanhando sua saúde.',
        action: { label: 'Ver histórico', route: '/historico' }
      })
    }

    // 3. Conquista: 7 dias de registro
    const uniqueDays = new Set(symptoms.value.map(s => s.date)).size
    if (uniqueDays === 7) {
      addNotification({
        type: NOTIFICATION_TYPES.ACHIEVEMENT,
        title: 'Uma semana de registros!',
        message: 'Você completou 7 dias registrando seus sintomas. Excelente dedicação!',
        action: { label: 'Ver insights', route: '/insights' }
      })
    }

    // 4. Alerta: intensidade alta frequente
    const recentSymptoms = symptoms.value.filter(s => {
      const date = new Date(s.date)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      return date >= weekAgo
    })

    const highIntensityCount = recentSymptoms.filter(s => s.intensity >= 4).length
    if (highIntensityCount >= 3) {
      addNotification({
        type: NOTIFICATION_TYPES.ALERT,
        title: 'Atenção à sua saúde',
        message: `Você registrou ${highIntensityCount} sintomas de alta intensidade esta semana. Considere consultar um profissional.`,
        action: { label: 'Ver detalhes', route: '/insights' }
      })
    }

    // 5. Insight: padrão identificado
    if (stats.value.typeStats && stats.value.typeStats.length > 0) {
      const mostCommon = stats.value.typeStats.reduce((prev, current) =>
        (prev.count > current.count) ? prev : current
      )

      if (mostCommon.count >= 5) {
        addNotification({
          type: NOTIFICATION_TYPES.INSIGHT,
          title: 'Padrão identificado',
          message: `"${mostCommon.label}" é o sintoma que você mais registra. Confira seus insights para mais detalhes.`,
          action: { label: 'Ver insights', route: '/insights' }
        })
      }
    }

    // 6. Dica periódica
    const tips = [
      'Beber água regularmente pode ajudar a reduzir dores de cabeça.',
      'Manter um horário regular de sono melhora a qualidade do descanso.',
      'Exercícios leves podem ajudar a reduzir a fadiga.',
      'Anote possíveis gatilhos dos seus sintomas nas observações.',
      'Compartilhe seus registros com seu médico nas consultas.'
    ]

    const lastTipDate = localStorage.getItem('aurora_last_tip_date')
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    if (!lastTipDate || lastTipDate < threeDaysAgo) {
      const randomTip = tips[Math.floor(Math.random() * tips.length)]
      addNotification({
        type: NOTIFICATION_TYPES.TIP,
        title: 'Dica de saúde',
        message: randomTip
      })
      localStorage.setItem('aurora_last_tip_date', today)
    }
  }

  // Observar mudanças nos sintomas para gerar notificações
  watch(symptoms, (newSymptoms, oldSymptoms) => {
    if (newSymptoms.length > (oldSymptoms?.length || 0)) {
      // Novo sintoma adicionado
      const latestSymptom = newSymptoms[0]

      // Notificação se intensidade alta
      if (latestSymptom.intensity >= 4) {
        addNotification({
          type: NOTIFICATION_TYPES.ALERT,
          title: 'Sintoma de alta intensidade',
          message: 'Você registrou um sintoma com intensidade alta. Lembre-se de monitorar como se sente.',
          action: { label: 'Ver histórico', route: '/historico' }
        })
      }
    }
  }, { deep: true })

  return {
    checkAndNotify
  }
}
