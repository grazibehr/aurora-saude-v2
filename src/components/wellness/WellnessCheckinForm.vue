<script setup>
import { ref } from "vue";
import { Battery, Smile, Moon, Check } from "lucide-vue-next";
import { BaseButton, BaseCard, BaseTextarea } from "../ui";
import { levelLabels } from "../../data/wellnessData";

const emit = defineEmits(["submit", "cancel"]);

const checkinData = ref({
  energy: 3,
  mood: 3,
  sleep: 3,
  notes: "",
});
const isSubmitting = ref(false);

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    emit("submit", { ...checkinData.value });
    checkinData.value = { energy: 3, mood: 3, sleep: 3, notes: "" };
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <BaseCard class="border-2 border-teal-200">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">Check-in Diário</h3>
        <BaseButton variant="ghost" size="sm" @click="emit('cancel')">
          Cancelar
        </BaseButton>
      </div>
    </template>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Energia -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">
          <Battery class="w-4 h-4 inline mr-2" />
          Nível de energia
        </label>
        <div class="flex gap-2">
          <button
            v-for="n in 5"
            :key="`energy-${n}`"
            type="button"
            @click="checkinData.energy = n"
            :class="[
              'flex-1 py-3 rounded-lg font-medium transition-all',
              checkinData.energy === n
                ? 'bg-yellow-500 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            ]"
          >
            {{ n }}
          </button>
        </div>
        <p class="text-center text-sm text-gray-500 mt-2">
          {{ levelLabels[checkinData.energy] }}
        </p>
      </div>

      <!-- Humor -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">
          <Smile class="w-4 h-4 inline mr-2" />
          Humor
        </label>
        <div class="flex gap-2">
          <button
            v-for="n in 5"
            :key="`mood-${n}`"
            type="button"
            @click="checkinData.mood = n"
            :class="[
              'flex-1 py-3 rounded-lg font-medium transition-all',
              checkinData.mood === n
                ? 'bg-blue-500 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            ]"
          >
            {{ n }}
          </button>
        </div>
        <p class="text-center text-sm text-gray-500 mt-2">
          {{ levelLabels[checkinData.mood] }}
        </p>
      </div>

      <!-- Sono -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">
          <Moon class="w-4 h-4 inline mr-2" />
          Qualidade do sono
        </label>
        <div class="flex gap-2">
          <button
            v-for="n in 5"
            :key="`sleep-${n}`"
            type="button"
            @click="checkinData.sleep = n"
            :class="[
              'flex-1 py-3 rounded-lg font-medium transition-all',
              checkinData.sleep === n
                ? 'bg-indigo-500 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            ]"
          >
            {{ n }}
          </button>
        </div>
        <p class="text-center text-sm text-gray-500 mt-2">
          {{ levelLabels[checkinData.sleep] }}
        </p>
      </div>

      <BaseTextarea
        v-model="checkinData.notes"
        label="Observações (opcional)"
        placeholder="Como foi seu dia? Algo que gostaria de registrar..."
        :rows="3"
        :maxlength="500"
      />

      <BaseButton
        type="submit"
        variant="primary"
        size="lg"
        full-width
        :loading="isSubmitting"
      >
        <template #icon-left>
          <Check class="w-5 h-5" />
        </template>
        Salvar Check-in
      </BaseButton>
    </form>
  </BaseCard>
</template>
