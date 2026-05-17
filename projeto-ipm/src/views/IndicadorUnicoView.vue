<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Button from '@/components/Button.vue';
import IndicatorCard from '@/components/IndicatorCard.vue';
import SummaryCard from '@/components/SummaryCard.vue';
import arrowDownIcon from '@/assets/arrow-down.svg';
import downloadIcon from '@/assets/Download.svg';
import exclamationIcon from '@/assets/exclamation.svg';
import { getIndicators } from '@/services/api';

const route = useRoute();
const router = useRouter();

const indicatorCards = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');

const isIndicatorGridOpen = ref(false);

const indicatorId = computed(() => Number(route.params.id));

const selectedIndicator = computed(() =>
  indicatorCards.value.find((indicator) => indicator.id === indicatorId.value) ?? null,
);

const selectedIndicatorTotalLabel = computed(() => {
  if (!selectedIndicator.value) return '';

  const metricLabel = selectedIndicator.value.metrics?.[0]?.label ?? 'Total';
  return metricLabel.replace(':', '').trim();
});

const selectedIndicatorTotalValue = computed(() => {
  if (!selectedIndicator.value) return '';

  const metric = selectedIndicator.value.metrics?.[0];
  const value = String(metric?.value ?? 'Dados em atualização');
  const unit = metric?.label?.match(/\((.*?)\)/)?.[1]?.trim();

  if (!unit || value === 'Dados em atualização' || value.toLowerCase().includes(unit.toLowerCase())) {
    return value;
  }

  return `${value} ${unit}`;
});

const evolutionTitle = computed(() => {
  if (!selectedIndicator.value) return '';

  return `Evolução ${selectedIndicator.value.title.toLowerCase()}`;
});

const parseNumber = (value) => Number(String(value).replace(/\s/g, '').replace(',', '.')) || 0;

const formatAxisValue = (value) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toLocaleString('pt-PT', { maximumFractionDigits: 1 })}M`;
  }

  if (value >= 1000) {
    return `${Math.round(value / 1000).toLocaleString('pt-PT')}K`;
  }

  return Math.round(value).toLocaleString('pt-PT');
};

const fallbackEvolution = computed(() => {
  if (!selectedIndicator.value) return [];

  const totalValue = parseNumber(selectedIndicator.value.metrics?.[0]?.value ?? 0);
  const periods = ['2021', '2022', '2023', '2024', '2025'];
  const progress = [0.05, 0.1, 0.18, 0.34, 0.72, 1];

  return periods.map((period, index) => ({
    period,
    value: Math.round(totalValue * progress[index]),
  }));
});

const evolutionSource = computed(() => {
  const evolution = selectedIndicator.value?.evolution ?? [];
  return evolution.length ? evolution : fallbackEvolution.value;
});

const maxEvolutionValue = computed(() =>
  Math.max(...evolutionSource.value.map((item) => parseNumber(item.value)), 1),
);

const yAxisLabels = computed(() =>
  [1, 0.8, 0.6, 0.4, 0.2, 0].map((ratio) => formatAxisValue(maxEvolutionValue.value * ratio)),
);

const evolutionBars = computed(() => {
  return evolutionSource.value.map((item) => ({
    label: item.period,
    value: parseNumber(item.value),
    height: Math.max(4, Math.round((parseNumber(item.value) / maxEvolutionValue.value) * 100)),
  }));
});

const selectIndicator = (id) => {
  router.push(`/indicadores/${id}`);
  isIndicatorGridOpen.value = false;
};

const toggleIndicatorGrid = () => {
  isIndicatorGridOpen.value = !isIndicatorGridOpen.value;
};

const loadIndicators = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  
  try {
    indicatorCards.value = await getIndicators();
    if (!selectedIndicator.value) {
      errorMessage.value = 'Indicador não encontrado.';
    }
  } catch (error) {
    errorMessage.value = 'Não foi possível carregar o indicador.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadIndicators);
watch(indicatorId, loadIndicators);
</script>

<template>
  <div class="indicator-detail-page">
    <p v-if="isLoading" class="state-text">A carregar indicador...</p>
    <p v-else-if="errorMessage" class="state-text state-text--error">{{ errorMessage }}</p>

    <div v-else-if="selectedIndicator" class="indicator-detail">
      <div class="indicator-detail__actions">
        <Button
          text="Mostrar Indicadores"
          textsize="13px"
          :icon="true"
          :iconPath="arrowDownIcon"
          iconPosition="right"
          :icon-direction="isIndicatorGridOpen ? 'up' : 'down'"
          @click="toggleIndicatorGrid"
        />

        <div class="indicator-total-pill">
          {{ selectedIndicatorTotalLabel }}
          <strong>{{ selectedIndicatorTotalValue }}</strong>
        </div>
      </div>

      <div
        v-if="isIndicatorGridOpen"
        class="indicators-grid indicators-grid--selector"
        aria-label="Escolher indicador"
      >
        <IndicatorCard
          v-for="card in indicatorCards"
          :key="card.id"
          :index="card.id"
          :title="card.title"
          :metrics="card.metrics"
          variant="simple"
          @click="selectIndicator(card.id)"
        />
      </div>

      <SummaryCard class="indicator-summary">
        <div class="indicator-summary__content">
          <div class="indicator-summary__title-row">
            <img :src="exclamationIcon" class="indicator-summary__icon" alt="Atenção" aria-hidden="true" />
            <h2>{{ selectedIndicator.summaryTitle }}</h2>
          </div>

          <p>{{ selectedIndicator.summary }}</p>
        </div>
      </SummaryCard>

      <section class="indicator-evolution-section" aria-labelledby="indicator-evolution-title">
        <div class="indicator-evolution-heading">
          <h2 id="indicator-evolution-title">{{ evolutionTitle }}</h2>

          <Button
            text="Exportar"
            textsize="13px"
            :icon="true"
            :iconPath="downloadIcon"
            :exportable="true"
          />
        </div>

        <article class="metric-panel evolution-panel">
          <div class="evolution-chart" aria-label="Evolução semestral">
              <div class="evolution-chart__plot">
                <div class="evolution-chart__grid" aria-hidden="true">
                <span v-for="label in yAxisLabels" :key="label">{{ label }}</span>
              </div>

              <div class="evolution-chart__bars">
                <div
                  v-for="bar in evolutionBars"
                  :key="bar.label"
                  class="evolution-chart__bar"
                >
                  <span :style="{ height: `${bar.height}%` }"></span>
                  <strong>{{ bar.label }}</strong>
                </div>
              </div>
            </div>
          </div>

          <div class="evolution-note">
            <h3>Atenção:</h3>
            <p>
              Este gráfico mostra os valores reportados para o indicador comum selecionado ao longo do tempo.
            </p>
            <p>
              Este é um indicador de stock, o que significa que os valores são acumulados ao longo do tempo e só podem aumentar.
            </p>
            <p>
              Os valores do indicador comum podem não estar representados no gráfico ao lado quando o reporte do Estado-Membro é feito numa unidade diferente da unidade geral do indicador.
            </p>
          </div>
        </article>
      </section>
    </div>
  </div>
</template>

<style scoped>
.indicator-detail-page {
  width: 100%;
  font-family: var(--font-primary);
}

.indicators-grid {
  width: min(1180px, calc(100% - 48px));
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px 30px;
  margin: 28px auto 64px;
}

.indicators-grid--selector {
  width: 100%;
  margin: 0 0 24px;
}

.indicator-detail {
  width: min(1050px, calc(100% - 48px));
  margin: 28px auto 72px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.indicator-detail__actions {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 10px;
  padding-top: 40px;
}

.indicator-detail__actions > :first-child {
  justify-self: start;
}

.indicator-total-pill {
  min-height: 46px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 34px;
  border-radius: 8px;
  background: var(--bg-blue);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
  color: #ffffff;
  font-size: 20px;
  white-space: nowrap;
}

.indicator-total-pill strong {
  font-weight: 900;
}

.indicator-summary {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(16, 29, 66, 0.17);
  min-height: 0;
  padding: 28px 30px;
}

.indicator-summary__content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: flex-start;
}

.indicator-summary__title-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.indicator-summary__icon {
  flex: 0 0 auto;
  width: 20px;
  height: 20px;
  margin-top: 1px;
}

.indicator-summary__title-row h2 {
  margin: 0;
  color: var(--text-dark);
  font-size: 18px;
  font-weight: 800;
  line-height: 1.25;
}

.indicator-summary__content p {
  margin: 0;
  color: var(--text-dark);
  font-size: 17px;
  line-height: 1.35;
  white-space: pre-line;
}

.indicator-evolution-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.metric-panel {
  background: var(--bg-white);
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(16, 29, 66, 0.17);
}

.indicator-evolution-heading {
  display: grid;
  align-items: center;
  grid-template-columns: 1fr auto;
  gap: 18px;
  padding-top: 8px;
}

.indicator-evolution-heading h2 {
  margin: 0;
  color: #000000;
  font-size: 22px;
  font-weight: 800;
}

.evolution-panel {
  min-height: 300px;
  padding: 26px 34px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 0.95fr);
  gap: 34px;
  align-items: stretch;
}

.evolution-chart {
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 8px 0;
}

.evolution-chart__plot {
  position: relative;
  width: min(430px, 100%);
  height: 230px;
  padding: 0 0 28px 42px;
}

.evolution-chart__grid {
  position: absolute;
  inset: 0 0 28px 0;
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  color: #777777;
  font-size: 11px;
}

.evolution-chart__grid span {
  position: relative;
}

.evolution-chart__grid span::after {
  content: "";
  position: absolute;
  left: 42px;
  right: 0;
  top: 0;
  border-top: 1px dashed #cccccc;
}

.evolution-chart__bars {
  position: relative;
  z-index: 1;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  align-items: end;
  gap: 18px;
  border-left: 1px solid #bbbbbb;
  border-bottom: 1px solid #bbbbbb;
  padding: 0 12px;
}

.evolution-chart__bar {
  height: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
  gap: 8px;
}

.evolution-chart__bar span {
  width: min(42px, 80%);
  display: block;
  background: #3e4968;
}

.evolution-chart__bar strong {
  color: #666666;
  font-size: 10px;
  font-weight: 700;
  text-align: center;
  white-space: nowrap;
}

.evolution-note {
  border-left: 1px solid #cfcfcf;
  padding: 26px 0 18px 32px;
  color: #777777;
}

.evolution-note h3 {
  margin: 0 0 24px;
  color: var(--text-dark);
  font-size: 18px;
  font-weight: 800;
}

.evolution-note p {
  margin: 0 0 18px;
  font-size: 13px;
  line-height: 1.35;
}

.evolution-note small {
  display: block;
  margin-top: 18px;
  font-size: 10px;
  line-height: 1.35;
}

.state-text {
  width: min(1050px, calc(100% - 48px));
  margin: 28px auto 64px;
  color: var(--text-gray);
  font-family: var(--font-primary);
}

.state-text--error {
  color: #b42318;
}

@media (max-width: 1100px) {
  .indicators-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: min(760px, calc(100% - 40px));
  }

  .indicators-grid--selector,
  .indicator-detail {
    width: min(760px, calc(100% - 40px));
  }
}

@media (max-width: 900px) {
  .evolution-panel {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .indicators-grid,
  .indicators-grid--selector,
  .indicator-detail,
  .state-text {
    width: min(360px, calc(100% - 32px));
  }

  .indicators-grid,
  .indicators-grid--selector {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .indicator-detail__actions,
  .indicator-evolution-heading,
  .evolution-panel {
    grid-template-columns: 1fr;
  }

  .indicator-total-pill {
    justify-self: stretch;
    white-space: normal;
    text-align: center;
    padding: 8px 18px;
    font-size: 16px;
  }

  .evolution-panel {
    padding: 22px 18px;
    gap: 22px;
  }

  .evolution-chart__plot {
    height: 200px;
    padding-left: 34px;
  }

  .evolution-chart__bars {
    gap: 8px;
    padding: 0 8px;
  }

  .evolution-chart__bar strong {
    font-size: 8px;
  }

  .evolution-note {
    border-left: 0;
    border-top: 1px solid #cfcfcf;
    padding: 22px 0 0;
  }
}
</style>
