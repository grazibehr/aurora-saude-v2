<script setup>
import { ref, computed } from "vue";
import { Search, Check, ChevronDown, Brain, Heart } from "lucide-vue-next";
import { BaseButton, BaseInput, BaseModal } from "../ui";
import {
  DISEASE_CATEGORIES,
  searchDiseases,
  getDiseasesByCategory,
} from "../../data/diseases";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  selectedDiseases: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue", "add"]);

const searchTerm = ref("");
const expandedCategories = ref(["mental"]);

const filteredDiseases = computed(() => {
  if (searchTerm.value.length < 2) return [];
  return searchDiseases(searchTerm.value).slice(0, 10);
});

const toggleCategory = (categoryId) => {
  const index = expandedCategories.value.indexOf(categoryId);
  if (index > -1) {
    expandedCategories.value.splice(index, 1);
  } else {
    expandedCategories.value.push(categoryId);
  }
};

const handleAdd = (disease) => {
  emit("add", disease);
  searchTerm.value = "";
};

const isDiseaseSelected = (diseaseId) => {
  return props.selectedDiseases.some((entry) => {
    if (typeof entry === "string") return entry === diseaseId;
    return entry?.cidCode === diseaseId || entry?.cid_code === diseaseId;
  });
};

const closeModal = () => {
  emit("update:modelValue", false);
};
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    title="Adicionar Condição de Saúde"
    size="lg"
  >
    <div class="space-y-4">
      <!-- Busca -->
      <BaseInput v-model="searchTerm" placeholder="Buscar por nome ou código CID...">
        <template #icon-left>
          <Search class="w-5 h-5" />
        </template>
      </BaseInput>

      <!-- Resultados da busca -->
      <div
        v-if="filteredDiseases.length > 0"
        class="space-y-2 max-h-60 overflow-y-auto"
      >
        <button
          v-for="disease in filteredDiseases"
          :key="disease.id"
          @click="handleAdd(disease)"
          :disabled="isDiseaseSelected(disease.id)"
          :class="[
            'w-full flex items-center justify-between p-3 rounded-lg text-left transition-all',
            isDiseaseSelected(disease.id)
              ? 'bg-green-50 border-2 border-green-200'
              : 'bg-gray-50 hover:bg-teal-50 hover:border-teal-200 border-2 border-transparent',
          ]"
        >
          <div>
            <p class="font-medium text-gray-900">{{ disease.name }}</p>
            <p class="text-xs text-gray-500">
              {{ disease.code }} -
              {{
                DISEASE_CATEGORIES.find((c) => c.id === disease.category)?.label
              }}
            </p>
          </div>
          <Check
            v-if="isDiseaseSelected(disease.id)"
            class="w-5 h-5 text-green-500"
          />
        </button>
      </div>

      <!-- Categorias -->
      <div v-else class="space-y-2">
        <p class="text-sm text-gray-500 mb-3">Ou selecione por categoria:</p>

        <div
          v-for="category in DISEASE_CATEGORIES"
          :key="category.id"
          class="border border-gray-200 rounded-lg overflow-hidden"
        >
          <button
            @click="toggleCategory(category.id)"
            class="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div class="flex items-center gap-2">
              <Brain
                v-if="category.id === 'mental'"
                class="w-5 h-5 text-teal-500"
              />
              <Heart v-else class="w-5 h-5 text-red-500" />
              <span class="font-medium text-gray-900">{{ category.label }}</span>
              <span class="text-xs text-gray-500"
                >({{ getDiseasesByCategory(category.id).length }})</span
              >
            </div>
            <ChevronDown
              :class="[
                'w-5 h-5 text-gray-400 transition-transform',
                expandedCategories.includes(category.id) ? 'rotate-180' : '',
              ]"
            />
          </button>

          <div
            v-if="expandedCategories.includes(category.id)"
            class="p-2 space-y-1 max-h-48 overflow-y-auto"
          >
            <button
              v-for="disease in getDiseasesByCategory(category.id)"
              :key="disease.id"
              @click="handleAdd(disease)"
              :disabled="isDiseaseSelected(disease.id)"
              :class="[
                'w-full flex items-center justify-between p-2 rounded-lg text-left text-sm transition-all',
                isDiseaseSelected(disease.id)
                  ? 'bg-green-50 text-green-700'
                  : 'hover:bg-teal-50',
              ]"
            >
              <span>{{ disease.name }}</span>
              <Check
                v-if="isDiseaseSelected(disease.id)"
                class="w-4 h-4 text-green-500"
              />
            </button>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <BaseButton variant="secondary" @click="closeModal"> Fechar </BaseButton>
    </template>
  </BaseModal>
</template>
