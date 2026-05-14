<script setup>
import BarsGraph from '@/components/graphs/BarsGraph.vue';
import CircleProgress from '@/components/graphs/CircleProgress.vue';
import HalfCircleGraph from '@/components/graphs/HalfCircleGraph.vue';
import HorizontalBarsGraph from '@/components/graphs/HorizontalBarsGraph.vue';
import PieGraph from '@/components/graphs/PieGraph.vue';

</script>

<template>
    <div class="charts-test">
    <CircleProgress 
        :percentage="67" 
        :scale="1"
    />
    <BarsGraph
        :bars="[
            { name: 'Six', value: 393, color: '#1d4ed8' },
            { name: 'Seven', value: 723.8, color: '#bbbbbb' },
        ]"
        :maxHeight="220"
    />
    <HorizontalBarsGraph
        :bars="[
            { title: 'Crescimento', value: 393, color: '#1d4ed8' },
            { title: 'Transição Ecológica', value: 723.8, color: '#bbbbbb' },
            { title: 'Sustentabilidade', value: 500, color: '#4ade80' },
            { title: 'Inovação', value: 250, color: '#fbbf24' },
            { title: 'Digitalização', value: 150, color: '#f87171' },
        ]"
        :maxWidth="200"
    />
    <PieGraph
        :slices="[
            { label: 'Portugal', percentage: 18, color: '#1d4ed8' },
            { label: 'Alemanha', percentage: 29, color: '#bbbbbb' },
            { label: 'Resto da UE', percentage: 53, color: '#4ade80' },
        ]"
        :size="200"
        :rotation="280"
    />
    <HalfCircleGraph
        :primaryPct="67"
        label="Portugal"
        primaryColor="#1d4ed8"
        secondaryColor="#bbbbbb"
        :size="200"
    />
    </div>
</template>

<style scoped>
    .charts-test {
        display: flex;
        flex-direction: column;
        gap: 48px;
    }
</style>
