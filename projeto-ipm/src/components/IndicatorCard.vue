<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    index: number | string
    title: string
    metrics: Array<{ label: string; value: string }>
    icons?: Array<{ src: string; alt?: string }>
    actionIconSrc?: string
    actionLabel?: string
    variant?: 'default' | 'simple'
  }>(),
  {
    icons: () => [],
    variant: 'default'
  }
)

const emit = defineEmits<{
  (e: 'action'): void
  (e: 'click'): void
}>()

const onActionClick = () => {
  emit('action')
}

const onCardClick = () => {
  emit('click')
}

const onCardKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('click')
  }
}

</script>

<template>
  <article
    class="indicator-card indicator-card--interactive"
    :class="{ 'indicator-card--simple': props.variant === 'simple' }"
    role="button"
    tabindex="0"
    @click="onCardClick"
    @keydown="onCardKeydown"
  >
    <div class="indicator-card__body">
      <div class="indicator-card__header">
        <span class="indicator-card__summary-icon" aria-hidden="true">!</span>
        <span class="indicator-card__index">({{ props.index }})</span>
        <h3 class="indicator-card__title">{{ props.title }}</h3>
      </div>

      <div v-if="props.variant !== 'simple'" class="indicator-card__metrics">
        <div
          v-for="(metric, metricIndex) in props.metrics"
          :key="metricIndex"
          class="indicator-card__metric"
        >
          <span class="indicator-card__label">{{ metric.label }}</span>
          <span class="indicator-card__value">{{ metric.value }}</span>
        </div>
      </div>
    </div>

    <div
      v-if="props.variant !== 'simple' && (props.icons.length || props.actionIconSrc)"
      class="indicator-card__side"
    >
      <div v-if="props.icons.length" class="indicator-card__icons">
        <span
          v-for="(icon, iconIndex) in props.icons"
          :key="iconIndex"
          class="indicator-card__icon-chip"
        >
          <img
            :src="icon.src"
            :alt="icon.alt || ''"
            :aria-hidden="icon.alt ? 'false' : 'true'"
          />
        </span>
      </div>

      <button
        v-if="props.actionIconSrc"
        type="button"
        class="indicator-card__action"
        :aria-label="props.actionLabel || 'Ver detalhes'"
        @click.stop="onActionClick"
      >
        <img :src="props.actionIconSrc" alt="" aria-hidden="true" />
      </button>
    </div>
  </article>
</template>

<style scoped>
.indicator-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
  padding: 16px 18px;
  border-radius: 12px;
  border: none;
  background: var(--bg-white);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  color: var(--text-black);
  min-height: 110px;
  transition: transform 160ms ease, box-shadow 160ms ease;
}

.indicator-card--interactive {
  cursor: pointer;
}

.indicator-card--interactive:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.indicator-card--interactive:focus-visible {
  outline: 2px solid var(--bg-blue);
  outline-offset: 3px;
}

.indicator-card--simple {
  grid-template-columns: 1fr;
  background: var(--bg-white);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  color: var(--text-black);
  min-height: 100px;
  padding: 16px 22px;
  border-radius: 12px;
}

.indicator-card--simple .indicator-card__body {
  justify-content: center;
  gap: 6px;
}

.indicator-card--simple .indicator-card__index {
  color: var(--text-black);
}

.indicator-card--simple .indicator-card__title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-black);
}

.indicator-card__body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
}

.indicator-card__header {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.indicator-card__summary-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 20px;
  height: 20px;
  margin-top: 1px;
  border-radius: 2px;
  background: #000000;
  color: #ffffff;
  font-size: 15px;
  font-weight: 800;
  line-height: 1;
}

.indicator-card__index {
  font-family: var(--font-primary);
  font-size: 12px;
  font-weight: 700;
  color: var(--text-black);
  white-space: nowrap;
}

.indicator-card__title {
  margin: 0;
  font-family: var(--font-primary);
  font-size: 18px;
  font-weight: 600;
  line-height: 1.2;
  color: var(--text-black);
}

.indicator-card__metrics {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: auto;
}

.indicator-card__metric {
  display: flex;
  align-items: baseline;
  justify-content: flex-start;
  gap: 8px;
}

.indicator-card__label {
  font-family: var(--font-primary);
  font-size: 12px;
  font-weight: 500;
  color: var(--text-gray);
}

.indicator-card__value {
  font-family: var(--font-primary);
  font-size: 16px;
  font-weight: 700;
  color: var(--text-black);
  white-space: nowrap;
}

.indicator-card__side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
}

.indicator-card__icons {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.indicator-card__icon-chip {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: var(--bg-gray);
  border: 1px solid var(--text-gray-light);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.indicator-card__icon-chip img {
  width: 14px;
  height: 14px;
}

.indicator-card__action {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 1px solid var(--text-gray-light);
  background: var(--bg-blue);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.indicator-card__action img {
  width: 14px;
  height: 14px;
}

.indicator-card__action:focus-visible {
  outline: 2px solid var(--bg-blue);
  outline-offset: 2px;
}

@media (max-width: 640px) {
  .indicator-card {
    grid-template-columns: 1fr;
  }

  .indicator-card__side {
    flex-direction: row;
    justify-content: flex-start;
  }

  .indicator-card__icons {
    flex-direction: row;
  }
}
</style>
