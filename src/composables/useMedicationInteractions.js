import { ref, computed, watch } from 'vue'
import {
  MEDICATION_INTERACTIONS,
  MEDICATION_SIDE_EFFECTS,
  INTERACTION_SYNDROMES,
  normalizeMedicationName,
  isSameMedication,
  findMedicationInDatabase,
  getMedicationClass
} from '../data/medicationData'
import { safeLocalStorageGet, safeLocalStorageSet } from '../utils/security'

const STORAGE_KEY = 'aurora_medication_alerts'

// Estado global dos alertas
const activeAlerts = ref([])
const acknowledgedAlerts = ref([])

// Carrega alertas do localStorage
const loadAlerts = () => {
  const saved = safeLocalStorageGet(STORAGE_KEY, null)
  if (saved) {
    activeAlerts.value = saved.active || []
    acknowledgedAlerts.value = saved.acknowledged || []
  }
}

// Salva alertas no localStorage
const saveAlerts = () => {
  safeLocalStorageSet(STORAGE_KEY, {
    active: activeAlerts.value,
    acknowledged: acknowledgedAlerts.value
  })
}

loadAlerts()

export function useMedicationInteractions() {
  /**
   * Verifica interacoes entre uma lista de medicamentos
   * @param {Array} medications - Lista de medicamentos do usuario
   * @returns {Array} Lista de interacoes encontradas
   */
  const checkInteractions = (medications) => {
    if (!medications || medications.length < 2) return []

    const interactions = []
    const medicationNames = medications.map(m => m.name)

    // Verifica cada par de medicamentos
    for (let i = 0; i < medicationNames.length; i++) {
      for (let j = i + 1; j < medicationNames.length; j++) {
        const med1 = medicationNames[i]
        const med2 = medicationNames[j]

        // Busca interacao direta
        const directInteraction = findDirectInteraction(med1, med2)
        if (directInteraction) {
          interactions.push({
            ...directInteraction,
            medications: [med1, med2],
            id: `${normalizeMedicationName(med1)}_${normalizeMedicationName(med2)}`
          })
          continue
        }

        // Busca interacao por classe
        const classInteraction = findClassInteraction(med1, med2)
        if (classInteraction) {
          interactions.push({
            ...classInteraction,
            medications: [med1, med2],
            id: `${normalizeMedicationName(med1)}_${normalizeMedicationName(med2)}`
          })
        }
      }
    }

    // Verifica polifarmacia (3+ medicamentos)
    if (medications.length >= 3) {
      interactions.push({
        severity: 'low',
        description: `Voce esta usando ${medications.length} medicamentos. Polifarmacia aumenta risco de interacoes.`,
        recommendation: 'Revise seus medicamentos com seu medico regularmente.',
        medications: medicationNames,
        id: 'polypharmacy_alert',
        isPolypharmacy: true
      })
    }

    return interactions
  }

  /**
   * Busca interacao direta entre dois medicamentos
   */
  const findDirectInteraction = (med1, med2) => {
    for (const interaction of MEDICATION_INTERACTIONS) {
      const matchDrug1 = isSameMedication(med1, interaction.drug1) || isSameMedication(med2, interaction.drug1)
      const matchDrug2 = isSameMedication(med1, interaction.drug2) || isSameMedication(med2, interaction.drug2)

      if (matchDrug1 && matchDrug2) {
        return {
          severity: interaction.severity,
          description: interaction.description,
          recommendation: interaction.recommendation,
          symptoms: interaction.symptoms || []
        }
      }
    }
    return null
  }

  /**
   * Busca interacao por classe de medicamento
   */
  const findClassInteraction = (med1, med2) => {
    const class1 = getMedicationClass(med1)
    const class2 = getMedicationClass(med2)

    if (!class1 || !class2) return null

    // Interacoes conhecidas entre classes
    const classInteractions = {
      'anti-inflamatorio_anticoagulante': {
        severity: 'high',
        description: 'Anti-inflamatorios aumentam risco de sangramento com anticoagulantes.',
        recommendation: 'Evite essa combinacao ou use com muito cuidado.'
      },
      'antidepressivo_anti-inflamatorio': {
        severity: 'moderate',
        description: 'Podem aumentar risco de sangramento.',
        recommendation: 'Use com cautela.'
      },
      'betabloqueador_antidiabetico': {
        severity: 'moderate',
        description: 'Betabloqueadores podem mascarar sintomas de hipoglicemia.',
        recommendation: 'Monitore glicemia com frequencia.'
      },
      'estatina_antibiotico': {
        severity: 'moderate',
        description: 'Alguns antibioticos aumentam niveis de estatinas.',
        recommendation: 'Monitore dores musculares durante o tratamento.'
      }
    }

    const key1 = `${class1}_${class2}`
    const key2 = `${class2}_${class1}`

    return classInteractions[key1] || classInteractions[key2] || null
  }

  /**
   * Retorna efeitos colaterais de um medicamento
   * @param {string} medicationName - Nome do medicamento
   * @returns {Array} Lista de sintomas possiveis
   */
  const getSideEffects = (medicationName) => {
    const found = findMedicationInDatabase(medicationName)
    return found ? found.sideEffects : []
  }

  /**
   * Analisa se um sintoma pode ser causado por medicamentos
   * @param {string} symptomType - Tipo do sintoma (ex: 'nausea', 'tontura')
   * @param {Array} medications - Lista de medicamentos do usuario
   * @returns {Array} Medicamentos que podem causar o sintoma
   */
  const analyzeSymptomCauses = (symptomType, medications) => {
    if (!medications || !symptomType) return []

    const possibleCauses = []

    for (const med of medications) {
      const sideEffects = getSideEffects(med.name)
      if (sideEffects.includes(symptomType)) {
        possibleCauses.push({
          medication: med.name,
          likelihood: 'possible',
          description: `${med.name} pode causar ${getSymptomLabel(symptomType)} como efeito colateral.`
        })
      }
    }

    // Verifica se pode ser sintoma de interacao
    const interactions = checkInteractions(medications)
    for (const interaction of interactions) {
      if (interaction.symptoms && interaction.symptoms.includes(symptomType)) {
        possibleCauses.push({
          medication: interaction.medications.join(' + '),
          likelihood: 'interaction',
          description: `A combinacao de ${interaction.medications.join(' e ')} pode causar ${getSymptomLabel(symptomType)}.`,
          severity: interaction.severity
        })
      }
    }

    return possibleCauses
  }

  /**
   * Analisa todos os sintomas do usuario vs medicamentos
   * @param {Array} symptoms - Lista de sintomas recentes
   * @param {Array} medications - Lista de medicamentos
   * @returns {Array} Analise de possiveis causas
   */
  const analyzeAllSymptoms = (symptoms, medications) => {
    if (!symptoms || !medications || symptoms.length === 0 || medications.length === 0) {
      return []
    }

    const analysis = []
    const symptomTypes = [...new Set(symptoms.map(s => s.type))]

    for (const symptomType of symptomTypes) {
      const causes = analyzeSymptomCauses(symptomType, medications)
      if (causes.length > 0) {
        analysis.push({
          symptom: symptomType,
          symptomLabel: getSymptomLabel(symptomType),
          possibleCauses: causes,
          count: symptoms.filter(s => s.type === symptomType).length
        })
      }
    }

    // Ordena por quantidade de ocorrencias
    return analysis.sort((a, b) => b.count - a.count)
  }

  /**
   * Atualiza alertas ativos baseado na lista de medicamentos
   */
  const updateAlerts = (medications) => {
    const interactions = checkInteractions(medications)

    // Filtra interacoes que nao foram reconhecidas
    const newAlerts = interactions.filter(interaction => {
      return !acknowledgedAlerts.value.includes(interaction.id)
    })

    activeAlerts.value = newAlerts
    saveAlerts()
  }

  /**
   * Marca um alerta como reconhecido
   */
  const acknowledgeAlert = (alertId) => {
    if (!acknowledgedAlerts.value.includes(alertId)) {
      acknowledgedAlerts.value.push(alertId)
      activeAlerts.value = activeAlerts.value.filter(a => a.id !== alertId)
      saveAlerts()
    }
  }

  /**
   * Reseta alertas reconhecidos (ex: quando medicamento e removido)
   */
  const resetAcknowledgedAlerts = () => {
    acknowledgedAlerts.value = []
    saveAlerts()
  }

  /**
   * Retorna label amigavel do sintoma
   */
  const getSymptomLabel = (symptomType) => {
    const labels = {
      'dor': 'Dor de cabeca',
      'febre': 'Febre',
      'enjoo': 'Enjoo',
      'nausea': 'Nausea',
      'fadiga': 'Fadiga',
      'ansiedade': 'Ansiedade',
      'insonia': 'Insonia',
      'tosse': 'Tosse',
      'tontura': 'Tontura',
      'dor_peito': 'Dor no peito',
      'falta_ar': 'Falta de ar',
      'dor_abdominal': 'Dor abdominal',
      'diarreia': 'Diarreia',
      'tremor': 'Tremores',
      'confusao': 'Confusao mental',
      'palpitacao': 'Palpitacoes',
      'fraqueza': 'Fraqueza muscular'
    }
    return labels[symptomType] || symptomType
  }

  /**
   * Retorna cor baseada na severidade
   */
  const getSeverityColor = (severity) => {
    const colors = {
      'low': 'blue',
      'moderate': 'yellow',
      'high': 'red'
    }
    return colors[severity] || 'gray'
  }

  /**
   * Retorna label da severidade
   */
  const getSeverityLabel = (severity) => {
    const labels = {
      'low': 'Baixa',
      'moderate': 'Moderada',
      'high': 'Alta'
    }
    return labels[severity] || 'Desconhecida'
  }

  // Computed: alertas de alta severidade
  const highSeverityAlerts = computed(() => {
    return activeAlerts.value.filter(a => a.severity === 'high')
  })

  // Computed: tem alertas ativos
  const hasActiveAlerts = computed(() => {
    return activeAlerts.value.length > 0
  })

  // Computed: quantidade de alertas
  const alertCount = computed(() => {
    return activeAlerts.value.length
  })

  return {
    // Estado
    activeAlerts,
    acknowledgedAlerts,
    hasActiveAlerts,
    alertCount,
    highSeverityAlerts,

    // Funcoes de verificacao
    checkInteractions,
    getSideEffects,
    analyzeSymptomCauses,
    analyzeAllSymptoms,

    // Funcoes de gerenciamento
    updateAlerts,
    acknowledgeAlert,
    resetAcknowledgedAlerts,

    // Utilitarios
    getSymptomLabel,
    getSeverityColor,
    getSeverityLabel,
    findMedicationInDatabase,
    getMedicationClass
  }
}
