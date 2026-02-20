<script setup>
import { ref, watch } from "vue";
import { Phone } from "lucide-vue-next";
import { BaseButton, BaseInput, BaseCard } from "../ui";

const props = defineProps({
  contact: {
    type: Object,
    default: () => ({ name: "", phone: "", relationship: "" }),
  },
});

const emit = defineEmits(["save"]);

const localContact = ref({ ...props.contact });

watch(
  () => props.contact,
  (newVal) => {
    localContact.value = { ...newVal };
  },
  { deep: true }
);

const handleSave = () => {
  emit("save", { ...localContact.value });
};
</script>

<template>
  <BaseCard>
    <template #header>
      <div class="flex items-center gap-2">
        <Phone class="w-5 h-5 text-green-500" />
        <h2 class="text-lg font-semibold text-gray-900">
          Contato de Emergência
        </h2>
      </div>
    </template>

    <div class="space-y-3">
      <BaseInput
        v-model="localContact.name"
        label="Nome"
        placeholder="Nome do contato"
      />
      <BaseInput
        v-model="localContact.phone"
        label="Telefone"
        placeholder="(00) 00000-0000"
      />
      <BaseInput
        v-model="localContact.relationship"
        label="Parentesco"
        placeholder="Ex: Mãe, Cônjuge, Amigo"
      />
      <BaseButton variant="secondary" size="sm" @click="handleSave">
        Salvar
      </BaseButton>
    </div>
  </BaseCard>
</template>
