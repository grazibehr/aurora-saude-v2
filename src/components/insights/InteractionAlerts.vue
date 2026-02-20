<script setup>
import { AlertTriangle } from "lucide-vue-next";

defineProps({
  alerts: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <section v-if="alerts.length > 0" aria-labelledby="active-alerts-title">
    <h2
      id="active-alerts-title"
      class="text-lg font-semibold text-amber-700 mb-4 flex items-center gap-2"
    >
      <AlertTriangle class="w-5 h-5" aria-hidden="true" />
      Alertas de Interação Medicamentosa
    </h2>

    <div class="space-y-2">
      <div
        v-for="alert in alerts"
        :key="alert.id"
        :class="[
          'p-3 rounded-lg border-l-4',
          alert.severity === 'high'
            ? 'bg-red-50 border-red-500'
            : alert.severity === 'moderate'
              ? 'bg-amber-50 border-amber-500'
              : 'bg-blue-50 border-blue-500',
        ]"
      >
        <p class="font-medium text-gray-900 text-sm">
          {{ alert.medications?.join(" + ") }}
        </p>
        <p class="text-xs text-gray-600 mt-1">{{ alert.description }}</p>
      </div>
    </div>
  </section>
</template>
