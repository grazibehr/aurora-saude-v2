<script setup>
import { ref, watch } from "vue";
import { FileText } from "lucide-vue-next";
import { BaseButton, BaseCard } from "../ui";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "save"]);

const notes = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newVal) => {
    notes.value = newVal;
  }
);

const handleInput = (e) => {
  notes.value = e.target.value;
  emit("update:modelValue", notes.value);
};

const handleSave = () => {
  emit("save", notes.value);
};
</script>

<template>
  <BaseCard>
    <template #header>
      <div class="flex items-center gap-2">
        <FileText class="w-5 h-5 text-gray-500" />
        <h2 class="text-lg font-semibold text-gray-900">Observações Médicas</h2>
      </div>
    </template>

    <textarea
      :value="notes"
      @input="handleInput"
      rows="4"
      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
      placeholder="Informações adicionais sobre sua saúde, histórico familiar, etc."
    ></textarea>

    <BaseButton variant="secondary" size="sm" class="mt-3" @click="handleSave">
      Salvar observações
    </BaseButton>
  </BaseCard>
</template>
