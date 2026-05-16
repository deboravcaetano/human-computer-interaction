<script setup>
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({
  percentage: { type: Number, default: 52 },
  scale: { type: Number, default: 1 },
  segments: { type: Array, default: null }
});

const progressValue = computed(() => Math.max(0, Math.min(100, props.percentage)));
const scaledWidth = computed(() => 200 * props.scale);
const scaledHeight = computed(() => 200 * props.scale);
const scaledFontSize = computed(() => 2 * props.scale);

const cssVarColor = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const backgroundChartData = computed(() => ({
  datasets: [{
    data: [100],
    backgroundColor: [cssVarColor('--graph-progress-track')],
    borderWidth: 0,
    borderRadius: 0,
    circumference: 360,
    rotation: 0,
    spacing: 0,
  }],
}));

// Segmento azul — ocupa tudo menos o amarelo, sem arredondamento na junção
const primaryChartData = computed(() => {
  if (!props.segments?.length) {
    return {
      datasets: [{
        data: [progressValue.value, 100 - progressValue.value],
        backgroundColor: [cssVarColor('--graph-progress-fill'), 'transparent'],
        borderWidth: 0,
        borderRadius: 20,
        hoverOffset: [14, 0],
        circumference: 360,
        rotation: 0,
        spacing: 0,
      }],
    };
  }

  const [primary, secondary] = props.segments;
  const remainder = Math.max(0, 100 - primary.value - (secondary?.value || 0));

  return {
    datasets: [{
      data: [primary.value, (secondary?.value || 0) + remainder],
      backgroundColor: [primary.color, 'transparent'],
      borderWidth: 0,
      borderRadius: 20,
      hoverOffset: [14, 0],
      circumference: 360,
      rotation: 0,
      spacing: 0,
    }],
  };
});

// Segmento amarelo — começa um pouco antes (overlap) para tapar o cinzento
const secondaryChartData = computed(() => {
  if (!props.segments?.length) return null;

  const [primary, secondary] = props.segments;
  if (!secondary) return null;

  const overlap = 20; // graus de sobreposição sobre o azul
  const overlapPercent = (overlap / 360) * 100;
  const secondaryValue = secondary.value + overlapPercent;
  const startPercent = primary.value - overlapPercent;
  const rotation = (startPercent / 100) * 360;
  const remainder = Math.max(0, 100 - secondaryValue);

  return {
    datasets: [{
      data: [secondaryValue, remainder],
      backgroundColor: [secondary.color, 'transparent'],
      borderWidth: 0,
      borderRadius: 20,
      hoverOffset: [14, 0],
      circumference: 360,
      rotation,
      spacing: 0,
    }],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  layout: { padding: 16 },
  elements: { arc: { borderAlign: 'inner' } },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
};
</script>

<template>
  <div class="chart-wrap" :style="{ width: scaledWidth + 'px', height: scaledHeight + 'px' }">
    <div class="chart-layer">
      <Doughnut :data="backgroundChartData" :options="chartOptions" />
    </div>
    <div class="chart-layer chart-layer--overlay" v-if="secondaryChartData">
      <Doughnut :data="secondaryChartData" :options="chartOptions" />
    </div>
    <div class="chart-layer">
      <Doughnut :data="primaryChartData" :options="chartOptions" />
    </div> 
    <div class="chart-text" :style="{ fontSize: scaledFontSize + 'rem' }">
      {{ progressValue }}%
    </div>
  </div>
</template>

<style scoped>
.chart-wrap {
  position: relative;
  width: 200px;
  height: 200px;
  display: inline-block;
  overflow: visible;
}
.chart-layer {
  position: absolute;
  inset: 0;
  overflow: visible;
}
.chart-layer--overlay {
  pointer-events: none;
}
.chart-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--font-primary);
  font-weight: bold;
  font-size: 2rem;
  color: var(--text-blue-dark);
}
</style>