<script setup>
import { ref } from "vue";
import { Wind, Play, Pause, RotateCcw, X } from "lucide-vue-next";
import { BaseCard } from "../ui";
import { breathingExercises } from "../../data/wellnessData";
import { useBreathingTimer } from "../../composables/useBreathingTimer";
import { useNotifications } from "../../composables/useNotifications";

const { addNotification, NOTIFICATION_TYPES } = useNotifications();

const showModal = ref(false);

const handleComplete = (exercise) => {
  addNotification({
    type: NOTIFICATION_TYPES.ACHIEVEMENT,
    title: "Exercício concluído!",
    message: `Você completou ${exercise.cycles} ciclos de ${exercise.name}.`,
  });
};

const {
  isActive,
  isPaused,
  currentCycle,
  stepProgress,
  currentStepData,
  exercise,
  start,
  play,
  pause,
  reset,
  cleanup,
} = useBreathingTimer(handleComplete);

const openExercise = (selectedExercise) => {
  start(selectedExercise);
  showModal.value = true;
};

const closeModal = () => {
  reset();
  cleanup();
  showModal.value = false;
};
</script>

<template>
  <BaseCard class="!bg-gradient-to-br !from-blue-50 !to-indigo-50">
    <template #header>
      <div class="flex items-center gap-2">
        <Wind class="w-5 h-5 text-blue-600" />
        <h3 class="text-lg font-semibold text-gray-900">
          Exercícios de Respiração
        </h3>
      </div>
    </template>

    <p class="text-sm text-gray-600 mb-4">
      Técnicas guiadas para reduzir estresse e ansiedade
    </p>

    <div class="space-y-2">
      <button
        v-for="ex in breathingExercises"
        :key="ex.id"
        @click="openExercise(ex)"
        class="w-full p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors text-left group"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium text-gray-900 group-hover:text-blue-600">
              {{ ex.name }}
            </p>
            <p class="text-xs text-gray-500">{{ ex.benefits }}</p>
          </div>
          <Play class="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
        </div>
      </button>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showModal"
          class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          @click.self="closeModal"
        >
          <div
            class="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
          >
            <div class="p-6">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-semibold text-gray-900">
                  {{ exercise?.name }}
                </h3>
                <button
                  @click="closeModal"
                  class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X class="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div class="flex flex-col items-center py-8">
                <div
                  :class="[
                    'w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300',
                    currentStepData?.color || 'bg-gray-200',
                    isActive ? 'scale-110' : 'scale-100',
                  ]"
                  :style="{
                    transform: isActive
                      ? `scale(${1 + stepProgress / 200})`
                      : 'scale(1)',
                  }"
                >
                  <div class="text-center text-white">
                    <p class="text-3xl font-bold">
                      {{ currentStepData?.action || "Pronto?" }}
                    </p>
                    <p v-if="isActive" class="text-lg opacity-80">
                      {{ currentStepData?.duration }}s
                    </p>
                  </div>
                </div>

                <div v-if="isActive" class="mt-6 text-center">
                  <p class="text-sm text-gray-500">
                    Ciclo {{ currentCycle }} de {{ exercise?.cycles }}
                  </p>
                  <div
                    class="w-48 h-2 bg-gray-200 rounded-full mt-2 overflow-hidden"
                  >
                    <div
                      class="h-full bg-teal-500 transition-all duration-100"
                      :style="{ width: `${stepProgress}%` }"
                    />
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-center gap-4">
                <button
                  @click="reset"
                  class="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <RotateCcw class="w-5 h-5 text-gray-600" />
                </button>

                <button
                  v-if="!isActive || isPaused"
                  @click="play"
                  class="p-4 bg-teal-500 hover:bg-teal-600 rounded-full transition-colors shadow-lg"
                >
                  <Play class="w-8 h-8 text-white" />
                </button>
                <button
                  v-else
                  @click="pause"
                  class="p-4 bg-orange-500 hover:bg-orange-600 rounded-full transition-colors shadow-lg"
                >
                  <Pause class="w-8 h-8 text-white" />
                </button>
              </div>

              <p class="text-center text-sm text-gray-500 mt-6">
                {{ exercise?.description }}
              </p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </BaseCard>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
