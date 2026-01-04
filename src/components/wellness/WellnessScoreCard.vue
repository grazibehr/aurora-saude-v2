<script setup>
import { Heart, Check } from "lucide-vue-next";
import { BaseButton, BaseCard } from "../ui";
import { scoreColors } from "../../data/wellnessData";

defineProps({
  healthScore: {
    type: Object,
    required: true,
  },
  weeklyTrendAnalysis: {
    type: Object,
    required: true,
  },
  hasCheckinToday: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["checkin"]);
</script>

<template>
  <BaseCard class="overflow-hidden">
    <div class="flex flex-col md:flex-row items-center gap-6">
      <!-- Score Circle -->
      <div class="relative">
        <div
          :class="[
            'w-32 h-32 rounded-full flex items-center justify-center',
            'bg-gradient-to-br shadow-lg',
            scoreColors[healthScore.color],
          ]"
        >
          <div class="text-center text-white">
            <span class="text-4xl font-bold">{{ healthScore.score }}</span>
            <p class="text-sm opacity-90">de 100</p>
          </div>
        </div>
      </div>

      <div class="flex-1 text-center md:text-left">
        <h2 class="text-xl font-semibold text-gray-900 mb-2">
          Score de Saúde
        </h2>
        <p class="text-gray-600 mb-4">{{ healthScore.message }}</p>

        <div
          class="flex flex-wrap justify-center md:justify-start gap-4 text-sm"
        >
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-green-500"></div>
            <span>{{ weeklyTrendAnalysis.improvingCount }} melhorando</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-gray-400"></div>
            <span>{{ weeklyTrendAnalysis.stableCount }} estável</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-red-500"></div>
            <span>{{ weeklyTrendAnalysis.worseningCount }} piorando</span>
          </div>
        </div>
      </div>

      <div class="shrink-0">
        <BaseButton
          v-if="!hasCheckinToday"
          variant="primary"
          size="lg"
          @click="emit('checkin')"
        >
          <template #icon-left>
            <Heart class="w-5 h-5" />
          </template>
          Fazer Check-in
        </BaseButton>
        <div v-else class="text-center">
          <div
            class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2"
          >
            <Check class="w-6 h-6 text-green-600" />
          </div>
          <p class="text-sm text-green-600 font-medium">
            Check-in de hoje feito!
          </p>
        </div>
      </div>
    </div>
  </BaseCard>
</template>
