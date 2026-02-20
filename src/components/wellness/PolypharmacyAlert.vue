<script setup>
import { Pill } from "lucide-vue-next";
import { BaseCard } from "../ui";

defineProps({
  totalMedications: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <BaseCard
    v-if="totalMedications >= 5"
    class="!bg-amber-50 !border-amber-200"
  >
    <div class="flex items-start gap-4">
      <div
        class="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0"
      >
        <Pill class="w-6 h-6 text-amber-600" />
      </div>
      <div>
        <h3 class="font-semibold text-amber-900 mb-1">
          Atenção: Polifarmácia
        </h3>
        <p class="text-sm text-amber-800">
          Você está utilizando {{ totalMedications }} medicamentos. A
          polifarmácia pode aumentar o risco de interações medicamentosas e
          efeitos adversos.
        </p>
        <p class="text-sm text-amber-700 mt-2 font-medium">
          Converse com seu médico sobre a revisão dos seus medicamentos.
        </p>
      </div>
    </div>
  </BaseCard>
</template>
