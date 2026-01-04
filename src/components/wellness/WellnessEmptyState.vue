<script setup>
import { Heart } from "lucide-vue-next";
import { BaseButton, BaseCard } from "../ui";

const emit = defineEmits(["checkin"]);
</script>

<template>
  <BaseCard class="text-center py-12">
    <Heart class="w-16 h-16 mx-auto mb-4 text-gray-300" />
    <h3 class="text-lg font-medium text-gray-900 mb-2">
      Comece seu acompanhamento
    </h3>
    <p class="text-gray-500 mb-6">
      Faça check-ins diários para receber análises personalizadas<br />
      e acompanhar sua evolução ao longo do tempo.
    </p>
    <BaseButton variant="primary" @click="emit('checkin')">
      <template #icon-left>
        <Heart class="w-5 h-5" />
      </template>
      Fazer primeiro check-in
    </BaseButton>
  </BaseCard>
</template>
