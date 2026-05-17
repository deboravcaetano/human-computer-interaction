<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Button from '@/components/Button.vue'
import IndicatorCard from '@/components/IndicatorCard.vue'
import SummaryCard from '@/components/SummaryCard.vue'
import arrowDownIcon from '@/assets/arrow-down.svg'
import downloadIcon from '@/assets/Download.svg'
import { getCountryById, getCountryIndicators, getIndicators } from '@/services/api'
import { exportData } from '@/services/exporter'

const route = useRoute()

const country = ref(null)
const indicators = ref([])
const countryIndicators = ref(null)
const selectedIndicatorId = ref(null)
const isIndicatorGridOpen = ref(false)
const isLoading = ref(true)
const errorMessage = ref('')

const countryId = computed(() => String(route.params.countryId ?? ''))

const fallbackCountryIndicator = (indicator) => ({
  indicatorId: indicator.id,
  value: indicator.metrics?.[0]?.value ?? 'Dados em atualização',
  evolution: [],
})

const indicatorsWithCountryData = computed(() =>
  indicators.value.map((indicator) => {
    const detail = countryIndicators.value?.indicators?.find(
      (item) => item.indicatorId === indicator.id,
    )

    return {
      ...indicator,
      countryDetail: detail ?? fallbackCountryIndicator(indicator),
    }
  }),
)

const selectedIndicator = computed(() =>
  indicatorsWithCountryData.value.find((indicator) => indicator.id === selectedIndicatorId.value) ?? null,
)

const selectedIndicatorTotalLabel = computed(() => {
  if (!selectedIndicator.value) return ''

  const metricLabel = selectedIndicator.value.metrics?.[0]?.label ?? 'Total'
  return metricLabel.replace(':', '')
})

const evolutionTitle = computed(() => {
  if (!selectedIndicator.value) return ''

  return `Evolução ${selectedIndicator.value.title.toLowerCase()}`
})

const evolutionBars = computed(() => {
  if (!selectedIndicator.value) return []

  const countryEvolution = selectedIndicator.value.countryDetail.evolution ?? []
  const values = countryEvolution.length
    ? countryEvolution.map((item) => item.value)
    : [6, 12, 22, 38, 76, 100]
  const maxBarValue = Math.max(...values)

  return (countryEvolution.length
    ? countryEvolution
    : ['S1 2023', 'S2 2023', 'S1 2024', 'S2 2024', 'S1 2025', 'S2 2025'].map((period, index) => ({
        period,
        value: values[index],
      }))
  ).map((item) => ({
      label: item.period,
      value: item.value,
      height: Math.max(4, Math.round((item.value / maxBarValue) * 100)),
    }))
})

const exportIndicatorRows = computed(() =>
  evolutionBars.value.map((bar) => ({
    periodo: bar.label,
    valor: bar.value,
  })),
)

const handleExport = (format) => {
  if (!selectedIndicator.value || !country.value) return

  exportData({
    format,
    filename: `indicador-${country.value.name}-${selectedIndicator.value.title}`,
    title: `${country.value.name} - ${evolutionTitle.value}`,
    data: exportIndicatorRows.value,
    metadata: {
      pais: country.value.name,
      indicador: selectedIndicator.value.title,
      valorAtual: selectedIndicator.value.countryDetail.value,
    },
  })
}

const loadIndicators = async () => {
  isLoading.value = true
  errorMessage.value = ''
  selectedIndicatorId.value = null
  isIndicatorGridOpen.value = false

  try {
    const [countryResponse, indicatorsResponse, countryIndicatorsResponse] = await Promise.all([
      getCountryById(countryId.value),
      getIndicators(),
      getCountryIndicators(countryId.value),
    ])

    if (!countryResponse) {
      errorMessage.value = 'Não encontrámos dados para este país.'
      country.value = null
      indicators.value = []
      countryIndicators.value = null
      return
    }

    country.value = countryResponse
    indicators.value = indicatorsResponse
    countryIndicators.value = countryIndicatorsResponse
  } catch (error) {
    errorMessage.value = 'Não foi possível carregar os indicadores deste país.'
  } finally {
    isLoading.value = false
  }
}

const selectIndicator = (indicatorId) => {
  selectedIndicatorId.value = indicatorId
  isIndicatorGridOpen.value = false
}

const toggleIndicatorGrid = () => {
  isIndicatorGridOpen.value = !isIndicatorGridOpen.value
}

onMounted(loadIndicators)
watch(countryId, loadIndicators)
</script>

<template>
  <section class="country-indicators-page">
    <p v-if="isLoading" class="state-text">A carregar indicadores do país...</p>

    <p v-else-if="errorMessage" class="state-text state-text--error">
      {{ errorMessage }}
    </p>

    <template v-else>
      <div v-if="!selectedIndicator" class="indicators-grid" aria-label="Indicadores do país">
        <IndicatorCard
          v-for="indicator in indicatorsWithCountryData"
          :key="indicator.id"
          :index="indicator.id"
          :title="indicator.title"
          :metrics="indicator.metrics"
          variant="simple"
          @click="selectIndicator(indicator.id)"
        />
      </div>

      <div v-else class="indicator-detail">
        <div class="indicator-detail__actions">
          <Button
            text="Mostrar Indicadores"
            textsize="13px"
            :icon="true"
            :iconPath="arrowDownIcon"
            :icon-direction="isIndicatorGridOpen ? 'up' : 'down'"
            @click="toggleIndicatorGrid"
          />

          <div class="indicator-total-pill">
            {{ selectedIndicatorTotalLabel }}
            <strong>{{ selectedIndicator.countryDetail.value }}</strong>
          </div>
        </div>

        <div
          v-if="isIndicatorGridOpen"
          class="indicators-grid indicators-grid--selector"
          aria-label="Escolher indicador"
        >
          <IndicatorCard
            v-for="indicator in indicatorsWithCountryData"
            :key="indicator.id"
            :index="indicator.id"
            :title="indicator.title"
            :metrics="indicator.metrics"
            variant="simple"
            @click="selectIndicator(indicator.id)"
          />
        </div>

        <SummaryCard class="indicator-summary">
          <div class="indicator-summary__content">
            <div class="indicator-summary__title-row">
              <span class="indicator-summary__icon" aria-hidden="true">!</span>
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
              @export="handleExport"
            />
          </div>

          <article class="metric-panel evolution-panel">
            <div class="evolution-chart" aria-label="Evolução semestral">
              <div class="evolution-chart__plot">
                <div class="evolution-chart__grid" aria-hidden="true">
                  <span>100K</span>
                  <span>80K</span>
                  <span>60K</span>
                  <span>40K</span>
                  <span>20K</span>
                  <span>0</span>
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
              <small>S1 - Primeiro Semestre<br />S2 - Segundo Semestre</small>
            </div>
          </article>
        </section>
      </div>
    </template>
  </section>
</template>

<style scoped>
.country-indicators-page {
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
  padding: 8px 34px;
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
  width: 20px;
  height: 20px;
  margin-top: 1px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  border-radius: 2px;
  background: #000000;
  color: #ffffff;
  font-size: 15px;
  font-weight: 800;
  line-height: 1;
}

.indicator-summary__title-row h2 {
  margin: 0;
  color: #000000;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.25;
}

.indicator-summary__content p {
  margin: 0;
  color: #000000;
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
  background: #ffffff;
  border: 1px solid #dddddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.14);
}

.indicator-evolution-heading {
  display: grid;
  align-items: center;
  grid-template-columns: 1fr auto;
  gap: 18px;
  padding: 0 8px;
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
  color: #000000;
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
