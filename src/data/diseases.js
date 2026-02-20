// Lista de doenças baseada no CID-10 (simplificada)
// Categorias: physical (física), mental (mental/psicológica)

export const DISEASE_CATEGORIES = [
  { id: 'mental', label: 'Saúde Mental', color: 'teal' },
  { id: 'cardiovascular', label: 'Cardiovascular', color: 'red' },
  { id: 'respiratory', label: 'Respiratório', color: 'blue' },
  { id: 'endocrine', label: 'Endócrino/Metabólico', color: 'orange' },
  { id: 'neurological', label: 'Neurológico', color: 'indigo' },
  { id: 'musculoskeletal', label: 'Musculoesquelético', color: 'green' },
  { id: 'gastrointestinal', label: 'Gastrointestinal', color: 'yellow' },
  { id: 'dermatological', label: 'Dermatológico', color: 'pink' },
  { id: 'immunological', label: 'Imunológico', color: 'teal' },
  { id: 'other', label: 'Outras', color: 'gray' }
]

export const DISEASES = [
  // === SAÚDE MENTAL (F00-F99) ===
  { id: 'F32', code: 'F32', name: 'Depressão', category: 'mental', commonSymptoms: ['fadiga', 'insonia', 'ansiedade'] },
  { id: 'F41', code: 'F41', name: 'Transtorno de Ansiedade Generalizada', category: 'mental', commonSymptoms: ['ansiedade', 'insonia', 'dor'] },
  { id: 'F41.0', code: 'F41.0', name: 'Transtorno de Pânico', category: 'mental', commonSymptoms: ['ansiedade', 'dor'] },
  { id: 'F41.1', code: 'F41.1', name: 'Ansiedade Generalizada', category: 'mental', commonSymptoms: ['ansiedade', 'insonia'] },
  { id: 'F31', code: 'F31', name: 'Transtorno Bipolar', category: 'mental', commonSymptoms: ['insonia', 'fadiga', 'ansiedade'] },
  { id: 'F20', code: 'F20', name: 'Esquizofrenia', category: 'mental', commonSymptoms: ['insonia', 'ansiedade'] },
  { id: 'F42', code: 'F42', name: 'Transtorno Obsessivo-Compulsivo (TOC)', category: 'mental', commonSymptoms: ['ansiedade', 'insonia'] },
  { id: 'F43.1', code: 'F43.1', name: 'Transtorno de Estresse Pós-Traumático', category: 'mental', commonSymptoms: ['ansiedade', 'insonia', 'fadiga'] },
  { id: 'F50.0', code: 'F50.0', name: 'Anorexia Nervosa', category: 'mental', commonSymptoms: ['fadiga', 'enjoo'] },
  { id: 'F50.2', code: 'F50.2', name: 'Bulimia Nervosa', category: 'mental', commonSymptoms: ['enjoo', 'fadiga'] },
  { id: 'F90', code: 'F90', name: 'TDAH - Déficit de Atenção e Hiperatividade', category: 'mental', commonSymptoms: ['ansiedade', 'insonia'] },
  { id: 'F33', code: 'F33', name: 'Transtorno Depressivo Recorrente', category: 'mental', commonSymptoms: ['fadiga', 'insonia', 'ansiedade'] },
  { id: 'F40', code: 'F40', name: 'Fobias', category: 'mental', commonSymptoms: ['ansiedade'] },
  { id: 'F51', code: 'F51', name: 'Distúrbios do Sono', category: 'mental', commonSymptoms: ['insonia', 'fadiga'] },

  // === CARDIOVASCULAR (I00-I99) ===
  { id: 'I10', code: 'I10', name: 'Hipertensão Arterial', category: 'cardiovascular', commonSymptoms: ['dor', 'fadiga'] },
  { id: 'I25', code: 'I25', name: 'Doença Cardíaca Isquêmica', category: 'cardiovascular', commonSymptoms: ['dor', 'fadiga'] },
  { id: 'I50', code: 'I50', name: 'Insuficiência Cardíaca', category: 'cardiovascular', commonSymptoms: ['fadiga', 'dor'] },
  { id: 'I20', code: 'I20', name: 'Angina', category: 'cardiovascular', commonSymptoms: ['dor'] },
  { id: 'I48', code: 'I48', name: 'Arritmia Cardíaca', category: 'cardiovascular', commonSymptoms: ['fadiga', 'ansiedade'] },
  { id: 'I83', code: 'I83', name: 'Varizes', category: 'cardiovascular', commonSymptoms: ['dor', 'fadiga'] },

  // === RESPIRATÓRIO (J00-J99) ===
  { id: 'J45', code: 'J45', name: 'Asma', category: 'respiratory', commonSymptoms: ['fadiga', 'ansiedade'] },
  { id: 'J44', code: 'J44', name: 'DPOC - Doença Pulmonar Obstrutiva Crônica', category: 'respiratory', commonSymptoms: ['fadiga'] },
  { id: 'J30', code: 'J30', name: 'Rinite Alérgica', category: 'respiratory', commonSymptoms: ['dor', 'fadiga'] },
  { id: 'J32', code: 'J32', name: 'Sinusite Crônica', category: 'respiratory', commonSymptoms: ['dor'] },
  { id: 'J40', code: 'J40', name: 'Bronquite', category: 'respiratory', commonSymptoms: ['fadiga', 'febre'] },
  { id: 'G47.3', code: 'G47.3', name: 'Apneia do Sono', category: 'respiratory', commonSymptoms: ['fadiga', 'insonia'] },

  // === ENDÓCRINO/METABÓLICO (E00-E90) ===
  { id: 'E11', code: 'E11', name: 'Diabetes Tipo 2', category: 'endocrine', commonSymptoms: ['fadiga', 'enjoo'] },
  { id: 'E10', code: 'E10', name: 'Diabetes Tipo 1', category: 'endocrine', commonSymptoms: ['fadiga', 'enjoo'] },
  { id: 'E03', code: 'E03', name: 'Hipotireoidismo', category: 'endocrine', commonSymptoms: ['fadiga', 'dor'] },
  { id: 'E05', code: 'E05', name: 'Hipertireoidismo', category: 'endocrine', commonSymptoms: ['ansiedade', 'insonia', 'fadiga'] },
  { id: 'E66', code: 'E66', name: 'Obesidade', category: 'endocrine', commonSymptoms: ['fadiga', 'dor'] },
  { id: 'E78', code: 'E78', name: 'Colesterol Alto', category: 'endocrine', commonSymptoms: ['fadiga'] },
  { id: 'E28', code: 'E28', name: 'Síndrome dos Ovários Policísticos', category: 'endocrine', commonSymptoms: ['dor', 'ansiedade'] },

  // === NEUROLÓGICO (G00-G99) ===
  { id: 'G43', code: 'G43', name: 'Enxaqueca', category: 'neurological', commonSymptoms: ['dor', 'enjoo'] },
  { id: 'G40', code: 'G40', name: 'Epilepsia', category: 'neurological', commonSymptoms: ['fadiga'] },
  { id: 'G35', code: 'G35', name: 'Esclerose Múltipla', category: 'neurological', commonSymptoms: ['fadiga', 'dor'] },
  { id: 'G20', code: 'G20', name: 'Parkinson', category: 'neurological', commonSymptoms: ['fadiga', 'insonia'] },
  { id: 'G30', code: 'G30', name: 'Alzheimer', category: 'neurological', commonSymptoms: ['insonia', 'ansiedade'] },
  { id: 'G44', code: 'G44', name: 'Cefaleia Tensional', category: 'neurological', commonSymptoms: ['dor'] },
  { id: 'G25.81', code: 'G25.81', name: 'Síndrome das Pernas Inquietas', category: 'neurological', commonSymptoms: ['insonia', 'dor'] },

  // === MUSCULOESQUELÉTICO (M00-M99) ===
  { id: 'M54', code: 'M54', name: 'Dor nas Costas (Lombalgia)', category: 'musculoskeletal', commonSymptoms: ['dor'] },
  { id: 'M79.7', code: 'M79.7', name: 'Fibromialgia', category: 'musculoskeletal', commonSymptoms: ['dor', 'fadiga', 'insonia'] },
  { id: 'M05', code: 'M05', name: 'Artrite Reumatoide', category: 'musculoskeletal', commonSymptoms: ['dor', 'fadiga'] },
  { id: 'M15', code: 'M15', name: 'Artrose/Osteoartrite', category: 'musculoskeletal', commonSymptoms: ['dor'] },
  { id: 'M81', code: 'M81', name: 'Osteoporose', category: 'musculoskeletal', commonSymptoms: ['dor'] },
  { id: 'M75', code: 'M75', name: 'Tendinite/Bursite', category: 'musculoskeletal', commonSymptoms: ['dor'] },
  { id: 'M50', code: 'M50', name: 'Hérnia de Disco', category: 'musculoskeletal', commonSymptoms: ['dor'] },

  // === GASTROINTESTINAL (K00-K93) ===
  { id: 'K21', code: 'K21', name: 'Refluxo Gastroesofágico', category: 'gastrointestinal', commonSymptoms: ['dor', 'enjoo'] },
  { id: 'K58', code: 'K58', name: 'Síndrome do Intestino Irritável', category: 'gastrointestinal', commonSymptoms: ['dor', 'enjoo'] },
  { id: 'K29', code: 'K29', name: 'Gastrite', category: 'gastrointestinal', commonSymptoms: ['dor', 'enjoo'] },
  { id: 'K50', code: 'K50', name: 'Doença de Crohn', category: 'gastrointestinal', commonSymptoms: ['dor', 'fadiga', 'enjoo'] },
  { id: 'K51', code: 'K51', name: 'Colite Ulcerativa', category: 'gastrointestinal', commonSymptoms: ['dor', 'fadiga'] },
  { id: 'K80', code: 'K80', name: 'Pedra na Vesícula', category: 'gastrointestinal', commonSymptoms: ['dor', 'enjoo'] },
  { id: 'K90', code: 'K90', name: 'Doença Celíaca', category: 'gastrointestinal', commonSymptoms: ['dor', 'fadiga', 'enjoo'] },
  { id: 'E73', code: 'E73', name: 'Intolerância à Lactose', category: 'gastrointestinal', commonSymptoms: ['dor', 'enjoo'] },

  // === DERMATOLÓGICO (L00-L99) ===
  { id: 'L40', code: 'L40', name: 'Psoríase', category: 'dermatological', commonSymptoms: ['dor', 'ansiedade'] },
  { id: 'L20', code: 'L20', name: 'Dermatite Atópica/Eczema', category: 'dermatological', commonSymptoms: ['dor', 'insonia'] },
  { id: 'L50', code: 'L50', name: 'Urticária', category: 'dermatological', commonSymptoms: ['ansiedade'] },
  { id: 'L70', code: 'L70', name: 'Acne', category: 'dermatological', commonSymptoms: ['ansiedade'] },
  { id: 'L63', code: 'L63', name: 'Alopecia', category: 'dermatological', commonSymptoms: ['ansiedade'] },

  // === IMUNOLÓGICO ===
  { id: 'M32', code: 'M32', name: 'Lúpus', category: 'immunological', commonSymptoms: ['fadiga', 'dor', 'febre'] },
  { id: 'D50', code: 'D50', name: 'Anemia', category: 'immunological', commonSymptoms: ['fadiga'] },
  { id: 'D69', code: 'D69', name: 'Púrpura', category: 'immunological', commonSymptoms: ['fadiga'] },
  { id: 'B20', code: 'B20', name: 'HIV/AIDS', category: 'immunological', commonSymptoms: ['fadiga', 'febre'] },

  // === OUTRAS ===
  { id: 'N18', code: 'N18', name: 'Doença Renal Crônica', category: 'other', commonSymptoms: ['fadiga', 'enjoo'] },
  { id: 'N40', code: 'N40', name: 'Hiperplasia Prostática', category: 'other', commonSymptoms: ['dor'] },
  { id: 'N94', code: 'N94', name: 'Endometriose', category: 'other', commonSymptoms: ['dor', 'fadiga'] },
  { id: 'R53', code: 'R53', name: 'Fadiga Crônica', category: 'other', commonSymptoms: ['fadiga', 'dor', 'insonia'] },
  { id: 'H81', code: 'H81', name: 'Labirintite/Vertigem', category: 'other', commonSymptoms: ['enjoo', 'ansiedade'] },
  { id: 'H25', code: 'H25', name: 'Catarata', category: 'other', commonSymptoms: ['dor'] },
  { id: 'H40', code: 'H40', name: 'Glaucoma', category: 'other', commonSymptoms: ['dor'] }
]

// Busca doenças por categoria
export function getDiseasesByCategory(categoryId) {
  return DISEASES.filter(d => d.category === categoryId)
}

// Busca doença por ID
export function getDiseaseById(id) {
  return DISEASES.find(d => d.id === id)
}

// Busca doenças por termo
export function searchDiseases(term) {
  const lowerTerm = term.toLowerCase()
  return DISEASES.filter(d =>
    d.name.toLowerCase().includes(lowerTerm) ||
    d.code.toLowerCase().includes(lowerTerm)
  )
}

// Retorna sintomas comuns de uma lista de doenças
export function getCommonSymptomsForDiseases(diseaseIds) {
  const symptoms = new Map()

  diseaseIds.forEach(id => {
    const disease = getDiseaseById(id)
    if (disease) {
      disease.commonSymptoms.forEach(symptom => {
        symptoms.set(symptom, (symptoms.get(symptom) || 0) + 1)
      })
    }
  })

  return Array.from(symptoms.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([symptom, count]) => ({ symptom, count }))
}
