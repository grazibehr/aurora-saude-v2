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

const medication = ref({
  name: "",
  dosage: "",
  frequency: "",
});

const handleAdd = () => {
  if (!medication.value.name.trim()) return;

  emit("add", { ...medication.value });
  medication.value = { name: "", dosage: "", frequency: "" };
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
    title="Adicionar Medicamento"
    size="sm"
  >
    <div class="space-y-4">
      <BaseInput
        v-model="medication.name"
        label="Nome do medicamento"
        placeholder="Ex: Paracetamol"
        required
      />
      <BaseInput
        v-model="medication.dosage"
        label="Dosagem"
        placeholder="Ex: 500mg"
      />
      <BaseInput
        v-model="medication.frequency"
        label="Frequência"
        placeholder="Ex: 2x ao dia"
      />
    </div>

    <template #footer>
      <BaseButton variant="secondary" @click="closeModal"> Cancelar </BaseButton>
      <BaseButton
        variant="primary"
        @click="handleAdd"
        :disabled="!medication.name.trim()"
      >
        Adicionar
      </BaseButton>
    </template>
  </BaseModal>
</template>
