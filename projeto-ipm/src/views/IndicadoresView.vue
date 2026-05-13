<script setup>
import IntroCard from '@/components/IntroCard.vue';
import IndicatorCard from '@/components/IndicatorCard.vue';

const title = "Indicadores Comuns";
const description = `O Painel de Avaliação da Recuperação e Resiliência monitoriza o progresso do PRR através de 14 indicadores comuns.


Estes indicadores refletem o progresso na implementação dos planos nacionais e desempenho global do mecanismo face aos objetivos partilhados.


Os Estados-Membros são responsáveis pela recolha e reporte destes dados à Comissão Europeia semestralmente, até ao final de Fevereiro e Agosto.`;

const useSimplifiedCards = false;

const indicatorCards = [
  {
    index: 1,
    title: 'Poupança no consumo anual de energia primária',
    metrics: [{ label: 'Total de poupança (MWh/Ano):', value: '37 568 052' }]
  },
  {
    index: 2,
    title: 'Capacidade operacional adicional instalada para energias renováveis',
    metrics: [
      { label: 'Energia Renovável:', value: '62 444 MW' },
      { label: 'Hidrogénio:', value: '18 MW' }
    ]
  },
  {
    index: 3,
    title: 'Infraestrutura de combustíveis alternativos',
    metrics: [{ label: 'Total:', value: '940 886' }]
  },
  {
    index: 4,
    title: 'População beneficiada por medidas de proteção',
    metrics: [{ label: 'População total:', value: '36 840 567' }]
  },
  {
    index: 5,
    title: 'Alojamentos adicionais com acesso à internet',
    metrics: [{ label: 'Alojamentos totais:', value: '17 567 890' }]
  },
  {
    index: 6,
    title: 'Empresas apoiadas no desenvolvimento de produtos e processos digitais',
    metrics: [{ label: 'Total de empresas:', value: '1 456 789' }]
  }
];

const cardsToRender = indicatorCards;
const cardVariant = 'default';
</script>

<template>
  <div>
    <IntroCard
      :title="title"
      :description="description"
      height="362px"
      width="100%"
    >
    </IntroCard>

    <section class="indicators-content">
      <div class="indicators-grid">
        <IndicatorCard
          v-for="card in cardsToRender"
          :key="card.index"
          :index="card.index"
          :title="card.title"
          :metrics="card.metrics"
          :variant="cardVariant"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
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