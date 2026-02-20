<script setup>
import { Activity } from "lucide-vue-next";
import { BaseCard } from "../ui";
</script>

<template>
  <BaseCard class="text-center py-12">
    <Activity class="w-16 h-16 text-gray-300 mx-auto mb-4" aria-hidden="true" />
    <h3 class="text-lg font-medium text-gray-900 mb-2">
      Sem dados suficientes
    </h3>
    <p class="text-gray-500 max-w-md mx-auto">
      Registre alguns sintomas para começar a ver insights personalizados sobre
      sua saúde.
    </p>
  </BaseCard>
</template>
