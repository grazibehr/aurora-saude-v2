import { ref, computed } from 'vue'
import { api } from '../services/api'
import {
  generateId,
  safeLocalStorageGet,
  safeLocalStorageSet,
  sanitizeInput
} from '../utils/security'
import { DISEASES, getDiseaseById, getCommonSymptomsForDiseases } from '../data/diseases'

const STORAGE_KEY = 'aurora_medical_record'

// Estrutura da ficha médica
// diseases agora é array de objetos: { cidCode: 'F32', dbId: 1 } para suportar backend
const defaultMedicalRecord = {
  diseases: [],        // Lista de objetos { cidCode, dbId } ou strings legadas
  medications: [],     // Lista de medicamentos
  allergies: [],       // Lista de alergias
  bloodType: '',       // Tipo sanguineo
  emergencyContact: {  // Contato de emergencia
    name: '',
    phone: '',
    relationship: ''
  },
  notes: '',           // Observacoes gerais
  updatedAt: null
}

// Helper para normalizar diseases (suporta formato antigo de strings e novo de objetos)
const normalizeDiseaseEntry = (entry) => {
  if (typeof entry === 'string') {
    return { cidCode: entry, dbId: null }
  }
  return entry
}

// Helper para obter o código CID de uma entrada
const getCidCode = (entry) => {
  if (typeof entry === 'string') return entry
  return entry?.cidCode || entry?.cid_code
}

// Validador para o localStorage
function validateMedicalRecord(data) {
  if (typeof data !== 'object' || data === null) return false
  if (!Array.isArray(data.diseases)) return false
  if (!Array.isArray(data.medications)) return false
  if (!Array.isArray(data.allergies)) return false
  return true
}

const medicalRecord = ref(null)
const isLoading = ref(false)
const error = ref(null)
const useLocalStorage = ref(false)

// Carrega do localStorage primeiro para UI rápida
const loadFromLocalStorage = () => {
  const saved = safeLocalStorageGet(STORAGE_KEY, null, validateMedicalRecord)
  medicalRecord.value = saved || { ...defaultMedicalRecord }
}

loadFromLocalStorage()

// Carrega do backend
const loadMedicalRecord = async () => {
  isLoading.value = true
  error.value = null

  try {
    const response = await api.getMedicalRecord()
    if (response.ok) {
      // diseases, medications, allergies estão no nível superior da resposta
      // medical_record contém blood_type, emergency_contact, etc.
      const record = response.medical_record || {}

      // Mapeia diseases do backend para formato interno { cidCode, dbId }
      const mappedDiseases = (response.diseases || []).map(d => ({
        cidCode: d.cid_code,
        dbId: d.id,
        name: d.disease_name
      }))

      // Mapeia medications do backend para formato interno
      const mappedMedications = (response.medications || []).map(m => ({
        id: m.id,
        name: m.name,
        dosage: m.dosage || '',
        frequency: m.frequency || '',
        notes: m.notes || '',
        active: m.active
      }))

      // Mapeia allergies do backend para formato interno
      const mappedAllergies = (response.allergies || []).map(a => ({
        id: a.id,
        name: a.allergen,
        severity: a.severity || 'moderate',
        notes: a.notes || ''
      }))

      medicalRecord.value = {
        diseases: mappedDiseases,
        medications: mappedMedications,
        allergies: mappedAllergies,
        bloodType: record.blood_type || '',
        emergencyContact: {
          name: record.emergency_contact_name || '',
          phone: record.emergency_contact_phone || '',
          relationship: record.emergency_contact_relationship || ''
        },
        notes: record.observations || '',
        updatedAt: record.updated_at
      }
      useLocalStorage.value = false
      // Sync com localStorage
      safeLocalStorageSet(STORAGE_KEY, medicalRecord.value)
    } else {
      throw new Error('API response invalid')
    }
  } catch (err) {
    console.warn('API indisponivel, usando localStorage:', err.message)
    useLocalStorage.value = true
  } finally {
    isLoading.value = false
  }
}

const saveMedicalRecord = async () => {
  medicalRecord.value.updatedAt = new Date().toISOString()
  safeLocalStorageSet(STORAGE_KEY, medicalRecord.value)

  // Tenta sincronizar com backend
  if (!useLocalStorage.value) {
    try {
      await api.updateMedicalRecord({
        diseases: medicalRecord.value.diseases,
        medications: medicalRecord.value.medications,
        allergies: medicalRecord.value.allergies,
        blood_type: medicalRecord.value.bloodType,
        emergency_contact: medicalRecord.value.emergencyContact,
        notes: medicalRecord.value.notes
      })
    } catch (err) {
      console.warn('Erro ao sincronizar com backend:', err.message)
    }
  }
}

export function useMedicalRecord() {
  // === DOENCAS ===

  // Verifica se uma doença já está cadastrada (suporta formato antigo e novo)
  const hasDiseaseByCode = (cidCode) => {
    return medicalRecord.value.diseases.some(entry => getCidCode(entry) === cidCode)
  }

  const addDisease = async (diseaseId) => {
    // diseaseId aqui é o código CID como 'F32'
    if (!hasDiseaseByCode(diseaseId)) {
      const disease = getDiseaseById(diseaseId)
      if (disease) {
        let dbId = null

        // Tenta adicionar via API
        try {
          const response = await api.addDiseaseToRecord({
            name: disease.name,
            code: disease.code
          })
          if (response.ok && response.disease) {
            dbId = response.disease.id
          }
          useLocalStorage.value = false
        } catch (err) {
          console.warn('Adicionando doenca localmente:', err.message)
          useLocalStorage.value = true
        }

        // Armazena no formato novo { cidCode, dbId }
        medicalRecord.value.diseases.push({
          cidCode: diseaseId,
          dbId: dbId,
          name: disease.name
        })
        await saveMedicalRecord()
      }
    }
  }

  const removeDisease = async (diseaseId) => {
    // diseaseId pode ser o código CID ou um objeto
    const cidCode = typeof diseaseId === 'string' ? diseaseId : diseaseId?.cidCode

    const index = medicalRecord.value.diseases.findIndex(entry => getCidCode(entry) === cidCode)
    if (index > -1) {
      const entry = normalizeDiseaseEntry(medicalRecord.value.diseases[index])

      // Tenta remover via API usando o dbId
      if (entry.dbId) {
        try {
          await api.removeDiseaseFromRecord(entry.dbId)
          // Só remove localmente se API teve sucesso
          medicalRecord.value.diseases.splice(index, 1)
          await saveMedicalRecord()
        } catch (err) {
          console.error('Erro ao remover doença:', err.message)
          throw new Error('Não foi possível remover a condição. Tente novamente.')
        }
      } else {
        // Se não tem dbId, é um item local apenas
        medicalRecord.value.diseases.splice(index, 1)
        await saveMedicalRecord()
      }
    }
  }

  const userDiseases = computed(() => {
    return medicalRecord.value.diseases
      .map(entry => {
        const cidCode = getCidCode(entry)
        const disease = getDiseaseById(cidCode)
        if (disease) {
          // Adiciona o dbId ao objeto da doença para uso na remoção
          return { ...disease, dbId: entry.dbId }
        }
        // Se não encontrar no catálogo local, usa os dados do backend
        if (typeof entry === 'object' && entry.name) {
          return {
            id: entry.cidCode,
            code: entry.cidCode,
            name: entry.name,
            dbId: entry.dbId,
            category: 'other'
          }
        }
        return null
      })
      .filter(Boolean)
  })

  // === MEDICAMENTOS ===
  const addMedication = async (medication) => {
    const newMed = {
      id: generateId(),
      name: sanitizeInput(medication.name, 100),
      dosage: sanitizeInput(medication.dosage || '', 50),
      frequency: sanitizeInput(medication.frequency || '', 50),
      notes: sanitizeInput(medication.notes || '', 200),
      createdAt: new Date().toISOString()
    }

    // Tenta adicionar via API
    try {
      const response = await api.addMedication({
        name: newMed.name,
        dosage: newMed.dosage,
        frequency: newMed.frequency,
        notes: newMed.notes
      })
      if (response.ok && response.medication) {
        newMed.id = response.medication.id
      }
    } catch (err) {
      console.warn('Adicionando medicamento localmente:', err.message)
    }

    medicalRecord.value.medications.push(newMed)
    await saveMedicalRecord()
    return newMed
  }

  const removeMedication = async (medicationId) => {
    const index = medicalRecord.value.medications.findIndex(m => m.id === medicationId)
    if (index > -1) {
      // Tenta remover via API primeiro
      try {
        await api.removeMedication(medicationId)
        // Só remove localmente se API teve sucesso
        medicalRecord.value.medications.splice(index, 1)
        await saveMedicalRecord()
      } catch (err) {
        console.error('Erro ao remover medicamento:', err.message)
        throw new Error('Não foi possível remover o medicamento. Tente novamente.')
      }
    }
  }

  const updateMedication = async (medicationId, updates) => {
    const index = medicalRecord.value.medications.findIndex(m => m.id === medicationId)
    if (index > -1) {
      medicalRecord.value.medications[index] = {
        ...medicalRecord.value.medications[index],
        ...updates
      }
      await saveMedicalRecord()
    }
  }

  // === ALERGIAS ===
  const addAllergy = async (allergy) => {
    const newAllergy = {
      id: generateId(),
      name: sanitizeInput(allergy.name, 100),
      severity: allergy.severity || 'moderate', // mild, moderate, severe
      notes: sanitizeInput(allergy.notes || '', 200),
      createdAt: new Date().toISOString()
    }

    // Tenta adicionar via API
    try {
      const response = await api.addAllergy({
        name: newAllergy.name,
        severity: newAllergy.severity,
        notes: newAllergy.notes
      })
      if (response.ok && response.allergy) {
        newAllergy.id = response.allergy.id
      }
    } catch (err) {
      console.warn('Adicionando alergia localmente:', err.message)
    }

    medicalRecord.value.allergies.push(newAllergy)
    await saveMedicalRecord()
    return newAllergy
  }

  const removeAllergy = async (allergyId) => {
    const index = medicalRecord.value.allergies.findIndex(a => a.id === allergyId)
    if (index > -1) {
      // Tenta remover via API primeiro
      try {
        await api.removeAllergy(allergyId)
        // Só remove localmente se API teve sucesso
        medicalRecord.value.allergies.splice(index, 1)
        await saveMedicalRecord()
      } catch (err) {
        console.error('Erro ao remover alergia:', err.message)
        throw new Error('Não foi possível remover a alergia. Tente novamente.')
      }
    }
  }

  // === OUTRAS INFORMACOES ===
  const updateBloodType = async (bloodType) => {
    medicalRecord.value.bloodType = sanitizeInput(bloodType, 10)
    await saveMedicalRecord()

    // Sincroniza com backend
    try {
      await api.updateMedicalInfo({
        bloodType: medicalRecord.value.bloodType,
        emergencyContact: medicalRecord.value.emergencyContact,
        notes: medicalRecord.value.notes
      })
    } catch (err) {
      console.warn('Erro ao sincronizar tipo sanguíneo:', err.message)
    }
  }

  const updateEmergencyContact = async (contact) => {
    medicalRecord.value.emergencyContact = {
      name: sanitizeInput(contact.name || '', 100),
      phone: sanitizeInput(contact.phone || '', 20),
      relationship: sanitizeInput(contact.relationship || '', 50)
    }
    await saveMedicalRecord()

    // Sincroniza com backend
    try {
      await api.updateMedicalInfo({
        bloodType: medicalRecord.value.bloodType,
        emergencyContact: medicalRecord.value.emergencyContact,
        notes: medicalRecord.value.notes
      })
    } catch (err) {
      console.warn('Erro ao sincronizar contato de emergência:', err.message)
    }
  }

  const updateNotes = async (notes) => {
    medicalRecord.value.notes = sanitizeInput(notes, 1000)
    await saveMedicalRecord()

    // Sincroniza com backend
    try {
      await api.updateMedicalInfo({
        bloodType: medicalRecord.value.bloodType,
        emergencyContact: medicalRecord.value.emergencyContact,
        notes: medicalRecord.value.notes
      })
    } catch (err) {
      console.warn('Erro ao sincronizar observações:', err.message)
    }
  }

  // === ANALISE E INSIGHTS ===

  // Retorna sintomas esperados baseado nas doencas cadastradas
  const expectedSymptoms = computed(() => {
    return getCommonSymptomsForDiseases(medicalRecord.value.diseases)
  })

  // Verifica se um sintoma está relacionado às doencas do usuário
  const isSymptomRelatedToConditions = (symptomType) => {
    return medicalRecord.value.diseases.some(diseaseId => {
      const disease = getDiseaseById(diseaseId)
      return disease?.commonSymptoms?.includes(symptomType)
    })
  }

  // Retorna doencas relacionadas a um sintoma específico
  const getRelatedDiseases = (symptomType) => {
    return userDiseases.value.filter(disease =>
      disease.commonSymptoms?.includes(symptomType)
    )
  }

  // Estatísticas da ficha
  const stats = computed(() => ({
    totalDiseases: medicalRecord.value.diseases.length,
    totalMedications: medicalRecord.value.medications.length,
    totalAllergies: medicalRecord.value.allergies.length,
    hasMentalHealth: userDiseases.value.some(d => d.category === 'mental'),
    hasChronicCondition: medicalRecord.value.diseases.length > 0,
    lastUpdated: medicalRecord.value.updatedAt
  }))

  // Refresh dos dados do servidor
  const refreshMedicalRecord = async () => {
    await loadMedicalRecord()
  }

  // Reseta a ficha médica (usado no logout/troca de usuário)
  const resetMedicalRecord = () => {
    medicalRecord.value = { ...defaultMedicalRecord }
  }

  return {
    medicalRecord,
    isLoading,
    error,
    // Doencas
    addDisease,
    removeDisease,
    userDiseases,
    // Medicamentos
    addMedication,
    removeMedication,
    updateMedication,
    // Alergias
    addAllergy,
    removeAllergy,
    // Outras info
    updateBloodType,
    updateEmergencyContact,
    updateNotes,
    // Analise
    expectedSymptoms,
    isSymptomRelatedToConditions,
    getRelatedDiseases,
    stats,
    // Refresh
    refreshMedicalRecord,
    resetMedicalRecord
  }
}
