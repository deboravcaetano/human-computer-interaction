<script setup>
import { onMounted, ref } from 'vue';
import IntroCard from '@/components/IntroCard.vue';
import PilaresCards from '@/components/PilaresCards.vue';
import { getPillars } from '@/services/api';

const title = "Pilares";
const description = "Os pilares são as grandes áreas estratégicas que orientam o investimento dos fundos europeus, como a Transição Ecológica e a Transformação Digital, servem para organizar e categorizar todos os marcos e metas de cada país. ";

const pillars = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');

const getPillarAssetName = (asset) => asset.replace('pilar-', '');

onMounted(async () => {
  try {
    pillars.value = await getPillars();
  } catch (error) {
    errorMessage.value = 'Não foi possível carregar os pilares.';
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div>
    <IntroCard 
      :title="title" 
      :description="description" 
      height="281" 
      width="100%" 
    >
    </IntroCard>

    <section class="pillars-section">
      <p v-if="isLoading" class="state-text">A carregar pilares...</p>
      <p v-else-if="errorMessage" class="state-text state-text--error">{{ errorMessage }}</p>

      <div v-else class="pillars-grid">
        <PilaresCards
          v-for="pillar in pillars"
          :key="pillar.id"
          :title="pillar.name"
          :pilar="getPillarAssetName(pillar.asset)"
        />
      </div>
    </section>
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
