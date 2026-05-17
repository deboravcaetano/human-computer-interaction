<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '@/components/Button.vue'
import IndicatorCard from '@/components/IndicatorCard.vue'
import PilaresCards from '@/components/PilaresCards.vue'
import SummaryCard from '@/components/SummaryCard.vue'
import BarsGraph from '@/components/graphs/BarsGraph.vue'
import PieGraph from '@/components/graphs/PieGraph.vue'
import arrowDownIcon from '@/assets/arrow-down.svg'
import downloadIcon from '@/assets/Download.svg'
import { exportData } from '@/services/exporter'
import {
  getCountries,
  getCountryDetail,
  getCountryIndicators,
  getCountryPillars,
  getIndicators,
  getPillars,
} from '@/services/api'

const route = useRoute()
const router = useRouter()

const countries = ref([])
const countryDetails = ref([])
const pillars = ref([])
const indicators = ref([])
const countryPillars = ref([])
const countryIndicators = ref([])
const activeTab = ref('summary')
const selectedPillarId = ref('')
const selectedIndicatorId = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')

const countryIds = computed(() => [
  String(route.params.firstCountryId ?? ''),
  String(route.params.secondCountryId ?? ''),
])

const selectedCountries = computed(() =>
  countryIds.value
    .map((id) => countries.value.find((country) => country.id === id))
    .filter(Boolean),
)

const getFlagPath = (flagAsset) => {
  return new URL(`../assets/flags/${flagAsset}.svg`, import.meta.url).href
}

const getPilarAssetName = (asset) => asset?.replace('pilar-', '') ?? ''

const getPilarIconPath = (asset) => {
  return new URL(`../assets/pilares/${asset}.svg`, import.meta.url).href
}

const tabs = [
  { id: 'summary', label: 'Sumário' },
  { id: 'pillars', label: 'Pilares' },
  { id: 'indicators', label: 'Indicadores' },
]

const parseMoneyValue = (value) => {
  if (!value || value === '---') return 0

  const normalized = String(value)
    .replace(/[^\d,.-]/g, '')
    .replace(/\s/g, '')
    .replace(',', '.')

  return Number.parseFloat(normalized) || 0
}

const countryWithDetail = computed(() =>
  selectedCountries.value
    .map((country) => {
    const detail = countryDetails.value.find((item) => item?.countryId === country.id)
    if (!detail) return null

    const completedGoals = detail.completedGoals
    const metrics = detail.metrics

    return {
      ...country,
      detail,
      completedGoals,
      metrics,
    }
  })
    .filter(Boolean),
)

const selectedPillar = computed(() =>
  pillars.value.find((pillar) => pillar.id === selectedPillarId.value) ?? null,
)

const selectedIndicator = computed(() =>
  indicators.value.find((indicator) => indicator.id === selectedIndicatorId.value) ?? null,
)

const getCountryPillarDetail = (countryId, pillarId) => {
  const countryData = countryPillars.value.find((item) => item?.countryId === countryId)
  return countryData?.pillars?.find((pillar) => pillar.pillarId === pillarId) ?? null
}

const getCountryIndicatorDetail = (countryId, indicatorId) => {
  const countryData = countryIndicators.value.find((item) => item?.countryId === countryId)
  return countryData?.indicators?.find((indicator) => indicator.indicatorId === indicatorId) ?? null
}

const comparePillarCards = computed(() =>
  pillars.value.map((pillar) => {
    const percentages = countryWithDetail.value.map((country) => {
      const detail = getCountryPillarDetail(country.id, pillar.id)
      return detail?.percentage ?? pillar.percentage
    })

    const average = percentages.length
      ? Math.round((percentages.reduce((sum, value) => sum + value, 0) / percentages.length) * 10) / 10
      : pillar.percentage

    return {
      ...pillar,
      percentage: average,
    }
  }),
)

const distributionSlices = computed(() => {
  const countryValues = countryWithDetail.value.map((country) => ({
    label: country.name,
    value:
      parseMoneyValue(country.metrics.grantsRequested) +
      parseMoneyValue(country.metrics.loansAwarded),
  }))
  const pairTotal = countryValues.reduce((sum, country) => sum + country.value, 0)
  const euRemainder = Math.max(pairTotal * 1.6, 1)
  const total = pairTotal + euRemainder

  const slices = countryValues.map((country, index) => ({
    label: country.label,
    percentage: Math.max(1, Math.round((country.value / total) * 100)),
    color: index === 0 ? '#ff1f1f' : '#ffcc42',
  }))

  const usedPercentage = slices.reduce((sum, slice) => sum + slice.percentage, 0)

  return [
    ...slices,
    {
      label: 'Resto da UE',
      percentage: Math.max(1, 100 - usedPercentage),
      color: '#101d42',
    },
  ]
})

const loansBars = computed(() =>
  countryWithDetail.value.map((country, index) => ({
    name: country.name,
    value: parseMoneyValue(country.metrics.loansAwarded),
    color: index === 0 ? '#ff1f1f' : '#ffcc42',
  })),
)

const compareTitle = computed(() =>
  selectedCountries.value.length === 2
    ? `${selectedCountries.value[0].name} vs ${selectedCountries.value[1].name}`
    : 'Comparação de países',
)

const defaultPolicyAreas = [
  { label: 'Eficiência Energética', value: 42.4 },
  { label: 'Mobilidade Sustentável', value: 10.8 },
  { label: 'Adaptação às alterações climáticas', value: 8.7 },
  { label: 'Proteção e Restauro da Biodiversidade', value: 2.1 },
  { label: 'Energia Renovável e Redes', value: 9.3 },
]

const getComparablePillarDetail = (country, pillar) => {
  const detail = getCountryPillarDetail(country.id, pillar.id)
  const percentage = detail?.percentage ?? pillar.percentage
  const total = detail?.milestones?.total ?? country.completedGoals.total
  const completed = detail?.milestones?.completed ?? Math.round((percentage / 100) * total)

  return {
    percentage,
    investment: detail?.investment ?? 'Dados em atualização',
    ranking: detail?.ranking ?? 'Ranking em atualização',
    rule: {
      percentage,
      allocation: detail?.rule?.allocation ?? detail?.investment ?? 'Dados em atualização',
      total: detail?.rule?.total ?? country.metrics.grantsRequested,
      aboveMinimum: detail?.rule?.aboveMinimum ?? `${Math.max(0, Math.round((percentage - 37) * 10) / 10).toString().replace('.', ',')} p.p.`,
    },
    policyAreas: detail?.policyAreas ?? defaultPolicyAreas,
    milestones: {
      completed,
      total,
      percentage: detail?.milestones?.percentage ?? Math.round((completed / total) * 100),
    },
  }
}

const getComparableIndicatorDetail = (country, indicator) => {
  const detail = getCountryIndicatorDetail(country.id, indicator.id)

  return {
    value: detail?.value ?? indicator.metrics?.[0]?.value ?? 'Dados em atualização',
    metrics: indicator.metrics?.length
      ? indicator.metrics
      : [{ label: 'Valor reportado:', value: detail?.value ?? 'Dados em atualização' }],
  }
}

const exportCompareRows = computed(() => {
  if (activeTab.value === 'pillars') {
    return countryWithDetail.value.map((country) => {
      const row = { pais: country.name }

      pillars.value.forEach((pillar) => {
        const detail = getComparablePillarDetail(country, pillar)
        row[pillar.name] = `${detail.percentage}%`
      })

      return row
    })
  }

  if (activeTab.value === 'indicators' && selectedIndicator.value) {
    return countryWithDetail.value.map((country) => {
      const detail = getComparableIndicatorDetail(country, selectedIndicator.value)

      return {
        pais: country.name,
        indicador: selectedIndicator.value.title,
        valor: detail.value,
        metricas: detail.metrics.map((metric) => `${metric.label} ${metric.value}`).join('; '),
      }
    })
  }

  return countryWithDetail.value.map((country) => ({
    pais: country.name,
    execucao: `${country.completedGoals.percentage}%`,
    marcosMetasConcluidos: `${country.completedGoals.completed}/${country.completedGoals.total}`,
    totalDesembolsado: country.metrics.totalDisbursed,
    apoiosFundoPerdido: country.metrics.grantsRequested,
    emprestimosAtribuidos: country.metrics.loansAwarded,
    alocacaoPrrPib: country.metrics.allocationVsGdp,
  }))
})

const handleExport = (format) => {
  exportData({
    format,
    filename: `comparacao-${compareTitle.value}-${activeTab.value}`,
    title: `${compareTitle.value} - ${tabs.find((tab) => tab.id === activeTab.value)?.label ?? 'Resumo'}`,
    data: exportCompareRows.value,
    metadata: {
      seccao: tabs.find((tab) => tab.id === activeTab.value)?.label ?? activeTab.value,
      indicador: selectedIndicator.value?.title ?? '',
      pilar: selectedPillar.value?.name ?? '',
    },
  })
}

const pieChartSize = computed(() => {
  if (typeof window === 'undefined') return 170
  return window.innerWidth <= 640 ? 132 : 170
})

const loanChartHeight = computed(() => {
  if (typeof window === 'undefined') return 160
  return window.innerWidth <= 640 ? 120 : 160
})

const loadCompareData = async () => {
  isLoading.value = true
  errorMessage.value = ''
  selectedPillarId.value = ''
  selectedIndicatorId.value = null

  try {
    const [
      countriesResponse,
      pillarsResponse,
      indicatorsResponse,
      ...details
    ] = await Promise.all([
      getCountries(),
      getPillars(),
      getIndicators(),
      ...countryIds.value.map((id) => getCountryDetail(id)),
      ...countryIds.value.map((id) => getCountryPillars(id)),
      ...countryIds.value.map((id) => getCountryIndicators(id)),
    ])

    countries.value = countriesResponse
    pillars.value = pillarsResponse
    indicators.value = indicatorsResponse
    countryDetails.value = details.slice(0, 2)
    countryPillars.value = details.slice(2, 4).filter(Boolean)
    countryIndicators.value = details.slice(4, 6).filter(Boolean)

    if (selectedCountries.value.length !== 2 || countryDetails.value.some((detail) => !detail)) {
      errorMessage.value = 'Só é possível comparar países com dados detalhados disponíveis.'
    }
  } catch (error) {
    errorMessage.value = 'Não foi possível carregar a comparação.'
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.push('/paises')
}

onMounted(loadCompareData)
watch(countryIds, loadCompareData)
</script>

<template>
  <section class="compare-page">
    <p v-if="isLoading" class="state-text">A carregar comparação...</p>

    <p v-else-if="errorMessage" class="state-text state-text--error">
      {{ errorMessage }}
    </p>

    <template v-else>
      <header class="compare-hero">
        <div>
          <p>Comparação de países</p>
          <h1>{{ selectedCountries[0].name }} vs {{ selectedCountries[1].name }}</h1>
        </div>

        <div class="compare-hero__flags" aria-hidden="true">
          <img
            v-for="country in selectedCountries"
            :key="country.id"
            :src="getFlagPath(country.flagAsset)"
            :alt="`Bandeira de ${country.name}`"
          />
        </div>
      </header>

      <nav class="compare-tabs" aria-label="Secções da comparação">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          class="compare-tabs__item"
          :class="{ 'compare-tabs__item--active': activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </nav>

      <section v-if="activeTab === 'summary'" class="summary-panel">
        <div class="country-progress-grid">
          <article
            v-for="country in countryWithDetail"
            :key="country.id"
            class="country-progress-card"
          >
            <header>
              <img :src="getFlagPath(country.flagAsset)" :alt="`Bandeira de ${country.name}`" />
              <h2>{{ country.name }}</h2>
            </header>

            <strong>{{ country.completedGoals.percentage }}%</strong>

            <div class="country-progress-card__track" aria-hidden="true">
              <span :style="{ width: `${country.completedGoals.percentage}%` }"></span>
            </div>

            <p>{{ country.completedGoals.completed }}/{{ country.completedGoals.total }} marcos e metas concluídos</p>
          </article>
        </div>

        <SummaryCard class="compare-summary-card" title="Estado dos Marcos e Metas">
          <div class="milestones-comparison">
            <div
              v-for="country in countryWithDetail"
              :key="country.id"
              class="milestones-comparison__item"
            >
              <strong>{{ country.completedGoals.percentage }}%</strong>
              <div class="milestones-comparison__bar" aria-hidden="true">
                <span :style="{ width: `${country.completedGoals.percentage}%` }"></span>
              </div>
              <span>{{ country.name }}</span>
            </div>
          </div>
        </SummaryCard>

        <div class="summary-charts-grid">
          <SummaryCard
            class="compare-summary-card compare-summary-card--chart"
            title="Como o Plano de Recuperação e Resiliência é distribuído?"
          >
            <PieGraph
              :slices="distributionSlices"
              :size="pieChartSize"
            />
          </SummaryCard>

          <SummaryCard
            class="compare-summary-card compare-summary-card--chart"
            title="Total de empréstimos atribuídos"
          >
            <BarsGraph
              :bars="loansBars"
              :max-height="loanChartHeight"
              unit="M"
            />
          </SummaryCard>
        </div>
      </section>

      <section v-else-if="activeTab === 'pillars'" class="compare-detail-section">
        <div v-if="!selectedPillar" class="pillars-grid">
          <PilaresCards
            v-for="pillar in comparePillarCards"
            :key="pillar.id"
            :title="pillar.name"
            :pilar="getPilarAssetName(pillar.asset)"
            :percentage="pillar.percentage"
            @select="selectedPillarId = pillar.id"
          />
        </div>

        <template v-else>
          <div class="compare-section-actions">
            <Button
              text="Mostrar Pilares"
              textsize="13px"
              :icon="true"
              :iconPath="arrowDownIcon"
              icon-direction="down"
              @click="selectedPillarId = ''"
            />
          </div>

          <SummaryCard class="compare-summary-card">
            <div class="compare-summary-card__content">
              <img
                :src="getPilarIconPath(selectedPillar.asset)"
                :alt="selectedPillar.name"
              />
              <div>
                <h2>{{ selectedPillar.name }}</h2>
                <p>{{ selectedPillar.summary }}</p>
              </div>
            </div>
          </SummaryCard>

          <div class="compare-columns">
            <article
              v-for="country in countryWithDetail"
              :key="country.id"
              class="comparison-detail-card"
            >
              <header>
                <span>
                  <img :src="getFlagPath(country.flagAsset)" :alt="`Bandeira de ${country.name}`" />
                  {{ country.name }}
                </span>
                <em>{{ getComparablePillarDetail(country, selectedPillar).ranking }}</em>
              </header>

              <section class="compare-rule-card">
                <h3>Regra dos 37%</h3>
                <strong>{{ getComparablePillarDetail(country, selectedPillar).rule.percentage.toString().replace('.', ',') }}%</strong>
                <div class="compare-rule-card__track" aria-hidden="true">
                  <span :style="{ width: `${getComparablePillarDetail(country, selectedPillar).rule.percentage}%` }"></span>
                  <i></i>
                </div>
                <dl>
                  <div>
                    <dt>Alocação</dt>
                    <dd>{{ getComparablePillarDetail(country, selectedPillar).rule.allocation }}</dd>
                  </div>
                  <div>
                    <dt>Total PRR</dt>
                    <dd>{{ getComparablePillarDetail(country, selectedPillar).rule.total }}</dd>
                  </div>
                  <div>
                    <dt>Acima mínimo</dt>
                    <dd>{{ getComparablePillarDetail(country, selectedPillar).rule.aboveMinimum }}</dd>
                  </div>
                </dl>
              </section>

              <section class="compare-area-card">
                <h3>Distribuição por Área</h3>
                <div
                  v-for="area in getComparablePillarDetail(country, selectedPillar).policyAreas"
                  :key="`${country.id}-${area.label}`"
                  class="compare-area-row"
                >
                  <div>
                    <span>{{ area.label }}</span>
                    <strong>{{ area.value.toString().replace('.', ',') }}%</strong>
                  </div>
                  <p><span :style="{ width: `${area.value}%` }"></span></p>
                </div>
              </section>

              <section class="compare-milestones-card">
                <h3>Marcos e Metas</h3>
                <strong>{{ getComparablePillarDetail(country, selectedPillar).milestones.percentage }}%</strong>
                <p>
                  {{ getComparablePillarDetail(country, selectedPillar).milestones.completed }}/{{ getComparablePillarDetail(country, selectedPillar).milestones.total }}
                  concluídos
                </p>
              </section>
            </article>
          </div>
        </template>
      </section>

      <section v-else class="compare-detail-section">
        <div v-if="!selectedIndicator" class="indicators-grid">
          <IndicatorCard
            v-for="indicator in indicators"
            :key="indicator.id"
            :index="indicator.id"
            :title="indicator.title"
            :metrics="indicator.metrics"
            variant="simple"
            @click="selectedIndicatorId = indicator.id"
          />
        </div>

        <template v-else>
          <div class="compare-section-actions">
            <Button
              text="Mostrar Indicadores"
              textsize="13px"
              :icon="true"
              :iconPath="arrowDownIcon"
              icon-direction="down"
              @click="selectedIndicatorId = null"
            />
          </div>

          <SummaryCard class="compare-summary-card">
            <div class="indicator-summary">
              <div class="indicator-summary__title-row">
                <span aria-hidden="true">!</span>
                <h2>{{ selectedIndicator.summaryTitle }}</h2>
              </div>
              <p>{{ selectedIndicator.summary }}</p>
            </div>
          </SummaryCard>

          <div class="compare-columns">
            <article
              v-for="country in countryWithDetail"
              :key="country.id"
              class="comparison-detail-card comparison-detail-card--indicator"
            >
              <header>
                <span>
                  <img :src="getFlagPath(country.flagAsset)" :alt="`Bandeira de ${country.name}`" />
                  {{ country.name }}
                </span>
              </header>

              <section class="compare-indicator-value">
                <h3>Valor reportado</h3>
                <strong>{{ getComparableIndicatorDetail(country, selectedIndicator).value }}</strong>
              </section>

              <section class="compare-indicator-metrics">
                <h3>Métricas</h3>
                <dl>
                  <div
                    v-for="metric in getComparableIndicatorDetail(country, selectedIndicator).metrics"
                    :key="`${country.id}-${metric.label}`"
                  >
                    <dt>{{ metric.label }}</dt>
                    <dd>{{ metric.value }}</dd>
                  </div>
                </dl>
              </section>
            </article>
          </div>
        </template>
      </section>

      <div class="compare-actions">
        <Button
          text="Voltar"
          textsize="13px"
          :icon="true"
          :iconPath="arrowDownIcon"
          icon-position="left"
          icon-direction="left"
          @click="goBack"
        />

        <Button
          text="Exportar"
          textsize="13px"
          :icon="true"
          :iconPath="downloadIcon"
          :exportable="true"
          @export="handleExport"
        />
      </div>
    </template>
  </section>
</template>

<style scoped>
.compare-page {
  width: min(1050px, calc(100% - 48px));
  margin: 0 auto 72px;
  font-family: var(--font-primary);
  overflow: visible;
}

.compare-hero {
  min-height: 116px;
  margin: 26px 0 26px;
  padding: 24px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  border-radius: 8px;
  background: var(--bg-blue);
  color: #ffffff;
  box-shadow: 0 8px 18px rgba(16, 29, 66, 0.18);
}

.compare-hero p,
.compare-hero h1 {
  margin: 0;
}

.compare-hero p {
  color: var(--bg-yellow);
  font-size: 13px;
  font-weight: 800;
}

.compare-hero h1 {
  margin-top: 8px;
  font-size: 30px;
  line-height: 1.1;
}

.compare-hero__flags {
  display: flex;
  align-items: center;
}

.compare-hero__flags img {
  width: 54px;
  height: 54px;
  border: 3px solid #ffffff;
  border-radius: 50%;
  object-fit: cover;
}

.compare-hero__flags img + img {
  margin-left: -12px;
}

.compare-tabs {
  display: flex;
  justify-content: center;
  gap: 64px;
  margin: 20px 0 48px;
}

.compare-tabs__item {
  border: 0;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: #6c6c6c;
  padding: 8px 4px;
  font: inherit;
  font-size: 17px;
  font-weight: 800;
  cursor: pointer;
}

.compare-tabs__item--active {
  border-color: #6c6c6c;
  color: #3f3f3f;
}

.summary-panel,
.compare-detail-section {
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.compare-section-actions {
  display: flex;
  justify-content: flex-start;
}

.country-progress-grid,
.compare-columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(280px, 1fr));
  gap: 42px;
}

.country-progress-card,
.comparison-country-card {
  border-radius: 8px;
  background: var(--bg-blue);
  color: #ffffff;
  box-shadow: 0 7px 16px rgba(0, 0, 0, 0.24);
}

.country-progress-card {
  min-height: 210px;
  padding: 16px 26px 26px;
}

.country-progress-card header,
.comparison-country-card header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px;
  background: rgba(35, 75, 138, 0.56);
}

.country-progress-card header {
  padding: 4px 12px;
}

.country-progress-card img,
.comparison-country-card img {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
}

.country-progress-card h2 {
  margin: 0;
  font-size: 26px;
}

.country-progress-card > strong {
  display: block;
  margin: 44px 0 14px;
  text-align: center;
  font-size: 34px;
}

.country-progress-card__track {
  height: 6px;
  border-radius: 999px;
  background: #d7ddf2;
}

.country-progress-card__track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: #8ea6dd;
}

.country-progress-card p {
  margin: 12px 0 0;
  font-size: 14px;
  font-weight: 800;
}

.compare-summary-card {
  min-height: 0;
}

.compare-summary-card--chart {
  min-height: 280px;
}

.summary-charts-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(280px, 1fr);
  gap: 18px;
}

.milestones-comparison {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 42px;
}

.milestones-comparison__item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.milestones-comparison__item strong {
  color: var(--text-blue-dark);
  font-size: 22px;
}

.milestones-comparison__bar {
  width: 100%;
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: #d8e2ff;
}

.milestones-comparison__bar span {
  display: block;
  height: 100%;
  background: var(--bg-blue);
}

.compare-summary-card--chart :deep(.summary-card__body) {
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-width: 0;
}

.compare-summary-card--chart :deep(.pie-chart-wrapper) {
  width: 100%;
  max-width: 100%;
  justify-content: center;
  gap: 22px;
  padding: 10px 0 0;
}

.compare-summary-card--chart :deep(.legend) {
  min-width: 0;
}

.compare-summary-card--chart :deep(.legend-label) {
  white-space: normal;
}

.compare-summary-card--chart :deep(.bar-chart-wrapper) {
  min-width: 0;
  max-width: 100%;
  padding: 8px 0 0;
  align-items: center;
}

.compare-summary-card--chart :deep(.bars-container) {
  width: 100%;
  justify-content: center;
  gap: 18px;
}

.compare-summary-card--chart :deep(.bar) {
  width: 62px;
}

.pillars-grid,
.indicators-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(220px, 1fr));
  gap: 22px 30px;
}

.compare-summary-card__content {
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 18px;
}

.compare-summary-card__content img {
  width: 34px;
  height: 34px;
}

.compare-summary-card__content h2,
.indicator-summary h2 {
  margin: 0 0 12px;
  color: #000000;
  font-size: 18px;
}

.compare-summary-card__content p,
.indicator-summary p {
  margin: 0;
  color: #000000;
  font-size: 16px;
  line-height: 1.35;
  white-space: pre-line;
}

.comparison-country-card {
  min-height: 150px;
  padding: 14px 22px 24px;
}

.comparison-country-card header {
  padding: 6px 10px;
}

.comparison-country-card header span {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 800;
}

.comparison-country-card > strong {
  display: block;
  margin-top: 30px;
  color: #ffffff;
  text-align: center;
  font-size: 34px;
}

.comparison-country-card p {
  margin: 16px 0 0;
  text-align: center;
  font-weight: 800;
}

.comparison-detail-card {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 18px;
  border: 1px solid #dddddd;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.14);
}

.comparison-detail-card header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.comparison-detail-card header span {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #000000;
  font-size: 16px;
  font-weight: 800;
}

.comparison-detail-card header img {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.comparison-detail-card header em {
  color: #555555;
  font-size: 11px;
  font-style: normal;
  font-weight: 800;
  text-align: right;
}

.compare-rule-card,
.compare-area-card,
.compare-milestones-card,
.compare-indicator-value,
.compare-indicator-metrics {
  border-radius: 8px;
  background: #f8f8f8;
  padding: 18px;
}

.compare-rule-card h3,
.compare-area-card h3,
.compare-milestones-card h3,
.compare-indicator-value h3,
.compare-indicator-metrics h3 {
  margin: 0 0 12px;
  color: #000000;
  font-size: 14px;
  font-weight: 800;
}

.compare-rule-card > strong,
.compare-milestones-card > strong,
.compare-indicator-value > strong {
  display: block;
  color: var(--text-blue-dark);
  font-size: 30px;
  text-align: center;
}

.compare-rule-card__track {
  position: relative;
  height: 12px;
  margin: 16px 0;
  overflow: hidden;
  border-radius: 2px;
  background: #e3e3e3;
}

.compare-rule-card__track span {
  display: block;
  height: 100%;
  background: var(--bg-blue);
}

.compare-rule-card__track i {
  position: absolute;
  top: -4px;
  bottom: -4px;
  left: 37%;
  width: 1px;
  background: #000000;
}

.compare-rule-card dl {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin: 0;
}

.compare-rule-card dt,
.compare-rule-card dd {
  margin: 0;
  text-align: center;
  font-size: 10px;
}

.compare-rule-card dt {
  color: #777777;
}

.compare-rule-card dd {
  color: #000000;
  font-weight: 800;
}

.compare-area-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.compare-area-row div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: #000000;
  font-size: 11px;
  font-weight: 800;
}

.compare-area-row strong {
  color: #777777;
}

.compare-area-row p {
  height: 6px;
  margin: 4px 0 0;
  overflow: hidden;
  border-radius: 999px;
  background: #dddddd;
}

.compare-area-row p span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--bg-blue);
}

.compare-milestones-card p {
  margin: 8px 0 0;
  color: #000000;
  text-align: center;
  font-size: 13px;
  font-weight: 800;
}

.comparison-detail-card--indicator {
  gap: 18px;
}

.compare-indicator-value > strong {
  overflow-wrap: anywhere;
}

.compare-indicator-metrics dl {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
}

.compare-indicator-metrics div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid #dddddd;
  padding-bottom: 10px;
}

.compare-indicator-metrics dt,
.compare-indicator-metrics dd {
  margin: 0;
  color: #000000;
  font-size: 12px;
  font-weight: 800;
}

.compare-indicator-metrics dd {
  color: var(--text-blue-dark);
  text-align: right;
}

.indicator-summary {
  width: 100%;
}

.indicator-summary__title-row {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.indicator-summary__title-row span {
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  background: #000000;
  color: #ffffff;
  font-weight: 800;
}

.compare-actions {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  margin-top: 24px;
}

.state-text {
  margin: 48px 0;
  color: var(--text-gray);
}

.state-text--error {
  color: #b42318;
}

@media (max-width: 900px) {
  .country-progress-grid,
  .compare-columns,
  .milestones-comparison,
  .summary-charts-grid,
  .pillars-grid,
  .indicators-grid {
    grid-template-columns: 1fr;
  }

  .country-progress-grid,
  .compare-columns {
    gap: 22px;
  }

  .compare-tabs {
    gap: 28px;
    overflow-x: auto;
    justify-content: flex-start;
  }
}

@media (max-width: 640px) {
  .compare-page {
    width: min(360px, calc(100% - 32px));
  }

  .compare-hero {
    align-items: flex-start;
    flex-direction: column;
  }

  .compare-hero h1 {
    font-size: 24px;
  }

  .country-progress-card,
  .comparison-country-card {
    padding-left: 16px;
    padding-right: 16px;
  }

  .country-progress-card h2 {
    font-size: 20px;
  }

  .country-progress-card > strong,
  .comparison-country-card > strong {
    font-size: 28px;
  }

  .compare-summary-card--chart {
    min-height: 0;
  }

  .compare-summary-card--chart :deep(.pie-chart-wrapper) {
    flex-direction: column;
    gap: 14px;
  }

  .compare-summary-card--chart :deep(.bar-chart-wrapper) {
    gap: 14px;
  }

  .compare-summary-card--chart :deep(.bars-container) {
    gap: 14px;
    min-height: 130px !important;
  }

  .compare-summary-card--chart :deep(.bar) {
    width: 46px;
  }

  .compare-summary-card--chart :deep(.bar-value) {
    font-size: 12px;
  }

  .compare-summary-card--chart :deep(.legend) {
    justify-content: flex-start;
    gap: 12px;
  }

  .compare-summary-card--chart :deep(.legend-dot) {
    width: 14px;
    height: 14px;
  }

  .compare-summary-card--chart :deep(.legend-label) {
    font-size: 12px;
  }

  .compare-summary-card__content {
    grid-template-columns: 1fr;
  }

  .comparison-detail-card header {
    align-items: flex-start;
    flex-direction: column;
  }

  .compare-rule-card dl {
    display: grid;
  }

  .compare-rule-card dt,
  .compare-rule-card dd {
    text-align: left;
  }

  .compare-indicator-metrics div {
    flex-direction: column;
    gap: 4px;
  }

  .compare-indicator-metrics dd {
    text-align: left;
  }

  .compare-actions {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
