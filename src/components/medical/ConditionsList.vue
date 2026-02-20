<script setup>
import { Heart, Plus, X } from "lucide-vue-next";
import { BaseButton, BaseCard } from "../ui";
import { DISEASE_CATEGORIES } from "../../data/diseases";

defineProps({
  diseases: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["add", "remove"]);

const categoryColors = {
  mental: "purple",
  cardiovascular: "red",
  respiratory: "blue",
  endocrine: "orange",
  neurological: "indigo",
  musculoskeletal: "green",
  gastrointestinal: "yellow",
  dermatological: "pink",
  immunological: "teal",
  other: "gray",
};

const getCategoryColor = (categoryId) => {
  const colors = {
    purple: "bg-teal-100",
    red: "bg-red-100",
    blue: "bg-blue-100",
    orange: "bg-orange-100",
    indigo: "bg-indigo-100",
    green: "bg-green-100",
    yellow: "bg-yellow-100",
    pink: "bg-pink-100",
    teal: "bg-teal-100",
    gray: "bg-gray-100",
  };
  return colors[categoryColors[categoryId]] || colors.gray;
};

const getCategoryLabel = (categoryId) => {
  return DISEASE_CATEGORIES.find((c) => c.id === categoryId)?.label || "";
};
</script>

<template>
  <BaseCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Heart class="w-5 h-5 text-teal-500" />
          <h2 class="text-lg font-semibold text-gray-900">
            Condições de Saúde
          </h2>
        </div>
        <BaseButton variant="primary" size="sm" @click="emit('add')">
          <template #icon-left>
            <Plus class="w-4 h-4" />
          </template>
          Adicionar
        </BaseButton>
      </div>
    </template>

    <div v-if="diseases.length === 0" class="text-center py-8">
      <Heart class="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p class="text-gray-500 mb-4">Nenhuma condição cadastrada</p>
      <BaseButton variant="outline" @click="emit('add')">
        Adicionar condição
      </BaseButton>
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="disease in diseases"
        :key="disease.id"
        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
      >
        <div class="flex items-center gap-3">
          <div
            :class="[
              'w-2 h-2 rounded-full',
              getCategoryColor(disease.category),
            ]"
          ></div>
          <div>
            <p class="font-medium text-gray-900">{{ disease.name }}</p>
            <p class="text-xs text-gray-500">
              {{ disease.code }} - {{ getCategoryLabel(disease.category) }}
            </p>
          </div>
        </div>
        <button
          @click="emit('remove', disease)"
          class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>
  </BaseCard>
</template>
