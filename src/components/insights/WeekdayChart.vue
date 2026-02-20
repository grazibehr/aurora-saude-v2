<script setup>
import { BaseCard } from "../ui";

defineProps({
  weekdayAnalysis: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <BaseCard>
    <template #header>
      <h2 class="text-lg font-semibold text-gray-900">
        Frequência por Dia da Semana
      </h2>
    </template>

    <div class="flex justify-between gap-2">
      <div
        v-for="day in weekdayAnalysis"
        :key="day.name"
        class="flex-1 flex flex-col items-center"
      >
        <!-- Área do gráfico com altura fixa -->
        <div class="w-full h-32 flex items-end justify-center">
          <div
            class="w-full max-w-[32px] bg-teal-500 rounded-t-lg transition-all"
            :style="{
              height:
                day.count > 0 ? `${Math.max(day.percentage, 8)}%` : '4px',
              opacity: day.count > 0 ? 1 : 0.3,
            }"
          />
        </div>
        <!-- Labels -->
        <span class="text-xs text-gray-600 font-medium mt-2">
          {{ day.name.slice(0, 3) }}
        </span>
        <span class="text-xs text-gray-400">
          {{ day.count }}
        </span>
      </div>
    </div>
  </BaseCard>
</template>
