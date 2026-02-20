<script setup>
import { Frown, Thermometer, Pill, Battery, Brain, Moon } from "lucide-vue-next";
import { BaseCard } from "../ui";

defineProps({
  typeAnalysis: {
    type: Array,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const iconMap = {
  Frown,
  Thermometer,
  Pill,
  Battery,
  Brain,
  Moon,
};

const colorMap = {
  red: "bg-red-100 text-red-600",
  orange: "bg-orange-100 text-orange-600",
  yellow: "bg-yellow-100 text-yellow-600",
  blue: "bg-blue-100 text-blue-600",
  purple: "bg-purple-100 text-purple-600",
  teal: "bg-teal-100 text-teal-600",
  indigo: "bg-indigo-100 text-indigo-600",
  gray: "bg-gray-100 text-gray-600",
};
</script>

<template>
  <BaseCard>
    <template #header>
      <h2 class="text-lg font-semibold text-gray-900">Sintomas por Tipo</h2>
    </template>

    <div v-if="typeAnalysis.length === 0" class="text-center py-6 text-gray-500">
      Nenhum dado disponível
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="type in typeAnalysis"
        :key="type.id"
        class="flex items-center gap-4"
      >
        <div
          :class="[
            'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
            colorMap[type.color],
          ]"
        >
          <component
            :is="iconMap[type.icon]"
            class="w-5 h-5"
            aria-hidden="true"
          />
        </div>

        <div class="flex-1">
          <div class="flex items-center justify-between mb-1">
            <span class="font-medium text-gray-900">{{ type.label }}</span>
            <span class="text-sm text-gray-500">{{ type.count }} registros</span>
          </div>
          <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-teal-500 rounded-full transition-all"
              :style="{ width: `${(type.count / total) * 100}%` }"
            />
          </div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>
