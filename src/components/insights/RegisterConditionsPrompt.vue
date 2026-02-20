<script setup>
import { HeartPulse } from "lucide-vue-next";
import { BaseCard } from "../ui";
</script>

<template>
  <BaseCard class="!bg-gradient-to-r !from-purple-50 !to-pink-50">
    <div class="flex items-center gap-4">
      <div
        class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center shrink-0"
      >
        <HeartPulse class="w-6 h-6 text-purple-600" aria-hidden="true" />
      </div>
      <div class="flex-1">
        <h3 class="font-semibold text-gray-900">Personalize seus insights</h3>
        <p class="text-gray-600 text-sm mt-1">
          Cadastre suas condições de saúde na
          <router-link
            to="/ficha-medica"
            class="text-purple-600 font-medium hover:underline"
          >
            Ficha Médica
          </router-link>
          para ver análises personalizadas baseadas no seu histórico de saúde.
        </p>
      </div>
    </div>
  </BaseCard>
</template>
