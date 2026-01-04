<script setup>
import { Lightbulb } from "lucide-vue-next";
import { BaseCard } from "../ui";

defineProps({
  totalRecords: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <BaseCard
    variant="gradient"
    class="!bg-gradient-to-r !from-teal-600 !to-cyan-600 !text-white"
  >
    <div class="flex items-center gap-4">
      <div
        class="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center"
      >
        <Lightbulb class="w-7 h-7" aria-hidden="true" />
      </div>
      <div>
        <h2 class="text-2xl font-bold text-white">Seus Insights</h2>
        <p class="text-teal-100">
          Análise personalizada baseada em {{ totalRecords }} registros
        </p>
      </div>
    </div>
  </BaseCard>
</template>
