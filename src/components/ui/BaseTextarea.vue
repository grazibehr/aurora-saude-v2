<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  helperText: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  rows: {
    type: Number,
    default: 4
  },
  maxlength: {
    type: Number,
    default: null
  },
  resize: {
    type: String,
    default: 'vertical',
    validator: (value) => ['none', 'vertical', 'horizontal', 'both'].includes(value)
  },
  showCount: {
    type: Boolean,
    default: false
  },
  rounded: {
    type: String,
    default: 'lg',
    validator: (value) => ['none', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  id: {
    type: String,
    default: () => `textarea-${Math.random().toString(36).substr(2, 9)}`
  }
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur'])

const textareaClasses = computed(() => {
  const base = 'w-full px-4 py-3 border bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2'

  const roundedOptions = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  }

  const resizeOptions = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize'
  }

  const stateClasses = props.error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
    : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500/20'

  const disabledClasses = props.disabled
    ? 'bg-gray-100 cursor-not-allowed opacity-60'
    : ''

  return [
    base,
    roundedOptions[props.rounded],
    resizeOptions[props.resize],
    stateClasses,
    disabledClasses
  ].join(' ')
})

const characterCount = computed(() => props.modelValue?.length || 0)

const isNearLimit = computed(() => {
  if (!props.maxlength) return false
  return characterCount.value >= props.maxlength * 0.9
})

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <div class="w-full">
    <!-- Label -->
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-700 mb-1.5"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>

    <!-- Textarea -->
    <textarea
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :readonly="readonly"
      :rows="rows"
      :maxlength="maxlength"
      :class="textareaClasses"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${id}-error` : helperText ? `${id}-helper` : undefined"
      @input="handleInput"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    />

    <!-- Footer -->
    <div class="flex items-center justify-between mt-1.5">
      <!-- Helper text or Error -->
      <div class="flex-1">
        <p
          v-if="helperText && !error"
          :id="`${id}-helper`"
          class="text-sm text-gray-500"
        >
          {{ helperText }}
        </p>

        <p
          v-if="error"
          :id="`${id}-error`"
          class="text-sm text-red-600 flex items-center gap-1"
          role="alert"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          {{ error }}
        </p>
      </div>

      <!-- Character count -->
      <span
        v-if="showCount && maxlength"
        :class="[
          'text-sm',
          isNearLimit ? 'text-orange-500 font-medium' : 'text-gray-400'
        ]"
      >
        {{ characterCount }}/{{ maxlength }}
      </span>
    </div>
  </div>
</template>
