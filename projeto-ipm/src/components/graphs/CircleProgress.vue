<script setup>
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';


ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({
  percentage: {
    type: Number,
    default: 52
  },
  scale: {
    type: Number,
    default: 1
  }
});

const progressValue = computed(() => Math.max(0, Math.min(100, props.percentage)));

const scaledWidth = computed(() => 200 * props.scale);
const scaledHeight = computed(() => 200 * props.scale);
const scaledFontSize = computed(() => 2 * props.scale);

const cssVarColor = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const backgroundChartData = computed(() => ({
  datasets: [
    {
      data: [100],
      backgroundColor: [cssVarColor('--graph-progress-track')],
      borderWidth: 0,
      borderRadius: 0,
      circumference: 360,
      rotation: 0,
      spacing: 0,
    },
  ],
}));

const progressChartData = computed(() => ({
  datasets: [
    {
      data: [progressValue.value, 100 - progressValue.value],
      backgroundColor: [cssVarColor('--graph-progress-fill'), 'transparent'],
      borderWidth: 0,
      borderRadius: 20,
      hoverOffset: [14, 0],
      circumference: 360,
      rotation: 0,
      spacing: 0,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  layout: {
    padding: 16,
  },
  elements: {
    arc: {
      borderAlign: 'inner',
    },
  },
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
    <div class="chart-layer">
      <Doughnut :data="progressChartData" :options="chartOptions" />
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