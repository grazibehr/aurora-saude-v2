<script setup>
import { ref, watch, onMounted } from "vue";
import { Activity } from "lucide-vue-next";
import { useMedicalRecord } from "../composables/useMedicalRecord";
import { useMedicationInteractions } from "../composables/useMedicationInteractions";
import { BaseAlert } from "../components/ui";
import {
  MedicalRecordStats,
  ConditionsList,
  MedicationsList,
  AllergiesList,
  BloodTypeCard,
  EmergencyContactCard,
  MedicalNotesCard,
  MedicationInteractionAlerts,
  AddConditionModal,
  AddMedicationModal,
  AddAllergyModal,
} from "../components/medical";

const {
  medicalRecord,
  addDisease,
  removeDisease,
  userDiseases,
  addMedication,
  removeMedication,
  addAllergy,
  removeAllergy,
  updateBloodType,
  updateEmergencyContact,
  updateNotes,
  stats,
  refreshMedicalRecord,
} = useMedicalRecord();

const { activeAlerts, alertCount, updateAlerts, acknowledgeAlert } =
  useMedicationInteractions();

// Estado dos modais
const showDiseaseModal = ref(false);
const showMedicationModal = ref(false);
const showAllergyModal = ref(false);

// Estado de feedback
const success = ref("");
const errorMsg = ref("");

// Estado local
const bloodType = ref("");
const emergencyContact = ref({ name: "", phone: "", relationship: "" });
const notes = ref("");

onMounted(async () => {
  await refreshMedicalRecord();
  if (medicalRecord.value) {
    emergencyContact.value = {
      name: medicalRecord.value.emergencyContact?.name || "",
      phone: medicalRecord.value.emergencyContact?.phone || "",
      relationship: medicalRecord.value.emergencyContact?.relationship || "",
    };
    bloodType.value = medicalRecord.value.bloodType || "";
    notes.value = medicalRecord.value.notes || "";
    updateAlerts(medicalRecord.value.medications || []);
  }
});

watch(
  () => medicalRecord.value?.medications,
  (newMeds) => {
    if (newMeds) {
      updateAlerts(newMeds);
    }
  },
  { deep: true }
);

watch(
  medicalRecord,
  (newRecord) => {
    if (newRecord) {
      emergencyContact.value = {
        name: newRecord.emergencyContact?.name || "",
        phone: newRecord.emergencyContact?.phone || "",
        relationship: newRecord.emergencyContact?.relationship || "",
      };
      bloodType.value = newRecord.bloodType || "";
      notes.value = newRecord.notes || "";
    }
  },
  { deep: true, immediate: true }
);

// Handlers
const handleAddDisease = (disease) => {
  addDisease(disease.id);
  showSuccess("Condição adicionada!");
};

const handleRemoveDisease = async (disease) => {
  try {
    await removeDisease(disease.id);
    showSuccess("Condição removida!");
  } catch (err) {
    showError(err.message);
  }
};

const handleAddMedication = (medication) => {
  addMedication(medication);
  showSuccess("Medicamento adicionado!");
};

const handleRemoveMedication = async (medicationId) => {
  try {
    await removeMedication(medicationId);
    showSuccess("Medicamento removido!");
  } catch (err) {
    showError(err.message);
  }
};

const handleAddAllergy = (allergy) => {
  addAllergy(allergy);
  showSuccess("Alergia adicionada!");
};

const handleRemoveAllergy = async (allergyId) => {
  try {
    await removeAllergy(allergyId);
    showSuccess("Alergia removida!");
  } catch (err) {
    showError(err.message);
  }
};

const handleSaveBloodType = (type) => {
  updateBloodType(type);
  showSuccess("Tipo sanguíneo salvo!");
};

const handleSaveEmergencyContact = (contact) => {
  updateEmergencyContact(contact);
  showSuccess("Contato de emergência salvo!");
};

const handleSaveNotes = (notesValue) => {
  updateNotes(notesValue);
  showSuccess("Observações salvas!");
};

const showSuccess = (message) => {
  success.value = message;
  setTimeout(() => {
    success.value = "";
  }, 3000);
};

const showError = (message) => {
  errorMsg.value = message;
  setTimeout(() => {
    errorMsg.value = "";
  }, 5000);
};
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Ficha Médica</h1>
        <p class="text-gray-500">
          Gerencie suas condições de saúde, medicamentos e informações
          importantes
        </p>
      </div>
      <div class="flex items-center gap-2 text-sm text-gray-500">
        <Activity class="w-4 h-4" />
        {{ stats.totalDiseases }} condições
      </div>
    </div>

    <!-- Mensagens de feedback -->
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

    <Transition name="slide">
      <BaseAlert
        v-if="errorMsg"
        variant="error"
        dismissible
        @dismiss="errorMsg = ''"
      >
        {{ errorMsg }}
      </BaseAlert>
    </Transition>

    <!-- Alertas de Interação -->
    <MedicationInteractionAlerts
      :alerts="activeAlerts"
      :alert-count="alertCount"
      @acknowledge="acknowledgeAlert"
    />

    <!-- Stats -->
    <MedicalRecordStats
      :stats="stats"
      :blood-type="medicalRecord?.bloodType"
    />

    <!-- Condições de Saúde -->
    <ConditionsList
      :diseases="userDiseases"
      @add="showDiseaseModal = true"
      @remove="handleRemoveDisease"
    />

    <!-- Medicamentos -->
    <MedicationsList
      :medications="medicalRecord?.medications || []"
      @add="showMedicationModal = true"
      @remove="handleRemoveMedication"
    />

    <!-- Alergias -->
    <AllergiesList
      :allergies="medicalRecord?.allergies || []"
      @add="showAllergyModal = true"
      @remove="handleRemoveAllergy"
    />

    <!-- Informações Adicionais -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <BloodTypeCard v-model="bloodType" @save="handleSaveBloodType" />
      <EmergencyContactCard
        :contact="emergencyContact"
        @save="handleSaveEmergencyContact"
      />
    </div>

    <!-- Observações -->
    <MedicalNotesCard v-model="notes" @save="handleSaveNotes" />

    <!-- Modais -->
    <AddConditionModal
      v-model="showDiseaseModal"
      :selected-diseases="medicalRecord?.diseases || []"
      @add="handleAddDisease"
    />

    <AddMedicationModal
      v-model="showMedicationModal"
      @add="handleAddMedication"
    />

    <AddAllergyModal v-model="showAllergyModal" @add="handleAddAllergy" />
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
