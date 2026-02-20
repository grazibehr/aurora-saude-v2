<script setup>
import { Heart, Pill, AlertTriangle, Droplet } from "lucide-vue-next";
import { BaseCard } from "../ui";

defineProps({
  stats: {
    type: Object,
    required: true,
  },
  bloodType: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
    <BaseCard class="!p-4">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center"
        >
          <Heart class="w-5 h-5 text-teal-600" />
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900">
            {{ stats.totalDiseases }}
          </p>
          <p class="text-xs text-gray-500">Condições</p>
        </div>
      </div>
    </BaseCard>

    <BaseCard class="!p-4">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"
        >
          <Pill class="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900">
            {{ stats.totalMedications }}
          </p>
          <p class="text-xs text-gray-500">Medicamentos</p>
        </div>
      </div>
    </BaseCard>

    <BaseCard class="!p-4">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center"
        >
          <AlertTriangle class="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900">
            {{ stats.totalAllergies }}
          </p>
          <p class="text-xs text-gray-500">Alergias</p>
        </div>
      </div>
    </BaseCard>

    <BaseCard class="!p-4">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center"
        >
          <Droplet class="w-5 h-5 text-red-600" />
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900">{{ bloodType || "-" }}</p>
          <p class="text-xs text-gray-500">Tipo Sanguíneo</p>
        </div>
      </div>
    </BaseCard>
  </div>
</template>
