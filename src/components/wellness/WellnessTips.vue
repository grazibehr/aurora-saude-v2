<script setup>
import {
  Lightbulb,
  Sun,
  Activity,
  Wind,
  Droplet,
  Utensils,
  Clock,
  Coffee,
  Brain,
  Users,
  Heart,
  Moon,
  Thermometer,
  Leaf,
  Smartphone,
  Home,
  AlertTriangle,
} from "lucide-vue-next";
import { BaseCard } from "../ui";

defineProps({
  tips: {
    type: Array,
    required: true,
  },
});

const iconMap = {
  Sun,
  Activity,
  Wind,
  Droplet,
  Utensils,
  Clock,
  Coffee,
  Brain,
  Users,
  Heart,
  Moon,
  Thermometer,
  Leaf,
  Smartphone,
  Home,
  Lightbulb,
  AlertTriangle,
};
</script>

<template>
  <BaseCard v-if="tips.length > 0">
    <template #header>
      <div class="flex items-center gap-2">
        <Lightbulb class="w-5 h-5 text-yellow-500" />
        <h3 class="text-lg font-semibold text-gray-900">
          Dicas Personalizadas
        </h3>
      </div>
    </template>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="(tip, idx) in tips"
        :key="idx"
        :class="[
          'flex items-start gap-3 p-4 rounded-xl',
          idx % 2 === 0
            ? 'bg-gradient-to-br from-teal-50 to-cyan-50'
            : 'bg-gradient-to-br from-purple-50 to-pink-50',
        ]"
      >
        <div
          class="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0"
        >
          <component
            :is="iconMap[tip.icon] || Lightbulb"
            :class="[
              'w-5 h-5',
              idx % 2 === 0 ? 'text-teal-600' : 'text-purple-600',
            ]"
          />
        </div>
        <div>
          <h4 class="font-medium text-gray-900">{{ tip.title }}</h4>
          <p class="text-sm text-gray-600">{{ tip.description }}</p>
          <p
            v-if="tip.source"
            :class="[
              'text-xs mt-1',
              idx % 2 === 0 ? 'text-teal-600' : 'text-purple-600',
            ]"
          >
            Baseado em: {{ tip.source }}
          </p>
        </div>
      </div>
    </div>
  </BaseCard>
</template>
