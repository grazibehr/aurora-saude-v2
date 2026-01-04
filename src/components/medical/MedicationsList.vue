<script setup>
import { Pill, Plus, X } from "lucide-vue-next";
import { BaseButton, BaseCard } from "../ui";

defineProps({
  medications: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["add", "remove"]);
</script>

<template>
  <BaseCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Pill class="w-5 h-5 text-blue-500" />
          <h2 class="text-lg font-semibold text-gray-900">Medicamentos</h2>
        </div>
        <BaseButton variant="primary" size="sm" @click="emit('add')">
          <template #icon-left>
            <Plus class="w-4 h-4" />
          </template>
          Adicionar
        </BaseButton>
      </div>
    </template>

    <div v-if="medications.length === 0" class="text-center py-8">
      <Pill class="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p class="text-gray-500">Nenhum medicamento cadastrado</p>
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="med in medications"
        :key="med.id"
        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
      >
        <div>
          <p class="font-medium text-gray-900">{{ med.name }}</p>
          <p class="text-sm text-gray-500">
            <span v-if="med.dosage">{{ med.dosage }}</span>
            <span v-if="med.dosage && med.frequency"> - </span>
            <span v-if="med.frequency">{{ med.frequency }}</span>
          </p>
        </div>
        <button
          @click="emit('remove', med.id)"
          class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>
  </BaseCard>
</template>
