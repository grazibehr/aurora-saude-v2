<script setup>
import { AlertTriangle, Plus, X } from "lucide-vue-next";
import { BaseButton, BaseCard } from "../ui";

defineProps({
  allergies: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["add", "remove"]);

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
</script>

<template>
  <BaseCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <AlertTriangle class="w-5 h-5 text-orange-500" />
          <h2 class="text-lg font-semibold text-gray-900">Alergias</h2>
        </div>
        <BaseButton variant="primary" size="sm" @click="emit('add')">
          <template #icon-left>
            <Plus class="w-4 h-4" />
          </template>
          Adicionar
        </BaseButton>
      </div>
    </template>

    <div v-if="allergies.length === 0" class="text-center py-8">
      <AlertTriangle class="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p class="text-gray-500">Nenhuma alergia cadastrada</p>
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="allergy in allergies"
        :key="allergy.id"
        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
      >
        <div class="flex items-center gap-3">
          <span
            :class="[
              'px-2 py-1 text-xs font-medium rounded-full',
              getAllergySeverityColor(allergy.severity),
            ]"
          >
            {{ getAllergySeverityLabel(allergy.severity) }}
          </span>
          <p class="font-medium text-gray-900">{{ allergy.name }}</p>
        </div>
        <button
          @click="emit('remove', allergy.id)"
          class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>
  </BaseCard>
</template>
