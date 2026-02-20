<script setup>
import { Activity, TrendingUp, TrendingDown, Minus } from "lucide-vue-next";
import { BaseCard } from "../ui";
import { trendConfig } from "../../data/wellnessData";

defineProps({
  weeklyTrendAnalysis: {
    type: Object,
    required: true,
  },
});

const trendIcons = {
  improving: TrendingUp,
  worsening: TrendingDown,
  stable: Minus,
};
</script>

<template>
  <BaseCard v-if="weeklyTrendAnalysis.typeAnalysis.length > 0">
    <template #header>
      <div class="flex items-center gap-2">
        <Activity class="w-5 h-5 text-teal-600" />
        <h3 class="text-lg font-semibold text-gray-900">
          Tendências da Semana
        </h3>
      </div>
    </template>

    <p class="text-gray-600 mb-4">{{ weeklyTrendAnalysis.overallMessage }}</p>

    <div class="space-y-3">
      <div
        v-for="analysis in weeklyTrendAnalysis.typeAnalysis"
        :key="analysis.id"
        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
      >
        <div class="flex items-center gap-3">
          <div :class="['p-2 rounded-lg', trendConfig.colors[analysis.trend]]">
            <component :is="trendIcons[analysis.trend]" class="w-4 h-4" />
          </div>
          <div>
            <p class="font-medium text-gray-900">{{ analysis.label }}</p>
            <p class="text-sm text-gray-500">
              {{ analysis.thisWeekCount }} esta semana
              <span v-if="analysis.lastWeekCount > 0">
                ({{ analysis.percentChange > 0 ? "+" : ""
                }}{{ analysis.percentChange }}%)
              </span>
            </p>
          </div>
        </div>
        <span
          :class="[
            'text-sm font-medium',
            trendConfig.colors[analysis.trend].split(' ')[0],
          ]"
        >
          {{ analysis.trendDescription }}
        </span>
      </div>
    </div>

    <div
      v-if="weeklyTrendAnalysis.typeAnalysis.length === 0"
      class="text-center py-8 text-gray-500"
    >
      <Activity class="w-12 h-12 mx-auto mb-3 opacity-30" />
      <p>Registre sintomas para ver a análise de tendências</p>
    </div>
  </BaseCard>
</template>
