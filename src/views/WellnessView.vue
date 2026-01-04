<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ArrowLeft } from "lucide-vue-next";
import { useWellness } from "../composables/useWellness";
import { useNotifications } from "../composables/useNotifications";
import { BaseButton, BaseAlert } from "../components/ui";
import {
  WellnessCheckinForm,
  WellnessScoreCard,
  WellnessTrends,
  WellnessTips,
  WellnessAnalysis,
  WellnessEmptyState,
  BreathingExerciseCard,
  StretchingExerciseCard,
  HydrationCard,
  PolypharmacyAlert,
} from "../components/wellness";

const router = useRouter();
const {
  checkins,
  error,
  addCheckin,
  hasCheckinToday,
  weeklyTrendAnalysis,
  wellnessAnalysis,
  healthScore,
  getHealthTips,
  checkMedicationCompatibility,
  refreshAll,
} = useWellness();

const { addNotification, NOTIFICATION_TYPES } = useNotifications();

const showCheckinForm = ref(false);
const success = ref(false);

onMounted(async () => {
  await refreshAll();
});

const handleCheckinSubmit = async (data) => {
  try {
    await addCheckin(data);
    success.value = true;
    showCheckinForm.value = false;

    addNotification({
      type: NOTIFICATION_TYPES.ACHIEVEMENT,
      title: "Check-in realizado!",
      message: "Seu bem-estar foi registrado com sucesso.",
      action: { label: "Ver análise", route: "/bem-estar" },
    });

    setTimeout(() => {
      success.value = false;
    }, 3000);
  } catch (err) {
    console.error("Erro ao salvar check-in:", err);
  }
};

const goBack = () => {
  router.push("/");
};
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <BaseButton variant="ghost" @click="goBack">
        <template #icon-left>
          <ArrowLeft class="w-5 h-5" />
        </template>
        Voltar
      </BaseButton>
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Bem-estar</h1>
        <p class="text-gray-500">
          Acompanhe sua saúde e receba dicas personalizadas
        </p>
      </div>
    </div>

    <!-- Alertas -->
    <Transition name="slide">
      <BaseAlert
        v-if="success"
        variant="success"
        title="Check-in registrado!"
        class="mb-4"
      >
        Seus dados foram salvos com sucesso.
      </BaseAlert>
    </Transition>

    <BaseAlert
      v-if="error"
      variant="error"
      :title="error"
      dismissible
      @dismiss="error = null"
    />

    <!-- Score Card -->
    <WellnessScoreCard
      :health-score="healthScore"
      :weekly-trend-analysis="weeklyTrendAnalysis"
      :has-checkin-today="hasCheckinToday"
      @checkin="showCheckinForm = true"
    />

    <!-- Check-in Form -->
    <Transition name="slide">
      <WellnessCheckinForm
        v-if="showCheckinForm"
        @submit="handleCheckinSubmit"
        @cancel="showCheckinForm = false"
      />
    </Transition>

    <!-- Tendências -->
    <WellnessTrends :weekly-trend-analysis="weeklyTrendAnalysis" />

    <!-- Alerta de Polifarmácia -->
    <PolypharmacyAlert
      :total-medications="checkMedicationCompatibility.totalMedications"
    />

    <!-- Dicas -->
    <WellnessTips :tips="getHealthTips" />

    <!-- Análise de Bem-estar -->
    <WellnessAnalysis v-if="wellnessAnalysis" :wellness-analysis="wellnessAnalysis" />

    <!-- Estado Vazio -->
    <WellnessEmptyState
      v-if="!wellnessAnalysis && !hasCheckinToday && checkins.length === 0"
      @checkin="showCheckinForm = true"
    />

    <!-- Grid de Exercícios -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <BreathingExerciseCard />
      <HydrationCard />
      <StretchingExerciseCard />
    </div>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
