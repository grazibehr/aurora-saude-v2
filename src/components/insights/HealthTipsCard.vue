<script setup>
import { Lightbulb } from "lucide-vue-next";
import { BaseCard } from "../ui";
</script>

<template>
  <BaseCard class="!bg-gradient-to-r !from-green-50 !to-blue-50">
    <template #header>
      <h2
        class="text-lg font-semibold text-gray-900 flex items-center gap-2"
      >
        <Lightbulb class="w-5 h-5 text-green-600" aria-hidden="true" />
        Dicas de Saúde
      </h2>
    </template>

    <ul class="space-y-3">
      <li class="flex items-start gap-3">
        <span
          class="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold shrink-0"
          >1</span
        >
        <p class="text-gray-700">
          Mantenha um registro consistente dos seus sintomas para identificar
          padrões.
        </p>
      </li>
      <li class="flex items-start gap-3">
        <span
          class="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold shrink-0"
          >2</span
        >
        <p class="text-gray-700">
          Compartilhe esses dados com seu médico durante consultas para um
          diagnóstico mais preciso.
        </p>
      </li>
      <li class="flex items-start gap-3">
        <span
          class="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold shrink-0"
          >3</span
        >
        <p class="text-gray-700">
          Anote nas observações possíveis gatilhos como alimentação, sono ou
          estresse.
        </p>
      </li>
    </ul>
  </BaseCard>
</template>
