<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
} from 'vue'
import type { PropType } from 'vue'
import {
  Chart,
  PieController,
  ArcElement,
  Legend,
} from 'chart.js'

Chart.register(PieController, ArcElement, Legend)

export interface PieSlice {
  label: string
  percentage: number
  color: string
}

export default defineComponent({
  name: 'PieChart',

  props: {
    slices: {
      type: Array as PropType<PieSlice[]>,
      required: true,
    },

    size: {
      type: Number,
      default: 200,
    },
    rotation: {
      type: Number,
      default: 0,
    },
  },

  setup(props) {
    const canvasRef = ref<HTMLCanvasElement | null>(null)
    let chart: Chart<'pie'> | null = null

    const cssVarColor = (name: string): string =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim()
    
    const canvasContainerStyle = computed(() => ({
      transform: `rotate(${props.rotation}deg)`,
      width: `${props.size}px`,
      height: `${props.size}px`,
      display: 'inline-block',
    }))
    function buildChart() {
      if (!canvasRef.value) return
      if (chart) chart.destroy()

      chart = new Chart(canvasRef.value, {
        type: 'pie',
        data: {
          labels: props.slices.map((s) => `${s.label} (${s.percentage}%)`),
          datasets: [
            {
              data: props.slices.map((s) => s.percentage),
              backgroundColor: props.slices.map((s) => s.color),
              borderWidth: 3,
              borderColor: cssVarColor('--text-white'),
              hoverOffset: 6,
            },
          ],
        },
        options: {
          responsive: false,
          animation: { animateRotate: true, duration: 800 },
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
          },
        },
      })
    }

    onMounted(() => {
      if (canvasRef.value) {
        canvasRef.value.width = props.size
        canvasRef.value.height = props.size
      }
      buildChart()
    })

    watch(() => [props.slices, props.rotation], buildChart, { deep: true })

    onBeforeUnmount(() => chart?.destroy())

    return { canvasRef, canvasContainerStyle }
  },
})
</script>

<template>
  <div class="pie-chart-wrapper">
    <div class="canvas-wrap" :style="canvasContainerStyle">
      <canvas ref="canvasRef" />
    </div>

    <div class="legend">
      <div
        v-for="slice in slices"
        :key="slice.label"
        class="legend-item"
      >
        <span class="legend-dot" :style="{ backgroundColor: slice.color }" />
        <span class="legend-label">{{ slice.label }} ({{ slice.percentage }}%)</span>
      </div>
    </div>
  </div>
</template>



<style scoped>
.pie-chart-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 32px;
  border-radius: 16px;
  padding: 28px 36px;
  font-family: var(--font-primary);
}

.canvas-wrap {
  position: relative;
  transition: transform 0.25s ease, filter 0.25s ease;
  transform-origin: center;
}

.canvas-wrap canvas {
  transition: transform 0.25s ease;
}

.canvas-wrap:hover {
  filter: drop-shadow(0 10px 18px rgba(16, 29, 66, 0.18));
}

.canvas-wrap:hover canvas {
  transform: scale(1.04);
}

.legend {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.legend-dot {
  width: 22px;
  height: 22px;
  border-radius: 4px;
  flex-shrink: 0;
}

.legend-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-black);
  white-space: nowrap;
}
</style>