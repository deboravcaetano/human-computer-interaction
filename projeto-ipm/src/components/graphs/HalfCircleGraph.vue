<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'HalfCircle',

  props: {

    label: { type: String, default: '' },

    primaryPct: { type: Number, default: 60 },
    primaryColor: { type: String, default: 'var(--graph-half-primary)' },
    primaryLabel: { type: String, default: 'Em progresso' },
    secondaryColor: { type: String, default: 'var(--graph-half-secondary)' },
    secondaryLabel: { type: String, default: 'Concluídos' },

    svgSize: { type: Number, default: 240 },
    strokeWidth: { type: Number, default: 22 },
  },

  setup(props) {
    const cx = computed(() => props.svgSize / 2)
    const cy = computed(() => props.svgSize / 2)
    const radius = computed(() => props.svgSize / 2 - props.strokeWidth)


    function polarToCartesian(
      cx: number, cy: number, r: number, angleDeg: number
    ) {

      const rad = (angleDeg * Math.PI) / 180
      return {
        x: cx + r * Math.cos(rad),
        y: cy - r * Math.sin(rad),
      }
    }

    function describeArc(
      cx: number, cy: number, r: number,
      startAngle: number, endAngle: number
    ) {
      const start = polarToCartesian(cx, cy, r, startAngle)
      const end = polarToCartesian(cx, cy, r, endAngle)
      const large = Math.abs(endAngle - startAngle) > 180 ? 1 : 0
      const sweep = 0
      return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} ${sweep} ${end.x} ${end.y}`
    }

    return { cx, cy, radius, describeArc }
  },
})
</script>

<template>
  <div class="half-wrapper">
    <div class="half-chart">
      <svg :width="svgSize" :height="svgSize / 2 + 20" :viewBox="`0 0 ${svgSize} ${svgSize / 2 + 20}`">

        <path
          :d="describeArc(cx, cy, radius, 0, (1 - primaryPct / 100) * 180)"
          fill="none"
          :stroke="secondaryColor"
          :stroke-width="strokeWidth"
          stroke-linecap="round"
        />

        <path
          :d="describeArc(cx, cy, radius, (1 - primaryPct / 100) * 180, 180)"
          class="primary-arc"
          fill="none"
          :stroke="primaryColor"
          :stroke-width="strokeWidth"
          stroke-linecap="round"
        />
      </svg>


      <div class="half-pct half-pct--left" :style="{ color: primaryColor }">
        {{ primaryPct }}%
      </div>


      <div class="half-center-label">{{ label }}</div>


      <div class="half-pct half-pct--right" :style="{ color: secondaryColor }">
        {{ 100 - primaryPct }}%
      </div>
    </div>


    <div class="legend">
      <div class="legend-item">
        <span class="legend-dot" :style="{ backgroundColor: primaryColor }" />
        <span class="legend-label">{{ primaryLabel }}</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot" :style="{ backgroundColor: secondaryColor }" />
        <span class="legend-label">{{ secondaryLabel }}</span>
      </div>
    </div>
  </div>
</template>



<style scoped>
.half-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 40px;
  border-radius: 16px;
  padding: 24px 36px;
  font-family: var(--font-primary);
}

.half-chart {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.half-chart svg {
  display: block;
}

.primary-arc {
  transition: transform 0.25s ease, filter 0.25s ease;
  transform-box: fill-box;
  transform-origin: center;
}

.primary-arc:hover {
  transform: translateY(-4px) scale(1.04);
  filter: drop-shadow(0 6px 10px rgba(16, 29, 66, 0.16));
}

.half-pct {
  position: absolute;
  bottom: 54px;
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1;
  pointer-events: none;
}

.half-pct--left  { left: -36px; transform: translateY(-6px); }
.half-pct--right { right: -36px; transform: translateY(-6px); }

.half-center-label {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-gray-dark);
  white-space: nowrap;
}

.legend {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-left: 30px;
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