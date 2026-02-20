<script setup>
import { computed, useSlots } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Selecione uma opção'
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
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  rounded: {
    type: String,
    default: 'lg',
    validator: (value) => ['none', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  optionLabel: {
    type: String,
    default: 'label'
  },
  optionValue: {
    type: String,
    default: 'value'
  },
  id: {
    type: String,
    default: () => `select-${Math.random().toString(36).substr(2, 9)}`
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const slots = useSlots()
const hasLeftIcon = computed(() => !!slots['icon-left'])

const selectClasses = computed(() => {
  const base = 'w-full border bg-white text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 appearance-none cursor-pointer'

  const sizes = {
    sm: 'text-sm py-1.5 pr-9',
    md: 'text-base py-2.5 pr-10',
    lg: 'text-lg py-3 pr-12'
  }

  const paddingLeft = {
    sm: hasLeftIcon.value ? 'pl-9' : 'pl-3',
    md: hasLeftIcon.value ? 'pl-10' : 'pl-4',
    lg: hasLeftIcon.value ? 'pl-12' : 'pl-5'
  }

  const roundedOptions = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  }

  const stateClasses = props.error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
    : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500/20'

  const disabledClasses = props.disabled
    ? 'bg-gray-100 cursor-not-allowed opacity-60'
    : ''

  return [
    base,
    sizes[props.size],
    paddingLeft[props.size],
    roundedOptions[props.rounded],
    stateClasses,
    disabledClasses
  ].join(' ')
})

const iconSizeClasses = computed(() => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }
  return sizes[props.size]
})

const chevronPositionClasses = computed(() => {
  const positions = {
    sm: 'right-2.5',
    md: 'right-3',
    lg: 'right-4'
  }
  return positions[props.size]
})

const getOptionLabel = (option) => {
  if (typeof option === 'string' || typeof option === 'number') {
    return option
  }
  return option[props.optionLabel]
}

const getOptionValue = (option) => {
  if (typeof option === 'string' || typeof option === 'number') {
    return option
  }
  return option[props.optionValue]
}

const handleChange = (event) => {
  emit('update:modelValue', event.target.value)
  emit('change', event.target.value)
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

    <!-- Select wrapper -->
    <div class="relative">
      <!-- Left icon -->
      <span
        v-if="hasLeftIcon"
        :class="[
          'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none',
          iconSizeClasses
        ]"
      >
        <slot name="icon-left" />
      </span>

      <!-- Select -->
      <select
        :id="id"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :class="selectClasses"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${id}-error` : helperText ? `${id}-helper` : undefined"
        @change="handleChange"
      >
        <option value="" disabled>{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="getOptionValue(option)"
          :value="getOptionValue(option)"
        >
          {{ getOptionLabel(option) }}
        </option>
      </select>

      <!-- Chevron icon -->
      <ChevronDown
        :class="[
          'absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none',
          chevronPositionClasses,
          iconSizeClasses
        ]"
      />
    </div>

    <!-- Helper text -->
    <p
      v-if="helperText && !error"
      :id="`${id}-helper`"
      class="mt-1.5 text-sm text-gray-500"
    >
      {{ helperText }}
    </p>

    <!-- Error message -->
    <p
      v-if="error"
      :id="`${id}-error`"
      class="mt-1.5 text-sm text-red-600 flex items-center gap-1"
      role="alert"
    >
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      {{ error }}
    </p>
  </div>
</template>
