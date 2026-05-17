<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import IntroCard from '@/components/IntroCard.vue';
import IndicatorCard from '@/components/IndicatorCard.vue';
import { getIndicators } from '@/services/api';

const title = "Indicadores Comuns";
const description = `O Painel de Avaliação da Recuperação e Resiliência monitoriza o progresso do PRR através de 14 indicadores comuns.


Estes indicadores refletem o progresso na implementação dos planos nacionais e desempenho global do mecanismo face aos objetivos partilhados.


Os Estados-Membros são responsáveis pela recolha e reporte destes dados à Comissão Europeia semestralmente, até ao final de Fevereiro e Agosto.`;

const indicatorCards = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');
const cardVariant = 'default';

const router = useRouter();

const goToIndicator = (id) => {
  router.push(`/indicadores/${id}`);
};

onMounted(async () => {
  try {
    indicatorCards.value = await getIndicators();
  } catch (error) {
    errorMessage.value = 'Não foi possível carregar os indicadores.';
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="indicators-page">
    <IntroCard
      :title="title"
      :description="description"
      height="362px"
      width="100%"
    >
    </IntroCard>

    <section class="indicators-content">
      <p v-if="isLoading" class="state-text">A carregar indicadores...</p>
      <p v-else-if="errorMessage" class="state-text state-text--error">{{ errorMessage }}</p>

      <div v-else class="indicators-grid" aria-label="Indicadores globais">
        <IndicatorCard
          v-for="card in indicatorCards"
          :key="card.id"
          :index="card.id"
          :title="card.title"
          :metrics="card.metrics"
          :variant="cardVariant"
          class="clickable-card"
          @click="goToIndicator(card.id)"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.indicators-page {
  width: 100%;
  font-family: var(--font-primary);
}

.indicators-content {
  display: flex;
  justify-content: center;
  padding: 40px 24px 80px;
  margin-top: 0;
}

.indicators-grid {
  width: min(1200px, 100%);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.clickable-card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.clickable-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
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

@media (max-width: 1100px) {
  .indicators-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .indicators-content {
    padding: 32px 18px 70px;
    margin-top: 0;
  }

  .indicators-grid {
    grid-template-columns: 1fr;
  }
}
</style>