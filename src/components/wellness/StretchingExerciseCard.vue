<script setup>
import { ref } from "vue";
import {
  Activity,
  Play,
  Pause,
  RotateCcw,
  X,
  Brain,
  Wind,
  Heart,
  Leaf,
} from "lucide-vue-next";
import { BaseCard } from "../ui";
import { stretchingExercises } from "../../data/wellnessData";
import { useStretchTimer, formatTime } from "../../composables/useStretchTimer";
import { useNotifications } from "../../composables/useNotifications";

const { addNotification, NOTIFICATION_TYPES } = useNotifications();

const showModal = ref(false);

const handleComplete = (stretch) => {
  addNotification({
    type: NOTIFICATION_TYPES.ACHIEVEMENT,
    title: "Alongamento concluído!",
    message: `Você completou o ${stretch.name}.`,
  });
};

const { isActive, timer, stretch, start, play, pause, reset, cleanup } =
  useStretchTimer(handleComplete);

const iconMap = {
  Brain,
  Activity,
  Wind,
  Heart,
  Leaf,
};

const openStretch = (selectedStretch) => {
  start(selectedStretch);
  showModal.value = true;
};

const closeModal = () => {
  pause();
  cleanup();
  showModal.value = false;
};
</script>

<template>
  <BaseCard class="!bg-gradient-to-br !from-green-50 !to-emerald-50">
    <template #header>
      <div class="flex items-center gap-2">
        <Activity class="w-5 h-5 text-green-600" />
        <h3 class="text-lg font-semibold text-gray-900">Alongamentos</h3>
      </div>
    </template>

    <p class="text-sm text-gray-600 mb-4">
      Exercícios rápidos para aliviar tensão muscular
    </p>

    <div class="space-y-2">
      <button
        v-for="ex in stretchingExercises"
        :key="ex.id"
        @click="openStretch(ex)"
        class="w-full p-3 bg-white rounded-lg hover:bg-green-50 transition-colors text-left group"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              :class="[
                'w-8 h-8 rounded-lg flex items-center justify-center',
                ex.color,
              ]"
            >
              <component :is="iconMap[ex.icon]" class="w-4 h-4" />
            </div>
            <div>
              <p class="font-medium text-gray-900 group-hover:text-green-600">
                {{ ex.name }}
              </p>
              <p class="text-xs text-gray-500">{{ ex.duration }}s</p>
            </div>
          </div>
          <Play class="w-5 h-5 text-gray-400 group-hover:text-green-600" />
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
                  {{ stretch?.name }}
                </h3>
                <button
                  @click="closeModal"
                  class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X class="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div class="flex flex-col items-center py-6">
                <div
                  :class="[
                    'w-32 h-32 rounded-full flex items-center justify-center',
                    stretch?.color || 'bg-gray-100',
                  ]"
                >
                  <span class="text-4xl font-bold text-gray-900">
                    {{ formatTime(timer) }}
                  </span>
                </div>
              </div>

              <div class="bg-gray-50 rounded-xl p-4 mb-6">
                <p class="text-sm font-medium text-gray-700 mb-2">
                  Instruções:
                </p>
                <ul class="space-y-2">
                  <li
                    v-for="(instruction, idx) in stretch?.instructions"
                    :key="idx"
                    class="text-sm text-gray-600 flex items-start gap-2"
                  >
                    <span
                      class="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-medium shrink-0"
                    >
                      {{ idx + 1 }}
                    </span>
                    {{ instruction }}
                  </li>
                </ul>
              </div>

              <div class="flex items-center justify-center gap-4">
                <button
                  @click="reset"
                  class="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <RotateCcw class="w-5 h-5 text-gray-600" />
                </button>

                <button
                  v-if="!isActive"
                  @click="play"
                  class="p-4 bg-green-500 hover:bg-green-600 rounded-full transition-colors shadow-lg"
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
