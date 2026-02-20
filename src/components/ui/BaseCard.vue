<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'elevated', 'outlined', 'flat', 'gradient'].includes(value)
  },
  padding: {
    type: String,
    default: 'md',
    validator: (value) => ['none', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  rounded: {
    type: String,
    default: 'xl',
    validator: (value) => ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'].includes(value)
  },
  hoverable: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  },
  gradientFrom: {
    type: String,
    default: 'teal-500'
  },
  gradientTo: {
    type: String,
    default: 'cyan-500'
  }
})

defineEmits(['click'])

const cardClasses = computed(() => {
  const base = 'transition-all duration-300 ease-out backdrop-blur-sm'

  const variants = {
    default: 'bg-white/90 border border-gray-100/80 shadow-sm shadow-gray-200/50',
    elevated: 'bg-white shadow-xl shadow-gray-200/40',
    outlined: 'bg-white/80 border-2 border-gray-200',
    flat: 'bg-gray-50/80',
    gradient: `bg-gradient-to-br from-${props.gradientFrom} to-${props.gradientTo} text-white border-0 shadow-lg`
  }

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
    xl: 'p-8'
  }

  const roundedOptions = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl'
  }

  const hoverClasses = props.hoverable
    ? 'hover:shadow-lg hover:shadow-gray-200/60 hover:-translate-y-1 hover:border-gray-200/60'
    : ''

  const clickableClasses = props.clickable
    ? 'cursor-pointer active:scale-[0.98] active:shadow-md'
    : ''

  return [
    base,
    variants[props.variant],
    paddings[props.padding],
    roundedOptions[props.rounded],
    hoverClasses,
    clickableClasses
  ].filter(Boolean).join(' ')
})
</script>

<template>
  <div
    :class="cardClasses"
    @click="clickable && $emit('click', $event)"
    v-bind="clickable ? { role: 'button', tabindex: 0 } : {}"
  >
    <!-- Header slot -->
    <div v-if="$slots.header" class="mb-4">
      <slot name="header" />
    </div>

    <!-- Default slot -->
    <slot />

    <!-- Footer slot -->
    <div v-if="$slots.footer" class="mt-4 pt-4 border-t border-gray-100">
      <slot name="footer" />
    </div>
  </div>
</template>
