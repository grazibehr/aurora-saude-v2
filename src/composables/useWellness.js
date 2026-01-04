import { ref, computed } from 'vue'
import { api } from '../services/api'
import { useSymptoms, SYMPTOM_TYPES } from './useSymptoms'
import { useMedicalRecord } from './useMedicalRecord'

const checkins = ref([])
const isLoading = ref(false)
const error = ref(null)

export function useWellness() {
  const { symptoms, refreshSymptoms } = useSymptoms()
  const { userDiseases, medicalRecord } = useMedicalRecord()

  // === CHECK-IN DIÁRIO ===

  const loadCheckins = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.getCheckins()
      if (response.ok && response.items) {
        checkins.value = response.items
      }
    } catch (err) {
      console.error('Erro ao carregar check-ins:', err)
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  const addCheckin = async (data) => {
    isLoading.value = true
    error.value = null
    try {
      // Mapeia os campos do frontend para o formato esperado pelo backend
      const response = await api.addCheckin({
        mood_level: data.mood,
        energy_level: data.energy,
        sleep_quality: data.sleep || null,
        sleep_hours: data.sleepHours || null,
        notes: data.notes || '',
        checkin_date: new Date().toISOString().split('T')[0]
      })

      if (response.ok) {
        // Recarrega os check-ins
        await loadCheckins()
        return response.checkin
      }
      throw new Error(response.message || 'Erro ao salvar check-in')
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getTodayCheckin = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return checkins.value.find(c => c.checkin_date === today)
  })

  const hasCheckinToday = computed(() => !!getTodayCheckin.value)

  // === ANÁLISE DE TENDÊNCIAS (calculado no frontend com dados do backend) ===

  const weeklyTrendAnalysis = computed(() => {
    const today = new Date()
    const thisWeekStart = new Date(today)
    thisWeekStart.setDate(today.getDate() - 7)

    const lastWeekStart = new Date(thisWeekStart)
    lastWeekStart.setDate(lastWeekStart.getDate() - 7)

    const thisWeekSymptoms = symptoms.value.filter(s => {
      const date = new Date(s.date)
      return date >= thisWeekStart && date <= today
    })

    const lastWeekSymptoms = symptoms.value.filter(s => {
      const date = new Date(s.date)
      return date >= lastWeekStart && date < thisWeekStart
    })

    // Análise por tipo de sintoma
    const typeAnalysis = SYMPTOM_TYPES.filter(t => t.id !== 'outro').map(type => {
      const thisWeekCount = thisWeekSymptoms.filter(s => s.type === type.id).length
      const lastWeekCount = lastWeekSymptoms.filter(s => s.type === type.id).length

      const thisWeekIntensities = thisWeekSymptoms.filter(s => s.type === type.id).map(s => s.intensity)
      const lastWeekIntensities = lastWeekSymptoms.filter(s => s.type === type.id).map(s => s.intensity)

      const thisWeekAvgIntensity = thisWeekIntensities.length > 0
        ? thisWeekIntensities.reduce((a, b) => a + b, 0) / thisWeekIntensities.length
        : 0

      const lastWeekAvgIntensity = lastWeekIntensities.length > 0
        ? lastWeekIntensities.reduce((a, b) => a + b, 0) / lastWeekIntensities.length
        : 0

      let trend = 'stable'
      let trendDescription = 'Estável'

      if (thisWeekCount > 0 || lastWeekCount > 0) {
        // PRIORIDADE 1: Sintomas leves (intensidade <= 2) são considerados como melhora/controle
        if (thisWeekCount > 0 && thisWeekAvgIntensity <= 2) {
          trend = 'improving'
          trendDescription = 'Sintomas leves'
        }
        // PRIORIDADE 2: Não tem mais sintomas esta semana
        else if (thisWeekCount === 0 && lastWeekCount > 0) {
          trend = 'improving'
          trendDescription = 'Sem ocorrências'
        }
        // PRIORIDADE 3: Menos ocorrências = melhora
        else if (thisWeekCount < lastWeekCount * 0.7) {
          trend = 'improving'
          trendDescription = 'Melhorando'
        }
        // PRIORIDADE 4: Intensidade diminuiu significativamente
        else if (thisWeekAvgIntensity < lastWeekAvgIntensity - 0.5) {
          trend = 'improving'
          trendDescription = 'Menos intenso'
        }
        // PRIORIDADE 5: Mais ocorrências E intensidade > 2 (não leve) = piora
        else if (thisWeekCount > lastWeekCount * 1.3 && thisWeekAvgIntensity > 2) {
          trend = 'worsening'
          trendDescription = 'Piorando'
        }
        // PRIORIDADE 6: Intensidade aumentou E > 2 = piora
        else if (thisWeekAvgIntensity > lastWeekAvgIntensity + 0.5 && thisWeekAvgIntensity > 2) {
          trend = 'worsening'
          trendDescription = 'Mais intenso'
        }
        // Caso contrário: estável
      }

      return {
        ...type,
        thisWeekCount,
        lastWeekCount,
        thisWeekAvgIntensity: thisWeekAvgIntensity.toFixed(1),
        lastWeekAvgIntensity: lastWeekAvgIntensity.toFixed(1),
        trend,
        trendDescription,
        change: thisWeekCount - lastWeekCount,
        percentChange: lastWeekCount > 0
          ? Math.round(((thisWeekCount - lastWeekCount) / lastWeekCount) * 100)
          : (thisWeekCount > 0 ? 100 : 0)
      }
    }).filter(t => t.thisWeekCount > 0 || t.lastWeekCount > 0)

    // Score geral
    const improvingCount = typeAnalysis.filter(t => t.trend === 'improving').length
    const worseningCount = typeAnalysis.filter(t => t.trend === 'worsening').length

    let overallTrend = 'stable'
    let overallMessage = 'Seus sintomas estão estáveis esta semana.'

    if (improvingCount > worseningCount && improvingCount > 0) {
      overallTrend = 'improving'
      overallMessage = 'Ótima notícia! Você está melhorando. Continue assim!'
    } else if (worseningCount > improvingCount && worseningCount > 0) {
      overallTrend = 'worsening'
      overallMessage = 'Alguns sintomas pioraram. Considere consultar um profissional.'
    } else if (thisWeekSymptoms.length === 0 && lastWeekSymptoms.length === 0) {
      overallMessage = 'Sem registros recentes. Lembre-se de registrar seus sintomas.'
    }

    return {
      typeAnalysis,
      overallTrend,
      overallMessage,
      improvingCount,
      worseningCount,
      stableCount: typeAnalysis.length - improvingCount - worseningCount,
      thisWeekTotal: thisWeekSymptoms.length,
      lastWeekTotal: lastWeekSymptoms.length
    }
  })

  // Análise de bem-estar baseada nos check-ins
  const wellnessAnalysis = computed(() => {
    if (checkins.value.length === 0) return null

    const last7Days = checkins.value.slice(0, 7)
    const previous7Days = checkins.value.slice(7, 14)

    const calcAvg = (arr, key) => {
      if (arr.length === 0) return 0
      return arr.reduce((sum, c) => sum + (c[key] || 0), 0) / arr.length
    }

    // Usa os nomes de campo do backend: mood_level, energy_level, sleep_quality
    const avgRecent = {
      mood: calcAvg(last7Days, 'mood_level'),
      energy: calcAvg(last7Days, 'energy_level'),
      sleep: calcAvg(last7Days, 'sleep_quality')
    }

    let avgPrevious = null
    let trends = {}

    if (previous7Days.length > 0) {
      avgPrevious = {
        mood: calcAvg(previous7Days, 'mood_level'),
        energy: calcAvg(previous7Days, 'energy_level'),
        sleep: calcAvg(previous7Days, 'sleep_quality')
      }

      const keys = ['mood', 'energy', 'sleep']
      keys.forEach(key => {
        const diff = avgRecent[key] - avgPrevious[key]
        if (diff > 0.3) trends[key] = 'improving'
        else if (diff < -0.3) trends[key] = 'worsening'
        else trends[key] = 'stable'
      })
    }

    return {
      recent: avgRecent,
      previous: avgPrevious,
      trends,
      daysTracked: last7Days.length
    }
  })

  // === SCORE DE SAÚDE ===

  const healthScore = computed(() => {
    let score = 70 // Base

    // Baseado nos check-ins
    if (wellnessAnalysis.value) {
      const { recent } = wellnessAnalysis.value
      // Calcula média dos campos disponíveis (mood, energy, sleep)
      const avgWellness = (recent.mood + recent.energy + (recent.sleep || 0)) / (recent.sleep ? 3 : 2)
      score = Math.round(avgWellness * 20)
    }

    // Ajusta pela tendência
    if (weeklyTrendAnalysis.value.overallTrend === 'improving') {
      score = Math.min(100, score + 10)
    } else if (weeklyTrendAnalysis.value.overallTrend === 'worsening') {
      score = Math.max(0, score - 10)
    }

    let level = 'regular'
    let message = 'Continue monitorando sua saúde.'
    let color = 'yellow'

    if (score >= 80) {
      level = 'excellent'
      message = 'Excelente! Você está no caminho certo.'
      color = 'green'
    } else if (score >= 60) {
      level = 'good'
      message = 'Bom! Pequenos ajustes podem ajudar.'
      color = 'lime'
    } else if (score >= 40) {
      level = 'attention'
      message = 'Atenção: considere alguns cuidados extras.'
      color = 'orange'
    } else {
      level = 'critical'
      message = 'Procure um profissional de saúde.'
      color = 'red'
    }

    return { score, level, message, color }
  })

  // === DICAS PERSONALIZADAS ===

  const getHealthTips = computed(() => {
    const tips = []

    // Baseado nas condições
    userDiseases.value.forEach(disease => {
      const diseaseTips = HEALTH_TIPS[disease.id] || HEALTH_TIPS[disease.category]
      if (diseaseTips) {
        tips.push(...diseaseTips.slice(0, 2).map(tip => ({
          ...tip,
          source: disease.name
        })))
      }
    })

    // Baseado nos sintomas recentes
    const recentTypes = [...new Set(symptoms.value.slice(0, 10).map(s => s.type))]
    recentTypes.forEach(type => {
      const symptomTips = SYMPTOM_TIPS[type]
      if (symptomTips) {
        tips.push(...symptomTips.slice(0, 1))
      }
    })

    // Remove duplicatas
    const unique = tips.reduce((acc, tip) => {
      if (!acc.find(t => t.title === tip.title)) acc.push(tip)
      return acc
    }, [])

    return unique.slice(0, 6)
  })

  // === COMPATIBILIDADE DE MEDICAMENTOS ===

  const checkMedicationCompatibility = computed(() => {
    const medications = medicalRecord.value?.medications || []

    if (medications.length < 2) {
      return { hasIssues: false, warnings: [], suggestions: [] }
    }

    const warnings = []
    const suggestions = []

    // Verifica combinações conhecidas
    const medNames = medications.map(m => m.name.toLowerCase())

    MEDICATION_INTERACTIONS.forEach(interaction => {
      const drug1Present = medNames.some(m => m.includes(interaction.drug1.toLowerCase()))
      const drug2Present = medNames.some(m => m.includes(interaction.drug2.toLowerCase()))

      if (drug1Present && drug2Present) {
        warnings.push({
          drugs: [interaction.drug1, interaction.drug2],
          severity: interaction.severity,
          description: interaction.description,
          recommendation: interaction.recommendation
        })
      }
    })

    // Sugestões gerais
    if (medications.length >= 3) {
      suggestions.push({
        title: 'Polifarmácia',
        description: 'Você usa 3 ou mais medicamentos. Converse com seu médico sobre possíveis interações.',
        icon: 'AlertTriangle'
      })
    }

    // Verifica horários
    const sameTimeMeds = medications.filter(m =>
      medications.some(other => other.id !== m.id && other.frequency === m.frequency)
    )
    if (sameTimeMeds.length > 0) {
      suggestions.push({
        title: 'Horários de medicamentos',
        description: 'Alguns medicamentos são tomados no mesmo horário. Verifique com seu médico se podem ser tomados juntos.',
        icon: 'Clock'
      })
    }

    return {
      hasIssues: warnings.length > 0,
      warnings,
      suggestions,
      totalMedications: medications.length
    }
  })

  // Função para carregar todos os dados necessários
  const refreshAll = async () => {
    await Promise.all([
      loadCheckins(),
      refreshSymptoms()
    ])
  }

  return {
    // Estado
    checkins,
    isLoading,
    error,
    // Check-ins
    loadCheckins,
    addCheckin,
    getTodayCheckin,
    hasCheckinToday,
    // Análises
    weeklyTrendAnalysis,
    wellnessAnalysis,
    healthScore,
    // Dicas
    getHealthTips,
    // Medicamentos
    checkMedicationCompatibility,
    // Refresh
    refreshAll,
    refreshSymptoms
  }
}

// === BANCO DE INTERAÇÕES MEDICAMENTOSAS ===
const MEDICATION_INTERACTIONS = [
  {
    drug1: 'Aspirina',
    drug2: 'Ibuprofeno',
    severity: 'moderate',
    description: 'Podem aumentar o risco de sangramento gastrointestinal.',
    recommendation: 'Evite tomar juntos ou consulte seu médico.'
  },
  {
    drug1: 'Omeprazol',
    drug2: 'Clopidogrel',
    severity: 'high',
    description: 'Omeprazol pode reduzir a eficácia do Clopidogrel.',
    recommendation: 'Consulte seu médico sobre alternativas.'
  },
  {
    drug1: 'Fluoxetina',
    drug2: 'Tramadol',
    severity: 'high',
    description: 'Risco de síndrome serotoninérgica.',
    recommendation: 'Evite essa combinação. Consulte seu médico.'
  },
  {
    drug1: 'Metformina',
    drug2: 'Contraste iodado',
    severity: 'high',
    description: 'Risco de acidose lática.',
    recommendation: 'Suspenda Metformina antes de exames com contraste.'
  },
  {
    drug1: 'Varfarina',
    drug2: 'Vitamina K',
    severity: 'moderate',
    description: 'Vitamina K pode reduzir o efeito anticoagulante.',
    recommendation: 'Mantenha consumo constante de vitamina K.'
  },
  {
    drug1: 'Losartana',
    drug2: 'Espironolactona',
    severity: 'moderate',
    description: 'Risco de hipercalemia (potássio alto).',
    recommendation: 'Monitore níveis de potássio regularmente.'
  },
  {
    drug1: 'Sinvastatina',
    drug2: 'Amiodarona',
    severity: 'high',
    description: 'Risco aumentado de miopatia.',
    recommendation: 'Limite a dose de Sinvastatina ou use alternativa.'
  },
  {
    drug1: 'Antidepressivo',
    drug2: 'Anti-inflamatório',
    severity: 'moderate',
    description: 'Podem aumentar risco de sangramento.',
    recommendation: 'Use com cautela e monitore sinais de sangramento.'
  }
]

// === DICAS POR CONDIÇÃO ===
const HEALTH_TIPS = {
  // Mental
  'F32': [
    { icon: 'Sun', title: 'Exponha-se à luz', description: 'A luz solar ajuda a regular o humor. Tente sair ao ar livre pela manhã.' },
    { icon: 'Activity', title: 'Movimento diário', description: 'Exercícios leves liberam endorfinas. Uma caminhada de 20 min já ajuda.' }
  ],
  'F41': [
    { icon: 'Wind', title: 'Respiração 4-7-8', description: 'Inspire 4s, segure 7s, expire 8s. Repita 4 vezes para acalmar.' },
    { icon: 'Coffee', title: 'Reduza estimulantes', description: 'Cafeína e açúcar podem piorar a ansiedade. Modere o consumo.' }
  ],
  'mental': [
    { icon: 'Moon', title: 'Higiene do sono', description: 'Durma e acorde nos mesmos horários. Evite telas 1h antes de dormir.' },
    { icon: 'Users', title: 'Conexões sociais', description: 'Converse com alguém de confiança. Você não precisa enfrentar sozinho.' }
  ],

  // Cardiovascular
  'I10': [
    { icon: 'Utensils', title: 'Reduza o sódio', description: 'Limite sal e alimentos processados. Use ervas para temperar.' },
    { icon: 'Activity', title: 'Monitore a pressão', description: 'Meça sua pressão regularmente e anote os valores.' }
  ],
  'cardiovascular': [
    { icon: 'Heart', title: 'Cuide do coração', description: 'Exercícios aeróbicos moderados fortalecem o coração.' }
  ],

  // Endócrino
  'E11': [
    { icon: 'Utensils', title: 'Carboidratos complexos', description: 'Prefira integrais. Eles liberam açúcar mais lentamente.' },
    { icon: 'Activity', title: 'Glicose regular', description: 'Faça refeições em horários regulares para estabilizar a glicose.' }
  ],
  'endocrine': [
    { icon: 'Clock', title: 'Rotina alimentar', description: 'Coma em horários regulares para manter o metabolismo estável.' }
  ],

  // Neurológico
  'G43': [
    { icon: 'Droplet', title: 'Hidratação', description: 'Desidratação é gatilho comum de enxaqueca. Beba água regularmente.' },
    { icon: 'Moon', title: 'Sono regular', description: 'Dormir muito ou pouco pode desencadear crises.' }
  ],
  'neurological': [
    { icon: 'Brain', title: 'Anote gatilhos', description: 'Identifique o que desencadeia seus sintomas para evitá-los.' }
  ],

  // Respiratório
  'J45': [
    { icon: 'Wind', title: 'Evite gatilhos', description: 'Poeira, mofo e pelos de animais podem piorar a asma.' },
    { icon: 'Home', title: 'Ar limpo', description: 'Mantenha ambientes arejados e limpos.' }
  ],
  'respiratory': [
    { icon: 'Wind', title: 'Exercícios respiratórios', description: 'Fortaleça sua respiração com exercícios diafragmáticos.' }
  ]
}

// === DICAS POR SINTOMA ===
const SYMPTOM_TIPS = {
  'dor': [
    { icon: 'Thermometer', title: 'Calor ou frio', description: 'Compressas podem aliviar dores. Teste qual funciona melhor para você.' }
  ],
  'febre': [
    { icon: 'Droplet', title: 'Hidrate-se bem', description: 'Beba muita água e descanse. A febre indica que o corpo está lutando.' }
  ],
  'enjoo': [
    { icon: 'Leaf', title: 'Gengibre ajuda', description: 'Chá de gengibre em pequenos goles pode aliviar náuseas.' }
  ],
  'fadiga': [
    { icon: 'Moon', title: 'Priorize o sono', description: 'Fadiga crônica pode indicar sono insuficiente ou de má qualidade.' }
  ],
  'ansiedade': [
    { icon: 'Wind', title: 'Grounding', description: 'Foque em 5 coisas que vê, 4 que ouve, 3 que toca para se ancorar.' }
  ],
  'insonia': [
    { icon: 'Smartphone', title: 'Digital detox', description: 'Evite telas 1h antes de dormir. A luz azul prejudica o sono.' }
  ]
}
