import { ref, onUnmounted } from "vue";

export function useStretchTimer(onComplete) {
  const isActive = ref(false);
  const timer = ref(0);
  const stretch = ref(null);
  let intervalId = null;

  const start = (selectedStretch) => {
    stretch.value = selectedStretch;
    timer.value = selectedStretch.duration;
    isActive.value = false;
  };

  const play = () => {
    isActive.value = true;
    intervalId = setInterval(() => {
      if (timer.value > 0) {
        timer.value--;
      } else {
        clearInterval(intervalId);
        isActive.value = false;
        if (onComplete) {
          onComplete(stretch.value);
        }
      }
    }, 1000);
  };

  const pause = () => {
    isActive.value = false;
    if (intervalId) {
      clearInterval(intervalId);
    }
  };

  const reset = () => {
    isActive.value = false;
    if (intervalId) {
      clearInterval(intervalId);
    }
    if (stretch.value) {
      timer.value = stretch.value.duration;
    }
  };

  const cleanup = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  };

  onUnmounted(cleanup);

  return {
    isActive,
    timer,
    stretch,
    start,
    play,
    pause,
    reset,
    cleanup,
  };
}

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
