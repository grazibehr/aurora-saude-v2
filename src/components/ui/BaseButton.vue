<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'ghost', 'outline', 'link'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  rounded: {
    type: String,
    default: 'lg',
    validator: (value) => ['none', 'sm', 'md', 'lg', 'xl', 'full'].includes(value)
  },
  iconOnly: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])

const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-[0.97] relative overflow-hidden'

const variantClasses = computed(() => {
  const variants = {
    primary: 'bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 focus:ring-teal-500 shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 hover:-translate-y-0.5',
    secondary: 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:from-gray-100 hover:to-gray-200 focus:ring-gray-400 shadow-sm hover:shadow-md hover:-translate-y-0.5',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 hover:-translate-y-0.5',
    ghost: 'bg-transparent text-gray-600 hover:bg-teal-50 hover:text-teal-700 focus:ring-teal-400',
    outline: 'bg-transparent border-2 border-teal-500 text-teal-600 hover:bg-teal-50 hover:border-teal-600 focus:ring-teal-500',
    link: 'bg-transparent text-teal-600 hover:text-teal-700 focus:ring-teal-500 p-0 underline-offset-4 hover:underline'
  }
  return variants[props.variant]
})

const sizeClasses = computed(() => {
  if (props.iconOnly) {
    const iconSizes = {
      xs: 'w-7 h-7',
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
      xl: 'w-14 h-14'
    }
    return iconSizes[props.size]
  }

  const sizes = {
    xs: 'text-xs px-2.5 py-1.5 gap-1',
    sm: 'text-sm px-3 py-2 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-5 py-3 gap-2',
    xl: 'text-lg px-6 py-3.5 gap-2.5'
  }
  return sizes[props.size]
})

const roundedClasses = computed(() => {
  const roundedOptions = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  }
  return roundedOptions[props.rounded]
})

const buttonClasses = computed(() => {
  return [
    baseClasses,
    variantClasses.value,
    sizeClasses.value,
    roundedClasses.value,
    props.fullWidth ? 'w-full' : '',
    props.loading ? 'cursor-wait' : ''
  ].filter(Boolean).join(' ')
})
</script>

<template>
  <button
    :type="type"
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <!-- Loading spinner -->
    <svg
      v-if="loading"
      class="animate-spin -ml-1 h-4 w-4"
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

    <!-- Left icon slot -->
    <slot name="icon-left" />

    <!-- Default slot for text -->
    <span v-if="$slots.default && !iconOnly" :class="{ 'sr-only': loading }">
      <slot />
    </span>

    <!-- Icon only slot -->
    <slot v-if="iconOnly" name="icon" />

    <!-- Right icon slot -->
    <slot name="icon-right" />
  </button>
</template>
