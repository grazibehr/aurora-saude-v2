<script setup>
import { computed, onMounted } from "vue";
import { TrendingUp, TrendingDown, Clock, AlertTriangle } from "lucide-vue-next";
import { useSymptoms } from "../composables/useSymptoms";
import { useMedicalRecord } from "../composables/useMedicalRecord";
import { useMedicationInteractions } from "../composables/useMedicationInteractions";
import {
  InsightsHeader,
  InsightsEmptyState,
  PersonalInsights,
  MedicationAnalysis,
  InteractionAlerts,
  ConditionInsights,
  SymptomTypeChart,
  WeekdayChart,
  WeeklyTrendCard,
  HealthTipsCard,
  RegisterConditionsPrompt,
} from "../components/insights";

const { symptoms, stats, refreshSymptoms } = useSymptoms();

onMounted(() => {
  refreshSymptoms();
});

const {
  userDiseases,
  expectedSymptoms,
  isSymptomRelatedToConditions,
  getRelatedDiseases,
  medicalRecord,
} = useMedicalRecord();

const { analyzeAllSymptoms, activeAlerts } = useMedicationInteractions();

// Análise por tipo de sintoma
const typeAnalysis = computed(() => {
  return stats.value.typeStats
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count);
});

// Análise de tendência semanal
const weeklyTrend = computed(() => {
  const today = new Date();
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - 7);

  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  const thisWeekSymptoms = symptoms.value.filter((s) => {
    const date = new Date(s.date);
    return date >= thisWeekStart && date <= today;
  });

  const lastWeekSymptoms = symptoms.value.filter((s) => {
    const date = new Date(s.date);
    return date >= lastWeekStart && date < thisWeekStart;
  });

  const thisWeekCount = thisWeekSymptoms.length;
  const lastWeekCount = lastWeekSymptoms.length;

  let trend = "stable";
  let percentage = 0;

  if (lastWeekCount > 0) {
    percentage = Math.round(
      ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100
    );
    if (percentage > 10) trend = "up";
    else if (percentage < -10) trend = "down";
  }

  return {
    thisWeekCount,
    lastWeekCount,
    trend,
    percentage: Math.abs(percentage),
  };
});

// Horários mais frequentes
const peakHours = computed(() => {
  const hourCounts = {};

  symptoms.value.forEach((s) => {
    const hour = parseInt(s.time?.split(":")[0] || 0);
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });

  const sortedHours = Object.entries(hourCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([hour, count]) => ({
      hour: parseInt(hour),
      count,
      label: `${hour.padStart(2, "0")}:00 - ${(parseInt(hour) + 1).toString().padStart(2, "0")}:00`,
    }));

  return sortedHours;
});

// Dias da semana mais frequentes
const weekdayAnalysis = computed(() => {
  const dayCounts = {
    0: { name: "Domingo", count: 0 },
    1: { name: "Segunda", count: 0 },
    2: { name: "Terça", count: 0 },
    3: { name: "Quarta", count: 0 },
    4: { name: "Quinta", count: 0 },
    5: { name: "Sexta", count: 0 },
    6: { name: "Sábado", count: 0 },
  };

  symptoms.value.forEach((s) => {
    const dateStr = (s.date || "").split("T")[0].split(" ")[0];
    if (!dateStr) return;
    const day = new Date(dateStr + "T12:00:00").getDay();
    if (!isNaN(day)) {
      dayCounts[day].count++;
    }
  });

  const maxCount = Math.max(...Object.values(dayCounts).map((d) => d.count));

  return Object.values(dayCounts).map((d) => ({
    ...d,
    percentage: maxCount > 0 ? Math.round((d.count / maxCount) * 100) : 0,
  }));
});

// Insights personalizados
const personalInsights = computed(() => {
  const insights = [];

  if (parseFloat(stats.value.avgIntensity) >= 4) {
    insights.push({
      type: "warning",
      icon: AlertTriangle,
      title: "Intensidade elevada",
      description:
        "A maioria dos seus sintomas tem intensidade alta. Considere consultar um profissional de saúde.",
    });
  }

  if (typeAnalysis.value.length > 0) {
    const mostCommon = typeAnalysis.value[0];
    insights.push({
      type: "info",
      icon: TrendingUp,
      title: "Sintoma mais frequente",
      description: `${mostCommon.label} é o sintoma que você mais registra (${mostCommon.count} vezes).`,
    });
  }

  if (weeklyTrend.value.trend === "up") {
    insights.push({
      type: "warning",
      icon: TrendingUp,
      title: "Aumento de sintomas",
      description: `Você registrou ${weeklyTrend.value.percentage}% mais sintomas esta semana comparado à semana anterior.`,
    });
  } else if (weeklyTrend.value.trend === "down") {
    insights.push({
      type: "success",
      icon: TrendingDown,
      title: "Redução de sintomas",
      description: `Ótima notícia! Você registrou ${weeklyTrend.value.percentage}% menos sintomas esta semana.`,
    });
  }

  if (peakHours.value.length > 0) {
    const peakHour = peakHours.value[0];
    insights.push({
      type: "info",
      icon: Clock,
      title: "Horário de pico",
      description: `Seus sintomas são mais frequentes entre ${peakHour.label}.`,
    });
  }

  return insights;
});

// Análise de sintomas relacionados às condições do usuário
const conditionInsights = computed(() => {
  const insights = [];

  if (userDiseases.value.length === 0) {
    return insights;
  }

  typeAnalysis.value.forEach((typeStats) => {
    const isRelated = isSymptomRelatedToConditions(typeStats.id);
    const relatedDiseases = getRelatedDiseases(typeStats.id);

    if (isRelated && relatedDiseases.length > 0) {
      insights.push({
        type: "condition",
        symptom: typeStats.label,
        symptomId: typeStats.id,
        count: typeStats.count,
        diseases: relatedDiseases.map((d) => d.name),
      });
    }
  });

  return insights;
});

// Sintomas esperados vs registrados
const symptomMatchAnalysis = computed(() => {
  if (expectedSymptoms.value.length === 0) return null;

  const expected = expectedSymptoms.value.map((e) => e.symptom);
  const registered = typeAnalysis.value.map((t) => t.id);

  const matching = expected.filter((e) => registered.includes(e));
  const notRegistered = expected.filter((e) => !registered.includes(e));
  const unexpected = registered.filter((r) => !expected.includes(r));

  return {
    matching,
    notRegistered,
    unexpected,
    matchPercentage:
      expected.length > 0
        ? Math.round((matching.length / expected.length) * 100)
        : 0,
  };
});

// Análise de sintomas vs medicamentos
const medicationSymptomAnalysis = computed(() => {
  const medications = medicalRecord.value?.medications || [];
  if (medications.length === 0 || symptoms.value.length === 0) {
    return null;
  }

  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 7);

  const recentSymptoms = symptoms.value.filter((s) => {
    const date = new Date(s.date);
    return date >= weekAgo && date <= today;
  });

  if (recentSymptoms.length === 0) {
    return null;
  }

  const analysis = analyzeAllSymptoms(recentSymptoms, medications);
  return analysis.length > 0 ? analysis : null;
});
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header -->
    <InsightsHeader :total-records="stats.total" />

    <!-- Empty state -->
    <InsightsEmptyState v-if="stats.total === 0" />

    <template v-else>
      <!-- Personal insights -->
      <PersonalInsights :insights="personalInsights" />

      <!-- Análise de Sintomas vs Medicamentos -->
      <MedicationAnalysis :analysis="medicationSymptomAnalysis" />

      <!-- Alertas de Interação Ativas -->
      <InteractionAlerts :alerts="activeAlerts" />

      <!-- Medical Record Insights -->
      <ConditionInsights
        v-if="userDiseases.length > 0"
        :user-diseases="userDiseases"
        :condition-insights="conditionInsights"
        :symptom-match-analysis="symptomMatchAnalysis"
      />

      <!-- Aviso para cadastrar condições -->
      <RegisterConditionsPrompt v-else-if="stats.total > 0" />

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Symptoms by type -->
        <SymptomTypeChart :type-analysis="typeAnalysis" :total="stats.total" />

        <!-- Weekday analysis -->
        <WeekdayChart :weekday-analysis="weekdayAnalysis" />

        <!-- Weekly trend -->
        <WeeklyTrendCard :weekly-trend="weeklyTrend" />
      </div>

      <!-- Health tips -->
      <HealthTipsCard />
    </template>
  </div>
</template>
