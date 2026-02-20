<script setup>
import { ref } from "vue";
import { BaseButton, BaseInput, BaseModal } from "../ui";

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "add"]);

const allergy = ref({
  name: "",
  severity: "moderate",
});

const getAllergySeverityColor = (severity) => {
  const colors = {
    mild: "bg-green-100 text-green-700",
    moderate: "bg-yellow-100 text-yellow-700",
    severe: "bg-red-100 text-red-700",
  };
  return colors[severity] || colors.moderate;
};

const getAllergySeverityLabel = (severity) => {
  const labels = {
    mild: "Leve",
    moderate: "Moderada",
    severe: "Grave",
  };
  return labels[severity] || "Moderada";
};

const handleAdd = () => {
  if (!allergy.value.name.trim()) return;

  emit("add", { ...allergy.value });
  allergy.value = { name: "", severity: "moderate" };
  emit("update:modelValue", false);
};

const closeModal = () => {
  emit("update:modelValue", false);
};
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    title="Adicionar Alergia"
    size="sm"
  >
    <div class="space-y-4">
      <BaseInput
        v-model="allergy.name"
        label="Alergia"
        placeholder="Ex: Penicilina, Amendoim"
        required
      />

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Gravidade</label
        >
        <div class="flex gap-2">
          <button
            v-for="severity in ['mild', 'moderate', 'severe']"
            :key="severity"
            @click="allergy.severity = severity"
            :class="[
              'flex-1 py-2 rounded-lg font-medium transition-all',
              allergy.severity === severity
                ? getAllergySeverityColor(severity)
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            ]"
          >
            {{ getAllergySeverityLabel(severity) }}
          </button>
        </div>
      </div>
    </div>

    <template #footer>
      <BaseButton variant="secondary" @click="closeModal"> Cancelar </BaseButton>
      <BaseButton
        variant="primary"
        @click="handleAdd"
        :disabled="!allergy.name.trim()"
      >
        Adicionar
      </BaseButton>
    </template>
  </BaseModal>
</template>
