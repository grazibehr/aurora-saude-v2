<script setup>
import { ref, computed } from 'vue'
import {
  User,
  Mail,
  Save,
  Trash2,
  FileText,
  Database,
  Info,
  Camera,
  X
} from 'lucide-vue-next'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useAuth } from '../composables/useAuth'
import { useSymptoms, SYMPTOM_TYPES } from '../composables/useSymptoms'
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
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()

  // Cores do tema
  const tealColor = [20, 184, 166] // teal-500
  const grayColor = [107, 114, 128] // gray-500
  const darkColor = [17, 24, 39] // gray-900

  // Cabeçalho
  doc.setFillColor(...tealColor)
  doc.rect(0, 0, pageWidth, 40, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('Aurora Saúde', 20, 25)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Relatório de Sintomas do Paciente', 20, 33)

  // Data do relatório
  const dataAtual = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  doc.text(`Gerado em: ${dataAtual}`, pageWidth - 20, 25, { align: 'right' })

  // Informações do paciente
  doc.setTextColor(...darkColor)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Dados do Paciente', 20, 55)

  doc.setDrawColor(...tealColor)
  doc.setLineWidth(0.5)
  doc.line(20, 58, pageWidth - 20, 58)

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...grayColor)
  doc.text(`Nome: ${user.value?.name || 'Não informado'}`, 20, 68)
  doc.text(`E-mail: ${user.value?.email || 'Não informado'}`, 20, 76)
  doc.text(`Total de registros: ${symptoms.value.length}`, 20, 84)

  // Tabela de sintomas
  doc.setTextColor(...darkColor)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Histórico de Sintomas', 20, 100)

  doc.setDrawColor(...tealColor)
  doc.line(20, 103, pageWidth - 20, 103)

  let finalY = 130

  if (symptoms.value.length > 0) {
    // Preparar dados para a tabela
    const tableData = symptoms.value
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(s => {
        const data = new Date(s.date).toLocaleDateString('pt-BR')
        const intensidadeTexto = {
          1: 'Muito leve',
          2: 'Leve',
          3: 'Moderada',
          4: 'Intensa',
          5: 'Muito intensa'
        }[s.intensity] || s.intensity

        // Busca o label do tipo de sintoma
        const symptomType = SYMPTOM_TYPES.find(t => t.id === s.type)
        const symptomLabel = s.type === 'outro' && s.customLabel
          ? s.customLabel
          : (symptomType?.label || 'Não especificado')

        return [
          data,
          symptomLabel,
          intensidadeTexto,
          s.notes || '-'
        ]
      })

    autoTable(doc, {
      startY: 110,
      head: [['Data', 'Sintoma', 'Intensidade', 'Observações']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: tealColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10
      },
      bodyStyles: {
        fontSize: 9,
        textColor: darkColor
      },
      alternateRowStyles: {
        fillColor: [240, 253, 250] // teal-50
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: 'auto' }
      },
      margin: { left: 20, right: 20 },
      didDrawPage: (data) => {
        // Rodapé em cada página
        const pageCount = doc.internal.getNumberOfPages()
        doc.setFontSize(8)
        doc.setTextColor(...grayColor)
        doc.text(
          `Página ${data.pageNumber} de ${pageCount}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        )
      }
    })

    finalY = doc.lastAutoTable?.finalY || 130
  } else {
    doc.setFontSize(11)
    doc.setTextColor(...grayColor)
    doc.text('Nenhum sintoma registrado até o momento.', 20, 115)
  }

  // Rodapé final
  if (finalY < doc.internal.pageSize.getHeight() - 50) {
    doc.setDrawColor(229, 231, 235) // gray-200
    doc.setLineWidth(0.3)
    doc.line(20, finalY + 15, pageWidth - 20, finalY + 15)

    doc.setFontSize(8)
    doc.setTextColor(...grayColor)
    doc.text(
      'Este relatório foi gerado automaticamente pelo sistema Aurora Saúde.',
      20,
      finalY + 23
    )
    doc.text(
      'As informações aqui contidas são de uso exclusivo para acompanhamento médico.',
      20,
      finalY + 29
    )
  }

  // Salvar PDF
  doc.save(`relatorio-aurora-saude-${new Date().toISOString().split('T')[0]}.pdf`)

  addNotification({
    type: NOTIFICATION_TYPES.ACHIEVEMENT,
    title: 'Relatório exportado',
    message: `PDF com ${symptoms.value.length} registros foi gerado com sucesso.`
  })

  success.value = 'Relatório PDF exportado com sucesso!'
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
            <FileText class="w-5 h-5" />
          </template>
          Exportar relatório PDF
        </BaseButton>

        <p class="text-sm text-gray-500 flex items-start gap-2">
          <Info class="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
          Gera um relatório PDF profissional com todos os seus sintomas para análise médica.
        </p>
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
