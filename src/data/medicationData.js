// ==========================================
// BASE DE DADOS DE INTERAÇÕES MEDICAMENTOSAS
// ==========================================

/**
 * Interações medicamentosas conhecidas
 * Severity: 'low' (baixa), 'moderate' (moderada), 'high' (alta)
 */
export const MEDICATION_INTERACTIONS = [
  // === ANTI-INFLAMATÓRIOS ===
  {
    drug1: 'Aspirina',
    drug2: 'Ibuprofeno',
    severity: 'moderate',
    description: 'Podem aumentar o risco de sangramento gastrointestinal.',
    recommendation: 'Evite tomar juntos. Se necessário, use com intervalo de 8 horas.',
    symptoms: ['nausea', 'dor_abdominal', 'fadiga']
  },
  {
    drug1: 'Aspirina',
    drug2: 'Naproxeno',
    severity: 'moderate',
    description: 'Risco aumentado de úlcera e sangramento gástrico.',
    recommendation: 'Evite combinar. Consulte seu médico.',
    symptoms: ['nausea', 'dor_abdominal']
  },
  {
    drug1: 'Ibuprofeno',
    drug2: 'Naproxeno',
    severity: 'moderate',
    description: 'Duplica o risco de efeitos colaterais gastrointestinais.',
    recommendation: 'Não use dois anti-inflamatórios juntos.',
    symptoms: ['nausea', 'dor_abdominal', 'tontura']
  },
  {
    drug1: 'Diclofenaco',
    drug2: 'Ibuprofeno',
    severity: 'moderate',
    description: 'Aumenta risco de problemas renais e gastrointestinais.',
    recommendation: 'Evite usar juntos.',
    symptoms: ['nausea', 'fadiga', 'tontura']
  },

  // === ANTICOAGULANTES ===
  {
    drug1: 'Varfarina',
    drug2: 'Aspirina',
    severity: 'high',
    description: 'Risco muito alto de sangramento.',
    recommendation: 'Combinação perigosa. Requer monitoramento rigoroso.',
    symptoms: ['fadiga', 'tontura', 'falta_ar']
  },
  {
    drug1: 'Varfarina',
    drug2: 'Ibuprofeno',
    severity: 'high',
    description: 'Anti-inflamatórios aumentam efeito anticoagulante.',
    recommendation: 'Consulte seu médico sobre alternativas seguras para dor.',
    symptoms: ['fadiga', 'tontura']
  },
  {
    drug1: 'Varfarina',
    drug2: 'Vitamina K',
    severity: 'moderate',
    description: 'Vitamina K reduz o efeito anticoagulante.',
    recommendation: 'Mantenha consumo constante de vitamina K.',
    symptoms: []
  },
  {
    drug1: 'Clopidogrel',
    drug2: 'Omeprazol',
    severity: 'high',
    description: 'Omeprazol pode reduzir a eficácia do Clopidogrel em até 50%.',
    recommendation: 'Consulte seu médico sobre alternativas compatíveis.',
    symptoms: []
  },
  {
    drug1: 'Rivaroxabana',
    drug2: 'Aspirina',
    severity: 'high',
    description: 'Risco significativo de sangramento.',
    recommendation: 'Use apenas sob orientação médica rigorosa.',
    symptoms: ['fadiga', 'tontura']
  },

  // === ANTIDEPRESSIVOS ===
  {
    drug1: 'Fluoxetina',
    drug2: 'Tramadol',
    severity: 'high',
    description: 'Risco de síndrome serotoninérgica - pode ser fatal.',
    recommendation: 'Evite essa combinação. Consulte seu médico imediatamente.',
    symptoms: ['febre', 'ansiedade', 'tremor', 'confusao', 'tontura']
  },
  {
    drug1: 'Sertralina',
    drug2: 'Tramadol',
    severity: 'high',
    description: 'Risco de síndrome serotoninérgica.',
    recommendation: 'Combinação perigosa. Busque alternativas.',
    symptoms: ['febre', 'ansiedade', 'tremor', 'confusao']
  },
  {
    drug1: 'Fluoxetina',
    drug2: 'IMAO',
    severity: 'high',
    description: 'Interação potencialmente fatal.',
    recommendation: 'Nunca combine. Aguarde 5 semanas entre medicamentos.',
    symptoms: ['febre', 'ansiedade', 'confusao', 'tremor']
  },
  {
    drug1: 'Paroxetina',
    drug2: 'Tamoxifeno',
    severity: 'high',
    description: 'Paroxetina reduz eficácia do tamoxifeno.',
    recommendation: 'Use outro antidepressivo. Consulte oncologista.',
    symptoms: []
  },
  {
    drug1: 'Antidepressivo',
    drug2: 'Anti-inflamatório',
    severity: 'moderate',
    description: 'Aumenta risco de sangramento gastrointestinal.',
    recommendation: 'Use com cautela. Monitore sinais de sangramento.',
    symptoms: ['nausea', 'dor_abdominal']
  },
  {
    drug1: 'Fluoxetina',
    drug2: 'Alprazolam',
    severity: 'moderate',
    description: 'Fluoxetina aumenta níveis de alprazolam no sangue.',
    recommendation: 'Pode ser necessário ajustar dose do alprazolam.',
    symptoms: ['tontura', 'fadiga', 'confusao']
  },

  // === CARDIOVASCULARES ===
  {
    drug1: 'Losartana',
    drug2: 'Espironolactona',
    severity: 'moderate',
    description: 'Risco de hipercalemia (potássio alto).',
    recommendation: 'Monitore níveis de potássio regularmente.',
    symptoms: ['fadiga', 'fraqueza', 'palpitacao', 'nausea']
  },
  {
    drug1: 'Enalapril',
    drug2: 'Espironolactona',
    severity: 'moderate',
    description: 'Risco de hipercalemia.',
    recommendation: 'Monitore potássio. Evite suplementos de potássio.',
    symptoms: ['fadiga', 'fraqueza', 'palpitacao']
  },
  {
    drug1: 'Sinvastatina',
    drug2: 'Amiodarona',
    severity: 'high',
    description: 'Risco aumentado de miopatia e rabdomiólise.',
    recommendation: 'Limite dose de sinvastatina a 20mg ou use alternativa.',
    symptoms: ['dor_muscular', 'fadiga', 'fraqueza']
  },
  {
    drug1: 'Sinvastatina',
    drug2: 'Diltiazem',
    severity: 'moderate',
    description: 'Diltiazem aumenta níveis de sinvastatina.',
    recommendation: 'Limite dose de sinvastatina a 10mg.',
    symptoms: ['dor_muscular', 'fadiga']
  },
  {
    drug1: 'Atenolol',
    drug2: 'Verapamil',
    severity: 'high',
    description: 'Risco de bradicardia severa e bloqueio cardíaco.',
    recommendation: 'Combinação perigosa. Monitoramento cardíaco necessário.',
    symptoms: ['tontura', 'fadiga', 'falta_ar', 'palpitacao']
  },
  {
    drug1: 'Propranolol',
    drug2: 'Insulina',
    severity: 'moderate',
    description: 'Betabloqueadores mascaram sintomas de hipoglicemia.',
    recommendation: 'Monitore glicemia com mais frequência.',
    symptoms: ['tontura', 'tremor', 'confusao']
  },
  {
    drug1: 'Digoxina',
    drug2: 'Amiodarona',
    severity: 'high',
    description: 'Amiodarona aumenta níveis de digoxina em 70-100%.',
    recommendation: 'Reduza dose de digoxina pela metade.',
    symptoms: ['nausea', 'tontura', 'palpitacao', 'confusao']
  },

  // === DIABETES ===
  {
    drug1: 'Metformina',
    drug2: 'Contraste iodado',
    severity: 'high',
    description: 'Risco de acidose lática - pode ser fatal.',
    recommendation: 'Suspenda metformina 48h antes e após exames com contraste.',
    symptoms: ['nausea', 'fadiga', 'dor_abdominal', 'falta_ar']
  },
  {
    drug1: 'Metformina',
    drug2: 'Álcool',
    severity: 'moderate',
    description: 'Álcool aumenta risco de acidose lática.',
    recommendation: 'Limite consumo de álcool.',
    symptoms: ['nausea', 'tontura', 'fadiga']
  },
  {
    drug1: 'Glibenclamida',
    drug2: 'Fluconazol',
    severity: 'moderate',
    description: 'Fluconazol aumenta efeito hipoglicemiante.',
    recommendation: 'Monitore glicemia frequentemente.',
    symptoms: ['tontura', 'tremor', 'fadiga', 'confusao']
  },

  // === ANTIBIÓTICOS ===
  {
    drug1: 'Ciprofloxacino',
    drug2: 'Antiácido',
    severity: 'moderate',
    description: 'Antiácidos reduzem absorção do antibiótico.',
    recommendation: 'Tome com intervalo de 2 horas.',
    symptoms: []
  },
  {
    drug1: 'Metronidazol',
    drug2: 'Álcool',
    severity: 'high',
    description: 'Causa reação tipo dissulfiram - náusea severa, vômito.',
    recommendation: 'Evite álcool durante e 48h após tratamento.',
    symptoms: ['nausea', 'dor_cabeca', 'tontura', 'palpitacao']
  },
  {
    drug1: 'Eritromicina',
    drug2: 'Sinvastatina',
    severity: 'high',
    description: 'Aumenta muito os níveis de sinvastatina.',
    recommendation: 'Suspenda estatina durante uso do antibiótico.',
    symptoms: ['dor_muscular', 'fadiga']
  },
  {
    drug1: 'Claritromicina',
    drug2: 'Colchicina',
    severity: 'high',
    description: 'Pode causar toxicidade fatal da colchicina.',
    recommendation: 'Evite combinação. Use alternativa.',
    symptoms: ['nausea', 'dor_abdominal', 'diarreia', 'fadiga']
  },

  // === ANALGÉSICOS ===
  {
    drug1: 'Paracetamol',
    drug2: 'Álcool',
    severity: 'moderate',
    description: 'Álcool aumenta risco de dano hepático.',
    recommendation: 'Evite álcool se usar paracetamol regularmente.',
    symptoms: ['nausea', 'fadiga', 'dor_abdominal']
  },
  {
    drug1: 'Tramadol',
    drug2: 'Carbamazepina',
    severity: 'moderate',
    description: 'Carbamazepina reduz efeito do tramadol.',
    recommendation: 'Pode ser necessária dose maior de tramadol.',
    symptoms: []
  },

  // === PSIQUIÁTRICOS ===
  {
    drug1: 'Lítio',
    drug2: 'Ibuprofeno',
    severity: 'high',
    description: 'AINEs aumentam níveis de lítio - risco de toxicidade.',
    recommendation: 'Consulte seu médico sobre alternativas seguras para dor.',
    symptoms: ['tremor', 'nausea', 'tontura', 'confusao', 'diarreia']
  },
  {
    drug1: 'Lítio',
    drug2: 'Diurético',
    severity: 'high',
    description: 'Diuréticos aumentam níveis de lítio.',
    recommendation: 'Monitore litemia frequentemente.',
    symptoms: ['tremor', 'nausea', 'confusao']
  },
  {
    drug1: 'Clozapina',
    drug2: 'Carbamazepina',
    severity: 'high',
    description: 'Combinação aumenta risco de agranulocitose.',
    recommendation: 'Contraindicação absoluta. Não combine.',
    symptoms: ['febre', 'fadiga', 'infeccao']
  },
  {
    drug1: 'Haloperidol',
    drug2: 'Metoclopramida',
    severity: 'moderate',
    description: 'Aumenta risco de sintomas extrapiramidais.',
    recommendation: 'Evite combinação ou monitore de perto.',
    symptoms: ['tremor', 'rigidez', 'inquietacao']
  },

  // === HORMÔNIOS ===
  {
    drug1: 'Levotiroxina',
    drug2: 'Calcio',
    severity: 'low',
    description: 'Cálcio reduz absorção da levotiroxina.',
    recommendation: 'Tome com intervalo de 4 horas.',
    symptoms: ['fadiga']
  },
  {
    drug1: 'Levotiroxina',
    drug2: 'Omeprazol',
    severity: 'low',
    description: 'IBPs podem reduzir absorção da levotiroxina.',
    recommendation: 'Tome levotiroxina em jejum, 1h antes de outros medicamentos.',
    symptoms: ['fadiga']
  },
  {
    drug1: 'Anticoncepcional',
    drug2: 'Rifampicina',
    severity: 'high',
    description: 'Rifampicina reduz muito a eficácia do anticoncepcional.',
    recommendation: 'Use método contraceptivo adicional.',
    symptoms: []
  },
  {
    drug1: 'Anticoncepcional',
    drug2: 'Carbamazepina',
    severity: 'moderate',
    description: 'Carbamazepina reduz eficácia do anticoncepcional.',
    recommendation: 'Considere método adicional ou alternativa.',
    symptoms: []
  },

  // === RESPIRATÓRIOS ===
  {
    drug1: 'Teofilina',
    drug2: 'Ciprofloxacino',
    severity: 'moderate',
    description: 'Ciprofloxacino aumenta níveis de teofilina.',
    recommendation: 'Reduza dose de teofilina ou use outro antibiótico.',
    symptoms: ['nausea', 'palpitacao', 'ansiedade', 'tremor']
  },
  {
    drug1: 'Salbutamol',
    drug2: 'Propranolol',
    severity: 'moderate',
    description: 'Betabloqueadores reduzem efeito broncodilatador.',
    recommendation: 'Evite betabloqueadores não seletivos em asmáticos.',
    symptoms: ['falta_ar', 'tosse']
  }
]

// ==========================================
// EFEITOS COLATERAIS POR MEDICAMENTO
// ==========================================

/**
 * Efeitos colaterais comuns de medicamentos
 * Mapeados para os tipos de sintomas do sistema
 */
export const MEDICATION_SIDE_EFFECTS = {
  // Anti-inflamatórios
  'Ibuprofeno': ['nausea', 'dor_abdominal', 'tontura', 'dor'],
  'Naproxeno': ['nausea', 'dor_abdominal', 'tontura'],
  'Diclofenaco': ['nausea', 'dor_abdominal', 'tontura', 'dor'],
  'Aspirina': ['nausea', 'dor_abdominal'],
  'Paracetamol': ['nausea'],

  // Cardiovasculares
  'Losartana': ['tontura', 'fadiga', 'dor'],
  'Enalapril': ['tosse', 'tontura', 'fadiga'],
  'Lisinopril': ['tosse', 'tontura', 'fadiga'],
  'Captopril': ['tosse', 'tontura'],
  'Atenolol': ['fadiga', 'tontura', 'insonia'],
  'Propranolol': ['fadiga', 'tontura', 'insonia', 'falta_ar'],
  'Metoprolol': ['fadiga', 'tontura'],
  'Anlodipino': ['tontura', 'fadiga', 'edema'],
  'Sinvastatina': ['dor', 'fadiga'],
  'Atorvastatina': ['dor', 'fadiga', 'nausea'],
  'Hidroclorotiazida': ['tontura', 'fadiga'],
  'Furosemida': ['tontura', 'fadiga'],

  // Diabetes
  'Metformina': ['nausea', 'diarreia', 'dor_abdominal'],
  'Glibenclamida': ['tontura', 'nausea'],
  'Insulina': ['tontura', 'tremor'],

  // Antidepressivos
  'Fluoxetina': ['insonia', 'ansiedade', 'nausea', 'dor', 'fadiga'],
  'Sertralina': ['insonia', 'nausea', 'dor', 'tontura'],
  'Escitalopram': ['insonia', 'nausea', 'fadiga'],
  'Paroxetina': ['insonia', 'nausea', 'tontura', 'fadiga'],
  'Venlafaxina': ['nausea', 'insonia', 'tontura', 'ansiedade'],
  'Duloxetina': ['nausea', 'fadiga', 'tontura', 'insonia'],
  'Amitriptilina': ['tontura', 'fadiga', 'boca_seca'],
  'Bupropiona': ['insonia', 'dor', 'ansiedade'],

  // Ansiolíticos
  'Alprazolam': ['tontura', 'fadiga'],
  'Clonazepam': ['tontura', 'fadiga'],
  'Diazepam': ['tontura', 'fadiga'],
  'Lorazepam': ['tontura', 'fadiga'],

  // Antipsicóticos
  'Risperidona': ['tontura', 'fadiga', 'tremor'],
  'Quetiapina': ['tontura', 'fadiga'],
  'Olanzapina': ['tontura', 'fadiga'],
  'Haloperidol': ['tremor', 'rigidez', 'tontura'],

  // Estabilizadores de humor
  'Lítio': ['tremor', 'nausea', 'diarreia', 'fadiga'],
  'Valproato': ['nausea', 'tontura', 'tremor'],
  'Carbamazepina': ['tontura', 'fadiga', 'nausea'],
  'Lamotrigina': ['tontura', 'dor', 'nausea'],

  // Gástricos
  'Omeprazol': ['dor', 'nausea', 'diarreia'],
  'Pantoprazol': ['dor', 'nausea'],
  'Ranitidina': ['dor', 'tontura'],

  // Antibióticos
  'Amoxicilina': ['nausea', 'diarreia'],
  'Azitromicina': ['nausea', 'diarreia', 'dor_abdominal'],
  'Ciprofloxacino': ['nausea', 'tontura', 'dor'],
  'Metronidazol': ['nausea', 'dor_abdominal', 'tontura'],

  // Hormônios
  'Levotiroxina': ['palpitacao', 'ansiedade', 'tremor', 'insonia'],
  'Prednisona': ['insonia', 'ansiedade', 'fadiga'],

  // Analgésicos
  'Tramadol': ['nausea', 'tontura', 'fadiga'],
  'Codeina': ['nausea', 'tontura', 'fadiga'],

  // Respiratórios
  'Salbutamol': ['tremor', 'palpitacao', 'ansiedade'],
  'Teofilina': ['nausea', 'palpitacao', 'ansiedade', 'tremor']
}

// ==========================================
// SÍNDROMES DE INTERAÇÃO
// ==========================================

/**
 * Síndromes causadas por interações medicamentosas
 */
export const INTERACTION_SYNDROMES = {
  'sindrome_serotoninergica': {
    name: 'Síndrome Serotoninérgica',
    description: 'Excesso de serotonina no cérebro. Pode ser grave.',
    symptoms: ['febre', 'ansiedade', 'tremor', 'confusao', 'tontura', 'palpitacao'],
    urgency: 'high',
    action: 'Procure atendimento médico imediatamente.'
  },
  'sangramento_gastrointestinal': {
    name: 'Risco de Sangramento GI',
    description: 'Irritação do estômago e intestino.',
    symptoms: ['nausea', 'dor_abdominal', 'fadiga'],
    urgency: 'moderate',
    action: 'Observe fezes escuras ou vômito com sangue.'
  },
  'hipercalemia': {
    name: 'Hipercalemia',
    description: 'Níveis altos de potássio no sangue.',
    symptoms: ['fadiga', 'fraqueza', 'palpitacao', 'nausea'],
    urgency: 'high',
    action: 'Faça exames de sangue regularmente.'
  },
  'hipoglicemia': {
    name: 'Hipoglicemia',
    description: 'Baixa de açúcar no sangue.',
    symptoms: ['tontura', 'tremor', 'fadiga', 'confusao', 'ansiedade'],
    urgency: 'moderate',
    action: 'Monitore glicemia e tenha fonte de glicose disponível.'
  },
  'toxicidade_hepatica': {
    name: 'Risco Hepático',
    description: 'Sobrecarga do fígado.',
    symptoms: ['nausea', 'fadiga', 'dor_abdominal'],
    urgency: 'moderate',
    action: 'Evite álcool e faça exames de função hepática.'
  },
  'miopatia': {
    name: 'Miopatia',
    description: 'Dano aos músculos.',
    symptoms: ['dor', 'fadiga', 'fraqueza'],
    urgency: 'moderate',
    action: 'Informe dores musculares ao médico.'
  },
  'toxicidade_litio': {
    name: 'Toxicidade por Lítio',
    description: 'Níveis perigosos de lítio no sangue.',
    symptoms: ['tremor', 'nausea', 'diarreia', 'confusao', 'tontura'],
    urgency: 'high',
    action: 'Procure atendimento médico se sintomas intensos.'
  }
}

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

/**
 * Normaliza nome do medicamento para comparação
 */
export function normalizeMedicationName(name) {
  if (!name) return ''
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // Remove acentos
    .replace(/[^a-z0-9]/g, '') // Remove caracteres especiais
    .trim()
}

/**
 * Verifica se dois nomes de medicamentos são similares
 */
export function isSameMedication(name1, name2) {
  const n1 = normalizeMedicationName(name1)
  const n2 = normalizeMedicationName(name2)

  if (n1 === n2) return true

  // Verifica se um contém o outro (para nomes parciais)
  if (n1.includes(n2) || n2.includes(n1)) return true

  return false
}

/**
 * Busca medicamento na base de dados de efeitos colaterais
 */
export function findMedicationInDatabase(medicationName) {
  const normalized = normalizeMedicationName(medicationName)

  for (const [dbName, effects] of Object.entries(MEDICATION_SIDE_EFFECTS)) {
    if (isSameMedication(medicationName, dbName)) {
      return { name: dbName, sideEffects: effects }
    }
  }

  return null
}

/**
 * Verifica se um medicamento pertence a uma classe
 */
export function getMedicationClass(medicationName) {
  const name = normalizeMedicationName(medicationName)

  const classes = {
    'anti-inflamatorio': ['ibuprofeno', 'naproxeno', 'diclofenaco', 'aspirina', 'nimesulida', 'piroxicam'],
    'antidepressivo': ['fluoxetina', 'sertralina', 'escitalopram', 'paroxetina', 'venlafaxina', 'duloxetina', 'amitriptilina', 'bupropiona'],
    'ansiolitico': ['alprazolam', 'clonazepam', 'diazepam', 'lorazepam', 'bromazepam'],
    'antihipertensivo': ['losartana', 'enalapril', 'lisinopril', 'captopril', 'anlodipino', 'valsartana'],
    'betabloqueador': ['atenolol', 'propranolol', 'metoprolol', 'carvedilol'],
    'estatina': ['sinvastatina', 'atorvastatina', 'rosuvastatina', 'pravastatina'],
    'diuretico': ['hidroclorotiazida', 'furosemida', 'espironolactona', 'indapamida'],
    'anticoagulante': ['varfarina', 'rivaroxabana', 'apixabana', 'dabigatrana', 'clopidogrel'],
    'antidiabetico': ['metformina', 'glibenclamida', 'glicazida', 'sitagliptina'],
    'inibidor_bomba_protons': ['omeprazol', 'pantoprazol', 'esomeprazol', 'lansoprazol']
  }

  for (const [className, medications] of Object.entries(classes)) {
    if (medications.some(med => name.includes(med) || med.includes(name))) {
      return className
    }
  }

  return null
}
