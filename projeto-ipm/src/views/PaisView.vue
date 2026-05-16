<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '@/components/Button.vue'
import ComparePopUp from '@/components/ComparePopUp.vue'
import UltimosAvancos from '@/components/UltimosAvancos.vue'
import HalfCircle from '@/components/graphs/HalfCircleGraph.vue'
import Tooltip from '@/components/Tooltip.vue' 

import arrowDownIcon from '@/assets/arrow-down.svg'
import compareIcon from '@/assets/compare-icon.svg'
import downloadIcon from '@/assets/Download.svg'
import { getCountries, getCountryById, getCountryDetail, getCountryDetails } from '@/services/api'

const route = useRoute()
const router = useRouter()

const country = ref(null)
const countryDetail = ref(null)
const countryDetails = ref([])
const allCountries = ref([])
const isLoading = ref(true)
const errorMessage = ref('')
const isComparePopUpOpen = ref(false)

const countryId = computed(() => String(route.params.countryId ?? ''))

const getFlagPath = (flagAsset) => {
  return new URL(`../assets/flags/${flagAsset}.svg`, import.meta.url).href
}

const fallbackDetail = computed(() => {
  const evolution = country.value?.evolution ?? 0
  const countryPercentage = Math.min(92, Math.max(55, evolution + 10))

  return {
    completedGoals: {
      percentage: evolution,
      completed: Math.round((evolution / 100) * 52),
      total: 52,
    },
    distribution: {
      countryPercentage,
      euPercentage: 100 - countryPercentage,
    },
    metrics: {
      totalDisbursed: '---',
      grantsRequested: '---',
      loansAwarded: '---',
      allocationVsGdp: '---',
    },
    updates: [],
  }
})

const detail = computed(() => countryDetail.value ?? fallbackDetail.value)
const hasCountryDetail = computed(() => Boolean(countryDetail.value))

const compareCountries = computed(() =>
  allCountries.value
    .filter((item) => countryDetails.value.some((detail) => detail.countryId === item.id))
    .map((item) => ({
      name: item.name,
      flagSrc: getFlagPath(item.flagAsset),
    })),
)

const progressWidth = computed(
  () => `${detail.value.completedGoals.percentage}%`,
)

const loadCountry = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const [countryResponse, detailResponse, countriesResponse, countryDetailsResponse] =
      await Promise.all([
        getCountryById(countryId.value),
        getCountryDetail(countryId.value),
        getCountries(),
        getCountryDetails(),
      ])

    if (!countryResponse) {
      errorMessage.value = 'Não encontrámos dados para este país.'
      country.value = null
      countryDetail.value = null
      return
    }

    country.value = countryResponse
    countryDetail.value = detailResponse
    allCountries.value = countriesResponse
    countryDetails.value = countryDetailsResponse
  } catch (error) {
    errorMessage.value = 'Não foi possível carregar os detalhes do país.'
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.push('/paises')
}

const goToMoreDetails = () => {
  router.push(`/paises/${countryId.value}/mais`)
}

const openComparePopUp = () => {
  isComparePopUpOpen.value = true
}

const closeComparePopUp = () => {
  isComparePopUpOpen.value = false
}

const onCompareCountries = (selectedCountries) => {
  const selectedIds = selectedCountries
    .map((countryName) => allCountries.value.find((item) => item.name === countryName)?.id)
    .filter(Boolean)

  closeComparePopUp()

  if (selectedIds.length === 2) {
    router.push(`/comparar/${selectedIds[0]}/${selectedIds[1]}`)
  }
}

onMounted(loadCountry)
watch(countryId, loadCountry)
</script>

<template>
  <section class="country-page">
    <p v-if="isLoading" class="state-text">A carregar país...</p>

    <p v-else-if="errorMessage" class="state-text state-text--error">
      {{ errorMessage }}
    </p>

    <template v-else-if="country">
      <header class="country-hero">
        <img
          class="country-hero__flag"
          :src="getFlagPath(country.flagAsset)"
          :alt="`Bandeira de ${country.name}`"
        />

        <h1 class="country-hero__title">
          {{ country.name }}
        </h1>
      </header>

      <div class="country-actions country-actions--top">
        <Button
          text="Voltar"
          textsize="13px"
          :icon="true"
          :iconPath="arrowDownIcon"
          icon-position="left"
          icon-direction="left"
          @click="goBack"
        />

        <div class="country-actions__right">
          <Button
            text="Comparar"
            textsize="13px"
            :icon="true"
            :iconPath="compareIcon"
            @click="openComparePopUp"
          />

          <Button
            text="Exportar"
            textsize="13px"
            :icon="true"
            :iconPath="downloadIcon"
            :exportable="true"
          />
        </div>
      </div>

      <ComparePopUp
        v-if="isComparePopUpOpen"
        :countries="compareCountries"
        :locked-country="country.name"
        title="Comparar com outro país"
        :description="`${country.name} já está selecionado. Escolha mais um país para comparar.`"
        @back="closeComparePopUp"
        @compare="onCompareCountries"
      />

      <section class="summary-grid" aria-label="Resumo do país">
        <div class="summary-top">
          <article class="distribution-card">
            <h2>
              Como o Plano de Recuperação e Resiliência é distribuído?
            </h2>

            <HalfCircle
              :primary-pct="detail.distribution.countryPercentage"
              :label="country.name"
              primary-label=""
              secondary-label=""
              :svg-size="180"
              :stroke-width="12"
            />
          </article>

          <div class="summary-top__cards">
            <article class="metric-card">
              <span class="metric-card__label">
                Total Desembolsado
              </span>

              <strong>
                {{ detail.metrics.totalDisbursed }}
              </strong>
            </article>

            <article class="goals-card">
              <h2>Metas Concluídas</h2>

              <div class="goals-card__value-row">
                <span class="goals-card__percentage">
                  {{ detail.completedGoals.percentage }}%
                </span>

                <span class="goals-card__count">
                  {{ detail.completedGoals.completed }}/{{ detail.completedGoals.total }}
                </span>
              </div>

              <div class="goals-card__bar" aria-hidden="true">
                <span :style="{ width: progressWidth }"></span>
              </div>
            </article>
          </div>
        </div>

        <div class="summary-bottom">
          <article class="metric-card">
            <span class="metric-card__label">
              Total de Apoios a Fundo Perdido
            </span>

            <strong>
              {{ detail.metrics.grantsRequested }}
            </strong>
          </article>

          <article class="metric-card">
            <span class="metric-card__label">
              Total de Empréstimos Atribuídos
            </span>

            <strong>
              {{ detail.metrics.loansAwarded }}
            </strong>
          </article>

          <article class="metric-card metric-card--info">
            <div class="metric-card__label-row">
              <span class="metric-card__label">
                Alocação do PRR em relação ao PIB
              </span>
              
              <Tooltip 
                title="Produto Interno Bruto (PIB):"
                text="Medida padrão do valor agregado criado por meio da produção de bens e serviços em um país durante um determinado período."
              />
            </div>

            <strong>
              {{ detail.metrics.allocationVsGdp }}
            </strong>
          </article>
        </div>
      </section>

      <UltimosAvancos
        v-if="detail.updates.length"
        class="country-timeline"
        :items="detail.updates"
        :initial-count="3"
      />

      <section v-else class="empty-updates" aria-live="polite">
        <h2>Últimos avanços</h2>

        <p>
          Ainda não há atualizações detalhadas disponíveis para
          {{ country.name }}.
        </p>
      </section>

      <div class="country-actions country-actions--bottom">
        <Button
          text="Ver Mais"
          textsize="13px"
          :icon="true"
          :iconPath="arrowDownIcon"
          icon-direction="right"
          :disabled="!hasCountryDetail"
          @click="goToMoreDetails"
        />
      </div>
    </template>
  </section>
</template>

<style scoped>
.country-page {
  width: 100%;
  padding: 0 0 64px;
  font-family: var(--font-primary);
}

.state-text {
  color: var(--text-gray);
  font-size: 1rem;
}

.state-text--error {
  color: #b42318;
}

.country-hero {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
  margin: 0 0 46px;
  padding: 56px max(20px, calc((100% - 1200px) / 2 + 20px));
  background: linear-gradient(
    135deg,
    var(--bg-blue-dark) 0%,
    var(--bg-blue) 100%
  );
}

.country-hero__flag {
  width: 150px;
  height: 100px;
  border-radius: 9px;
  object-fit: cover;
  box-shadow:
    8px 0 0 #ffffff,
    9px 0 0 var(--text-gray-light);
}

.country-hero__title {
  color: var(--text-white);
  font-size: clamp(2.5rem, 5vw, 4.1rem);
  font-weight: 800;
  line-height: 1;
}

.country-actions {
  width: min(100% - 40px, 1200px);
  margin-left: auto;
  margin-right: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.country-actions--top {
  margin-bottom: 48px;
}

.country-actions--bottom {
  justify-content: flex-end;
  margin-top: 22px;
}

.country-actions__right {
  display: flex;
  gap: 10px;
}

.summary-grid {
  width: min(100% - 40px, 1200px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.summary-top {
  display: grid;
  grid-template-columns: 2.4fr 1fr;
  gap: 22px;
  align-items: stretch;
}

.summary-top__cards {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.summary-bottom {
  display: grid;
  grid-template-columns: 1.1fr 2.4fr 1fr;
  gap: 22px;
  align-items: start;
}

.goals-card,
.distribution-card,
.metric-card {
  min-height: 90px;
  border: 1px solid var(--text-gray-light);
  border-radius: 8px;
  background: var(--bg-white);
  box-shadow: 0 8px 16px rgba(16, 29, 66, 0.17);
}

.goals-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  padding: 16px 20px;
  background: var(--bg-blue-dark);
  border-color: var(--bg-blue-dark);
  color: var(--text-white);
}

.goals-card h2,
.distribution-card h2 {
  font-size: 0.9rem;
  line-height: 1.25;
}

.goals-card h2 {
  color: var(--text-blue-neon);
  margin-bottom: 14px;
}

.goals-card__value-row {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 16px;
}

.goals-card__percentage {
  color: var(--text-blue-neon);
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
}

.goals-card__count {
  color: var(--text-purple-light);
  font-size: 0.72rem;
  font-weight: 800;
}

.goals-card__bar {
  width: 100%;
  height: 6px;
  margin-top: 14px;
  border-radius: 999px;
  background: var(--text-purple-light);
  overflow: hidden;
}

.goals-card__bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--text-blue-neon);
}

.distribution-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 22px;
  justify-content: space-between;
}

.distribution-card h2 {
  color: var(--text-black);
  margin-bottom: 18px;
  align-self: flex-start;
}

.distribution-card :deep(.legend) {
  display: none;
}

.metric-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 22px;
  padding: 18px 22px;
}

.summary-top__cards .metric-card {
  flex: 1;
}

.metric-card__label-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.metric-card__label {
  max-width: 170px;
  color: var(--text-gray);
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.05;
}

.metric-card strong {
  color: var(--text-blue-dark);
  font-size: clamp(1.65rem, 3vw, 2.35rem);
  font-weight: 800;
  line-height: 1;
}

.country-timeline {
  width: min(100% - 40px, 1200px);
  margin-top: 34px;
}

.empty-updates {
  width: min(100% - 40px, 1200px);
  margin: 34px auto 0;
  padding: 28px 32px;
  border: 1px solid var(--light-blue);
  border-radius: 8px;
  background: var(--bg-white);
  box-shadow: 0 4px 14px rgba(18, 38, 85, 0.12);
}

.empty-updates h2 {
  color: var(--text-blue-dark);
  font-size: clamp(1.35rem, 1.9vw, 1.8rem);
  font-weight: 800;
  margin-bottom: 10px;
}

.empty-updates p {
  color: var(--text-gray);
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.5;
}

@media (max-width: 980px) {
  .country-page {
    padding-top: 0;
  }

  .country-hero {
    margin-bottom: 48px;
  }

  .summary-top {
    grid-template-columns: 1fr;
  }

  .summary-bottom {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .country-page {
    padding: 0 0 48px;
  }

  .country-hero {
    align-items: flex-start;
    gap: 14px;
    margin-bottom: 28px;
    padding: 34px 16px;
  }

  .country-hero__flag {
    width: 96px;
    height: 64px;
  }

  .country-actions {
    align-items: flex-start; 
  }

  .country-actions__right {
    align-items: stretch;
    width: 100%; 
  }

  .country-actions--top {
    flex-direction: column;
    margin-bottom: 24px;
    align-items: flex-start; 
  }

  .country-actions,
  .summary-grid,
  .country-timeline,
  .empty-updates {
    width: calc(100% - 32px);
  }

  .summary-bottom {
    grid-template-columns: 1fr;
  }

  .metric-card {
    min-height: 88px;
  }
}
</style>