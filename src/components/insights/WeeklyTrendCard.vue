<script setup>
import { TrendingUp, TrendingDown, Activity } from "lucide-vue-next";
import { BaseCard } from "../ui";

defineProps({
  weeklyTrend: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <BaseCard>
    <template #header>
      <h2 class="text-lg font-semibold text-gray-900">Tendência Semanal</h2>
    </template>

    <div class="flex items-center gap-6">
      <div class="flex-1 text-center p-4 bg-gray-50 rounded-xl">
        <p class="text-3xl font-bold text-gray-900">
          {{ weeklyTrend.lastWeekCount }}
        </p>
        <p class="text-sm text-gray-500">Semana passada</p>
      </div>

      <div class="flex flex-col items-center">
        <component
          :is="
            weeklyTrend.trend === 'up'
              ? TrendingUp
              : weeklyTrend.trend === 'down'
                ? TrendingDown
                : Activity
          "
          :class="[
            'w-8 h-8',
            weeklyTrend.trend === 'up'
              ? 'text-red-500'
              : weeklyTrend.trend === 'down'
                ? 'text-green-500'
                : 'text-gray-400',
          ]"
          aria-hidden="true"
        />
        <span
          v-if="weeklyTrend.percentage > 0"
          :class="[
            'text-sm font-medium',
            weeklyTrend.trend === 'up' ? 'text-red-600' : 'text-green-600',
          ]"
        >
          {{ weeklyTrend.trend === "up" ? "+" : "-" }}{{ weeklyTrend.percentage }}%
        </span>
      </div>

      <div class="flex-1 text-center p-4 bg-teal-50 rounded-xl">
        <p class="text-3xl font-bold text-teal-700">
          {{ weeklyTrend.thisWeekCount }}
        </p>
        <p class="text-sm text-teal-600">Esta semana</p>
      </div>
    </div>
  </BaseCard>
</template>
