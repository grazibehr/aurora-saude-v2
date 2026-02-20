<script setup>
import { computed } from 'vue'

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl', '2xl'].includes(value)
  },
  rounded: {
    type: String,
    default: 'full',
    validator: (value) => ['md', 'lg', 'xl', 'full'].includes(value)
  },
  color: {
    type: String,
    default: 'teal',
    validator: (value) => ['teal', 'blue', 'green', 'red', 'yellow', 'gray'].includes(value)
  },
  status: {
    type: String,
    default: null,
    validator: (value) => ['online', 'offline', 'busy', 'away'].includes(value)
  }
})

const initials = computed(() => {
  if (!props.name) return '?'

  const names = props.name.trim().split(' ')
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase()
  }
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
})

const sizeClasses = computed(() => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl'
  }
  return sizes[props.size]
})

const roundedClasses = computed(() => {
  const options = {
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  }
  return options[props.rounded]
})

const colorClasses = computed(() => {
  const colors = {
    teal: 'bg-teal-100 text-teal-700',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    gray: 'bg-gray-100 text-gray-700'
  }
  return colors[props.color]
})

const statusClasses = computed(() => {
  const statuses = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    busy: 'bg-red-500',
    away: 'bg-yellow-500'
  }
  return statuses[props.status]
})

const statusSizes = computed(() => {
  const sizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5'
  }
  return sizes[props.size]
})
</script>

<template>
  <div class="relative inline-flex shrink-0">
    <!-- Image avatar -->
    <img
      v-if="src"
      :src="src"
      :alt="alt || name"
      :class="[
        'object-cover',
        sizeClasses,
        roundedClasses
      ]"
    />

    <!-- Initials avatar -->
    <div
      v-else
      :class="[
        'flex items-center justify-center font-semibold',
        sizeClasses,
        roundedClasses,
        colorClasses
      ]"
      :aria-label="name"
    >
      {{ initials }}
    </div>

    <!-- Status indicator -->
    <span
      v-if="status"
      :class="[
        'absolute bottom-0 right-0 rounded-full ring-2 ring-white',
        statusClasses,
        statusSizes
      ]"
      :aria-label="`Status: ${status}`"
    />
  </div>
</template>
