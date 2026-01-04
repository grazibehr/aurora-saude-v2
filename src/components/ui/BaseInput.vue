<script setup>
import { computed, useSlots } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
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
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  rounded: {
    type: String,
    default: 'lg',
    validator: (value) => ['none', 'sm', 'md', 'lg', 'xl', 'full'].includes(value)
  },
  id: {
    type: String,
    default: () => `input-${Math.random().toString(36).substr(2, 9)}`
  }
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur'])

const slots = useSlots()

const hasLeftIcon = computed(() => !!slots['icon-left'])
const hasRightIcon = computed(() => !!slots['icon-right'])

const inputClasses = computed(() => {
  const base = 'w-full border bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2'

  const sizes = {
    sm: 'text-sm py-1.5',
    md: 'text-base py-2.5',
    lg: 'text-lg py-3'
  }

  const paddingLeft = {
    sm: hasLeftIcon.value ? 'pl-9' : 'pl-3',
    md: hasLeftIcon.value ? 'pl-10' : 'pl-4',
    lg: hasLeftIcon.value ? 'pl-12' : 'pl-5'
  }

  const paddingRight = {
    sm: hasRightIcon.value ? 'pr-9' : 'pr-3',
    md: hasRightIcon.value ? 'pr-10' : 'pr-4',
    lg: hasRightIcon.value ? 'pr-12' : 'pr-5'
  }

  const roundedOptions = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
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
    paddingRight[props.size],
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

const iconPositionClasses = computed(() => {
  const positions = {
    sm: 'top-1/2 -translate-y-1/2',
    md: 'top-1/2 -translate-y-1/2',
    lg: 'top-1/2 -translate-y-1/2'
  }
  return positions[props.size]
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

    <!-- Input wrapper -->
    <div class="relative">
      <!-- Left icon -->
      <span
        v-if="hasLeftIcon"
        :class="[
          'absolute left-3 text-gray-400 pointer-events-none',
          iconPositionClasses,
          iconSizeClasses
        ]"
      >
        <slot name="icon-left" />
      </span>

      <!-- Input -->
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :readonly="readonly"
        :class="inputClasses"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${id}-error` : helperText ? `${id}-helper` : undefined"
        @input="handleInput"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      />

      <!-- Right icon -->
      <span
        v-if="hasRightIcon"
        :class="[
          'absolute right-3 text-gray-400',
          iconPositionClasses,
          iconSizeClasses
        ]"
      >
        <slot name="icon-right" />
      </span>
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
