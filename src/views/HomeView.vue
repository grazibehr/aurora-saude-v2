<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Plus,
  TrendingUp,
  Calendar,
  Activity,
  ArrowRight,
  Frown,
  Thermometer,
  Pill,
  Battery,
  Brain,
  Moon,
  Check,
  Zap
} from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth'
import { useSymptoms, SYMPTOM_TYPES, INTENSITY_LEVELS } from '../composables/useSymptoms'
import { BaseButton, BaseCard } from '../components/ui'

const router = useRouter()
const { user } = useAuth()
const { symptoms, stats, addSymptom, refreshSymptoms } = useSymptoms()

// Carrega sintomas do backend ao montar
onMounted(() => {
  refreshSymptoms()
})

// Estado para registro rápido
const selectedType = ref(null)
const selectedIntensity = ref(3)
const showIntensityPicker = ref(false)
const justRegistered = ref(null)

const iconMap = {
  Frown,
  Thermometer,
  Pill,
  Battery,
  Brain,
  Moon
}

const colorMap = {
  red: 'bg-red-100 text-red-600',
  orange: 'bg-orange-100 text-orange-600',
  yellow: 'bg-yellow-100 text-yellow-600',
  blue: 'bg-blue-100 text-blue-600',
  purple: 'bg-purple-100 text-purple-600',
  teal: 'bg-teal-100 text-teal-600',
  indigo: 'bg-indigo-100 text-indigo-600',
  gray: 'bg-gray-100 text-gray-600'
}

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
})

const firstName = computed(() => {
  return user.value?.name?.split(' ')[0] || 'Usuário'
})

const recentSymptoms = computed(() => {
  return symptoms.value.slice(0, 5)
})

const getSymptomType = (typeId) => {
  return SYMPTOM_TYPES.find(t => t.id === typeId) || {}
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short'
  })
}

const goToSymptoms = () => {
  router.push('/sintomas')
}

const goToHistory = () => {
  router.push('/historico')
}

const goToInsights = () => {
  router.push('/insights')
}

// Registro rápido
const handleQuickSelect = (type) => {
  selectedType.value = type.id
  showIntensityPicker.value = true
}

const handleQuickRegister = () => {
  if (!selectedType.value) return

  const now = new Date()
  const date = now.toISOString().split('T')[0]
  const time = now.toTimeString().slice(0, 5)

  try {
    addSymptom({
      type: selectedType.value,
      intensity: selectedIntensity.value,
      date,
      time,
      notes: ''
    })

    // Feedback visual
    justRegistered.value = selectedType.value
    setTimeout(() => {
      justRegistered.value = null
    }, 2000)

    // Reset
    showIntensityPicker.value = false
    selectedType.value = null
    selectedIntensity.value = 3
  } catch (error) {
    console.error('Erro ao registrar:', error)
  }
}

const cancelQuickRegister = () => {
  showIntensityPicker.value = false
  selectedType.value = null
  selectedIntensity.value = 3
}

const getIntensityColor = (value) => {
  const colors = {
    1: 'bg-green-500',
    2: 'bg-lime-500',
    3: 'bg-yellow-500',
    4: 'bg-orange-500',
    5: 'bg-red-500'
  }
  return colors[value] || 'bg-gray-500'
}
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Welcome section -->
    <BaseCard variant="gradient" class="!bg-gradient-to-r !from-teal-500 !to-cyan-500">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold mb-1 text-white">
            {{ greeting }}, {{ firstName }}!
          </h2>
          <p class="text-teal-100">
            Como você está se sentindo hoje?
          </p>
        </div>
        <BaseButton
          variant="secondary"
          size="lg"
          class="!bg-white !text-teal-700 hover:!bg-teal-50"
          @click="goToSymptoms"
        >
          <template #icon-left>
            <Plus class="w-5 h-5" />
          </template>
          Registrar Sintoma
        </BaseButton>
      </div>
    </BaseCard>

    <!-- Stats cards -->
    <section aria-label="Estatísticas">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BaseCard>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
              <Activity class="w-6 h-6 text-teal-600" aria-hidden="true" />
            </div>
            <div>
              <p class="text-sm text-gray-500">Total de registros</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
            </div>
          </div>
        </BaseCard>

        <BaseCard>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Calendar class="w-6 h-6 text-blue-600" aria-hidden="true" />
            </div>
            <div>
              <p class="text-sm text-gray-500">Hoje</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.todayCount }}</p>
            </div>
          </div>
        </BaseCard>

        <BaseCard>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <TrendingUp class="w-6 h-6 text-green-600" aria-hidden="true" />
            </div>
            <div>
              <p class="text-sm text-gray-500">Esta semana</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.weekCount }}</p>
            </div>
          </div>
        </BaseCard>

        <BaseCard>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <Activity class="w-6 h-6 text-orange-600" aria-hidden="true" />
            </div>
            <div>
              <p class="text-sm text-gray-500">Intensidade média</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.avgIntensity }}/5</p>
            </div>
          </div>
        </BaseCard>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Quick actions -->
      <BaseCard>
        <template #header>
          <div class="flex items-center gap-2">
            <Zap class="w-5 h-5 text-yellow-500" />
            <h3 class="text-lg font-semibold text-gray-900">
              Registro rápido
            </h3>
          </div>
        </template>

        <!-- Seletor de intensidade -->
        <div v-if="showIntensityPicker" class="mb-4 p-4 bg-teal-50 rounded-xl border-2 border-teal-200">
          <p class="text-sm font-medium text-gray-700 mb-3">
            Qual a intensidade do sintoma?
          </p>
          <div class="flex gap-2 mb-4">
            <button
              v-for="level in INTENSITY_LEVELS"
              :key="level.value"
              @click="selectedIntensity = level.value"
              :class="[
                'flex-1 py-3 rounded-lg text-sm font-medium transition-all',
                selectedIntensity === level.value
                  ? getIntensityColor(level.value) + ' text-white scale-105 shadow-lg'
                  : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-gray-300'
              ]"
            >
              {{ level.value }}
            </button>
          </div>
          <p class="text-xs text-gray-500 text-center mb-4">
            {{ INTENSITY_LEVELS.find(l => l.value === selectedIntensity)?.label }}
          </p>
          <div class="flex gap-2">
            <BaseButton
              variant="secondary"
              size="sm"
              class="flex-1"
              @click="cancelQuickRegister"
            >
              Cancelar
            </BaseButton>
            <BaseButton
              variant="primary"
              size="sm"
              class="flex-1"
              @click="handleQuickRegister"
            >
              <template #icon-left>
                <Check class="w-4 h-4" />
              </template>
              Registrar
            </BaseButton>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <button
            v-for="type in SYMPTOM_TYPES"
            :key="type.id"
            @click="handleQuickSelect(type)"
            :class="[
              'relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300',
              justRegistered === type.id
                ? 'border-green-400 bg-green-50 scale-95'
                : selectedType === type.id
                  ? 'border-teal-400 bg-teal-50'
                  : 'border-gray-100 hover:border-teal-300 hover:bg-teal-50',
              'focus:ring-2 focus:ring-teal-500 focus:ring-offset-2'
            ]"
          >
            <!-- Ícone de sucesso -->
            <div
              v-if="justRegistered === type.id"
              class="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <Check class="w-4 h-4 text-white" />
            </div>

            <div :class="[
              'w-12 h-12 rounded-xl flex items-center justify-center transition-transform',
              colorMap[type.color],
              justRegistered === type.id ? 'scale-110' : ''
            ]">
              <component :is="iconMap[type.icon]" class="w-6 h-6" aria-hidden="true" />
            </div>
            <span class="text-sm font-medium text-gray-700">{{ type.label }}</span>
          </button>
        </div>

        <p class="text-xs text-gray-400 text-center mt-4">
          Clique em um sintoma para registrar rapidamente
        </p>
      </BaseCard>

      <!-- Recent symptoms -->
      <BaseCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">
              Registros recentes
            </h3>
            <BaseButton
              v-if="recentSymptoms.length > 0"
              variant="link"
              size="sm"
              @click="goToHistory"
            >
              Ver todos
              <template #icon-right>
                <ArrowRight class="w-4 h-4" />
              </template>
            </BaseButton>
          </div>
        </template>

        <div v-if="recentSymptoms.length === 0" class="text-center py-8">
          <Activity class="w-12 h-12 text-gray-300 mx-auto mb-3" aria-hidden="true" />
          <p class="text-gray-500 mb-4">
            Nenhum sintoma registrado ainda
          </p>
          <BaseButton variant="primary" @click="goToSymptoms">
            <template #icon-left>
              <Plus class="w-5 h-5" />
            </template>
            Registrar primeiro sintoma
          </BaseButton>
        </div>

        <ul v-else class="space-y-3" role="list">
          <li
            v-for="symptom in recentSymptoms"
            :key="symptom.id"
            class="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
          >
            <div
              :class="[
                'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                colorMap[getSymptomType(symptom.type).color]
              ]"
            >
              <component
                :is="iconMap[getSymptomType(symptom.type).icon]"
                class="w-5 h-5"
                aria-hidden="true"
              />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-gray-900">
                {{ getSymptomType(symptom.type).label }}
              </p>
              <p class="text-sm text-gray-500 truncate">
                Intensidade: {{ symptom.intensity }}/5
                <span v-if="symptom.notes"> - {{ symptom.notes }}</span>
              </p>
            </div>
            <span class="text-sm text-gray-400 shrink-0">
              {{ formatDate(symptom.date) }}
            </span>
          </li>
        </ul>
      </BaseCard>
    </div>

    <!-- Tips section -->
    <BaseCard class="!bg-gradient-to-r !from-purple-50 !to-pink-50">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
          <TrendingUp class="w-6 h-6 text-purple-600" aria-hidden="true" />
        </div>
        <div>
          <h3 class="font-semibold text-gray-900 mb-1">
            Dica do dia
          </h3>
          <p class="text-gray-600">
            Registrar seus sintomas diariamente ajuda a identificar padrões e gatilhos.
            Quanto mais consistente for o registro, melhores serão os insights sobre sua saúde.
          </p>
          <BaseButton
            variant="link"
            class="mt-3 !p-0"
            @click="goToInsights"
          >
            Ver meus insights
            <template #icon-right>
              <ArrowRight class="w-4 h-4" />
            </template>
          </BaseButton>
        </div>
      </div>
    </BaseCard>
  </div>
</template>
