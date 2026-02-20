<script setup>
import { computed } from 'vue'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-vue-next'

const props = defineProps({
  variant: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'success', 'warning', 'error'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  dismissible: {
    type: Boolean,
    default: false
  },
  icon: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['dismiss'])

const icons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle
}

const alertClasses = computed(() => {
  const base = 'relative p-4 rounded-xl border'

  const variants = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  }

  return [base, variants[props.variant]].join(' ')
})

const iconClasses = computed(() => {
  const colors = {
    info: 'text-blue-500',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    error: 'text-red-500'
  }

  return ['w-5 h-5 shrink-0', colors[props.variant]].join(' ')
})

const titleClasses = computed(() => {
  const colors = {
    info: 'text-blue-900',
    success: 'text-green-900',
    warning: 'text-yellow-900',
    error: 'text-red-900'
  }

  return ['font-semibold', colors[props.variant]].join(' ')
})

const dismissClasses = computed(() => {
  const colors = {
    info: 'text-blue-500 hover:bg-blue-100',
    success: 'text-green-500 hover:bg-green-100',
    warning: 'text-yellow-600 hover:bg-yellow-100',
    error: 'text-red-500 hover:bg-red-100'
  }

  return [
    'absolute top-3 right-3 p-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2',
    colors[props.variant]
  ].join(' ')
})

const currentIcon = computed(() => icons[props.variant])
</script>

<template>
  <div :class="alertClasses" role="alert">
    <div class="flex gap-3">
      <!-- Icon -->
      <component
        v-if="icon"
        :is="currentIcon"
        :class="iconClasses"
        aria-hidden="true"
      />

      <!-- Content -->
      <div class="flex-1 min-w-0" :class="{ 'pr-8': dismissible }">
        <h4 v-if="title" :class="titleClasses">
          {{ title }}
        </h4>
        <div :class="{ 'mt-1': title }">
          <slot />
        </div>
      </div>
    </div>

    <!-- Dismiss button -->
    <button
      v-if="dismissible"
      type="button"
      :class="dismissClasses"
      @click="$emit('dismiss')"
      aria-label="Fechar alerta"
    >
      <X class="w-4 h-4" />
    </button>
  </div>
</template>
