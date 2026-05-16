<script setup>
import { onMounted, ref } from 'vue';
import IntroCard from '@/components/IntroCard.vue';
import PilaresCards from '@/components/PilaresCards.vue';
import { getPillars } from '@/services/api';

const title = "Pilares";
const description = "Os pilares são as grandes áreas estratégicas que orientam o investimento dos fundos europeus, como a Transição Ecológica e a Transformação Digital, servem para organizar e categorizar todos os marcos e metas de cada país.";

const pilares = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');

const getPilarAssetName = (asset) => asset?.replace('pilar-', '') ?? '';

onMounted(async () => {
  try {
    pilares.value = await getPillars();
  } catch (error) {
    errorMessage.value = 'Não foi possível carregar os pilares.';
  } finally {
    isLoading.value = false;
  }
});
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

    <p v-if="isLoading" class="state-text">A carregar pilares...</p>
    <p v-else-if="errorMessage" class="state-text state-text--error">{{ errorMessage }}</p>

    <div v-else class="pilares-grid">
      <PilaresCards
        v-for="pilar in pilares"
        :key="pilar.id"
        :title="pilar.name"
        :pilar="getPilarAssetName(pilar.asset)"
        :percentage="pilar.percentage"
      />
    </div>
  </div>
</template>

<style scoped>
.pilares-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pilares-grid {
  width: min(1050px, calc(100% - 48px));
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px;
  justify-items: stretch;
  padding: 48px 0 80px;
}

.pillars-section {
  display: flex;
  justify-content: center;
  padding: 48px 24px 80px;
}

.state-text {
  width: min(1200px, 100%);
  margin: 48px auto 80px;
  padding: 0 24px;
  font-family: var(--font-primary);
  color: var(--text-gray);
}

.state-text--error {
  color: #b42318;
}

@media (max-width: 1024px) {
  .pilares-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: min(720px, calc(100% - 40px));
    gap: 22px;
  }
}

@media (max-width: 640px) {
  .pilares-grid {
    grid-template-columns: 1fr;
    width: min(340px, calc(100% - 32px));
    padding: 36px 0 56px;
  }
}
</style>
