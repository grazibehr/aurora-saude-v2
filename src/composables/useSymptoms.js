import { ref, computed } from 'vue'
import { api } from '../services/api'
import {
  sanitizeInput,
  validateDate,
  validateTime,
  validateIntensity,
  generateId,
  safeLocalStorageGet,
  safeLocalStorageSet,
  validateSymptomsData
} from '../utils/security'

const STORAGE_KEY = 'aurora_symptoms'

// Tipos de sintomas disponiveis - mapeados com IDs do backend
export const SYMPTOM_TYPES = [
  { id: 'dor', backendId: 2, label: 'Dor de cabeca', icon: 'Frown', color: 'red' },
  { id: 'febre', backendId: 1, label: 'Febre', icon: 'Thermometer', color: 'orange' },
  { id: 'enjoo', backendId: 6, label: 'Enjoo', icon: 'Pill', color: 'yellow' },
  { id: 'fadiga', backendId: 5, label: 'Fadiga', icon: 'Battery', color: 'blue' },
  { id: 'ansiedade', backendId: 23, label: 'Ansiedade', icon: 'Brain', color: 'teal' },
  { id: 'insonia', backendId: 20, label: 'Insonia', icon: 'Moon', color: 'indigo' },
  { id: 'nausea', backendId: 3, label: 'Nausea', icon: 'Pill', color: 'yellow' },
  { id: 'tosse', backendId: 4, label: 'Tosse', icon: 'Thermometer', color: 'orange' },
  { id: 'tontura', backendId: 11, label: 'Tontura', icon: 'Brain', color: 'teal' },
  { id: 'dor_peito', backendId: 17, label: 'Dor no peito', icon: 'Frown', color: 'red' },
  { id: 'falta_ar', backendId: 10, label: 'Falta de ar', icon: 'Battery', color: 'blue' },
  { id: 'outro', backendId: 99, label: 'Outro', icon: 'Plus', color: 'gray' }
]

// IDs validos para validacao rapida
const VALID_SYMPTOM_IDS = new Set(SYMPTOM_TYPES.map(t => t.id))

// Mapa de tipo frontend -> ID do backend
const TYPE_TO_BACKEND_ID = Object.fromEntries(
  SYMPTOM_TYPES.filter(t => t.backendId).map(t => [t.id, t.backendId])
)

// Níveis de intensidade
export const INTENSITY_LEVELS = [
  { value: 1, label: 'Muito leve', color: 'green' },
  { value: 2, label: 'Leve', color: 'lime' },
  { value: 3, label: 'Moderado', color: 'yellow' },
  { value: 4, label: 'Intenso', color: 'orange' },
  { value: 5, label: 'Muito intenso', color: 'red' }
]

const symptoms = ref([])
const isLoading = ref(false)
const error = ref(null)
const useLocalStorage = ref(false) // Flag para fallback

// Mapa reverso: ID do backend -> tipo frontend
const BACKEND_ID_TO_TYPE = Object.fromEntries(
  SYMPTOM_TYPES.filter(t => t.backendId).map(t => [t.backendId, t.id])
)

// Carrega sintomas - tenta API primeiro, fallback para localStorage
const loadSymptoms = async () => {
  isLoading.value = true
  error.value = null

  try {
    const response = await api.getSymptoms()
    if (response.items && Array.isArray(response.items)) {
      // Converte formato do backend para formato do frontend
      symptoms.value = response.items.map(item => {
        const type = BACKEND_ID_TO_TYPE[item.symptom_id] || 'outro'
        let customLabel = null
        let notes = item.notes || ''

        // Extrai customLabel das notes se for tipo "outro"
        if (type === 'outro' && notes.startsWith('[')) {
          const match = notes.match(/^\[(.+?)\]\s*(.*)$/)
          if (match) {
            customLabel = match[1]
            notes = match[2]
          }
        }

        return {
          id: item.id,
          type,
          customLabel: customLabel || (type === 'outro' ? item.symptom_name : null),
          intensity: Math.ceil(item.pain_level / 2), // Converte 1-10 para 1-5
          notes,
          date: item.date,
          time: '00:00', // Backend nao armazena hora
          createdAt: item.date
        }
      })
      useLocalStorage.value = false
      // Sync com localStorage como backup
      safeLocalStorageSet(STORAGE_KEY, symptoms.value)
    } else {
      throw new Error('API response invalid')
    }
  } catch (err) {
    console.warn('API indisponivel, usando localStorage:', err.message)
    useLocalStorage.value = true
    symptoms.value = safeLocalStorageGet(STORAGE_KEY, [], validateSymptomsData)
  } finally {
    isLoading.value = false
  }
}

// Inicializa - carrega do localStorage primeiro para UI rápida
symptoms.value = safeLocalStorageGet(STORAGE_KEY, [], validateSymptomsData)

const saveToLocalStorage = () => {
  safeLocalStorageSet(STORAGE_KEY, symptoms.value)
}

export function useSymptoms() {
  const addSymptom = async (symptomData) => {
    // Validação do tipo (usando Set para O(1) lookup)
    if (!VALID_SYMPTOM_IDS.has(symptomData.type)) {
      throw new Error('Tipo de sintoma invalido')
    }

    // Se for "outro", precisa ter um customLabel
    if (symptomData.type === 'outro' && !symptomData.customLabel?.trim()) {
      throw new Error('Descreva o sintoma')
    }

    // Valida e sanitiza data
    const validDate = validateDate(symptomData.date)
    if (!validDate) {
      throw new Error('Data invalida')
    }

    // Valida horário
    const validTime = validateTime(symptomData.time)
    if (!validTime) {
      throw new Error('Horario invalido')
    }

    const newSymptom = {
      id: generateId(),
      type: symptomData.type,
      customLabel: symptomData.type === 'outro' ? sanitizeInput(symptomData.customLabel, 100) : null,
      intensity: validateIntensity(symptomData.intensity),
      notes: sanitizeInput(symptomData.notes || '', 500),
      date: validDate,
      time: validTime,
      createdAt: new Date().toISOString()
    }

    // Tenta salvar via API
    const backendSymptomId = TYPE_TO_BACKEND_ID[newSymptom.type]

    if (backendSymptomId) {
      try {
        // Converte intensity (1-5) para pain_level (1-10)
        const painLevel = Math.min(10, Math.max(1, newSymptom.intensity * 2))

        // Para tipo "outro", inclui o customLabel nas notes
        let notesContent = newSymptom.notes || ''
        if (newSymptom.type === 'outro' && newSymptom.customLabel) {
          notesContent = `[${newSymptom.customLabel}] ${notesContent}`.trim()
        }

        const response = await api.addSymptom({
          symptom_id: backendSymptomId,
          pain_level: painLevel,
          date: newSymptom.date,
          notes: notesContent || null
        })

        if (response.id) {
          newSymptom.id = response.id
          useLocalStorage.value = false
        }
      } catch (err) {
        console.warn('Salvando sintoma localmente:', err.message)
        useLocalStorage.value = true
      }
    } else {
      // Tipo sem mapeamento - salva apenas local
      console.warn('Tipo sem mapeamento no backend, salvando localmente')
      useLocalStorage.value = true
    }

    symptoms.value.unshift(newSymptom)
    saveToLocalStorage()

    return newSymptom
  }

  const updateSymptom = async (id, updates) => {
    const index = symptoms.value.findIndex(s => s.id === id)
    if (index === -1) {
      throw new Error('Sintoma nao encontrado')
    }

    const sanitizedUpdates = {
      ...updates,
      notes: updates.notes ? sanitizeInput(updates.notes) : symptoms.value[index].notes
    }

    symptoms.value[index] = { ...symptoms.value[index], ...sanitizedUpdates }
    saveToLocalStorage()

    return symptoms.value[index]
  }

  const deleteSymptom = async (id) => {
    const index = symptoms.value.findIndex(s => s.id === id)
    if (index === -1) {
      throw new Error('Sintoma nao encontrado')
    }

    // Tenta deletar via API
    try {
      await api.deleteSymptom(id)
    } catch (err) {
      console.warn('Deletando sintoma localmente:', err.message)
    }

    symptoms.value.splice(index, 1)
    saveToLocalStorage()
  }

  const getSymptomsByDate = (date) => {
    return symptoms.value.filter(s => s.date === date)
  }

  const getSymptomsByType = (type) => {
    return symptoms.value.filter(s => s.type === type)
  }

  const getSymptomsByDateRange = (startDate, endDate) => {
    return symptoms.value.filter(s => {
      return s.date >= startDate && s.date <= endDate
    })
  }

  const filteredSymptoms = (filters = {}) => {
    return computed(() => {
      let result = [...symptoms.value]

      if (filters.type) {
        result = result.filter(s => s.type === filters.type)
      }

      if (filters.startDate) {
        result = result.filter(s => s.date >= filters.startDate)
      }

      if (filters.endDate) {
        result = result.filter(s => s.date <= filters.endDate)
      }

      if (filters.intensity) {
        result = result.filter(s => s.intensity === filters.intensity)
      }

      return result
    })
  }

  // Estatísticas básicas
  const stats = computed(() => {
    const total = symptoms.value.length
    const today = new Date().toISOString().split('T')[0]
    const todayCount = symptoms.value.filter(s => s.date === today).length

    const lastWeek = new Date()
    lastWeek.setDate(lastWeek.getDate() - 7)
    const weekStart = lastWeek.toISOString().split('T')[0]
    const weekCount = symptoms.value.filter(s => s.date >= weekStart).length

    const typeStats = SYMPTOM_TYPES.map(type => ({
      ...type,
      count: symptoms.value.filter(s => s.type === type.id).length
    }))

    const avgIntensity = total > 0
      ? (symptoms.value.reduce((sum, s) => sum + s.intensity, 0) / total).toFixed(1)
      : 0

    return {
      total,
      todayCount,
      weekCount,
      typeStats,
      avgIntensity
    }
  })

  // Carrega sintomas ao usar o composable
  const refreshSymptoms = async () => {
    await loadSymptoms()
  }

  return {
    symptoms,
    isLoading,
    error,
    addSymptom,
    updateSymptom,
    deleteSymptom,
    getSymptomsByDate,
    getSymptomsByType,
    getSymptomsByDateRange,
    filteredSymptoms,
    stats,
    refreshSymptoms
  }
}
