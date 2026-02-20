<script setup>
import { Pill, ShieldAlert, Info } from "lucide-vue-next";
import { BaseCard } from "../ui";

defineProps({
  analysis: {
    type: Array,
    default: null,
  },
});
</script>

<template>
  <section v-if="analysis" aria-labelledby="medication-analysis-title">
    <h2
      id="medication-analysis-title"
      class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"
    >
      <Pill class="w-5 h-5 text-blue-600" aria-hidden="true" />
      Possíveis Efeitos dos Medicamentos
    </h2>

    <div class="space-y-3">
      <BaseCard
        v-for="(item, index) in analysis"
        :key="index"
        class="!p-4"
      >
        <div class="flex items-start gap-3">
          <div
            class="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0"
          >
            <ShieldAlert class="w-5 h-5 text-amber-600" aria-hidden="true" />
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="font-semibold text-gray-900">
                {{ item.symptomLabel }}
              </h3>
              <span
                class="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
              >
                {{ item.count }}x esta semana
              </span>
            </div>
            <p class="text-sm text-gray-600 mb-2">
              Este sintoma pode estar relacionado aos seus medicamentos:
            </p>
            <div class="space-y-1">
              <div
                v-for="(cause, causeIndex) in item.possibleCauses"
                :key="causeIndex"
                :class="[
                  'text-sm p-2 rounded-lg flex items-start gap-2',
                  cause.likelihood === 'interaction'
                    ? 'bg-red-50 text-red-700'
                    : 'bg-blue-50 text-blue-700',
                ]"
              >
                <Info class="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <span class="font-medium">{{ cause.medication }}</span>
                  <span v-if="cause.severity" class="ml-1 text-xs">
                    ({{
                      cause.severity === "high"
                        ? "risco alto"
                        : cause.severity === "moderate"
                          ? "risco moderado"
                          : "risco baixo"
                    }})
                  </span>
                  <p class="text-xs mt-0.5 opacity-80">
                    {{ cause.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <p class="text-xs text-gray-500 mt-3 flex items-center gap-1">
      <Info class="w-3 h-3" />
      Essas informações são apenas sugestivas. Consulte seu médico antes de
      fazer alterações.
    </p>
  </section>
</template>
