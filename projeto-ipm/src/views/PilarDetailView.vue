<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '@/components/Button.vue'
import PilaresCards from '@/components/PilaresCards.vue'
import SearchBar from '@/components/SearchBar.vue'
import SummaryCard from '@/components/SummaryCard.vue'
import arrowDownIcon from '@/assets/arrow-down.svg'
import downloadIcon from '@/assets/Download.svg'
import { getAllCountryPillars, getCountries, getPillarById, getPillars } from '@/services/api'
import { exportData } from '@/services/exporter'

const route = useRoute()
const router = useRouter()

const pillar = ref(null)
const pillars = ref([])
const countries = ref([])
const countryPillars = ref([])
const countrySearchQuery = ref('')
const isPillarGridOpen = ref(false)
const isLoading = ref(true)
const errorMessage = ref('')

const pillarId = computed(() => String(route.params.pillarId ?? ''))

const getPilarAssetName = (asset) => asset?.replace('pilar-', '') ?? ''

const getPilarIconPath = (asset) => {
  return new URL(`../assets/pilares/${asset}.svg`, import.meta.url).href
}

const getFlagPath = (flagAsset) => {
  return new URL(`../assets/flags/${flagAsset}.svg`, import.meta.url).href
}

const getExecutionValue = (country) => {
  const value = Number.parseFloat(String(country.evolution ?? 0).replace(',', '.'))

  return Number.isNaN(value) ? 0 : value
}

const getInvestmentSortValue = (investment) => {
  const normalizedValue = String(investment ?? '')
    .replace(/[^\d,.-]/g, '')
    .replace(',', '.')
  const value = Number.parseFloat(normalizedValue)

  return Number.isNaN(value) ? 0 : value
}

const stats = computed(() => {
  const globalStats = pillar.value?.globalStats ?? {}

  return [
    {
      title: 'Marcos totais a nível europeu',
      value: globalStats.milestones ?? 'Dados em atualização',
    },
    {
      title: 'Total investido pela União Europeia',
      value: globalStats.investment ?? 'Dados em atualização',
    },
    {
      title: 'Percentagem de execução pela União Europeia',
      value: globalStats.execution ?? 'Dados em atualização',
    },
  ]
})

const getCountryPillarInvestment = (countryId) => {
  const countryPillar = countryPillars.value.find((item) => item.countryId === countryId)
  const pillarDetail = countryPillar?.pillars?.find((item) => item.pillarId === pillarId.value)
  const leaderboardDetail = pillar.value?.globalStats?.leaderboard?.find((item) => item.countryId === countryId)

  return pillarDetail?.investment ?? leaderboardDetail?.investment ?? 'Dados em atualização'
}

const rankedCountries = computed(() =>
  [...countries.value]
    .map((country) => ({
      ...country,
      investment: getCountryPillarInvestment(country.id),
    }))
    .sort((a, b) =>
      getInvestmentSortValue(b.investment) - getInvestmentSortValue(a.investment) ||
      getExecutionValue(b) - getExecutionValue(a) ||
      a.name.localeCompare(b.name),
    )
    .map((country, index) => ({
      ...country,
      rank: index + 1,
    })),
)

const filteredCountries = computed(() => {
  const searchTerm = countrySearchQuery.value.trim().toLowerCase()

  if (!searchTerm) return rankedCountries.value

  return rankedCountries.value
    .filter((country) =>
      country.name.toLowerCase().includes(searchTerm) ||
      (country.nameEn ?? '').toLowerCase().includes(searchTerm),
    )
})

const exportRows = computed(() => [
  ...stats.value.map((item) => ({
    secção: 'Resumo europeu',
    indicador: item.title,
    valor: item.value,
  })),
])

const loadPillar = async () => {
  isLoading.value = true
  errorMessage.value = ''
  isPillarGridOpen.value = false

  try {
    const [pillarResponse, pillarsResponse, countriesResponse, countryPillarsResponse] = await Promise.all([
      getPillarById(pillarId.value),
      getPillars(),
      getCountries(),
      getAllCountryPillars(),
    ])

    if (!pillarResponse) {
      pillar.value = null
      pillars.value = pillarsResponse
      countries.value = countriesResponse
      countryPillars.value = countryPillarsResponse
      errorMessage.value = 'Não encontrámos dados para este pilar.'
      return
    }

    pillar.value = pillarResponse
    pillars.value = pillarsResponse
    countries.value = countriesResponse
    countryPillars.value = countryPillarsResponse
  } catch (error) {
    errorMessage.value = 'Não foi possível carregar os dados deste pilar.'
  } finally {
    isLoading.value = false
  }
}

const selectPillar = (selectedPillarId) => {
  isPillarGridOpen.value = false
  router.push(`/pilares/${selectedPillarId}`)
}

const togglePillarGrid = () => {
  isPillarGridOpen.value = !isPillarGridOpen.value
}

const onCountrySearch = (query) => {
  countrySearchQuery.value = query
}

const goToCountryPillar = (countryId) => {
  if (!pillar.value) return

  router.push({
    path: `/paises/${countryId}/mais/pilares`,
    query: { pilar: pillar.value.id },
  })
}

const handleExport = (format) => {
  if (!pillar.value) return

  exportData({
    format,
    filename: `pilar-${pillar.value.name}`,
    title: `Pilar ${pillar.value.name}`,
    data: exportRows.value,
    metadata: {
      pilar: pillar.value.name,
      percentagem: `${pillar.value.percentage}%`,
      dataExportacao: new Date().toLocaleDateString('pt-PT'),
    },
  })
}

onMounted(loadPillar)
watch(pillarId, loadPillar)
</script>

<template>
  <section class="pillar-detail-page">
    <p v-if="isLoading" class="state-text">A carregar pilar...</p>

    <p v-else-if="errorMessage" class="state-text state-text--error">
      {{ errorMessage }}
    </p>

    <div v-else-if="pillar" class="pillar-detail">
      <div class="pillar-detail__actions">
        <Button
          text="Mostrar Pilares"
          textsize="13px"
          :icon="true"
          :iconPath="arrowDownIcon"
          :icon-direction="isPillarGridOpen ? 'up' : 'down'"
          @click="togglePillarGrid"
        />
      </div>

      <div
        v-if="isPillarGridOpen"
        class="pillars-grid pillars-grid--selector"
        aria-label="Escolher pilar"
      >
        <PilaresCards
          v-for="pilar in pillars"
          :key="pilar.id"
          :title="pilar.name"
          :pilar="getPilarAssetName(pilar.asset)"
          :percentage="pilar.percentage"
          @select="selectPillar(pilar.id)"
        />
      </div>

      <SummaryCard class="pillar-summary">
        <div class="pillar-summary__content">
          <img
            class="pillar-summary__icon"
            :src="getPilarIconPath(pillar.asset)"
            :alt="pillar.name"
          />

          <div class="pillar-summary__copy">
            <h1>{{ pillar.name }}</h1>
            <p>{{ pillar.summary }}</p>
          </div>
        </div>
      </SummaryCard>

      <div class="pillar-detail__toolbar">
        <Button
          text="Exportar"
          textsize="13px"
          :icon="true"
          :iconPath="downloadIcon"
          :exportable="true"
          @export="handleExport"
        />
      </div>

      <div class="stats-grid" aria-label="Resumo europeu do pilar">
        <article v-for="item in stats" :key="item.title" class="stat-card">
          <h2>{{ item.title }}</h2>
          <p>{{ item.value }}</p>
        </article>
      </div>

      <section class="countries-section" aria-labelledby="countries-title">
        <div class="countries-heading">
          <div>
            <h2 id="countries-title">Países</h2>
            <p>Estados-Membros com dados disponíveis para navegar neste pilar.</p>
          </div>

          <SearchBar
            class="countries-search"
            placeholder="Pesquisar por país"
            height="36px"
            width="100%"
            @search="onCountrySearch"
          />
        </div>

        <div class="countries-list" aria-label="Lista de países">
          <button
            v-for="country in filteredCountries"
            :key="country.id"
            :class="['country-mini-card', country.rank === 1 ? 'country-mini-card--gold' : country.rank === 2 ? 'country-mini-card--silver' : country.rank === 3 ? 'country-mini-card--bronze' : '']"            type="button"
            @click="goToCountryPillar(country.id)"
          >
            <span class="country-mini-card__identity">
              <span class="country-mini-card__rank">#{{ country.rank }}</span>
              <img
                :src="getFlagPath(country.flagAsset)"
                :alt="`Bandeira de ${country.name}`"
              />
              <strong>{{ country.name }}</strong>
            </span>

            <span class="country-mini-card__metrics">
              <span class="country-mini-card__meta">
                <span>{{ country.investment }}</span>
                <small>Total de investimento</small>
              </span>

              <span class="country-mini-card__meta">
                <span>{{ country.evolution }}%</span>
                <small>Execução geral</small>
              </span>
            </span>
          </button>
        </div>

        <p v-if="!filteredCountries.length" class="countries-empty">Sem resultados.</p>
      </section>
    </div>
  </section>
</template>

<style scoped>
.pillar-detail-page {
  width: 100%;
  font-family: var(--font-primary);
}

.pillar-detail {
  width: min(1380px, calc(100% - 72px));
  margin: 78px auto 96px;
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.pillar-detail__actions {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.pillars-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.pillars-grid--selector {
  margin: 14px 0 18px;
}

.pillar-summary {
  min-height: 170px;
  padding: 26px 30px;
  border: 1px solid #dddddd;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.14);
}

.pillar-summary :deep(.summary-card__body) {
  justify-content: flex-start;
  align-items: stretch;
}

.pillar-summary__content {
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 18px;
  align-items: flex-start;
}

.pillar-summary__icon {
  width: 34px;
  height: 34px;
  object-fit: contain;
}

.pillar-summary__copy h1 {
  margin: 4px 0 22px;
  color: var(--text-blue-dark);
  font-size: 18px;
  font-weight: 800;
  line-height: 1.2;
}

.pillar-summary__copy p {
  margin: 0;
  color: #000000;
  font-size: 17px;
  line-height: 1.32;
  white-space: pre-line;
}

.pillar-detail__toolbar {
  display: flex;
  justify-content: flex-end;
  margin: 2px 0 -6px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 34px;
}

.stat-card {
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  padding: 20px 24px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 5px 14px rgba(0, 0, 0, 0.14);
}

.stat-card h2 {
  margin: 0;
  color: var(--text-gray);
  font-size: 14px;
  font-weight: 800;
  line-height: 1.25;
}

.stat-card p {
  margin: 0;
  color: var(--text-blue-dark);
  font-size: 28px;
  font-weight: 900;
  line-height: 1;
}

.countries-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 42px;
}

.countries-heading {
  display: grid;
  grid-template-columns: 1fr minmax(260px, 360px);
  gap: 18px;
  align-items: end;
}

.countries-heading h2 {
  margin: 0;
  color: #000000;
  font-size: 18px;
  font-weight: 900;
}

.countries-heading p {
  margin: 5px 0 0;
  color: var(--text-gray);
  font-size: 11px;
  line-height: 1.35;
}

.countries-search {
  width: 100%;
}

.countries-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.country-mini-card {
  min-height: 96px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  color: #000000;
  cursor: pointer;
  font-family: var(--font-primary);
  text-align: left;
  transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
}

.country-mini-card:hover {
  border-color: var(--bg-blue-light);
  box-shadow: 0 8px 18px rgba(16, 29, 66, 0.14);
  transform: translateY(-2px);
}

.country-mini-card:focus-visible {
  outline: 2px solid var(--text-blue-neon);
  outline-offset: 2px;
}

.country-mini-card__identity {
  min-width: 0;
  flex: 1;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.country-mini-card__rank {
  min-width: 34px;
  color: var(--text-gray);
  font-size: 12px;
  font-weight: 900;
}

.country-mini-card__identity img {
  width: 30px;
  height: 22px;
  flex-shrink: 0;
  border-radius: 4px;
  object-fit: cover;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
}

.country-mini-card__identity strong {
  overflow: hidden;
  color: var(--text-blue-dark);
  font-size: 14px;
  font-weight: 800;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.country-mini-card__metrics {
  flex-shrink: 0;
  display: flex;
  align-items: flex-end;
  gap: 14px;
}

.country-mini-card__meta {
  min-width: 78px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
}

.country-mini-card__meta span {
  color: var(--text-blue-dark);
  font-size: 15px;
  font-weight: 900;
  line-height: 1.1;
  white-space: nowrap;
}

.country-mini-card__meta small {
  color: var(--text-gray);
  font-size: 10px;
  font-weight: 700;
  line-height: 1.15;
  text-align: right;
}

.countries-empty {
  margin: 0;
  color: var(--text-gray);
  font-size: 13px;
}

.state-text {
  width: min(1380px, calc(100% - 72px));
  margin: 78px auto 96px;
  color: var(--text-gray);
  font-family: var(--font-primary);
}

.state-text--error {
  color: #b42318;
}

@media (max-width: 1180px) {
  .pillar-detail,
  .state-text {
    width: min(720px, calc(100% - 40px));
  }

  .pillars-grid,
  .stats-grid,
  .countries-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 22px;
  }

  .countries-heading {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .pillar-detail,
  .state-text {
    width: min(340px, calc(100% - 32px));
    margin-top: 44px;
  }

  .pillars-grid,
  .stats-grid,
  .countries-list {
    grid-template-columns: 1fr;
  }

  .pillar-summary {
    padding: 22px;
  }

  .pillar-summary__content {
    grid-template-columns: 1fr;
  }

  .pillar-summary__copy p {
    font-size: 15px;
  }

  .countries-heading {
    align-items: flex-start;
  }

  .country-mini-card {
    align-items: flex-start;
    flex-direction: column;
  }
  css.country-mini-card--gold {
  border-left: 6px solid #d7a400;
  }
  
  .country-mini-card--silver {
    border-left: 6px solid #aeb6c5;
  }
  
  .country-mini-card--bronze {
    border-left: 6px solid #b66b3d;
  }

  .country-mini-card__metrics {
    width: 100%;
    justify-content: space-between;
  }

  .country-mini-card__meta {
    align-items: flex-start;
  }

  .country-mini-card__meta small {
    text-align: left;
  }
}
</style>
