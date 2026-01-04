<script setup>
import { ref, watch } from "vue";
import { Droplet } from "lucide-vue-next";
import { BaseButton, BaseCard } from "../ui";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "save"]);

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const selectedType = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newVal) => {
    selectedType.value = newVal;
  }
);

const selectType = (type) => {
  selectedType.value = type;
  emit("update:modelValue", type);
};

const handleSave = () => {
  emit("save", selectedType.value);
};
</script>

<template>
  <BaseCard>
    <template #header>
      <div class="flex items-center gap-2">
        <Droplet class="w-5 h-5 text-red-500" />
        <h2 class="text-lg font-semibold text-gray-900">Tipo Sanguíneo</h2>
      </div>
    </template>

    <div class="flex flex-wrap gap-2 mb-4">
      <button
        v-for="type in bloodTypes"
        :key="type"
        @click="selectType(type)"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-all',
          selectedType === type
            ? 'bg-red-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
        ]"
      >
        {{ type }}
      </button>
    </div>

    <BaseButton
      variant="secondary"
      size="sm"
      @click="handleSave"
      :disabled="selectedType === modelValue"
    >
      Salvar
    </BaseButton>
  </BaseCard>
</template>
