<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Check,
  ArrowLeft,
  Frown,
  Thermometer,
  Pill,
  Battery,
  Brain,
  Moon,
  Plus
} from 'lucide-vue-next'
import { useSymptoms, SYMPTOM_TYPES, INTENSITY_LEVELS } from '../composables/useSymptoms'
import { useNotifications } from '../composables/useNotifications'
import { BaseButton, BaseInput, BaseTextarea, BaseCard, BaseAlert } from '../components/ui'

const router = useRouter()
const { addSymptom } = useSymptoms()
const { addNotification, NOTIFICATION_TYPES } = useNotifications()

const selectedType = ref('')
const customLabel = ref('')
const intensity = ref(3)
const notes = ref('')
const date = ref(new Date().toISOString().split('T')[0])
const time = ref(new Date().toTimeString().slice(0, 5))
const error = ref('')
const success = ref(false)
const isSubmitting = ref(false)

const iconMap = {
  Frown,
  Thermometer,
  Pill,
  Battery,
  Brain,
  Moon,
  Plus
}

const colorMap = {
  red: 'bg-red-100 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300',
  orange: 'bg-orange-100 text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300',
  yellow: 'bg-yellow-100 text-yellow-600 border-yellow-200 hover:bg-yellow-50 hover:border-yellow-300',
  blue: 'bg-blue-100 text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300',
  purple: 'bg-purple-100 text-purple-600 border-purple-200 hover:bg-purple-50 hover:border-purple-300',
  teal: 'bg-teal-100 text-teal-600 border-teal-200 hover:bg-teal-50 hover:border-teal-300',
  indigo: 'bg-indigo-100 text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300',
  gray: 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
}

const selectedColorMap = {
  red: 'ring-2 ring-red-500 ring-offset-2 bg-red-100 border-red-500',
  orange: 'ring-2 ring-orange-500 ring-offset-2 bg-orange-100 border-orange-500',
  yellow: 'ring-2 ring-yellow-500 ring-offset-2 bg-yellow-100 border-yellow-500',
  blue: 'ring-2 ring-blue-500 ring-offset-2 bg-blue-100 border-blue-500',
  purple: 'ring-2 ring-purple-500 ring-offset-2 bg-purple-100 border-purple-500',
  teal: 'ring-2 ring-teal-500 ring-offset-2 bg-teal-100 border-teal-500',
  indigo: 'ring-2 ring-indigo-500 ring-offset-2 bg-indigo-100 border-indigo-500',
  gray: 'ring-2 ring-gray-500 ring-offset-2 bg-gray-100 border-gray-500'
}

const intensityColorMap = {
  green: 'bg-green-500 hover:bg-green-600',
  lime: 'bg-lime-500 hover:bg-lime-600',
  yellow: 'bg-yellow-500 hover:bg-yellow-600',
  orange: 'bg-orange-500 hover:bg-orange-600',
  red: 'bg-red-500 hover:bg-red-600'
}

const isFormValid = computed(() => {
  const baseValid = selectedType.value && date.value && time.value
  // Se for "outro", precisa ter customLabel preenchido
  if (selectedType.value === 'outro') {
    return baseValid && customLabel.value.trim().length >= 2
  }
  return baseValid
})

const currentIntensity = computed(() => {
  return INTENSITY_LEVELS.find(l => l.value === intensity.value) || INTENSITY_LEVELS[2]
})

const selectType = (typeId) => {
  selectedType.value = typeId
  // Limpa customLabel se mudar de tipo
  if (typeId !== 'outro') {
    customLabel.value = ''
  }
  error.value = ''
}

const handleSubmit = async () => {
  if (!isFormValid.value) return

  error.value = ''
  isSubmitting.value = true

  try {
    const symptomType = SYMPTOM_TYPES.find(t => t.id === selectedType.value)
    const displayLabel = selectedType.value === 'outro' ? customLabel.value : symptomType?.label

    await addSymptom({
      type: selectedType.value,
      customLabel: selectedType.value === 'outro' ? customLabel.value : null,
      intensity: intensity.value,
      notes: notes.value,
      date: date.value,
      time: time.value
    })

    // Adicionar notificação de sucesso
    addNotification({
      type: NOTIFICATION_TYPES.ACHIEVEMENT,
      title: 'Sintoma registrado!',
      message: `${displayLabel || 'Sintoma'} com intensidade ${intensity.value}/5 foi salvo com sucesso.`,
      action: { label: 'Ver histórico', route: '/historico' }
    })

    success.value = true

    setTimeout(() => {
      selectedType.value = ''
      customLabel.value = ''
      intensity.value = 3
      notes.value = ''
      date.value = new Date().toISOString().split('T')[0]
      time.value = new Date().toTimeString().slice(0, 5)
      success.value = false
    }, 2000)
  } catch (err) {
    error.value = err.message || 'Erro ao registrar sintoma'
  } finally {
    isSubmitting.value = false
  }
}

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="max-w-2xl mx-auto animate-fade-in">
    <div class="mb-6">
      <BaseButton variant="ghost" @click="goBack">
        <template #icon-left>
          <ArrowLeft class="w-5 h-5" />
        </template>
        Voltar
      </BaseButton>
    </div>

    <!-- Success message -->
    <Transition name="slide">
      <BaseAlert
        v-if="success"
        variant="success"
        title="Sintoma registrado com sucesso!"
        class="mb-6"
      >
        Seu registro foi salvo.
      </BaseAlert>
    </Transition>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Error message -->
      <BaseAlert
        v-if="error"
        variant="error"
        dismissible
        @dismiss="error = ''"
      >
        {{ error }}
      </BaseAlert>

      <!-- Symptom type selection -->
      <BaseCard>
        <template #header>
          <h2 class="text-lg font-semibold text-gray-900">
            Qual sintoma você está sentindo?
          </h2>
        </template>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3" role="radiogroup">
          <button
            v-for="type in SYMPTOM_TYPES"
            :key="type.id"
            type="button"
            @click="selectType(type.id)"
            :class="[
              'flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200',
              'focus:outline-none',
              selectedType === type.id
                ? selectedColorMap[type.color]
                : `border-gray-100 ${colorMap[type.color]}`
            ]"
            :aria-pressed="selectedType === type.id"
            role="radio"
            :aria-checked="selectedType === type.id"
          >
            <div
              :class="[
                'w-14 h-14 rounded-xl flex items-center justify-center transition-transform',
                selectedType === type.id ? 'scale-110' : '',
                colorMap[type.color].split(' ').slice(0, 2).join(' ')
              ]"
            >
              <component :is="iconMap[type.icon]" class="w-7 h-7" aria-hidden="true" />
            </div>
            <span class="font-medium text-gray-900">{{ type.label }}</span>
          </button>
        </div>

        <!-- Campo para descrever o sintoma quando "Outro" é selecionado -->
        <Transition name="slide">
          <div v-if="selectedType === 'outro'" class="mt-4">
            <BaseInput
              v-model="customLabel"
              label="Descreva o sintoma"
              placeholder="Ex: Tontura, Coceira, Falta de ar..."
              required
              :minlength="2"
              :maxlength="100"
              :error="customLabel.length > 0 && customLabel.length < 2 ? 'Mínimo 2 caracteres' : ''"
            />
          </div>
        </Transition>
      </BaseCard>

      <!-- Intensity selection -->
      <BaseCard>
        <template #header>
          <h2 class="text-lg font-semibold text-gray-900">
            Qual a intensidade?
          </h2>
        </template>

        <div class="space-y-6">
          <div class="flex items-center justify-between text-sm text-gray-500">
            <span>Muito leve</span>
            <span>Muito intenso</span>
          </div>

          <input
            id="intensity"
            v-model.number="intensity"
            type="range"
            min="1"
            max="5"
            step="1"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            :aria-valuetext="currentIntensity.label"
          />

          <div class="flex justify-between gap-2">
            <button
              v-for="level in INTENSITY_LEVELS"
              :key="level.value"
              type="button"
              @click="intensity = level.value"
              :class="[
                'flex-1 h-12 rounded-xl font-medium transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500',
                intensity === level.value
                  ? `${intensityColorMap[level.color]} text-white scale-105 shadow-lg`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
              :aria-label="`Intensidade ${level.value}: ${level.label}`"
              :aria-pressed="intensity === level.value"
            >
              {{ level.value }}
            </button>
          </div>

          <p class="text-center">
            <span class="text-lg font-semibold text-gray-900">{{ currentIntensity.label }}</span>
            <span class="text-gray-500 ml-2">({{ intensity }}/5)</span>
          </p>
        </div>
      </BaseCard>

      <!-- Date and time -->
      <BaseCard>
        <template #header>
          <h2 class="text-lg font-semibold text-gray-900">
            Quando ocorreu?
          </h2>
        </template>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BaseInput
            v-model="date"
            type="date"
            label="Data"
            required
            :max="new Date().toISOString().split('T')[0]"
          />

          <BaseInput
            v-model="time"
            type="time"
            label="Horário"
            required
          />
        </div>
      </BaseCard>

      <!-- Notes -->
      <BaseCard>
        <BaseTextarea
          v-model="notes"
          label="Observações (opcional)"
          placeholder="Descreva detalhes adicionais, possíveis causas, medicamentos tomados..."
          :maxlength="500"
          :rows="4"
          show-count
        />
      </BaseCard>

      <!-- Submit buttons -->
      <div class="flex gap-3">
        <BaseButton
          variant="secondary"
          size="lg"
          full-width
          @click="goBack"
        >
          Cancelar
        </BaseButton>

        <BaseButton
          type="submit"
          variant="primary"
          size="lg"
          full-width
          :disabled="!isFormValid"
          :loading="isSubmitting"
        >
          <template #icon-left>
            <Check class="w-5 h-5" />
          </template>
          Registrar Sintoma
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

input[type="range"]::-webkit-slider-thumb {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  background-color: rgb(20 184 166);
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
  margin-top: -8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

input[type="range"]::-moz-range-thumb {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  background-color: rgb(20 184 166);
  cursor: pointer;
  border: 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
</style>
