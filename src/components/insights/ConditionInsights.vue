<script setup>
import { HeartPulse, Stethoscope, Activity } from "lucide-vue-next";
import { BaseCard } from "../ui";

defineProps({
  userDiseases: {
    type: Array,
    required: true,
  },
  conditionInsights: {
    type: Array,
    required: true,
  },
  symptomMatchAnalysis: {
    type: Object,
    default: null,
  },
});

const categoryColorMap = {
  mental: "purple",
  cardiovascular: "red",
  respiratory: "blue",
  endocrine: "orange",
  neurological: "indigo",
  musculoskeletal: "green",
  gastrointestinal: "yellow",
  dermatological: "pink",
  immunological: "teal",
  other: "gray",
};

const getCategoryColor = (category) => {
  const colors = {
    purple: "bg-teal-100 text-teal-700 border-teal-200",
    red: "bg-red-100 text-red-700 border-red-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    orange: "bg-orange-100 text-orange-700 border-orange-200",
    indigo: "bg-indigo-100 text-indigo-700 border-indigo-200",
    green: "bg-green-100 text-green-700 border-green-200",
    yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
    pink: "bg-pink-100 text-pink-700 border-pink-200",
    teal: "bg-teal-100 text-teal-700 border-teal-200",
    gray: "bg-gray-100 text-gray-700 border-gray-200",
  };
  return colors[categoryColorMap[category]] || colors.gray;
};

const symptomTypeMap = {
  dor: "Dor",
  enjoo: "Enjoo",
  fadiga: "Fadiga",
  ansiedade: "Ansiedade",
  insonia: "Insônia",
  febre: "Febre",
};
</script>

<template>
  <section aria-labelledby="condition-insights-title">
    <h2
      id="condition-insights-title"
      class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"
    >
      <HeartPulse class="w-5 h-5 text-teal-600" aria-hidden="true" />
      Análise das Suas Condições
    </h2>

    <div class="grid gap-4">
      <!-- Resumo das condições -->
      <BaseCard
        class="!bg-gradient-to-r !from-teal-50 !to-cyan-50 !border-teal-100"
      >
        <div class="flex items-start gap-4">
          <div
            class="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center shrink-0"
          >
            <Stethoscope class="w-6 h-6 text-teal-600" aria-hidden="true" />
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900 mb-2">
              Suas Condições de Saúde
            </h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="disease in userDiseases"
                :key="disease.id"
                :class="[
                  'px-3 py-1 rounded-full text-sm font-medium border',
                  getCategoryColor(disease.category),
                ]"
              >
                {{ disease.name }}
              </span>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Sintomas relacionados às condições -->
      <article
        v-for="insight in conditionInsights"
        :key="insight.symptomId"
        class="p-4 rounded-xl border-2 bg-purple-50 border-purple-200"
      >
        <div class="flex items-start gap-4">
          <div
            class="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0"
          >
            <Activity class="w-5 h-5 text-purple-600" aria-hidden="true" />
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">
              {{ insight.symptom }} relacionado às suas condições
            </h3>
            <p class="text-gray-600 mt-1">
              Você registrou <strong>{{ insight.count }}</strong> episódios de
              {{ insight.symptom.toLowerCase() }}. Este sintoma é comum em:
              <strong>{{ insight.diseases.join(", ") }}</strong
              >.
            </p>
          </div>
        </div>
      </article>

      <!-- Análise de correspondência -->
      <BaseCard v-if="symptomMatchAnalysis">
        <div class="flex items-center gap-4 mb-4">
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900">
              Correspondência de Sintomas
            </h3>
            <p class="text-sm text-gray-500">
              Comparação entre sintomas esperados e registrados
            </p>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-teal-600">
              {{ symptomMatchAnalysis.matchPercentage }}%
            </div>
            <div class="text-xs text-gray-500">correspondência</div>
          </div>
        </div>

        <div class="space-y-3">
          <div v-if="symptomMatchAnalysis.matching.length > 0">
            <p class="text-sm font-medium text-gray-700 mb-1">
              Sintomas esperados e registrados:
            </p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="symptom in symptomMatchAnalysis.matching"
                :key="symptom"
                class="px-2 py-1 bg-green-100 text-green-700 rounded text-sm"
              >
                {{ symptomTypeMap[symptom] || symptom }}
              </span>
            </div>
          </div>

          <div v-if="symptomMatchAnalysis.unexpected.length > 0">
            <p class="text-sm font-medium text-gray-700 mb-1">
              Sintomas não esperados (atenção):
            </p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="symptom in symptomMatchAnalysis.unexpected"
                :key="symptom"
                class="px-2 py-1 bg-amber-100 text-amber-700 rounded text-sm"
              >
                {{ symptomTypeMap[symptom] || symptom }}
              </span>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              Estes sintomas não estão tipicamente associados às suas condições
              cadastradas. Considere mencionar isso ao seu médico.
            </p>
          </div>
        </div>
      </BaseCard>
    </div>
  </section>
</template>
