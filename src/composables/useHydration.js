import { ref, computed, onUnmounted } from "vue";

export function useHydration(onGoalReached, onReminder) {
  const goal = ref(8);
  const consumed = ref(0);
  const reminderActive = ref(false);
  let reminderIntervalId = null;

  const progress = computed(() => {
    return Math.min((consumed.value / goal.value) * 100, 100);
  });

  const add = () => {
    if (consumed.value < goal.value) {
      consumed.value++;
      if (consumed.value === goal.value && onGoalReached) {
        onGoalReached();
      }
    }
  };

  const remove = () => {
    if (consumed.value > 0) {
      consumed.value--;
    }
  };

  const toggleReminder = () => {
    reminderActive.value = !reminderActive.value;
    if (reminderActive.value) {
      // Lembrete a cada 30 minutos
      reminderIntervalId = setInterval(() => {
        if (consumed.value < goal.value && onReminder) {
          onReminder(consumed.value, goal.value);
        }
      }, 30 * 60 * 1000);
    } else {
      if (reminderIntervalId) {
        clearInterval(reminderIntervalId);
      }
    }
  };

  const cleanup = () => {
    if (reminderIntervalId) {
      clearInterval(reminderIntervalId);
    }
  };

  onUnmounted(cleanup);
  return {
    goal,
    consumed,
    progress,
    reminderActive,
    add,
    remove,
    toggleReminder,
    cleanup,
  };
}
