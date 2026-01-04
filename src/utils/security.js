/**
 * Utilitários de segurança para sanitização e validação de dados
 * Previne XSS, injeção de código e outras vulnerabilidades
 */

/**
 * Sanitiza string de entrada removendo caracteres perigosos
 * @param {string} input - String a ser sanitizada
 * @param {number} maxLength - Tamanho máximo permitido
 * @returns {string} String sanitizada
 */
export function sanitizeInput(input, maxLength = 1000) {
  if (typeof input !== 'string') {
    return ''
  }

  return input
    .trim()
    // Remove tags HTML
    .replace(/<[^>]*>/g, '')
    // Remove caracteres de controle (exceto newline e tab)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Limita tamanho máximo
    .slice(0, maxLength)
}

/**
 * Escapa string para uso seguro em HTML (previne XSS)
 * Use isso quando for inserir conteúdo dinâmico em HTML
 * @param {string} str - String a ser escapada
 * @returns {string} String escapada
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') {
    return ''
  }

  const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  }

  return str.replace(/[&<>"'`=/]/g, char => htmlEscapes[char])
}

/**
 * Valida formato de e-mail usando regex segura (não vulnerável a ReDoS)
 * @param {string} email - E-mail a ser validado
 * @returns {boolean} true se válido
 */
export function validateEmail(email) {
  if (typeof email !== 'string') {
    return false
  }

  // Limita tamanho para prevenir ataques
  if (email.length > 254) {
    return false
  }

  // Regex simplificada e segura (não vulnerável a ReDoS)
  // Verifica estrutura básica: algo@algo.algo
  const parts = email.split('@')
  if (parts.length !== 2) {
    return false
  }

  const [local, domain] = parts

  // Validação do local part
  if (local.length === 0 || local.length > 64) {
    return false
  }

  // Validação do domain
  if (domain.length === 0 || domain.length > 253) {
    return false
  }

  // Verifica se domain tem pelo menos um ponto
  if (!domain.includes('.')) {
    return false
  }

  // Verifica caracteres válidos (simplificado mas seguro)
  const validLocalChars = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/
  const validDomainChars = /^[a-zA-Z0-9.-]+$/

  if (!validLocalChars.test(local) || !validDomainChars.test(domain)) {
    return false
  }

  // Verifica se domain não começa/termina com ponto ou hífen
  if (domain.startsWith('.') || domain.endsWith('.') ||
      domain.startsWith('-') || domain.endsWith('-')) {
    return false
  }

  return true
}

/**
 * Valida e sanitiza data no formato ISO (YYYY-MM-DD)
 * @param {string} date - Data no formato YYYY-MM-DD
 * @returns {string|null} Data válida ou null
 */
export function validateDate(date) {
  if (typeof date !== 'string') {
    return null
  }

  // Verifica formato exato
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(date)) {
    return null
  }

  // Extrai componentes
  const [year, month, day] = date.split('-').map(Number)

  // Valida ranges
  if (year < 1900 || year > 2100) return null
  if (month < 1 || month > 12) return null
  if (day < 1 || day > 31) return null

  // Cria data e verifica se é válida
  const parsed = new Date(year, month - 1, day)
  if (isNaN(parsed.getTime())) {
    return null
  }

  // Verifica se a data corresponde aos valores (previne datas como 31 de fevereiro)
  if (parsed.getFullYear() !== year ||
      parsed.getMonth() !== month - 1 ||
      parsed.getDate() !== day) {
    return null
  }

  // Verifica se a data não está muito no futuro ou passado
  const now = new Date()
  const maxFuture = new Date()
  maxFuture.setFullYear(maxFuture.getFullYear() + 1)

  const minPast = new Date()
  minPast.setFullYear(minPast.getFullYear() - 10)

  if (parsed > maxFuture || parsed < minPast) {
    return null
  }

  return date
}

/**
 * Valida horário no formato HH:MM
 * @param {string} time - Horário no formato HH:MM
 * @returns {string|null} Horário válido ou null
 */
export function validateTime(time) {
  if (typeof time !== 'string') {
    return null
  }

  // Verifica formato exato
  const timeRegex = /^\d{2}:\d{2}$/
  if (!timeRegex.test(time)) {
    return null
  }

  const [hours, minutes] = time.split(':').map(Number)

  // Valida ranges
  if (hours < 0 || hours > 23) return null
  if (minutes < 0 || minutes > 59) return null

  return time
}

/**
 * Valida intensidade (1-5)
 * @param {*} intensity - Valor de intensidade
 * @returns {number} Intensidade válida (1-5)
 */
export function validateIntensity(intensity) {
  const parsed = parseInt(intensity, 10)
  if (isNaN(parsed)) return 3
  return Math.min(5, Math.max(1, parsed))
}

/**
 * Gera ID único seguro usando crypto API
 * @returns {string} UUID v4
 */
export function generateId() {
  // Usa crypto.randomUUID se disponível (mais seguro)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  // Fallback para navegadores mais antigos
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 0x0f) >> (c === 'x' ? 0 : 1)
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * Verifica se string contém apenas caracteres alfanuméricos
 * @param {string} str - String a verificar
 * @returns {boolean}
 */
export function isAlphanumeric(str) {
  if (typeof str !== 'string') {
    return false
  }
  return /^[a-zA-Z0-9]+$/.test(str)
}

/**
 * Valida estrutura de dados do localStorage para prevenir prototype pollution
 * @param {*} data - Dados a validar
 * @param {Object} schema - Schema esperado
 * @returns {boolean}
 */
function validateDataStructure(data, schema) {
  if (data === null || typeof data !== 'object') {
    return false
  }

  // Previne prototype pollution - verifica apenas propriedades próprias
  if (Object.prototype.hasOwnProperty.call(data, '__proto__') ||
      Object.prototype.hasOwnProperty.call(data, 'constructor') ||
      Object.prototype.hasOwnProperty.call(data, 'prototype')) {
    return false
  }

  return true
}

/**
 * Limpa e valida JSON do localStorage com proteção contra prototype pollution
 * @param {string} key - Chave do localStorage
 * @param {*} defaultValue - Valor padrão se inválido
 * @param {Function} validator - Função de validação opcional
 * @returns {*} Dados parseados ou valor padrão
 */
export function safeLocalStorageGet(key, defaultValue = null, validator = null) {
  try {
    const item = localStorage.getItem(key)
    if (item === null) {
      return defaultValue
    }

    // Parse com reviver para prevenir prototype pollution
    const parsed = JSON.parse(item, (k, v) => {
      // Bloqueia chaves perigosas
      if (k === '__proto__' || k === 'constructor' || k === 'prototype') {
        return undefined
      }
      return v
    })

    // Valida estrutura básica
    if (!validateDataStructure(parsed, {})) {
      localStorage.removeItem(key)
      return defaultValue
    }

    // Validação customizada
    if (validator && typeof validator === 'function') {
      if (!validator(parsed)) {
        localStorage.removeItem(key)
        return defaultValue
      }
    }

    return parsed
  } catch {
    // Remove item corrompido
    localStorage.removeItem(key)
    return defaultValue
  }
}

/**
 * Salva dados de forma segura no localStorage
 * @param {string} key - Chave do localStorage
 * @param {*} value - Valor a ser salvo
 * @returns {boolean} true se sucesso
 */
export function safeLocalStorageSet(key, value) {
  try {
    // Verifica se key é uma string válida
    if (typeof key !== 'string' || key.length === 0) {
      return false
    }

    // Limita tamanho dos dados (5MB é o limite típico, usamos 4MB para segurança)
    const serialized = JSON.stringify(value)
    if (serialized.length > 4 * 1024 * 1024) {
      console.warn('Dados muito grandes para localStorage')
      return false
    }

    localStorage.setItem(key, serialized)
    return true
  } catch (error) {
    console.error('Erro ao salvar no localStorage:', error)
    return false
  }
}

/**
 * Valida array de sintomas do localStorage
 * @param {*} data - Dados a validar
 * @returns {boolean}
 */
export function validateSymptomsData(data) {
  if (!Array.isArray(data)) {
    return false
  }

  // Limita tamanho do array
  if (data.length > 10000) {
    return false
  }

  // Valida cada item
  return data.every(item => {
    if (typeof item !== 'object' || item === null) return false
    if (typeof item.id !== 'string') return false
    if (typeof item.type !== 'string') return false
    if (typeof item.intensity !== 'number') return false
    return true
  })
}

/**
 * Valida dados de usuário do localStorage
 * @param {*} data - Dados a validar
 * @returns {boolean}
 */
export function validateUserData(data) {
  if (typeof data !== 'object' || data === null) {
    return false
  }

  if (typeof data.id !== 'string') return false
  if (typeof data.name !== 'string') return false
  if (typeof data.email !== 'string') return false

  return true
}

/**
 * Valida array de notificações do localStorage
 * @param {*} data - Dados a validar
 * @returns {boolean}
 */
export function validateNotificationsData(data) {
  if (!Array.isArray(data)) {
    return false
  }

  // Limita tamanho do array
  if (data.length > 100) {
    return false
  }

  // Valida cada item
  return data.every(item => {
    if (typeof item !== 'object' || item === null) return false
    if (typeof item.id !== 'string') return false
    if (typeof item.type !== 'string') return false
    if (typeof item.title !== 'string') return false
    return true
  })
}

/**
 * Cria uma versão rate-limited de uma função
 * @param {Function} fn - Função a limitar
 * @param {number} minInterval - Intervalo mínimo em ms
 * @returns {Function}
 */
export function rateLimit(fn, minInterval = 1000) {
  let lastCall = 0

  return function(...args) {
    const now = Date.now()
    if (now - lastCall < minInterval) {
      return null
    }
    lastCall = now
    return fn.apply(this, args)
  }
}
