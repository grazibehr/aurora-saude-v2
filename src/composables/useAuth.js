import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'
import {
  sanitizeInput,
  validateEmail,
  safeLocalStorageGet,
  safeLocalStorageSet,
  validateUserData
} from '../utils/security'

const USER_STORAGE_KEY = 'aurora_user'
const TOKEN_STORAGE_KEY = 'aurora_token'

const user = ref(null)
const token = ref(null)

user.value = safeLocalStorageGet(USER_STORAGE_KEY, null, validateUserData)
token.value = localStorage.getItem(TOKEN_STORAGE_KEY)

export function useAuth() {
  const router = useRouter()

  const isAuthenticated = computed(() => user.value !== null && token.value !== null)

  const login = async (email, password) => {
    const sanitizedEmail = sanitizeInput(email, 254).toLowerCase()

    if (!validateEmail(sanitizedEmail)) {
      throw new Error('E-mail inválido')
    }

    if (!password || password.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres')
    }

    const response = await api.login(sanitizedEmail, password)

    if (!response.ok) {
      throw new Error(response.message || 'Erro ao fazer login')
    }

    // Salva o token
    token.value = response.token
    localStorage.setItem(TOKEN_STORAGE_KEY, response.token)

    // Verifica se já existe dados do usuário no localStorage (para preservar onboardingCompleted)
    const existingUser = safeLocalStorageGet(USER_STORAGE_KEY, null, validateUserData)
    const userId = String(response.user?.id || 'unknown')

    // Preserva onboardingCompleted se for o mesmo usuário
    const preserveOnboarding = existingUser?.id === userId && existingUser?.onboardingCompleted === true

    // Usa os dados do usuário da resposta da API
    const userData = {
      id: userId,
      name: response.user?.name || 'Usuário',
      email: response.user?.email || sanitizedEmail,
      createdAt: new Date().toISOString(),
      onboardingCompleted: preserveOnboarding || response.user?.onboardingCompleted || false,
      avatar: response.user?.avatar || null
    }
    user.value = userData
    safeLocalStorageSet(USER_STORAGE_KEY, userData)

    return userData
  }

  const cadastro = async (name, email, password) => {
    const sanitizedName = sanitizeInput(name, 100)
    const sanitizedEmail = sanitizeInput(email, 254).toLowerCase()

    if (!sanitizedName || sanitizedName.length < 2) {
      throw new Error('Nome deve ter pelo menos 2 caracteres')
    }

    if (!validateEmail(sanitizedEmail)) {
      throw new Error('E-mail inválido')
    }

    if (!password || password.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres')
    }

    const response = await api.cadastro(sanitizedName, sanitizedEmail, password)

    if (!response.ok) {
      throw new Error(response.message || 'Erro ao cadastrar')
    }

    // Salva o token
    token.value = response.token
    localStorage.setItem(TOKEN_STORAGE_KEY, response.token)

    // Usa os dados do usuário da resposta da API
    // Marca como novo usuário que precisa fazer onboarding
    const userData = {
      id: String(response.user?.id || 'unknown'),
      name: response.user?.name || sanitizedName,
      email: response.user?.email || sanitizedEmail,
      createdAt: new Date().toISOString(),
      onboardingCompleted: false // Novo usuário precisa fazer onboarding
    }
    user.value = userData
    safeLocalStorageSet(USER_STORAGE_KEY, userData)

    return userData
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem(USER_STORAGE_KEY)
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    // Limpa todos os dados do usuário
    localStorage.removeItem('aurora_medical_record')
    localStorage.removeItem('aurora_symptoms')
    localStorage.removeItem('aurora_wellness')
    localStorage.removeItem('aurora_medications_schedule')
    router.push('/login')
  }

  const updateUser = (updates) => {
    if (!user.value) return

    const sanitizedUpdates = {}

    if (updates.name) {
      const sanitizedName = sanitizeInput(updates.name, 100)
      if (sanitizedName.length < 2) {
        throw new Error('Nome deve ter pelo menos 2 caracteres')
      }
      sanitizedUpdates.name = sanitizedName
    }

    if (updates.email) {
      const sanitizedEmail = sanitizeInput(updates.email, 254).toLowerCase()
      if (!validateEmail(sanitizedEmail)) {
        throw new Error('E-mail inválido')
      }
      sanitizedUpdates.email = sanitizedEmail
    }

    if (updates.avatar !== undefined) {
      sanitizedUpdates.avatar = updates.avatar
    }

    user.value = { ...user.value, ...sanitizedUpdates }
    safeLocalStorageSet(USER_STORAGE_KEY, user.value)
  }

  // Atualiza perfil do usuário (usado no onboarding e configurações)
  const updateUserProfile = async (profileData) => {
    if (!user.value) return

    const updates = {}
    const apiData = {}

    // Data de nascimento
    if (profileData.birthDate) {
      updates.birthDate = profileData.birthDate
      apiData.birth_date = profileData.birthDate
    }

    // Telefone
    if (profileData.phone !== undefined) {
      updates.phone = sanitizeInput(profileData.phone, 20)
      apiData.phone = updates.phone
    }

    // Onboarding completo
    if (profileData.onboardingCompleted !== undefined) {
      updates.onboardingCompleted = profileData.onboardingCompleted
      apiData.onboarding_completed = profileData.onboardingCompleted
    }

    // Avatar
    if (profileData.avatar !== undefined) {
      updates.avatar = profileData.avatar
      apiData.avatar = profileData.avatar
    }

    // Atualiza localmente primeiro
    user.value = { ...user.value, ...updates }
    safeLocalStorageSet(USER_STORAGE_KEY, user.value)

    // Envia para o backend se houver dados para atualizar
    if (Object.keys(apiData).length > 0) {
      try {
        await api.updateProfile(apiData)
      } catch (error) {
        console.error('Erro ao atualizar perfil no servidor:', error)
        // Mantém atualização local mesmo se falhar no servidor
      }
    }

    return user.value
  }

  // Verifica se precisa fazer onboarding
  const needsOnboarding = computed(() => {
    return user.value && !user.value.onboardingCompleted
  })

  return {
    user,
    token,
    isAuthenticated,
    needsOnboarding,
    login,
    cadastro,
    logout,
    updateUser,
    updateUserProfile
  }
}
