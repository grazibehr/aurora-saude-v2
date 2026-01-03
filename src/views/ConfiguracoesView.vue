<script setup>
import { ref, computed } from 'vue'
import {
  User,
  Mail,
  Save,
  Trash2,
  Download,
  Check,
  Shield,
  Database,
  Info,
  Camera,
  X
} from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth'
import { useSymptoms } from '../composables/useSymptoms'
import { useNotifications } from '../composables/useNotifications'
import { BaseButton, BaseInput, BaseCard, BaseAlert, BaseModal, BaseAvatar } from '../components/ui'

const { user, updateUser, updateUserProfile, logout } = useAuth()
const { symptoms } = useSymptoms()
const { addNotification, NOTIFICATION_TYPES } = useNotifications()

const name = ref(user.value?.name || '')
const email = ref(user.value?.email || '')
const error = ref('')
const success = ref('')
const showDeleteModal = ref(false)
const fileInput = ref(null)
const isUploadingPhoto = ref(false)

const hasChanges = computed(() => {
  return name.value !== user.value?.name || email.value !== user.value?.email
})

const handleSave = () => {
  error.value = ''
  success.value = ''

  try {
    updateUser({
      name: name.value,
      email: email.value
    })
    success.value = 'Perfil atualizado com sucesso!'

    addNotification({
      type: NOTIFICATION_TYPES.ACHIEVEMENT,
      title: 'Perfil atualizado',
      message: 'Suas informações de perfil foram salvas com sucesso.'
    })

    setTimeout(() => {
      success.value = ''
    }, 3000)
  } catch (err) {
    error.value = err.message || 'Erro ao atualizar perfil'
  }
}

const handleExportData = () => {
  const data = {
    user: user.value,
    symptoms: symptoms.value,
    exportedAt: new Date().toISOString()
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `aurora-saude-backup-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  addNotification({
    type: NOTIFICATION_TYPES.ACHIEVEMENT,
    title: 'Dados exportados',
    message: `Backup com ${symptoms.value.length} registros foi baixado com sucesso.`
  })

  success.value = 'Dados exportados com sucesso!'
  setTimeout(() => {
    success.value = ''
  }, 3000)
}

const handleDeleteAccount = () => {
  localStorage.removeItem('aurora_symptoms')
  localStorage.removeItem('aurora_user')
  logout()
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

// Funções para foto de perfil
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  // Validações
  if (!file.type.startsWith('image/')) {
    error.value = 'Por favor, selecione uma imagem válida'
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    error.value = 'A imagem deve ter no máximo 2MB'
    return
  }

  isUploadingPhoto.value = true
  error.value = ''

  try {
    const base64 = await fileToBase64(file)
    const resized = await resizeImage(base64, 200, 200)

    await updateUserProfile({ avatar: resized })

    success.value = 'Foto de perfil atualizada!'
    addNotification({
      type: NOTIFICATION_TYPES.ACHIEVEMENT,
      title: 'Foto atualizada',
      message: 'Sua foto de perfil foi alterada com sucesso.'
    })

    setTimeout(() => {
      success.value = ''
    }, 3000)
  } catch (err) {
    error.value = 'Erro ao salvar foto. Tente novamente.'
    console.error('Erro ao salvar avatar:', err)
  } finally {
    isUploadingPhoto.value = false
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

const removePhoto = async () => {
  try {
    await updateUserProfile({ avatar: null })
    success.value = 'Foto de perfil removida!'
    setTimeout(() => {
      success.value = ''
    }, 3000)
  } catch (err) {
    error.value = 'Erro ao remover foto.'
    console.error('Erro ao remover avatar:', err)
  }
}

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const resizeImage = (base64, maxWidth, maxHeight) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', 0.8))
    }
    img.src = base64
  })
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6 animate-fade-in">
    <!-- Success message -->
    <Transition name="slide">
      <BaseAlert
        v-if="success"
        variant="success"
        dismissible
        @dismiss="success = ''"
      >
        {{ success }}
      </BaseAlert>
    </Transition>

    <!-- Error message -->
    <Transition name="slide">
      <BaseAlert
        v-if="error"
        variant="error"
        dismissible
        @dismiss="error = ''"
      >
        {{ error }}
      </BaseAlert>
    </Transition>

    <!-- Profile section -->
    <BaseCard>
      <template #header>
        <div class="flex items-center gap-4">
          <!-- Avatar com upload -->
          <div class="relative group">
            <div
              v-if="user?.avatar"
              class="w-16 h-16 rounded-full overflow-hidden ring-4 ring-teal-100"
            >
              <img
                :src="user.avatar"
                alt="Foto de perfil"
                class="w-full h-full object-cover"
              />
            </div>
            <BaseAvatar
              v-else
              :name="user?.name"
              size="xl"
              color="teal"
            />

            <!-- Overlay para upload -->
            <button
              @click="triggerFileInput"
              :disabled="isUploadingPhoto"
              class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera class="w-6 h-6 text-white" />
            </button>

            <!-- Botão remover foto -->
            <button
              v-if="user?.avatar"
              @click="removePhoto"
              class="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-red-600 transition-colors"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileSelect"
          />

          <div>
            <h2 class="text-xl font-semibold text-gray-900">
              Meu Perfil
            </h2>
            <p class="text-sm text-gray-500">
              Membro desde {{ formatDate(user?.createdAt) }}
            </p>
            <button
              @click="triggerFileInput"
              class="text-sm text-teal-600 hover:text-teal-700 font-medium mt-1"
            >
              {{ user?.avatar ? 'Alterar foto' : 'Adicionar foto' }}
            </button>
          </div>
        </div>
      </template>

      <form @submit.prevent="handleSave" class="space-y-4">
        <BaseInput
          v-model="name"
          label="Nome completo"
          placeholder="Seu nome"
          required
          :minlength="2"
          :maxlength="100"
        >
          <template #icon-left>
            <User class="w-5 h-5" />
          </template>
        </BaseInput>

        <BaseInput
          v-model="email"
          type="email"
          label="E-mail"
          placeholder="seu@email.com"
          required
        >
          <template #icon-left>
            <Mail class="w-5 h-5" />
          </template>
        </BaseInput>

        <BaseButton
          type="submit"
          variant="primary"
          size="lg"
          full-width
          :disabled="!hasChanges"
        >
          <template #icon-left>
            <Save class="w-5 h-5" />
          </template>
          Salvar alterações
        </BaseButton>
      </form>
    </BaseCard>

    <!-- Data section -->
    <BaseCard>
      <template #header>
        <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Database class="w-5 h-5 text-gray-400" />
          Seus Dados
        </h2>
      </template>

      <div class="space-y-4">
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <p class="font-medium text-gray-900">Total de registros</p>
            <p class="text-sm text-gray-500">Sintomas registrados no sistema</p>
          </div>
          <span class="text-2xl font-bold text-teal-600">{{ symptoms.length }}</span>
        </div>

        <BaseButton
          variant="secondary"
          size="lg"
          full-width
          @click="handleExportData"
        >
          <template #icon-left>
            <Download class="w-5 h-5" />
          </template>
          Exportar meus dados
        </BaseButton>

        <p class="text-sm text-gray-500 flex items-start gap-2">
          <Info class="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
          Seus dados serão baixados em formato JSON, que pode ser importado posteriormente.
        </p>
      </div>
    </BaseCard>

    <!-- Privacy section -->
    <BaseCard>
      <template #header>
        <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Shield class="w-5 h-5 text-gray-400" />
          Privacidade e Segurança
        </h2>
      </template>

      <div class="space-y-4">
        <BaseAlert variant="success" title="Seus dados estão seguros">
          Todas as informações são armazenadas localmente no seu navegador.
          Nenhum dado é enviado para servidores externos.
        </BaseAlert>

        <ul class="space-y-2 text-sm text-gray-600">
          <li class="flex items-center gap-2">
            <Check class="w-4 h-4 text-green-500" aria-hidden="true" />
            Armazenamento 100% local
          </li>
          <li class="flex items-center gap-2">
            <Check class="w-4 h-4 text-green-500" aria-hidden="true" />
            Nenhum rastreamento
          </li>
          <li class="flex items-center gap-2">
            <Check class="w-4 h-4 text-green-500" aria-hidden="true" />
            Dados criptografados pelo navegador
          </li>
          <li class="flex items-center gap-2">
            <Check class="w-4 h-4 text-green-500" aria-hidden="true" />
            Controle total sobre suas informações
          </li>
        </ul>
      </div>
    </BaseCard>

    <!-- Danger zone -->
    <BaseCard variant="outlined" class="!border-2 !border-red-200">
      <template #header>
        <h2 class="text-lg font-semibold text-red-600 flex items-center gap-2">
          <Trash2 class="w-5 h-5" />
          Zona de Perigo
        </h2>
      </template>

      <p class="text-gray-600 mb-4">
        Ao excluir sua conta, todos os seus dados serão permanentemente removidos.
        Esta ação não pode ser desfeita.
      </p>

      <BaseButton
        variant="danger"
        size="lg"
        full-width
        @click="showDeleteModal = true"
      >
        <template #icon-left>
          <Trash2 class="w-5 h-5" />
        </template>
        Excluir minha conta e dados
      </BaseButton>
    </BaseCard>

    <!-- About section -->
    <BaseCard class="!bg-gradient-to-r !from-teal-50 !to-cyan-50">
      <template #header>
        <h2 class="text-lg font-semibold text-gray-900">
          Sobre o Aurora Saúde
        </h2>
      </template>

      <p class="text-gray-600 mb-4">
        O Aurora Saúde é um sistema de monitoramento de saúde desenvolvido como MVP
        para a disciplina "Desenvolvimento FullStack Básico" da PUC-Rio.
      </p>

      <div class="text-sm text-gray-500 space-y-1">
        <p>Versão: 2.0.0</p>
        <p>Desenvolvido com Vue 3 + Tailwind CSS</p>
        <p>&copy; {{ new Date().getFullYear() }} - Todos os direitos reservados</p>
      </div>
    </BaseCard>

    <!-- Delete confirmation modal -->
    <BaseModal
      v-model="showDeleteModal"
      title="Excluir conta?"
      size="sm"
    >
      <p class="text-gray-600">
        Esta ação irá excluir permanentemente sua conta e todos os {{ symptoms.length }} registros de sintomas.
        Não será possível recuperar essas informações.
      </p>

      <template #footer>
        <BaseButton variant="secondary" @click="showDeleteModal = false">
          Cancelar
        </BaseButton>
        <BaseButton variant="danger" @click="handleDeleteAccount">
          <template #icon-left>
            <Trash2 class="w-4 h-4" />
          </template>
          Sim, excluir tudo
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
