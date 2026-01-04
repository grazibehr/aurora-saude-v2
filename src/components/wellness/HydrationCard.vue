<script setup>
import { computed } from "vue";
import { Droplet, Minus, Clock } from "lucide-vue-next";
import { BaseCard } from "../ui";
import { useHydration } from "../../composables/useHydration";
import { useNotifications } from "../../composables/useNotifications";

const CUP_ML = 250;

const { addNotification, NOTIFICATION_TYPES } = useNotifications();

const handleGoalReached = () => {
  addNotification({
    type: NOTIFICATION_TYPES.ACHIEVEMENT,
    title: "Meta alcançada!",
    message: "Parabéns! Você atingiu sua meta diária de hidratação 💧",
  });
};

const handleReminder = (consumed, goal) => {
  addNotification({
    type: NOTIFICATION_TYPES.REMINDER,
    title: "Hora de beber água!",
    message: `Você bebeu ${((consumed * CUP_ML) / 1000).toFixed(1)}L de ${(
      (goal * CUP_ML) /
      1000
    ).toFixed(1)}L hoje.`,
  });
};

const {
  goal, // em copos
  consumed, // em copos
  progress,
  reminderActive,
  add,
  remove,
  toggleReminder,
} = useHydration(handleGoalReached, handleReminder);

// derivados para UI
const consumedLiters = computed(() => (consumed.value * CUP_ML) / 1000);
const goalLiters = computed(() => (goal.value * CUP_ML) / 1000);
</script>

<template>
  <BaseCard class="!bg-gradient-to-br !from-cyan-50 !to-teal-50">
    <template #header>
      <div class="flex items-center gap-2">
        <Droplet class="w-5 h-5 text-cyan-600" />
        <h3 class="text-lg font-semibold text-gray-900">Hidratação</h3>
      </div>
    </template>

    <!-- Progresso -->
    <div class="text-center mb-4">
      <div class="relative inline-flex items-center justify-center">
        <svg class="w-28 h-28 transform -rotate-90">
          <circle
            cx="56"
            cy="56"
            r="48"
            stroke="#e5e7eb"
            stroke-width="8"
            fill="none"
          />
          <circle
            cx="56"
            cy="56"
            r="48"
            stroke="#06b6d4"
            stroke-width="8"
            fill="none"
            :stroke-dasharray="`${progress * 3.02} 302`"
            class="transition-all duration-500"
          />
        </svg>

        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center">
            <span class="text-2xl font-bold text-gray-900">
              {{ consumedLiters.toFixed(1) }}L
            </span>
            <span class="text-gray-500"> / {{ goalLiters.toFixed(1) }}L </span>
            <p class="text-xs text-gray-500">hidratação diária</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Controles -->
    <div class="flex items-center justify-center gap-3 mb-4">
      <button
        @click="remove"
        :disabled="consumed === 0"
        class="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 flex items-center justify-center transition-colors"
      >
        <Minus class="w-5 h-5 text-gray-600" />
      </button>

      <button
        @click="add"
        :disabled="consumed >= goal"
        class="w-14 h-14 rounded-full bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 flex items-center justify-center transition-colors shadow-lg"
      >
        <Droplet class="w-7 h-7 text-white" />
      </button>

      <!-- spacer -->
      <div class="w-10 h-10 invisible"></div>
    </div>

    <!-- Lembretes -->
    <button
      @click="toggleReminder"
      :class="[
        'w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2',
        reminderActive
          ? 'bg-cyan-500 text-white'
          : 'bg-white text-gray-700 hover:bg-cyan-50',
      ]"
    >
      <Clock class="w-4 h-4" />
      {{ reminderActive ? "Lembretes ativos" : "Ativar lembretes" }}
    </button>
  </BaseCard>
</template>
