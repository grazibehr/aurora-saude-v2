<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'success', 'warning', 'danger', 'info'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg'].includes(value)
  },
  rounded: {
    type: String,
    default: 'full',
    validator: (value) => ['sm', 'md', 'lg', 'full'].includes(value)
  },
  dot: {
    type: Boolean,
    default: false
  },
  removable: {
    type: Boolean,
    default: false
  },
  outline: {
    type: Boolean,
    default: false
  }
})

defineEmits(['remove'])

const badgeClasses = computed(() => {
  const base = 'inline-flex items-center font-medium transition-all'

  const solidVariants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-teal-100 text-teal-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700'
  }

  const outlineVariants = {
    default: 'bg-transparent border border-gray-300 text-gray-700',
    primary: 'bg-transparent border border-teal-300 text-teal-700',
    success: 'bg-transparent border border-green-300 text-green-700',
    warning: 'bg-transparent border border-yellow-400 text-yellow-700',
    danger: 'bg-transparent border border-red-300 text-red-700',
    info: 'bg-transparent border border-blue-300 text-blue-700'
  }

  const sizes = {
    xs: 'text-xs px-1.5 py-0.5 gap-1',
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2'
  }

  const roundedOptions = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  }

  const variants = props.outline ? outlineVariants : solidVariants

  return [
    base,
    variants[props.variant],
    sizes[props.size],
    roundedOptions[props.rounded]
  ].join(' ')
})

const dotClasses = computed(() => {
  const colors = {
    default: 'bg-gray-500',
    primary: 'bg-teal-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500'
  }

  const sizes = {
    xs: 'w-1 h-1',
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5'
  }

  return [
    'rounded-full',
    colors[props.variant],
    sizes[props.size]
  ].join(' ')
})

const removeButtonClasses = computed(() => {
  const colors = {
    default: 'hover:bg-gray-200 text-gray-500',
    primary: 'hover:bg-teal-200 text-teal-500',
    success: 'hover:bg-green-200 text-green-500',
    warning: 'hover:bg-yellow-200 text-yellow-600',
    danger: 'hover:bg-red-200 text-red-500',
    info: 'hover:bg-blue-200 text-blue-500'
  }

  return [
    'ml-1 -mr-0.5 p-0.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1',
    colors[props.variant]
  ].join(' ')
})
</script>

<template>
  <span :class="badgeClasses">
    <!-- Dot indicator -->
    <span v-if="dot" :class="dotClasses" aria-hidden="true" />

    <!-- Left icon slot -->
    <slot name="icon-left" />

    <!-- Content -->
    <slot />

    <!-- Right icon slot -->
    <slot name="icon-right" />

    <!-- Remove button -->
    <button
      v-if="removable"
      type="button"
      :class="removeButtonClasses"
      @click="$emit('remove')"
      aria-label="Remover"
    >
      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </button>
  </span>
</template>
