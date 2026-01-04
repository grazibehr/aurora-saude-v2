// ==========================================
// BASE DE DADOS DE INTERACOES MEDICAMENTOSAS
// ==========================================

/**
 * Interacoes medicamentosas conhecidas
 * Severity: 'low' (baixa), 'moderate' (moderada), 'high' (alta)
 */
export const MEDICATION_INTERACTIONS = [
  // === ANTI-INFLAMATORIOS ===
  {
    drug1: 'Aspirina',
    drug2: 'Ibuprofeno',
    severity: 'moderate',
    description: 'Podem aumentar o risco de sangramento gastrointestinal.',
    recommendation: 'Evite tomar juntos. Se necessario, use com intervalo de 8 horas.',
    symptoms: ['nausea', 'dor_abdominal', 'fadiga']
  },
  {
    drug1: 'Aspirina',
    drug2: 'Naproxeno',
    severity: 'moderate',
    description: 'Risco aumentado de ulcera e sangramento gastrico.',
    recommendation: 'Evite combinar. Consulte seu medico.',
    symptoms: ['nausea', 'dor_abdominal']
  },
  {
    drug1: 'Ibuprofeno',
    drug2: 'Naproxeno',
    severity: 'moderate',
    description: 'Duplica o risco de efeitos colaterais gastrointestinais.',
    recommendation: 'Nao use dois anti-inflamatorios juntos.',
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
    recommendation: 'Combinacao perigosa. Requer monitoramento rigoroso.',
    symptoms: ['fadiga', 'tontura', 'falta_ar']
  },
  {
    drug1: 'Varfarina',
    drug2: 'Ibuprofeno',
    severity: 'high',
    description: 'Anti-inflamatorios aumentam efeito anticoagulante.',
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
    description: 'Omeprazol pode reduzir a eficacia do Clopidogrel em ate 50%.',
    recommendation: 'Consulte seu médico sobre alternativas compatíveis.',
    symptoms: []
  },
  {
    drug1: 'Rivaroxabana',
    drug2: 'Aspirina',
    severity: 'high',
    description: 'Risco significativo de sangramento.',
    recommendation: 'Use apenas sob orientacao medica rigorosa.',
    symptoms: ['fadiga', 'tontura']
  },

  // === ANTIDEPRESSIVOS ===
  {
    drug1: 'Fluoxetina',
    drug2: 'Tramadol',
    severity: 'high',
    description: 'Risco de sindrome serotoninergica - pode ser fatal.',
    recommendation: 'Evite essa combinacao. Consulte seu medico imediatamente.',
    symptoms: ['febre', 'ansiedade', 'tremor', 'confusao', 'tontura']
  },
  {
    drug1: 'Sertralina',
    drug2: 'Tramadol',
    severity: 'high',
    description: 'Risco de sindrome serotoninergica.',
    recommendation: 'Combinacao perigosa. Busque alternativas.',
    symptoms: ['febre', 'ansiedade', 'tremor', 'confusao']
  },
  {
    drug1: 'Fluoxetina',
    drug2: 'IMAO',
    severity: 'high',
    description: 'Interacao potencialmente fatal.',
    recommendation: 'Nunca combine. Aguarde 5 semanas entre medicamentos.',
    symptoms: ['febre', 'ansiedade', 'confusao', 'tremor']
  },
  {
    drug1: 'Paroxetina',
    drug2: 'Tamoxifeno',
    severity: 'high',
    description: 'Paroxetina reduz eficacia do tamoxifeno.',
    recommendation: 'Use outro antidepressivo. Consulte oncologista.',
    symptoms: []
  },
  {
    drug1: 'Antidepressivo',
    drug2: 'Anti-inflamatorio',
    severity: 'moderate',
    description: 'Aumenta risco de sangramento gastrointestinal.',
    recommendation: 'Use com cautela. Monitore sinais de sangramento.',
    symptoms: ['nausea', 'dor_abdominal']
  },
  {
    drug1: 'Fluoxetina',
    drug2: 'Alprazolam',
    severity: 'moderate',
    description: 'Fluoxetina aumenta niveis de alprazolam no sangue.',
    recommendation: 'Pode ser necessario ajustar dose do alprazolam.',
    symptoms: ['tontura', 'fadiga', 'confusao']
  },

  // === CARDIOVASCULARES ===
  {
    drug1: 'Losartana',
    drug2: 'Espironolactona',
    severity: 'moderate',
    description: 'Risco de hipercalemia (potassio alto).',
    recommendation: 'Monitore niveis de potassio regularmente.',
    symptoms: ['fadiga', 'fraqueza', 'palpitacao', 'nausea']
  },
  {
    drug1: 'Enalapril',
    drug2: 'Espironolactona',
    severity: 'moderate',
    description: 'Risco de hipercalemia.',
    recommendation: 'Monitore potassio. Evite suplementos de potassio.',
    symptoms: ['fadiga', 'fraqueza', 'palpitacao']
  },
  {
    drug1: 'Sinvastatina',
    drug2: 'Amiodarona',
    severity: 'high',
    description: 'Risco aumentado de miopatia e rabdomiolise.',
    recommendation: 'Limite dose de sinvastatina a 20mg ou use alternativa.',
    symptoms: ['dor_muscular', 'fadiga', 'fraqueza']
  },
  {
    drug1: 'Sinvastatina',
    drug2: 'Diltiazem',
    severity: 'moderate',
    description: 'Diltiazem aumenta niveis de sinvastatina.',
    recommendation: 'Limite dose de sinvastatina a 10mg.',
    symptoms: ['dor_muscular', 'fadiga']
  },
  {
    drug1: 'Atenolol',
    drug2: 'Verapamil',
    severity: 'high',
    description: 'Risco de bradicardia severa e bloqueio cardiaco.',
    recommendation: 'Combinacao perigosa. Monitoramento cardiaco necessario.',
    symptoms: ['tontura', 'fadiga', 'falta_ar', 'palpitacao']
  },
  {
    drug1: 'Propranolol',
    drug2: 'Insulina',
    severity: 'moderate',
    description: 'Betabloqueadores mascaram sintomas de hipoglicemia.',
    recommendation: 'Monitore glicemia com mais frequencia.',
    symptoms: ['tontura', 'tremor', 'confusao']
  },
  {
    drug1: 'Digoxina',
    drug2: 'Amiodarona',
    severity: 'high',
    description: 'Amiodarona aumenta niveis de digoxina em 70-100%.',
    recommendation: 'Reduza dose de digoxina pela metade.',
    symptoms: ['nausea', 'tontura', 'palpitacao', 'confusao']
  },

  // === DIABETES ===
  {
    drug1: 'Metformina',
    drug2: 'Contraste iodado',
    severity: 'high',
    description: 'Risco de acidose latica - pode ser fatal.',
    recommendation: 'Suspenda metformina 48h antes e apos exames com contraste.',
    symptoms: ['nausea', 'fadiga', 'dor_abdominal', 'falta_ar']
  },
  {
    drug1: 'Metformina',
    drug2: 'Alcool',
    severity: 'moderate',
    description: 'Alcool aumenta risco de acidose latica.',
    recommendation: 'Limite consumo de alcool.',
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

  // === ANTIBIOTICOS ===
  {
    drug1: 'Ciprofloxacino',
    drug2: 'Antiácido',
    severity: 'moderate',
    description: 'Antiacidos reduzem absorcao do antibiotico.',
    recommendation: 'Tome com intervalo de 2 horas.',
    symptoms: []
  },
  {
    drug1: 'Metronidazol',
    drug2: 'Alcool',
    severity: 'high',
    description: 'Causa reacao tipo dissulfiram - nausea severa, vomito.',
    recommendation: 'Evite alcool durante e 48h apos tratamento.',
    symptoms: ['nausea', 'dor_cabeca', 'tontura', 'palpitacao']
  },
  {
    drug1: 'Eritromicina',
    drug2: 'Sinvastatina',
    severity: 'high',
    description: 'Aumenta muito os niveis de sinvastatina.',
    recommendation: 'Suspenda estatina durante uso do antibiotico.',
    symptoms: ['dor_muscular', 'fadiga']
  },
  {
    drug1: 'Claritromicina',
    drug2: 'Colchicina',
    severity: 'high',
    description: 'Pode causar toxicidade fatal da colchicina.',
    recommendation: 'Evite combinacao. Use alternativa.',
    symptoms: ['nausea', 'dor_abdominal', 'diarreia', 'fadiga']
  },

  // === ANALGESICOS ===
  {
    drug1: 'Paracetamol',
    drug2: 'Alcool',
    severity: 'moderate',
    description: 'Alcool aumenta risco de dano hepatico.',
    recommendation: 'Evite alcool se usar paracetamol regularmente.',
    symptoms: ['nausea', 'fadiga', 'dor_abdominal']
  },
  {
    drug1: 'Tramadol',
    drug2: 'Carbamazepina',
    severity: 'moderate',
    description: 'Carbamazepina reduz efeito do tramadol.',
    recommendation: 'Pode ser necessaria dose maior de tramadol.',
    symptoms: []
  },

  // === PSIQUIATRICOS ===
  {
    drug1: 'Litio',
    drug2: 'Ibuprofeno',
    severity: 'high',
    description: 'AINEs aumentam niveis de litio - risco de toxicidade.',
    recommendation: 'Consulte seu médico sobre alternativas seguras para dor.',
    symptoms: ['tremor', 'nausea', 'tontura', 'confusao', 'diarreia']
  },
  {
    drug1: 'Litio',
    drug2: 'Diuretico',
    severity: 'high',
    description: 'Diureticos aumentam niveis de litio.',
    recommendation: 'Monitore litemia frequentemente.',
    symptoms: ['tremor', 'nausea', 'confusao']
  },
  {
    drug1: 'Clozapina',
    drug2: 'Carbamazepina',
    severity: 'high',
    description: 'Combinacao aumenta risco de agranulocitose.',
    recommendation: 'Contraindicacao absoluta. Nao combine.',
    symptoms: ['febre', 'fadiga', 'infeccao']
  },
  {
    drug1: 'Haloperidol',
    drug2: 'Metoclopramida',
    severity: 'moderate',
    description: 'Aumenta risco de sintomas extrapiramidais.',
    recommendation: 'Evite combinacao ou monitore de perto.',
    symptoms: ['tremor', 'rigidez', 'inquietacao']
  },

  // === HORMONIOS ===
  {
    drug1: 'Levotiroxina',
    drug2: 'Calcio',
    severity: 'low',
    description: 'Calcio reduz absorcao da levotiroxina.',
    recommendation: 'Tome com intervalo de 4 horas.',
    symptoms: ['fadiga']
  },
  {
    drug1: 'Levotiroxina',
    drug2: 'Omeprazol',
    severity: 'low',
    description: 'IBPs podem reduzir absorcao da levotiroxina.',
    recommendation: 'Tome levotiroxina em jejum, 1h antes de outros medicamentos.',
    symptoms: ['fadiga']
  },
  {
    drug1: 'Anticoncepcional',
    drug2: 'Rifampicina',
    severity: 'high',
    description: 'Rifampicina reduz muito a eficacia do anticoncepcional.',
    recommendation: 'Use metodo contraceptivo adicional.',
    symptoms: []
  },
  {
    drug1: 'Anticoncepcional',
    drug2: 'Carbamazepina',
    severity: 'moderate',
    description: 'Carbamazepina reduz eficacia do anticoncepcional.',
    recommendation: 'Considere metodo adicional ou alternativa.',
    symptoms: []
  },

  // === RESPIRATORIOS ===
  {
    drug1: 'Teofilina',
    drug2: 'Ciprofloxacino',
    severity: 'moderate',
    description: 'Ciprofloxacino aumenta niveis de teofilina.',
    recommendation: 'Reduza dose de teofilina ou use outro antibiotico.',
    symptoms: ['nausea', 'palpitacao', 'ansiedade', 'tremor']
  },
  {
    drug1: 'Salbutamol',
    drug2: 'Propranolol',
    severity: 'moderate',
    description: 'Betabloqueadores reduzem efeito broncodilatador.',
    recommendation: 'Evite betabloqueadores nao seletivos em asmaticos.',
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
  // Anti-inflamatorios
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

  // Ansioliticos
  'Alprazolam': ['tontura', 'fadiga'],
  'Clonazepam': ['tontura', 'fadiga'],
  'Diazepam': ['tontura', 'fadiga'],
  'Lorazepam': ['tontura', 'fadiga'],

  // Antipsicoticos
  'Risperidona': ['tontura', 'fadiga', 'tremor'],
  'Quetiapina': ['tontura', 'fadiga'],
  'Olanzapina': ['tontura', 'fadiga'],
  'Haloperidol': ['tremor', 'rigidez', 'tontura'],

  // Estabilizadores de humor
  'Litio': ['tremor', 'nausea', 'diarreia', 'fadiga'],
  'Valproato': ['nausea', 'tontura', 'tremor'],
  'Carbamazepina': ['tontura', 'fadiga', 'nausea'],
  'Lamotrigina': ['tontura', 'dor', 'nausea'],

  // Gastricos
  'Omeprazol': ['dor', 'nausea', 'diarreia'],
  'Pantoprazol': ['dor', 'nausea'],
  'Ranitidina': ['dor', 'tontura'],

  // Antibioticos
  'Amoxicilina': ['nausea', 'diarreia'],
  'Azitromicina': ['nausea', 'diarreia', 'dor_abdominal'],
  'Ciprofloxacino': ['nausea', 'tontura', 'dor'],
  'Metronidazol': ['nausea', 'dor_abdominal', 'tontura'],

  // Hormonios
  'Levotiroxina': ['palpitacao', 'ansiedade', 'tremor', 'insonia'],
  'Prednisona': ['insonia', 'ansiedade', 'fadiga'],

  // Analgesicos
  'Tramadol': ['nausea', 'tontura', 'fadiga'],
  'Codeina': ['nausea', 'tontura', 'fadiga'],

  // Respiratorios
  'Salbutamol': ['tremor', 'palpitacao', 'ansiedade'],
  'Teofilina': ['nausea', 'palpitacao', 'ansiedade', 'tremor']
}

// ==========================================
// SINTOMAS DE SINDROMES DE INTERACAO
// ==========================================

/**
 * Sindromes causadas por interacoes medicamentosas
 */
export const INTERACTION_SYNDROMES = {
  'sindrome_serotoninergica': {
    name: 'Sindrome Serotoninergica',
    description: 'Excesso de serotonina no cerebro. Pode ser grave.',
    symptoms: ['febre', 'ansiedade', 'tremor', 'confusao', 'tontura', 'palpitacao'],
    urgency: 'high',
    action: 'Procure atendimento medico imediatamente.'
  },
  'sangramento_gastrointestinal': {
    name: 'Risco de Sangramento GI',
    description: 'Irritacao do estomago e intestino.',
    symptoms: ['nausea', 'dor_abdominal', 'fadiga'],
    urgency: 'moderate',
    action: 'Observe fezes escuras ou vomito com sangue.'
  },
  'hipercalemia': {
    name: 'Hipercalemia',
    description: 'Niveis altos de potassio no sangue.',
    symptoms: ['fadiga', 'fraqueza', 'palpitacao', 'nausea'],
    urgency: 'high',
    action: 'Faca exames de sangue regularmente.'
  },
  'hipoglicemia': {
    name: 'Hipoglicemia',
    description: 'Baixa de acucar no sangue.',
    symptoms: ['tontura', 'tremor', 'fadiga', 'confusao', 'ansiedade'],
    urgency: 'moderate',
    action: 'Monitore glicemia e tenha fonte de glicose disponivel.'
  },
  'toxicidade_hepatica': {
    name: 'Risco Hepatico',
    description: 'Sobrecarga do figado.',
    symptoms: ['nausea', 'fadiga', 'dor_abdominal'],
    urgency: 'moderate',
    action: 'Evite alcool e faca exames de funcao hepatica.'
  },
  'miopatia': {
    name: 'Miopatia',
    description: 'Dano aos musculos.',
    symptoms: ['dor', 'fadiga', 'fraqueza'],
    urgency: 'moderate',
    action: 'Informe dores musculares ao medico.'
  },
  'toxicidade_litio': {
    name: 'Toxicidade por Litio',
    description: 'Niveis perigosos de litio no sangue.',
    symptoms: ['tremor', 'nausea', 'diarreia', 'confusao', 'tontura'],
    urgency: 'high',
    action: 'Procure atendimento medico se sintomas intensos.'
  }
}

// ==========================================
// FUNCOES AUXILIARES
// ==========================================

/**
 * Normaliza nome do medicamento para comparacao
 */
export function normalizeMedicationName(name) {
  if (!name) return ''
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]/g, '') // Remove caracteres especiais
    .trim()
}

/**
 * Verifica se dois nomes de medicamentos sao similares
 */
export function isSameMedication(name1, name2) {
  const n1 = normalizeMedicationName(name1)
  const n2 = normalizeMedicationName(name2)

  if (n1 === n2) return true

  // Verifica se um contem o outro (para nomes parciais)
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
