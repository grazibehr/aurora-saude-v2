<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Search,
  Filter,
  Calendar,
  Trash2,
  ChevronDown,
  X,
  Frown,
  Thermometer,
  Pill,
  Battery,
  Brain,
  Moon,
  Plus
} from 'lucide-vue-next'
import { useSymptoms, SYMPTOM_TYPES, INTENSITY_LEVELS } from '../composables/useSymptoms'
import { BaseButton, BaseInput, BaseSelect, BaseCard, BaseModal, BaseIconButton } from '../components/ui'

const { symptoms, deleteSymptom, refreshSymptoms } = useSymptoms()

// Carrega sintomas do backend ao montar
onMounted(() => {
  refreshSymptoms()
})

const searchQuery = ref('')
const filterType = ref('')
const filterIntensity = ref('')
const filterStartDate = ref('')
const filterEndDate = ref('')
const showFilters = ref(false)
const showDeleteModal = ref(false)
const symptomToDelete = ref(null)

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
  red: 'bg-red-100 text-red-600',
  orange: 'bg-orange-100 text-orange-600',
  yellow: 'bg-yellow-100 text-yellow-600',
  blue: 'bg-blue-100 text-blue-600',
  purple: 'bg-purple-100 text-purple-600',
  teal: 'bg-teal-100 text-teal-600',
  indigo: 'bg-indigo-100 text-indigo-600',
  gray: 'bg-gray-100 text-gray-600'
}

const intensityBarColors = {
  1: 'bg-green-500',
  2: 'bg-lime-500',
  3: 'bg-yellow-500',
  4: 'bg-orange-500',
  5: 'bg-red-500'
}

const typeOptions = computed(() => [
  { value: '', label: 'Todos os tipos' },
  ...SYMPTOM_TYPES.map(t => ({ value: t.id, label: t.label }))
])

const intensityOptions = computed(() => [
  { value: '', label: 'Todas as intensidades' },
  ...INTENSITY_LEVELS.map(l => ({ value: l.value.toString(), label: `${l.value} - ${l.label}` }))
])

const filteredSymptoms = computed(() => {
  let result = [...symptoms.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(s => {
      const type = SYMPTOM_TYPES.find(t => t.id === s.type)
      return (
        type?.label.toLowerCase().includes(query) ||
        s.customLabel?.toLowerCase().includes(query) ||
        s.notes?.toLowerCase().includes(query)
      )
    })
  }

  if (filterType.value) {
    result = result.filter(s => s.type === filterType.value)
  }

  if (filterIntensity.value) {
    result = result.filter(s => s.intensity === parseInt(filterIntensity.value))
  }

  if (filterStartDate.value) {
    result = result.filter(s => s.date >= filterStartDate.value)
  }

  if (filterEndDate.value) {
    result = result.filter(s => s.date <= filterEndDate.value)
  }

  return result
})

const groupedSymptoms = computed(() => {
  const groups = {}

  filteredSymptoms.value.forEach(symptom => {
    if (!groups[symptom.date]) {
      groups[symptom.date] = []
    }
    groups[symptom.date].push(symptom)
  })

  const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a))

  return sortedDates.map(date => ({
    date,
    symptoms: groups[date]
  }))
})

const activeFiltersCount = computed(() => {
  let count = 0
  if (filterType.value) count++
  if (filterIntensity.value) count++
  if (filterStartDate.value) count++
  if (filterEndDate.value) count++
  return count
})

const getSymptomType = (typeId) => {
  return SYMPTOM_TYPES.find(t => t.id === typeId) || {}
}

// Retorna o label do sintoma considerando customLabel para tipo "outro"
const getSymptomLabel = (symptom) => {
  if (symptom.type === 'outro' && symptom.customLabel) {
    return symptom.customLabel
  }
  return getSymptomType(symptom.type).label || 'Sintoma'
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.getTime() === today.getTime()) {
    return 'Hoje'
  }

  if (date.getTime() === yesterday.getTime()) {
    return 'Ontem'
  }

  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })
}

const clearFilters = () => {
  filterType.value = ''
  filterIntensity.value = ''
  filterStartDate.value = ''
  filterEndDate.value = ''
}

const confirmDelete = (symptom) => {
  symptomToDelete.value = symptom
  showDeleteModal.value = true
}

const handleDelete = () => {
  if (symptomToDelete.value) {
    deleteSymptom(symptomToDelete.value.id)
    showDeleteModal.value = false
    symptomToDelete.value = null
  }
}
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Search and filters -->
    <BaseCard>
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Search -->
        <BaseInput
          v-model="searchQuery"
          type="search"
          placeholder="Buscar sintomas..."
          class="flex-1"
        >
          <template #icon-left>
            <Search class="w-5 h-5" />
          </template>
        </BaseInput>

        <!-- Filter toggle -->
        <BaseButton
          variant="secondary"
          @click="showFilters = !showFilters"
          :aria-expanded="showFilters"
        >
          <template #icon-left>
            <Filter class="w-5 h-5" />
          </template>
          Filtros
          <template #icon-right>
            <ChevronDown
              :class="['w-4 h-4 transition-transform', showFilters ? 'rotate-180' : '']"
            />
          </template>
        </BaseButton>
      </div>

      <!-- Filters panel -->
      <Transition name="slide">
        <div v-if="showFilters" class="mt-4 pt-4 border-t border-gray-200">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <BaseSelect
              v-model="filterType"
              label="Tipo de sintoma"
              :options="typeOptions"
              placeholder="Todos os tipos"
            />

            <BaseSelect
              v-model="filterIntensity"
              label="Intensidade"
              :options="intensityOptions"
              placeholder="Todas"
            />

            <BaseInput
              v-model="filterStartDate"
              type="date"
              label="Data inicial"
            />

            <BaseInput
              v-model="filterEndDate"
              type="date"
              label="Data final"
            />
          </div>

          <BaseButton
            v-if="activeFiltersCount > 0"
            variant="link"
            size="sm"
            class="mt-4"
            @click="clearFilters"
          >
            <template #icon-left>
              <X class="w-4 h-4" />
            </template>
            Limpar filtros
          </BaseButton>
        </div>
      </Transition>
    </BaseCard>

    <!-- Results count -->
    <p class="text-sm text-gray-500">
      {{ filteredSymptoms.length }} registro(s) encontrado(s)
    </p>

    <!-- Empty state -->
    <BaseCard v-if="filteredSymptoms.length === 0" class="text-center py-12">
      <Calendar class="w-16 h-16 text-gray-300 mx-auto mb-4" aria-hidden="true" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        Nenhum registro encontrado
      </h3>
      <p class="text-gray-500">
        {{ symptoms.length === 0
          ? 'Você ainda não registrou nenhum sintoma.'
          : 'Tente ajustar os filtros de busca.'
        }}
      </p>
    </BaseCard>

    <!-- Symptoms list -->
    <div v-else class="space-y-6">
      <section
        v-for="group in groupedSymptoms"
        :key="group.date"
        :aria-label="`Registros de ${formatDate(group.date)}`"
      >
        <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Calendar class="w-4 h-4" aria-hidden="true" />
          {{ formatDate(group.date) }}
        </h2>

        <ul class="space-y-3" role="list">
          <li v-for="symptom in group.symptoms" :key="symptom.id">
            <BaseCard hoverable padding="md">
              <div class="flex items-start gap-4">
                <!-- Icon -->
                <div
                  :class="[
                    'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
                    colorMap[getSymptomType(symptom.type).color]
                  ]"
                >
                  <component
                    :is="iconMap[getSymptomType(symptom.type).icon]"
                    class="w-6 h-6"
                    aria-hidden="true"
                  />
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <h3 class="font-semibold text-gray-900">
                        {{ getSymptomLabel(symptom) }}
                      </h3>
                      <p class="text-sm text-gray-500">
                        {{ symptom.time }}
                        <span v-if="symptom.type === 'outro'" class="text-gray-400"> • Outro</span>
                      </p>
                    </div>

                    <!-- Actions -->
                    <BaseIconButton
                      variant="ghost"
                      size="sm"
                      label="Excluir registro"
                      @click="confirmDelete(symptom)"
                    >
                      <Trash2 class="w-4 h-4 text-gray-400 hover:text-red-600" />
                    </BaseIconButton>
                  </div>

                  <!-- Intensity bar -->
                  <div class="mt-3">
                    <div class="flex items-center justify-between text-sm mb-1">
                      <span class="text-gray-500">Intensidade</span>
                      <span class="font-medium">{{ symptom.intensity }}/5</span>
                    </div>
                    <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        :class="[
                          'h-full rounded-full transition-all',
                          intensityBarColors[symptom.intensity]
                        ]"
                        :style="{ width: `${(symptom.intensity / 5) * 100}%` }"
                      />
                    </div>
                  </div>

                  <!-- Notes -->
                  <p
                    v-if="symptom.notes"
                    class="mt-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-3"
                  >
                    {{ symptom.notes }}
                  </p>
                </div>
              </div>
            </BaseCard>
          </li>
        </ul>
      </section>
    </div>

    <!-- Delete confirmation modal -->
    <BaseModal
      v-model="showDeleteModal"
      title="Excluir registro?"
      size="sm"
    >
      <p class="text-gray-600">
        Esta ação não pode ser desfeita. O registro será permanentemente removido.
      </p>

      <template #footer>
        <BaseButton variant="secondary" @click="showDeleteModal = false">
          Cancelar
        </BaseButton>
        <BaseButton variant="danger" @click="handleDelete">
          <template #icon-left>
            <Trash2 class="w-4 h-4" />
          </template>
          Excluir
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
