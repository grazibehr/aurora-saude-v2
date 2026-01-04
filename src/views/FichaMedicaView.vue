<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import {
  Heart,
  Pill,
  AlertTriangle,
  Droplet,
  Phone,
  FileText,
  Plus,
  X,
  Search,
  Check,
  ChevronDown,
  ChevronUp,
  Brain,
  Activity,
  ShieldAlert,
  Info
} from 'lucide-vue-next'
import { useMedicalRecord } from '../composables/useMedicalRecord'
import { useMedicationInteractions } from '../composables/useMedicationInteractions'
import { DISEASES, DISEASE_CATEGORIES, searchDiseases, getDiseasesByCategory } from '../data/diseases'
import { BaseButton, BaseInput, BaseCard, BaseAlert, BaseModal, BaseBadge } from '../components/ui'

const {
  medicalRecord,
  addDisease,
  removeDisease,
  userDiseases,
  addMedication,
  removeMedication,
  addAllergy,
  removeAllergy,
  updateBloodType,
  updateEmergencyContact,
  updateNotes,
  stats,
  refreshMedicalRecord
} = useMedicalRecord()

// Sistema de interações medicamentosas
const {
  activeAlerts,
  hasActiveAlerts,
  alertCount,
  highSeverityAlerts,
  checkInteractions,
  updateAlerts,
  acknowledgeAlert,
  getSeverityColor,
  getSeverityLabel
} = useMedicationInteractions()

// Carrega dados do backend ao montar o componente
onMounted(async () => {
  await refreshMedicalRecord()
  // Atualiza os valores locais após carregar do backend
  if (medicalRecord.value) {
    emergencyContact.value = {
      name: medicalRecord.value.emergencyContact?.name || '',
      phone: medicalRecord.value.emergencyContact?.phone || '',
      relationship: medicalRecord.value.emergencyContact?.relationship || ''
    }
    bloodType.value = medicalRecord.value.bloodType || ''
    notes.value = medicalRecord.value.notes || ''
    // Verifica interações medicamentosas
    updateAlerts(medicalRecord.value.medications || [])
  }
})

// Atualiza alertas quando medicamentos mudam
watch(() => medicalRecord.value?.medications, (newMeds) => {
  if (newMeds) {
    updateAlerts(newMeds)
  }
}, { deep: true })

// Estado
const searchTerm = ref('')
const showDiseaseModal = ref(false)
const showMedicationModal = ref(false)
const showAllergyModal = ref(false)
const expandedCategories = ref(['mental'])
const success = ref('')
const errorMsg = ref('')

// Novo medicamento
const newMedication = ref({
  name: '',
  dosage: '',
  frequency: ''
})

// Nova alergia
const newAllergy = ref({
  name: '',
  severity: 'moderate'
})

// Contato de emergência
const emergencyContact = ref({
  name: medicalRecord.value?.emergencyContact?.name || '',
  phone: medicalRecord.value?.emergencyContact?.phone || '',
  relationship: medicalRecord.value?.emergencyContact?.relationship || ''
})

// Tipo sanguíneo
const bloodType = ref(medicalRecord.value?.bloodType || '')
const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

// Observações
const notes = ref(medicalRecord.value?.notes || '')

// Sincroniza valores locais quando medicalRecord mudar (ex: troca de usuário ou refresh)
watch(medicalRecord, (newRecord) => {
  if (newRecord) {
    emergencyContact.value = {
      name: newRecord.emergencyContact?.name || '',
      phone: newRecord.emergencyContact?.phone || '',
      relationship: newRecord.emergencyContact?.relationship || ''
    }
    bloodType.value = newRecord.bloodType || ''
    notes.value = newRecord.notes || ''
  }
}, { deep: true, immediate: true })

// Busca de doenças
const filteredDiseases = computed(() => {
  if (searchTerm.value.length < 2) return []
  return searchDiseases(searchTerm.value).slice(0, 10)
})

// Cores das categorias
const categoryColors = {
  mental: 'purple',
  cardiovascular: 'red',
  respiratory: 'blue',
  endocrine: 'orange',
  neurological: 'indigo',
  musculoskeletal: 'green',
  gastrointestinal: 'yellow',
  dermatological: 'pink',
  immunological: 'teal',
  other: 'gray'
}

const getCategoryColor = (categoryId) => {
  const colors = {
    purple: 'bg-teal-100 text-teal-700',
    red: 'bg-red-100 text-red-700',
    blue: 'bg-blue-100 text-blue-700',
    orange: 'bg-orange-100 text-orange-700',
    indigo: 'bg-indigo-100 text-indigo-700',
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    pink: 'bg-pink-100 text-pink-700',
    teal: 'bg-teal-100 text-teal-700',
    gray: 'bg-gray-100 text-gray-700'
  }
  return colors[categoryColors[categoryId]] || colors.gray
}

const getAllergySeverityColor = (severity) => {
  const colors = {
    mild: 'bg-green-100 text-green-700',
    moderate: 'bg-yellow-100 text-yellow-700',
    severe: 'bg-red-100 text-red-700'
  }
  return colors[severity] || colors.moderate
}

const getAllergySeverityLabel = (severity) => {
  const labels = {
    mild: 'Leve',
    moderate: 'Moderada',
    severe: 'Grave'
  }
  return labels[severity] || 'Moderada'
}

// Handlers
const handleAddDisease = (disease) => {
  addDisease(disease.id)
  searchTerm.value = ''
  showSuccess('Condição adicionada!')
}

const handleRemoveDisease = async (disease) => {
  try {
    // Passa o código CID - a função removeDisease encontra o dbId internamente
    await removeDisease(disease.id)
    showSuccess('Condição removida!')
  } catch (err) {
    showError(err.message)
  }
}

const handleAddMedication = () => {
  if (!newMedication.value.name.trim()) return

  addMedication({
    name: newMedication.value.name,
    dosage: newMedication.value.dosage,
    frequency: newMedication.value.frequency
  })

  newMedication.value = { name: '', dosage: '', frequency: '' }
  showMedicationModal.value = false
  showSuccess('Medicamento adicionado!')
}

const handleRemoveMedication = async (medicationId) => {
  try {
    await removeMedication(medicationId)
    showSuccess('Medicamento removido!')
  } catch (err) {
    showError(err.message)
  }
}

const handleAddAllergy = () => {
  if (!newAllergy.value.name.trim()) return

  addAllergy({
    name: newAllergy.value.name,
    severity: newAllergy.value.severity
  })

  newAllergy.value = { name: '', severity: 'moderate' }
  showAllergyModal.value = false
  showSuccess('Alergia adicionada!')
}

const handleRemoveAllergy = async (allergyId) => {
  try {
    await removeAllergy(allergyId)
    showSuccess('Alergia removida!')
  } catch (err) {
    showError(err.message)
  }
}

const handleSaveBloodType = () => {
  updateBloodType(bloodType.value)
  showSuccess('Tipo sanguíneo salvo!')
}

const handleSaveEmergencyContact = () => {
  updateEmergencyContact(emergencyContact.value)
  showSuccess('Contato de emergência salvo!')
}

const handleSaveNotes = () => {
  updateNotes(notes.value)
  showSuccess('Observações salvas!')
}

const toggleCategory = (categoryId) => {
  const index = expandedCategories.value.indexOf(categoryId)
  if (index > -1) {
    expandedCategories.value.splice(index, 1)
  } else {
    expandedCategories.value.push(categoryId)
  }
}

const showSuccess = (message) => {
  success.value = message
  setTimeout(() => {
    success.value = ''
  }, 3000)
}

const showError = (message) => {
  errorMsg.value = message
  setTimeout(() => {
    errorMsg.value = ''
  }, 5000)
}

const isDiseaseSelected = (diseaseId) => {
  // Suporta formato novo (objetos) e antigo (strings)
  return medicalRecord.value.diseases.some(entry => {
    if (typeof entry === 'string') return entry === diseaseId
    return entry?.cidCode === diseaseId || entry?.cid_code === diseaseId
  })
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Ficha Médica</h1>
        <p class="text-gray-500">Gerencie suas condições de saúde, medicamentos e informações importantes</p>
      </div>
      <div class="flex items-center gap-2 text-sm text-gray-500">
        <Activity class="w-4 h-4" />
        {{ stats.totalDiseases }} condições
      </div>
    </div>

    <!-- Success message -->
    <Transition name="slide">
      <BaseAlert v-if="success" variant="success" dismissible @dismiss="success = ''">
        {{ success }}
      </BaseAlert>
    </Transition>

    <!-- Error message -->
    <Transition name="slide">
      <BaseAlert v-if="errorMsg" variant="error" dismissible @dismiss="errorMsg = ''">
        {{ errorMsg }}
      </BaseAlert>
    </Transition>

    <!-- Alertas de Interação Medicamentosa -->
    <div v-if="hasActiveAlerts" class="space-y-3">
      <div class="flex items-center gap-2 text-amber-700">
        <ShieldAlert class="w-5 h-5" />
        <h2 class="font-semibold">Alertas de Interação Medicamentosa</h2>
        <span class="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
          {{ alertCount }}
        </span>
      </div>

      <div
        v-for="alert in activeAlerts"
        :key="alert.id"
        :class="[
          'p-4 rounded-xl border-l-4',
          alert.severity === 'high' ? 'bg-red-50 border-red-500' :
          alert.severity === 'moderate' ? 'bg-amber-50 border-amber-500' :
          'bg-blue-50 border-blue-500'
        ]"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span
                :class="[
                  'px-2 py-0.5 text-xs font-medium rounded-full',
                  alert.severity === 'high' ? 'bg-red-100 text-red-700' :
                  alert.severity === 'moderate' ? 'bg-amber-100 text-amber-700' :
                  'bg-blue-100 text-blue-700'
                ]"
              >
                {{ getSeverityLabel(alert.severity) }}
              </span>
              <span class="text-sm font-medium text-gray-900">
                {{ alert.medications?.join(' + ') }}
              </span>
            </div>
            <p class="text-sm text-gray-700 mb-2">{{ alert.description }}</p>
            <p class="text-xs text-gray-600 flex items-center gap-1">
              <Info class="w-3 h-3" />
              {{ alert.recommendation }}
            </p>
          </div>
          <button
            @click="acknowledgeAlert(alert.id)"
            class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
            title="Marcar como lido"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Quick stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <BaseCard class="!p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
            <Heart class="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalDiseases }}</p>
            <p class="text-xs text-gray-500">Condições</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard class="!p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Pill class="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalMedications }}</p>
            <p class="text-xs text-gray-500">Medicamentos</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard class="!p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
            <AlertTriangle class="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalAllergies }}</p>
            <p class="text-xs text-gray-500">Alergias</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard class="!p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <Droplet class="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ medicalRecord?.bloodType || '-' }}</p>
            <p class="text-xs text-gray-500">Tipo Sanguíneo</p>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Condições de Saúde -->
    <BaseCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Heart class="w-5 h-5 text-teal-500" />
            <h2 class="text-lg font-semibold text-gray-900">Condições de Saúde</h2>
          </div>
          <BaseButton variant="primary" size="sm" @click="showDiseaseModal = true">
            <template #icon-left>
              <Plus class="w-4 h-4" />
            </template>
            Adicionar
          </BaseButton>
        </div>
      </template>

      <!-- Lista de condições do usuário -->
      <div v-if="userDiseases.length === 0" class="text-center py-8">
        <Heart class="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p class="text-gray-500 mb-4">Nenhuma condição cadastrada</p>
        <BaseButton variant="outline" @click="showDiseaseModal = true">
          Adicionar condição
        </BaseButton>
      </div>

      <div v-else class="space-y-2">
        <div
          v-for="disease in userDiseases"
          :key="disease.id"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div class="flex items-center gap-3">
            <div :class="['w-2 h-2 rounded-full', getCategoryColor(disease.category).split(' ')[0]]"></div>
            <div>
              <p class="font-medium text-gray-900">{{ disease.name }}</p>
              <p class="text-xs text-gray-500">{{ disease.code }} - {{ DISEASE_CATEGORIES.find(c => c.id === disease.category)?.label }}</p>
            </div>
          </div>
          <button
            @click="handleRemoveDisease(disease)"
            class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>
    </BaseCard>

    <!-- Medicamentos -->
    <BaseCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Pill class="w-5 h-5 text-blue-500" />
            <h2 class="text-lg font-semibold text-gray-900">Medicamentos</h2>
          </div>
          <BaseButton variant="primary" size="sm" @click="showMedicationModal = true">
            <template #icon-left>
              <Plus class="w-4 h-4" />
            </template>
            Adicionar
          </BaseButton>
        </div>
      </template>

      <div v-if="medicalRecord?.medications?.length === 0" class="text-center py-8">
        <Pill class="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p class="text-gray-500">Nenhum medicamento cadastrado</p>
      </div>

      <div v-else class="space-y-2">
        <div
          v-for="med in medicalRecord.medications"
          :key="med.id"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div>
            <p class="font-medium text-gray-900">{{ med.name }}</p>
            <p class="text-sm text-gray-500">
              <span v-if="med.dosage">{{ med.dosage }}</span>
              <span v-if="med.dosage && med.frequency"> - </span>
              <span v-if="med.frequency">{{ med.frequency }}</span>
            </p>
          </div>
          <button
            @click="handleRemoveMedication(med.id)"
            class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>
    </BaseCard>

    <!-- Alergias -->
    <BaseCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <AlertTriangle class="w-5 h-5 text-orange-500" />
            <h2 class="text-lg font-semibold text-gray-900">Alergias</h2>
          </div>
          <BaseButton variant="primary" size="sm" @click="showAllergyModal = true">
            <template #icon-left>
              <Plus class="w-4 h-4" />
            </template>
            Adicionar
          </BaseButton>
        </div>
      </template>

      <div v-if="medicalRecord?.allergies?.length === 0" class="text-center py-8">
        <AlertTriangle class="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p class="text-gray-500">Nenhuma alergia cadastrada</p>
      </div>

      <div v-else class="space-y-2">
        <div
          v-for="allergy in medicalRecord.allergies"
          :key="allergy.id"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div class="flex items-center gap-3">
            <span :class="['px-2 py-1 text-xs font-medium rounded-full', getAllergySeverityColor(allergy.severity)]">
              {{ getAllergySeverityLabel(allergy.severity) }}
            </span>
            <p class="font-medium text-gray-900">{{ allergy.name }}</p>
          </div>
          <button
            @click="handleRemoveAllergy(allergy.id)"
            class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>
    </BaseCard>

    <!-- Informações Adicionais -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Tipo Sanguíneo -->
      <BaseCard>
        <template #header>
          <div class="flex items-center gap-2">
            <Droplet class="w-5 h-5 text-red-500" />
            <h2 class="text-lg font-semibold text-gray-900">Tipo Sanguíneo</h2>
          </div>
        </template>

        <div class="flex flex-wrap gap-2 mb-4">
          <button
            v-for="type in bloodTypes"
            :key="type"
            @click="bloodType = type"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all',
              bloodType === type
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            {{ type }}
          </button>
        </div>

        <BaseButton
          variant="secondary"
          size="sm"
          @click="handleSaveBloodType"
          :disabled="bloodType === medicalRecord?.bloodType"
        >
          Salvar
        </BaseButton>
      </BaseCard>

      <!-- Contato de Emergência -->
      <BaseCard>
        <template #header>
          <div class="flex items-center gap-2">
            <Phone class="w-5 h-5 text-green-500" />
            <h2 class="text-lg font-semibold text-gray-900">Contato de Emergência</h2>
          </div>
        </template>

        <div class="space-y-3">
          <BaseInput
            v-model="emergencyContact.name"
            label="Nome"
            placeholder="Nome do contato"
          />
          <BaseInput
            v-model="emergencyContact.phone"
            label="Telefone"
            placeholder="(00) 00000-0000"
          />
          <BaseInput
            v-model="emergencyContact.relationship"
            label="Parentesco"
            placeholder="Ex: Mãe, Cônjuge, Amigo"
          />
          <BaseButton variant="secondary" size="sm" @click="handleSaveEmergencyContact">
            Salvar
          </BaseButton>
        </div>
      </BaseCard>
    </div>

    <!-- Observações -->
    <BaseCard>
      <template #header>
        <div class="flex items-center gap-2">
          <FileText class="w-5 h-5 text-gray-500" />
          <h2 class="text-lg font-semibold text-gray-900">Observações Médicas</h2>
        </div>
      </template>

      <textarea
        v-model="notes"
        rows="4"
        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
        placeholder="Informações adicionais sobre sua saúde, histórico familiar, etc."
      ></textarea>

      <BaseButton variant="secondary" size="sm" class="mt-3" @click="handleSaveNotes">
        Salvar observações
      </BaseButton>
    </BaseCard>

    <!-- Modal: Adicionar Doença -->
    <BaseModal v-model="showDiseaseModal" title="Adicionar Condição de Saúde" size="lg">
      <div class="space-y-4">
        <!-- Busca -->
        <BaseInput
          v-model="searchTerm"
          placeholder="Buscar por nome ou código CID..."
        >
          <template #icon-left>
            <Search class="w-5 h-5" />
          </template>
        </BaseInput>

        <!-- Resultados da busca -->
        <div v-if="filteredDiseases.length > 0" class="space-y-2 max-h-60 overflow-y-auto">
          <button
            v-for="disease in filteredDiseases"
            :key="disease.id"
            @click="handleAddDisease(disease)"
            :disabled="isDiseaseSelected(disease.id)"
            :class="[
              'w-full flex items-center justify-between p-3 rounded-lg text-left transition-all',
              isDiseaseSelected(disease.id)
                ? 'bg-green-50 border-2 border-green-200'
                : 'bg-gray-50 hover:bg-teal-50 hover:border-teal-200 border-2 border-transparent'
            ]"
          >
            <div>
              <p class="font-medium text-gray-900">{{ disease.name }}</p>
              <p class="text-xs text-gray-500">{{ disease.code }} - {{ DISEASE_CATEGORIES.find(c => c.id === disease.category)?.label }}</p>
            </div>
            <Check v-if="isDiseaseSelected(disease.id)" class="w-5 h-5 text-green-500" />
          </button>
        </div>

        <!-- Categorias -->
        <div v-else class="space-y-2">
          <p class="text-sm text-gray-500 mb-3">Ou selecione por categoria:</p>

          <div v-for="category in DISEASE_CATEGORIES" :key="category.id" class="border border-gray-200 rounded-lg overflow-hidden">
            <button
              @click="toggleCategory(category.id)"
              class="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div class="flex items-center gap-2">
                <Brain v-if="category.id === 'mental'" class="w-5 h-5 text-teal-500" />
                <Heart v-else class="w-5 h-5 text-red-500" />
                <span class="font-medium text-gray-900">{{ category.label }}</span>
                <span class="text-xs text-gray-500">({{ getDiseasesByCategory(category.id).length }})</span>
              </div>
              <ChevronDown
                :class="[
                  'w-5 h-5 text-gray-400 transition-transform',
                  expandedCategories.includes(category.id) ? 'rotate-180' : ''
                ]"
              />
            </button>

            <div v-if="expandedCategories.includes(category.id)" class="p-2 space-y-1 max-h-48 overflow-y-auto">
              <button
                v-for="disease in getDiseasesByCategory(category.id)"
                :key="disease.id"
                @click="handleAddDisease(disease)"
                :disabled="isDiseaseSelected(disease.id)"
                :class="[
                  'w-full flex items-center justify-between p-2 rounded-lg text-left text-sm transition-all',
                  isDiseaseSelected(disease.id)
                    ? 'bg-green-50 text-green-700'
                    : 'hover:bg-teal-50'
                ]"
              >
                <span>{{ disease.name }}</span>
                <Check v-if="isDiseaseSelected(disease.id)" class="w-4 h-4 text-green-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <BaseButton variant="secondary" @click="showDiseaseModal = false">
          Fechar
        </BaseButton>
      </template>
    </BaseModal>

    <!-- Modal: Adicionar Medicamento -->
    <BaseModal v-model="showMedicationModal" title="Adicionar Medicamento" size="sm">
      <div class="space-y-4">
        <BaseInput
          v-model="newMedication.name"
          label="Nome do medicamento"
          placeholder="Ex: Paracetamol"
          required
        />
        <BaseInput
          v-model="newMedication.dosage"
          label="Dosagem"
          placeholder="Ex: 500mg"
        />
        <BaseInput
          v-model="newMedication.frequency"
          label="Frequência"
          placeholder="Ex: 2x ao dia"
        />
      </div>

      <template #footer>
        <BaseButton variant="secondary" @click="showMedicationModal = false">
          Cancelar
        </BaseButton>
        <BaseButton variant="primary" @click="handleAddMedication" :disabled="!newMedication.name.trim()">
          Adicionar
        </BaseButton>
      </template>
    </BaseModal>

    <!-- Modal: Adicionar Alergia -->
    <BaseModal v-model="showAllergyModal" title="Adicionar Alergia" size="sm">
      <div class="space-y-4">
        <BaseInput
          v-model="newAllergy.name"
          label="Alergia"
          placeholder="Ex: Penicilina, Amendoim"
          required
        />

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Gravidade</label>
          <div class="flex gap-2">
            <button
              v-for="severity in ['mild', 'moderate', 'severe']"
              :key="severity"
              @click="newAllergy.severity = severity"
              :class="[
                'flex-1 py-2 rounded-lg font-medium transition-all',
                newAllergy.severity === severity
                  ? getAllergySeverityColor(severity)
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              {{ getAllergySeverityLabel(severity) }}
            </button>
          </div>
        </div>
      </div>

      <template #footer>
        <BaseButton variant="secondary" @click="showAllergyModal = false">
          Cancelar
        </BaseButton>
        <BaseButton variant="primary" @click="handleAddAllergy" :disabled="!newAllergy.name.trim()">
          Adicionar
        </BaseButton>
      </template>
    </BaseModal>
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
</style>
