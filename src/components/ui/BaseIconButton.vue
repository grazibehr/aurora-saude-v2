<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'ghost',
    validator: (value) => ['primary', 'secondary', 'danger', 'ghost', 'outline'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  rounded: {
    type: String,
    default: 'lg',
    validator: (value) => ['sm', 'md', 'lg', 'full'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    required: true
  }
})

defineEmits(['click'])

const buttonClasses = computed(() => {
  const base = 'inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800 focus:ring-teal-500',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 focus:ring-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500',
    ghost: 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700 active:bg-gray-200 focus:ring-gray-400',
    outline: 'bg-transparent border-2 border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 focus:ring-gray-400'
  }

  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14'
  }

  const roundedOptions = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  }

  return [
    base,
    variants[props.variant],
    sizes[props.size],
    roundedOptions[props.rounded],
    props.loading ? 'cursor-wait' : ''
  ].filter(Boolean).join(' ')
})

const iconSizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-7 h-7'
}
</script>

<template>
  <button
    type="button"
    :class="buttonClasses"
    :disabled="disabled || loading"
    :aria-label="label"
    @click="$emit('click', $event)"
  >
    <!-- Loading spinner -->
    <svg
      v-if="loading"
      :class="['animate-spin', iconSizes[size]]"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>

    <!-- Icon slot -->
    <span v-else :class="iconSizes[size]">
      <slot />
    </span>
  </button>
</template>
