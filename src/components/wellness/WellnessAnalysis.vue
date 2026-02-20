<script setup>
import {
  Heart,
  Battery,
  Smile,
  Moon,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-vue-next";
import { BaseCard } from "../ui";
import { trendConfig } from "../../data/wellnessData";

defineProps({
  wellnessAnalysis: {
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
  <BaseCard>
    <template #header>
      <div class="flex items-center gap-2">
        <Heart class="w-5 h-5 text-red-500" />
        <h3 class="text-lg font-semibold text-gray-900">
          Análise de Bem-estar
        </h3>
      </div>
    </template>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="text-center p-4 bg-yellow-50 rounded-xl">
        <Battery class="w-6 h-6 mx-auto mb-2 text-yellow-600" />
        <p class="text-2xl font-bold text-gray-900">
          {{ wellnessAnalysis.recent.energy.toFixed(1) }}
        </p>
        <p class="text-sm text-gray-500">Energia</p>
        <div v-if="wellnessAnalysis.trends.energy" class="mt-2">
          <component
            :is="trendIcons[wellnessAnalysis.trends.energy]"
            :class="[
              'w-4 h-4 mx-auto',
              trendConfig.colors[wellnessAnalysis.trends.energy].split(' ')[0],
            ]"
          />
        </div>
      </div>

      <div class="text-center p-4 bg-blue-50 rounded-xl">
        <Smile class="w-6 h-6 mx-auto mb-2 text-blue-600" />
        <p class="text-2xl font-bold text-gray-900">
          {{ wellnessAnalysis.recent.mood.toFixed(1) }}
        </p>
        <p class="text-sm text-gray-500">Humor</p>
        <div v-if="wellnessAnalysis.trends.mood" class="mt-2">
          <component
            :is="trendIcons[wellnessAnalysis.trends.mood]"
            :class="[
              'w-4 h-4 mx-auto',
              trendConfig.colors[wellnessAnalysis.trends.mood].split(' ')[0],
            ]"
          />
        </div>
      </div>

      <div class="text-center p-4 bg-indigo-50 rounded-xl">
        <Moon class="w-6 h-6 mx-auto mb-2 text-indigo-600" />
        <p class="text-2xl font-bold text-gray-900">
          {{ wellnessAnalysis.recent.sleep.toFixed(1) }}
        </p>
        <p class="text-sm text-gray-500">Sono</p>
        <div v-if="wellnessAnalysis.trends.sleep" class="mt-2">
          <component
            :is="trendIcons[wellnessAnalysis.trends.sleep]"
            :class="[
              'w-4 h-4 mx-auto',
              trendConfig.colors[wellnessAnalysis.trends.sleep].split(' ')[0],
            ]"
          />
        </div>
      </div>
    </div>

    <p class="text-sm text-gray-500 text-center mt-4">
      Baseado em {{ wellnessAnalysis.daysTracked }} dias de check-in
    </p>
  </BaseCard>
</template>
