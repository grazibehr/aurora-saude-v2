<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Calendar,
  HeartPulse,
  Phone,
  ChevronRight,
  ChevronLeft,
  Check,
  Search,
  X,
  Sparkles,
  UserPlus,
  User
} from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth'
import { useMedicalRecord } from '../composables/useMedicalRecord'
import { DISEASES, DISEASE_CATEGORIES, searchDiseases } from '../data/diseases'
import { BaseButton, BaseCard, BaseInput } from '../components/ui'

const router = useRouter()
const { user, updateUserProfile } = useAuth()
const { addDisease, userDiseases, updateEmergencyContact } = useMedicalRecord()

// Step management
const currentStep = ref(1)
const totalSteps = 4

// Form data
const birthDate = ref('')
const phoneNumber = ref('')
const searchTerm = ref('')
const selectedDiseases = ref([])

// Emergency contact
const emergencyContact = ref({
  name: '',
  phone: '',
  relationship: ''
})

// Relationship options
const relationshipOptions = [
  'Pai/Mãe',
  'Filho(a)',
  'Cônjuge',
  'Irmão/Irmã',
  'Amigo(a)',
  'Outro'
]

// Validation
const birthDateError = ref('')
const phoneError = ref('')
const emergencyPhoneError = ref('')

// Search diseases
const filteredDiseases = computed(() => {
  if (!searchTerm.value || searchTerm.value.length < 2) {
    return []
  }
  return searchDiseases(searchTerm.value).slice(0, 10)
})

// Selected diseases info
const selectedDiseasesInfo = computed(() => {
  return selectedDiseases.value.map(id =>
    DISEASES.find(d => d.id === id)
  ).filter(Boolean)
})

// Category colors
const categoryColors = {
  mental: 'bg-teal-100 text-teal-700 border-teal-200',
  cardiovascular: 'bg-red-100 text-red-700 border-red-200',
  respiratory: 'bg-blue-100 text-blue-700 border-blue-200',
  endocrine: 'bg-orange-100 text-orange-700 border-orange-200',
  neurological: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  musculoskeletal: 'bg-green-100 text-green-700 border-green-200',
  gastrointestinal: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  dermatological: 'bg-pink-100 text-pink-700 border-pink-200',
  immunological: 'bg-teal-100 text-teal-700 border-teal-200',
  other: 'bg-gray-100 text-gray-700 border-gray-200'
}

const getCategoryColor = (category) => categoryColors[category] || categoryColors.other

// Validate birth date
const validateBirthDate = () => {
  birthDateError.value = ''

  if (!birthDate.value) {
    birthDateError.value = 'Data de nascimento é obrigatória'
    return false
  }

  const date = new Date(birthDate.value)
  const today = new Date()
  const age = Math.floor((today - date) / (365.25 * 24 * 60 * 60 * 1000))

  if (age < 0 || age > 120) {
    birthDateError.value = 'Data de nascimento inválida'
    return false
  }

  return true
}

// Validate phone
const validatePhone = () => {
  phoneError.value = ''

  if (!phoneNumber.value) {
    // Phone is optional, but if provided must be valid
    return true
  }

  // Remove non-digits
  const digits = phoneNumber.value.replace(/\D/g, '')

  if (digits.length < 10 || digits.length > 11) {
    phoneError.value = 'Telefone deve ter 10 ou 11 dígitos'
    return false
  }

  return true
}

// Format phone number
const formatPhone = (value) => {
  const digits = value.replace(/\D/g, '')

  if (digits.length <= 2) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
}

const handlePhoneInput = (e) => {
  phoneNumber.value = formatPhone(e.target.value)
}

const handleEmergencyPhoneInput = (e) => {
  emergencyContact.value.phone = formatPhone(e.target.value)
}

// Validate emergency contact phone
const validateEmergencyPhone = () => {
  emergencyPhoneError.value = ''

  if (!emergencyContact.value.phone) {
    return true // Optional
  }

  const digits = emergencyContact.value.phone.replace(/\D/g, '')

  if (digits.length < 10 || digits.length > 11) {
    emergencyPhoneError.value = 'Telefone deve ter 10 ou 11 dígitos'
    return false
  }

  return true
}

// Add disease to selection
const toggleDisease = (diseaseId) => {
  const index = selectedDiseases.value.indexOf(diseaseId)
  if (index > -1) {
    selectedDiseases.value.splice(index, 1)
  } else {
    selectedDiseases.value.push(diseaseId)
  }
}

const removeDisease = (diseaseId) => {
  const index = selectedDiseases.value.indexOf(diseaseId)
  if (index > -1) {
    selectedDiseases.value.splice(index, 1)
  }
}

// Navigation
const canProceed = computed(() => {
  if (currentStep.value === 1) {
    return birthDate.value && !birthDateError.value
  }
  return true
})

const nextStep = () => {
  if (currentStep.value === 1 && !validateBirthDate()) {
    return
  }

  if (currentStep.value === 3 && !validatePhone()) {
    return
  }

  if (currentStep.value === 4 && !validateEmergencyPhone()) {
    return
  }

  if (currentStep.value < totalSteps) {
    currentStep.value++
  } else {
    completeOnboarding()
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// Complete onboarding
const isSubmitting = ref(false)

const completeOnboarding = async () => {
  isSubmitting.value = true

  try {
    // Save diseases to medical record (aguarda todas as promessas)
    for (const diseaseId of selectedDiseases.value) {
      await addDisease(diseaseId)
    }

    // Save emergency contact to medical record
    if (emergencyContact.value.name || emergencyContact.value.phone) {
      await updateEmergencyContact({
        name: emergencyContact.value.name,
        phone: emergencyContact.value.phone.replace(/\D/g, ''),
        relationship: emergencyContact.value.relationship
      })
    }

    // Update user profile with birth date and phone
    await updateUserProfile({
      birthDate: birthDate.value,
      phone: phoneNumber.value.replace(/\D/g, ''),
      onboardingCompleted: true
    })

    // Redirect to home
    router.push('/')
  } catch (error) {
    console.error('Erro ao completar onboarding:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Skip onboarding (optional)
const skipOnboarding = async () => {
  await updateUserProfile({
    onboardingCompleted: true
  })
  router.push('/')
}

// Calculate age from birth date for display
const calculatedAge = computed(() => {
  if (!birthDate.value) return null
  const date = new Date(birthDate.value)
  const today = new Date()
  return Math.floor((today - date) / (365.25 * 24 * 60 * 60 * 1000))
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 flex flex-col">
    <!-- Header -->
    <header class="p-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
          <Sparkles class="w-5 h-5 text-white" />
        </div>
        <span class="font-semibold text-gray-900">Aurora Saude</span>
      </div>

      <button
        @click="skipOnboarding"
        class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        Pular
      </button>
    </header>

    <!-- Progress bar -->
    <div class="px-6 py-2">
      <div class="flex items-center gap-2">
        <template v-for="step in totalSteps" :key="step">
          <div
            :class="[
              'h-2 rounded-full flex-1 transition-all duration-300',
              step <= currentStep ? 'bg-teal-500' : 'bg-gray-200'
            ]"
          />
        </template>
      </div>
      <p class="text-sm text-gray-500 mt-2 text-center">
        Passo {{ currentStep }} de {{ totalSteps }}
      </p>
    </div>

    <!-- Content -->
    <main class="flex-1 px-6 py-4 overflow-y-auto">
      <!-- Step 1: Birth Date -->
      <div v-if="currentStep === 1" class="max-w-md mx-auto animate-fade-in">
        <div class="text-center mb-8">
          <div class="w-16 h-16 rounded-2xl bg-teal-100 flex items-center justify-center mx-auto mb-4">
            <Calendar class="w-8 h-8 text-teal-600" />
          </div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">
            Quando você nasceu?
          </h1>
          <p class="text-gray-600">
            Essa informação ajuda a personalizar suas análises de saúde.
          </p>
        </div>

        <BaseCard>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Data de Nascimento
              </label>
              <input
                v-model="birthDate"
                type="date"
                :max="new Date().toISOString().split('T')[0]"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
                @blur="validateBirthDate"
              />
              <p v-if="birthDateError" class="text-red-500 text-sm mt-1">
                {{ birthDateError }}
              </p>
            </div>

            <div v-if="calculatedAge !== null && calculatedAge >= 0" class="text-center p-4 bg-teal-50 rounded-xl">
              <p class="text-teal-700">
                Você tem <strong class="text-2xl">{{ calculatedAge }}</strong> anos
              </p>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Step 2: Diseases -->
      <div v-if="currentStep === 2" class="max-w-md mx-auto animate-fade-in">
        <div class="text-center mb-6">
          <div class="w-16 h-16 rounded-2xl bg-teal-100 flex items-center justify-center mx-auto mb-4">
            <HeartPulse class="w-8 h-8 text-teal-600" />
          </div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">
            Suas condições de saúde
          </h1>
          <p class="text-gray-600">
            Cadastre suas doenças ou condições para insights personalizados.
          </p>
        </div>

        <!-- Search -->
        <div class="relative mb-4">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Buscar doença (ex: diabetes, ansiedade...)"
            class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <!-- Search Results -->
        <div v-if="filteredDiseases.length > 0" class="mb-4 bg-white rounded-xl border border-gray-200 shadow-lg max-h-60 overflow-y-auto">
          <button
            v-for="disease in filteredDiseases"
            :key="disease.id"
            @click="toggleDisease(disease.id)"
            :class="[
              'w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors',
              selectedDiseases.includes(disease.id) ? 'bg-teal-50' : ''
            ]"
          >
            <div>
              <p class="font-medium text-gray-900">{{ disease.name }}</p>
              <p class="text-sm text-gray-500">{{ disease.code }}</p>
            </div>
            <div
              v-if="selectedDiseases.includes(disease.id)"
              class="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center"
            >
              <Check class="w-4 h-4 text-white" />
            </div>
          </button>
        </div>

        <!-- Selected diseases -->
        <BaseCard v-if="selectedDiseasesInfo.length > 0" class="mb-4">
          <h3 class="text-sm font-medium text-gray-700 mb-3">
            Condições selecionadas ({{ selectedDiseasesInfo.length }})
          </h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="disease in selectedDiseasesInfo"
              :key="disease.id"
              :class="[
                'inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border',
                getCategoryColor(disease.category)
              ]"
            >
              {{ disease.name }}
              <button
                @click="removeDisease(disease.id)"
                class="ml-1 hover:opacity-70"
              >
                <X class="w-4 h-4" />
              </button>
            </span>
          </div>
        </BaseCard>

        <!-- Empty state -->
        <div v-else class="text-center py-8 text-gray-500">
          <p>Nenhuma condição selecionada</p>
          <p class="text-sm mt-1">Você pode pular ou adicionar depois</p>
        </div>

        <!-- Common conditions quick select -->
        <div class="mt-4">
          <p class="text-sm font-medium text-gray-700 mb-2">Condições comuns:</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="disease in DISEASES.filter(d => ['F32', 'F41', 'I10', 'E11', 'G43', 'J45'].includes(d.id))"
              :key="disease.id"
              @click="toggleDisease(disease.id)"
              :class="[
                'px-3 py-1.5 rounded-full text-sm border transition-all',
                selectedDiseases.includes(disease.id)
                  ? 'bg-teal-500 text-white border-teal-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-teal-300'
              ]"
            >
              {{ disease.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Step 3: Phone -->
      <div v-if="currentStep === 3" class="max-w-md mx-auto animate-fade-in">
        <div class="text-center mb-8">
          <div class="w-16 h-16 rounded-2xl bg-teal-100 flex items-center justify-center mx-auto mb-4">
            <Phone class="w-8 h-8 text-teal-600" />
          </div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">
            Seu telefone
          </h1>
          <p class="text-gray-600">
            Receba lembretes e notificações importantes sobre sua saúde.
          </p>
        </div>

        <BaseCard>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Número de Telefone (opcional)
              </label>
              <input
                :value="phoneNumber"
                @input="handlePhoneInput"
                type="tel"
                placeholder="(00) 00000-0000"
                maxlength="16"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
              />
              <p v-if="phoneError" class="text-red-500 text-sm mt-1">
                {{ phoneError }}
              </p>
              <p class="text-sm text-gray-500 mt-2">
                Você pode adicionar depois nas configurações.
              </p>
            </div>

            <div class="p-4 bg-teal-50 rounded-xl">
              <h4 class="font-medium text-teal-900 mb-2">Você receberá:</h4>
              <ul class="text-sm text-teal-700 space-y-1">
                <li>• Lembretes para registrar sintomas</li>
                <li>• Alertas sobre padrões de saúde</li>
                <li>• Dicas personalizadas</li>
              </ul>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Step 4: Emergency Contact -->
      <div v-if="currentStep === 4" class="max-w-md mx-auto animate-fade-in">
        <div class="text-center mb-8">
          <div class="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
            <UserPlus class="w-8 h-8 text-red-600" />
          </div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">
            Contato de Emergência
          </h1>
          <p class="text-gray-600">
            Quem devemos contatar em caso de emergência?
          </p>
        </div>

        <BaseCard>
          <div class="space-y-4">
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nome do contato
              </label>
              <div class="relative">
                <User class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  v-model="emergencyContact.name"
                  type="text"
                  placeholder="Nome completo"
                  maxlength="100"
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Telefone do contato
              </label>
              <div class="relative">
                <Phone class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  :value="emergencyContact.phone"
                  @input="handleEmergencyPhoneInput"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  maxlength="16"
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <p v-if="emergencyPhoneError" class="text-red-500 text-sm mt-1">
                {{ emergencyPhoneError }}
              </p>
            </div>

            <!-- Relationship -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Parentesco/Relação
              </label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="option in relationshipOptions"
                  :key="option"
                  @click="emergencyContact.relationship = option"
                  :class="[
                    'px-4 py-2 rounded-xl text-sm font-medium border transition-all',
                    emergencyContact.relationship === option
                      ? 'bg-teal-500 text-white border-teal-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-teal-300'
                  ]"
                >
                  {{ option }}
                </button>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Info box -->
        <div class="mt-4 p-4 bg-red-50 rounded-xl border border-red-100">
          <p class="text-sm text-red-700">
            <strong>Importante:</strong> Este contato será acionado apenas em situações de emergência relacionadas à sua saúde.
          </p>
        </div>

        <!-- Summary -->
        <BaseCard class="mt-4 !bg-gradient-to-r !from-teal-50 !to-cyan-50">
          <h3 class="font-semibold text-gray-900 mb-3">Resumo do seu perfil</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Idade:</span>
              <span class="font-medium">{{ calculatedAge }} anos</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Condições:</span>
              <span class="font-medium">{{ selectedDiseasesInfo.length }} cadastradas</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Seu telefone:</span>
              <span class="font-medium">{{ phoneNumber || 'Não informado' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Contato emergência:</span>
              <span class="font-medium">{{ emergencyContact.name || 'Não informado' }}</span>
            </div>
          </div>
        </BaseCard>
      </div>
    </main>

    <!-- Footer with navigation -->
    <footer class="p-6 bg-white border-t border-gray-100">
      <div class="max-w-md mx-auto flex gap-3">
        <BaseButton
          v-if="currentStep > 1"
          variant="outline"
          @click="prevStep"
          class="flex-1"
        >
          <template #icon-left>
            <ChevronLeft class="w-5 h-5" />
          </template>
          Voltar
        </BaseButton>

        <BaseButton
          variant="primary"
          @click="nextStep"
          :loading="isSubmitting"
          :disabled="currentStep === 1 && !birthDate"
          :class="currentStep === 1 ? 'flex-1' : 'flex-[2]'"
        >
          {{ currentStep === totalSteps ? 'Concluir' : 'Continuar' }}
          <template #icon-right>
            <component :is="currentStep === totalSteps ? Check : ChevronRight" class="w-5 h-5" />
          </template>
        </BaseButton>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
