<script setup>
defineProps({
  insights: {
    type: Array,
    required: true,
  },
});

const getInsightStyles = (type) => {
  const styles = {
    info: "bg-blue-50 border-blue-200",
    warning: "bg-amber-50 border-amber-200",
    success: "bg-green-50 border-green-200",
  };
  return styles[type] || styles.info;
};

const getInsightIconStyles = (type) => {
  const styles = {
    info: "bg-blue-100 text-blue-600",
    warning: "bg-amber-100 text-amber-600",
    success: "bg-green-100 text-green-600",
  };
  return styles[type] || styles.info;
};
</script>

<template>
  <section v-if="insights.length > 0" aria-labelledby="insights-title">
    <h2 id="insights-title" class="text-lg font-semibold text-gray-900 mb-4">
      Observações Importantes
    </h2>

    <div class="grid gap-4">
      <article
        v-for="(insight, index) in insights"
        :key="index"
        :class="['p-4 rounded-xl border-2', getInsightStyles(insight.type)]"
      >
        <div class="flex items-start gap-4">
          <div
            :class="[
              'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
              getInsightIconStyles(insight.type),
            ]"
          >
            <component :is="insight.icon" class="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">{{ insight.title }}</h3>
            <p class="text-gray-600 mt-1">{{ insight.description }}</p>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
