import { ref, computed, onUnmounted } from "vue";

export function useBreathingTimer(onComplete) {
  const isActive = ref(false);
  const isPaused = ref(false);
  const currentStep = ref(0);
  const currentCycle = ref(1);
  const stepProgress = ref(0);
  const exercise = ref(null);
  let intervalId = null;

  const currentStepData = computed(() => {
    if (!exercise.value) return null;
    return exercise.value.steps[currentStep.value];
  });

  const start = (selectedExercise) => {
    exercise.value = selectedExercise;
    isActive.value = false;
    isPaused.value = false;
    currentStep.value = 0;
    currentCycle.value = 1;
    stepProgress.value = 0;
  };

  const play = () => {
    isActive.value = true;
    isPaused.value = false;
    runStep();
  };

  const pause = () => {
    isPaused.value = true;
    if (intervalId) {
      clearInterval(intervalId);
    }
  };

  const reset = () => {
    isActive.value = false;
    isPaused.value = false;
    currentStep.value = 0;
    currentCycle.value = 1;
    stepProgress.value = 0;
    if (intervalId) {
      clearInterval(intervalId);
    }
  };

  const runStep = () => {
    if (!exercise.value) return;

    const step = exercise.value.steps[currentStep.value];
    const totalMs = step.duration * 1000;
    const intervalMs = 50;
    let elapsed = 0;

    intervalId = setInterval(() => {
      if (isPaused.value) return;

      elapsed += intervalMs;
      stepProgress.value = (elapsed / totalMs) * 100;

      if (elapsed >= totalMs) {
        clearInterval(intervalId);
        stepProgress.value = 0;

        if (currentStep.value < exercise.value.steps.length - 1) {
          currentStep.value++;
        } else {
          if (currentCycle.value < exercise.value.cycles) {
            currentCycle.value++;
            currentStep.value = 0;
          } else {
            isActive.value = false;
            if (onComplete) {
              onComplete(exercise.value);
            }
            return;
          }
        }

        if (isActive.value && !isPaused.value) {
          runStep();
        }
      }
    }, intervalMs);
  };

  const cleanup = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  };

  onUnmounted(cleanup);

  return {
    isActive,
    isPaused,
    currentStep,
    currentCycle,
    stepProgress,
    currentStepData,
    exercise,
    start,
    play,
    pause,
    reset,
    cleanup,
  };
}
