<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'

export interface BarItem {
  name: string
  value: number
  color: string
}

export default defineComponent({
  name: 'BarChart',

  props: {
    bars: {
      type: Array as PropType<BarItem[]>,
      required: true,
    },
    maxHeight: {
      type: Number,
      default: 220,
    },
    unit: {
      type: String,
      default: 'B',
    },
  },

  setup(props) {
    const maxValue = computed(() =>
      Math.max(...props.bars.map((bar) => bar.value))
    )

    function barHeight(value: number): number {
      if (maxValue.value <= 0) return 0
      return (value / maxValue.value) * props.maxHeight
    }

    function formatValue(value: number): string {
      const formatted = value.toLocaleString('pt-PT')
      return props.unit ? `${formatted} ${props.unit}` : formatted
    }

    return { barHeight, formatValue }
  },
})
</script>


<template>
  <div class="bar-chart-wrapper">
    <div class="bars-container" :style="{ minHeight: `${maxHeight}px` }">
      <div
        v-for="bar in bars"
        :key="bar.name"
        class="bar-group"
      >
        <span class="bar-value" :style="{ color: bar.color }">
          {{ formatValue(bar.value) }}
        </span>
        <div
          class="bar"
          :style="{
            height: barHeight(bar.value) + 'px',
            backgroundColor: bar.color,
          }"
        />
      </div>
    </div>

    <div class="legend">
      <div
        v-for="bar in bars"
        :key="bar.name"
        class="legend-item"
      >
        <span class="legend-dot" :style="{ backgroundColor: bar.color }" />
        <span class="legend-label">{{ bar.name }}</span>
      </div>
    </div>
  </div>
</template>



<style scoped>
.bar-chart-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  border-radius: 16px;
  padding: 32px 40px 24px;
  font-family: var(--font-primary);
  min-width: 260px;
  width: 100%;
  box-sizing: border-box;
}


.bars-container {
  display: flex;
  align-items: flex-end;
  gap: 20px;
}

.bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s ease;
}

.bar-value {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  white-space: nowrap;
}

.bar {
  width: 80px;
  min-height: 1px;
  border-radius: 4px 4px 0 0;
  transition: height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
    transform 0.2s ease, filter 0.2s ease;
}

.bar-group:hover {
  transform: translateY(-2px);
}

.bar-group:hover .bar {
  transform: scale(1.04);
  filter: brightness(1.08);
}


.legend {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-dot {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  flex-shrink: 0;
}

.legend-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-gray-dark);
  white-space: nowrap;
}
</style>