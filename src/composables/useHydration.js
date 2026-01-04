import { ref, computed, onUnmounted } from "vue";

const CUP_ML = 250;
const DAILY_GOAL_ML = 2500; // 2,5L padrão

export function useHydration(onGoalReached, onReminder) {
  // meta fixa: 10 copos
  const goal = ref(Math.ceil(DAILY_GOAL_ML / CUP_ML));
  const consumed = ref(0);

  const reminderActive = ref(false);
  let reminderIntervalId = null;

  // progresso normalizado (0 → 1)
  const progress = computed(() => Math.min(consumed.value / goal.value, 1));

  const add = () => {
    if (consumed.value >= goal.value) return;

    consumed.value++;

    if (consumed.value === goal.value && onGoalReached) {
      onGoalReached();
    }
  };

  const remove = () => {
    if (consumed.value > 0) {
      consumed.value--;
    }
  };

  const startReminder = () => {
    stopReminder();

    reminderIntervalId = setInterval(() => {
      if (consumed.value < goal.value && onReminder) {
        onReminder(consumed.value, goal.value);
      }
    }, 30 * 60 * 1000); // 30 minutos
  };

  const stopReminder = () => {
    if (reminderIntervalId) {
      clearInterval(reminderIntervalId);
      reminderIntervalId = null;
    }
  };

  const toggleReminder = () => {
    reminderActive.value = !reminderActive.value;
    reminderActive.value ? startReminder() : stopReminder();
  };

  onUnmounted(stopReminder);

  return {
    goal, // copos
    consumed, // copos
    progress, // 0–1
    reminderActive,
    add,
    remove,
    toggleReminder,
  };
}
