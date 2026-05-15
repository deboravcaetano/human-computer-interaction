<script setup>
import { onMounted, ref } from 'vue';
import IntroCard from '@/components/IntroCard.vue';
import PilaresCards from '@/components/PilaresCards.vue';

const title = "Pilares";
const description = "Os pilares são as grandes áreas estratégicas que orientam o investimento dos fundos europeus, como a Transição Ecológica e a Transformação Digital, servem para organizar e categorizar todos os marcos e metas de cada país.";

const pilares = [
  { id: 1, title: 'Crescimento', pilar: 'crescimento', percentage: 10.8 },
  { id: 2, title: 'Políticas', pilar: 'politicas', percentage: 10.8 },
  { id: 3, title: 'Saúde e Resiliência', pilar: 'saude', percentage: 10.8 },
  { id: 4, title: 'Transição Ecológica', pilar: 'ecologica', percentage: 10.8 },
  { id: 5, title: 'Coesão Social e Territorial', pilar: 'coesao', percentage: 10.8 },
  { id: 6, title: 'Transformação Digital', pilar: 'digital', percentage: 10.8 },
];
</script>

<template>
  <div class="pilares-page">
    <IntroCard 
      :title="title" 
      :description="description" 
      height="281px" 
      width="100%" 
    >
    </IntroCard>

    <div class="pilares-grid">
      <PilaresCards
        v-for="pilar in pilares"
        :key="pilar.id"
        :title="pilar.title"
        :pilar="pilar.pilar"
        :percentage="pilar.percentage"
      />
    </div>
  </div>
</template>

<style scoped>
.pillars-section {
  display: flex;
  justify-content: center;
  padding: 48px 24px 80px;
}

.pillars-grid {
  width: min(1200px, 100%);
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 18px;
}

.state-text {
  width: min(1200px, 100%);
  margin: 0;
  font-family: var(--font-primary);
  color: var(--text-gray);
}

.state-text--error {
  color: #b42318;
}
</style>
