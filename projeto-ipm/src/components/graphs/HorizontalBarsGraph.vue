<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'

export interface HorizontalBarItem {
  title: string
  value: number
  color: string
}

export default defineComponent({
  name: 'HorizontalBarChart',

  props: {
    bars: {
      type: Array as PropType<HorizontalBarItem[]>,
      required: true,
    },
    unit: {
      type: String,
      default: '',
    },
    maxWidth: {
      type: Number,
      default: 100,
    },
  },

  setup(props) {
    const maxValue = computed(() =>
      Math.max(...props.bars.map((b) => b.value))
    )

    const barHeight = computed(() => Math.max(24, Math.round(props.maxWidth * 0.09)))
    const barFontSize = computed(() => Math.max(12, Math.round(props.maxWidth * 0.08)))
    const titleSize = computed(() => Math.max(10, Math.round(props.maxWidth * 0.06)))

    function barWidth(value: number): number {
      if (maxValue.value <= 0) return 0
      return (value / maxValue.value) * props.maxWidth
    }

    function formatValue(value: number): string {
      const formatted = value.toLocaleString('pt-PT')
      return props.unit ? `${formatted} ${props.unit}` : formatted
    }

    return { barWidth, barHeight, barFontSize, titleSize, formatValue }
  },
})
</script>


<template>
    <div class="chart-wrapper">
        <div class="chart-rows">
        <div
            v-for="bar in bars"
            :key="bar.title"
            class="chart-row"
        >
            <div class="bar-label" :style="{ color: bar.color, fontSize: titleSize + 'px' }">
            {{ bar.title }}
            </div>
            <div class="bar-track">
            <div
                class="bar-fill"
                :style="{
                width: barWidth(bar.value) + 'px',
                height: barHeight + 'px',
                backgroundColor: bar.color,
                }"
            >
              <span class="bar-value" :style="{ fontSize: barFontSize + 'px' }">{{ formatValue(bar.value) }}</span>
            </div>
            </div>
        </div>
        </div>
    </div>
</template>



<style scoped>
.chart-wrapper {
  display: inline-flex;
  flex-direction: column;
  border-radius: 16px;
  padding: 28px 32px;
  font-family: var(--font-primary);
  min-width: 420px;
  width: 100%;
  box-sizing: border-box;
}

.chart-rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chart-row {
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s ease;
}

.bar-label {
  width: 140px;
  flex-shrink: 0;
  padding-left: 8px;
  font-weight: 700;
  line-height: 1.3;
  text-align: left;
}

.bar-track {
  flex: 1;
  display: flex;
  align-items: flex-end;
}

.bar-fill {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
  border-radius: 4px;
  transition: width 0.7s cubic-bezier(0.34, 1.2, 0.64, 1),
    height 0.7s cubic-bezier(0.34, 1.2, 0.64, 1),
    transform 0.2s ease, filter 0.2s ease;
  box-sizing: border-box;
  min-width: 0;
}

.chart-row:hover {
  transform: translateX(2px);
}

.chart-row:hover .bar-fill {
  transform: scale(1.02);
  filter: brightness(1.08);
}

.bar-value {
  color: var(--text-white);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  white-space: nowrap;
}
</style>