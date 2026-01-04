<script setup>
import { ShieldAlert, X, Info } from "lucide-vue-next";

defineProps({
  alerts: {
    type: Array,
    required: true,
  },
  alertCount: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["acknowledge"]);

const getSeverityLabel = (severity) => {
  const labels = {
    high: "Alto Risco",
    moderate: "Risco Moderado",
    low: "Baixo Risco",
  };
  return labels[severity] || "Risco";
};
</script>

<template>
  <div v-if="alerts.length > 0" class="space-y-3">
    <div class="flex items-center gap-2 text-amber-700">
      <ShieldAlert class="w-5 h-5" />
      <h2 class="font-semibold">Alertas de Interação Medicamentosa</h2>
      <span
        class="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full"
      >
        {{ alertCount }}
      </span>
    </div>

    <div
      v-for="alert in alerts"
      :key="alert.id"
      :class="[
        'p-4 rounded-xl border-l-4',
        alert.severity === 'high'
          ? 'bg-red-50 border-red-500'
          : alert.severity === 'moderate'
            ? 'bg-amber-50 border-amber-500'
            : 'bg-blue-50 border-blue-500',
      ]"
    >
      <div class="flex items-start justify-between gap-3">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span
              :class="[
                'px-2 py-0.5 text-xs font-medium rounded-full',
                alert.severity === 'high'
                  ? 'bg-red-100 text-red-700'
                  : alert.severity === 'moderate'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-blue-100 text-blue-700',
              ]"
            >
              {{ getSeverityLabel(alert.severity) }}
            </span>
            <span class="text-sm font-medium text-gray-900">
              {{ alert.medications?.join(" + ") }}
            </span>
          </div>
          <p class="text-sm text-gray-700 mb-2">{{ alert.description }}</p>
          <p class="text-xs text-gray-600 flex items-center gap-1">
            <Info class="w-3 h-3" />
            {{ alert.recommendation }}
          </p>
        </div>
        <button
          @click="emit('acknowledge', alert.id)"
          class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
          title="Marcar como lido"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>
