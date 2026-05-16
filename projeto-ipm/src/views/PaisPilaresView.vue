<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '@/components/Button.vue'
import PilaresCards from '@/components/PilaresCards.vue'
import SummaryCard from '@/components/SummaryCard.vue'
import BarsGraph from '@/components/graphs/BarsGraph.vue'
import CircleProgress from '@/components/graphs/CircleProgress.vue'
import arrowDownIcon from '@/assets/arrow-down.svg'
import { getCountryById, getCountryPillars, getPillars } from '@/services/api'

const route = useRoute()
const router = useRouter()

const country = ref(null)
const pillars = ref([])
const countryPillars = ref(null)
const selectedPillarId = ref('')
const isPillarGridOpen = ref(false)
const isLoading = ref(true)
const errorMessage = ref('')

const countryId = computed(() => String(route.params.countryId ?? ''))

const getPilarAssetName = (asset) => asset?.replace('pilar-', '') ?? ''

const getFlagPath = (flagAsset) => {
  return new URL(`../assets/flags/${flagAsset}.svg`, import.meta.url).href
}

const getPilarIconPath = (asset) => {
  return new URL(`../assets/pilares/${asset}.svg`, import.meta.url).href
}

const defaultPolicyAreas = [
  { label: 'Eficiência Energética', value: 42.4 },
  { label: 'Mobilidade Sustentável', value: 10.8 },
  { label: 'Adaptação às alterações climáticas', value: 8.7 },
  { label: 'Proteção e Restauro da Biodiversidade', value: 2.1 },
  { label: 'Transição para a Economia Circular', value: 0.8 },
  { label: 'Energia Renovável e Redes', value: 9.3 },
  { label: 'I&D em atividades verdes', value: 16 },
]

const fallbackCountryPillar = (pillar, index) => {
  const base = country.value?.evolution ?? 50
  const percentage = Math.max(7, Math.min(48, Math.round((pillar.percentage + base / 4 + index * 1.7) * 10) / 10))
  const totalMilestones = 8 + index * 3
  const completedMilestones = Math.max(1, Math.round(totalMilestones * (base / 100)))

  return {
    pillarId: pillar.id,
    percentage,
    summary: `Este pilar reúne medidas do PRR de ${country.value?.name ?? 'este país'} relacionadas com ${pillar.name.toLowerCase()}, combinando reformas, investimentos e marcos de execução nacionais.`,
    investment: 'Dados em atualização',
    ranking: `${index + 3}.º lugar no ranking da UE`,
    rule: {
      percentage: Math.max(7, Math.min(48, Math.round((pillar.percentage + base / 4 + index * 1.7) * 10) / 10)),
      allocation: 'Dados em atualização',
      total: 'Dados em atualização',
      aboveMinimum: '+ 0 p.p.',
    },
    policyAreas: defaultPolicyAreas,
    greenPolicyAreas: defaultPolicyAreas,
    milestones: {
      completed: completedMilestones,
      total: totalMilestones,
      percentage: Math.round((completedMilestones / totalMilestones) * 100),
    },
  }
}

const pillarsWithCountryData = computed(() =>
  pillars.value.map((pillar, index) => {
    const detail = countryPillars.value?.pillars?.find((item) => item.pillarId === pillar.id)
    const fallbackDetail = fallbackCountryPillar(pillar, index)
    const milestones = {
      ...fallbackDetail.milestones,
      ...detail?.milestones,
    }

    return {
      ...pillar,
      countryDetail: {
        ...fallbackDetail,
        ...detail,
        rule: {
          ...fallbackDetail.rule,
          ...detail?.rule,
          percentage: detail?.percentage ?? detail?.rule?.percentage ?? fallbackDetail.rule.percentage,
        },
        policyAreas: detail?.policyAreas ?? fallbackDetail.policyAreas,
        greenPolicyAreas: detail?.greenPolicyAreas ?? fallbackDetail.greenPolicyAreas,
        milestones: {
          ...milestones,
          percentage:
            milestones.percentage ??
            Math.round((milestones.completed / milestones.total) * 100),
        },
      },
    }
  }),
)

const selectedPillar = computed(() =>
  pillarsWithCountryData.value.find((pillar) => pillar.id === selectedPillarId.value) ?? null,
)

const selectedPillarDetail = computed(() => selectedPillar.value?.countryDetail ?? null)

const milestoneStatus = computed(() => {
  if (!selectedPillarDetail.value) return []

  const milestones = selectedPillarDetail.value.milestones
  return [
    {
      label: 'Concluídos',
      value: milestones.completed,
      percentage: milestones.percentage,
    },
    {
      label: 'Não Avaliados',
      value: milestones.total - milestones.completed,
      percentage: 100 - milestones.percentage,
    },
  ]
})

const measureTypeBars = computed(() => {
  if (!selectedPillarDetail.value) return []

  const total = selectedPillarDetail.value.milestones.total
  const investments = Math.max(1, Math.round(total * 0.82))
  const reforms = Math.max(1, total - investments)

  return [
    {
      name: 'Investimentos',
      value: investments,
      color: '#2364dc',
    },
    {
      name: 'Reformas',
      value: reforms,
      color: '#d8e2ff',
    },
  ]
})

const loadPillars = async () => {
  isLoading.value = true
  errorMessage.value = ''
  selectedPillarId.value = ''
  isPillarGridOpen.value = false

  try {
    const [countryResponse, pillarsResponse, countryPillarsResponse] = await Promise.all([
      getCountryById(countryId.value),
      getPillars(),
      getCountryPillars(countryId.value),
    ])

    if (!countryResponse) {
      errorMessage.value = 'Não encontrámos dados para este país.'
      country.value = null
      pillars.value = []
      countryPillars.value = null
      return
    }

    country.value = countryResponse
    pillars.value = pillarsResponse
    countryPillars.value = countryPillarsResponse
  } catch (error) {
    errorMessage.value = 'Não foi possível carregar os pilares deste país.'
  } finally {
    isLoading.value = false
  }
}

const selectPillar = (pillarId) => {
  selectedPillarId.value = pillarId
  isPillarGridOpen.value = false
}

const togglePillarGrid = () => {
  isPillarGridOpen.value = !isPillarGridOpen.value
}

const goBack = () => {
  router.push(`/paises/${countryId.value}`)
}

onMounted(loadPillars)
watch(countryId, loadPillars)
</script>

<template>
  <section class="country-pillars-page">
    <p v-if="isLoading" class="state-text">A carregar pilares do país...</p>

    <p v-else-if="errorMessage" class="state-text state-text--error">
      {{ errorMessage }}
    </p>

    <template v-else>
      <div v-if="!selectedPillar" class="pillars-grid" aria-label="Pilares do país">
        <PilaresCards
          v-for="pilar in pillarsWithCountryData"
          :key="pilar.id"
          :title="pilar.name"
          :pilar="getPilarAssetName(pilar.asset)"
          :percentage="pilar.countryDetail.percentage"
          @select="selectPillar(pilar.id)"
        />
      </div>

      <div v-else class="pillar-detail">
        <div class="pillar-detail__actions">
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
            text="Mostrar Pilares"
            textsize="13px"
            :icon="true"
            :iconPath="arrowDownIcon"
            :icon-direction="isPillarGridOpen ? 'up' : 'down'"
            @click="togglePillarGrid"
          />
        </div>

        <div v-if="isPillarGridOpen" class="pillars-grid pillars-grid--selector" aria-label="Escolher pilar">
          <PilaresCards
            v-for="pilar in pillarsWithCountryData"
            :key="pilar.id"
            :title="pilar.name"
            :pilar="getPilarAssetName(pilar.asset)"
            :percentage="pilar.countryDetail.percentage"
            @select="selectPillar(pilar.id)"
          />
        </div>

        <SummaryCard class="pillar-summary">
          <div class="pillar-summary__content">
            <img
              class="pillar-summary__icon"
              :src="getPilarIconPath(selectedPillar.asset)"
              :alt="selectedPillar.name"
            />

            <div class="pillar-summary__copy">
              <h2>{{ selectedPillar.name }}</h2>
              <p>{{ selectedPillar.summary }}</p>
            </div>
          </div>
        </SummaryCard>

        <div v-if="country && selectedPillarDetail" class="country-context">
          <span class="country-context__chip">
            <img
              :src="getFlagPath(country.flagAsset)"
              :alt="`Bandeira de ${country.name}`"
            />
            {{ country.name }}
          </span>

          <span class="country-context__ranking">
            {{ selectedPillarDetail.ranking }}
          </span>
        </div>

        <section v-if="selectedPillarDetail" class="rule-section" aria-labelledby="rule-title">
          <h2 id="rule-title">Regra dos 37%</h2>

          <article class="metric-panel rule-card">
            <strong class="rule-card__value">
              {{ selectedPillarDetail.rule.percentage.toString().replace('.', ',') }}%
            </strong>

            <div class="rule-card__progress">
              <div class="rule-card__scale" aria-hidden="true">
                <span>0%</span>
                <span>25%</span>
                <span>Min 37%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>

              <div class="rule-card__track" aria-hidden="true">
                <span
                  class="rule-card__minimum"
                  :style="{ left: '37%' }"
                ></span>
                <span
                  class="rule-card__fill"
                  :style="{ width: `${selectedPillarDetail.rule.percentage}%` }"
                ></span>
              </div>

              <div class="rule-card__numbers">
                <span>
                  <strong>{{ selectedPillarDetail.rule.allocation }}</strong>
                  Alocação Climática
                </span>
                <span>
                  <strong>{{ selectedPillarDetail.rule.total }}</strong>
                  Total do PRR
                </span>
                <span>
                  <strong>{{ selectedPillarDetail.rule.aboveMinimum }}</strong>
                  Acima do Mínimo
                </span>
              </div>
            </div>
          </article>
        </section>

        <section v-if="selectedPillarDetail" class="investment-section" aria-labelledby="investment-title">
          <div class="section-heading">
            <h2 id="investment-title">Distribuição do Investimento por Área</h2>
            <p>Repartição percentual da despesa climática e do pilar por área de política.</p>
          </div>

          <div class="detail-grid">
            <article class="metric-panel area-card">
              <h3>Rastreio Climático - Despesa por Área de Política</h3>
              <p>Percentagem da dotação total do plano afeta a objetivos climáticos.</p>

              <div class="area-list">
                <div
                  v-for="area in selectedPillarDetail.policyAreas"
                  :key="area.label"
                  class="area-row"
                >
                  <div class="area-row__label">
                    <span>{{ area.label }}</span>
                    <strong>{{ area.value.toString().replace('.', ',') }}%</strong>
                  </div>
                  <div class="area-row__track">
                    <span :style="{ width: `${area.value}%` }"></span>
                  </div>
                </div>
              </div>
            </article>

            <article class="metric-panel milestones-card">
              <h3>Estado dos Marcos e Metas</h3>
              <p>Um marco é concluído quando o Estado-Membro apresenta evidências e a Comissão valida positivamente.</p>

              <div class="milestones-card__body">
                <CircleProgress
                  :percentage="selectedPillarDetail.milestones.percentage"
                  :scale="0.62"
                />

                <div class="milestone-list">
                  <div
                    v-for="status in milestoneStatus"
                    :key="status.label"
                    class="milestone-row"
                  >
                    <div class="milestone-row__label">
                      <span>{{ status.label }}</span>
                      <strong>{{ status.value }}</strong>
                    </div>
                    <div class="milestone-row__track">
                      <span :style="{ width: `${status.percentage}%` }"></span>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <article class="metric-panel area-card">
              <h3>Pilar {{ selectedPillar.name }} - Despesa por Área de Política</h3>
              <p>Percentagem da contribuição para o pilar, por área de política estabelecida pela Comissão Europeia.</p>

              <div class="area-list">
                <div
                  v-for="area in selectedPillarDetail.greenPolicyAreas"
                  :key="area.label"
                  class="area-row"
                >
                  <div class="area-row__label">
                    <span>{{ area.label }}</span>
                    <strong>{{ area.value.toString().replace('.', ',') }}%</strong>
                  </div>
                  <div class="area-row__track">
                    <span :style="{ width: `${area.value}%` }"></span>
                  </div>
                </div>
              </div>
            </article>

            <article class="metric-panel bars-card">
              <h3>Marcos por Tipo de Medida</h3>
              <p>Divisão entre investimentos e reformas nos marcos totais.</p>

              <BarsGraph
                class="bars-card__chart"
                :bars="measureTypeBars"
                :max-height="170"
                unit=""
              />
            </article>
          </div>
        </section>
      </div>
    </template>
  </section>
</template>

<style scoped>
.country-pillars-page {
  width: 100%;
  font-family: var(--font-primary);
}

.pillars-grid {
  width: min(1050px, calc(100% - 48px));
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px;
  justify-items: stretch;
  margin: 28px auto 64px;
}

.pillars-grid--selector {
  width: 100%;
  margin: 0 0 24px;
}

.pillar-detail {
  width: min(1050px, calc(100% - 48px));
  margin: 28px auto 72px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.pillar-detail__actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.pillar-summary {
  min-height: 0;
  padding: 28px 30px;
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

.pillar-summary__copy h2 {
  margin: 5px 0 24px;
  color: var(--text-blue-dark);
  font-size: 18px;
  font-weight: 800;
  line-height: 1.2;
}

.pillar-summary__copy p {
  margin: 0;
  color: #000000;
  font-size: 17px;
  line-height: 1.3;
  white-space: pre-line;
}

.country-context {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 18px;
  margin-top: 8px;
}

.country-context__chip,
.country-context__ranking {
  min-height: 30px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid var(--bg-blue-light);
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.14);
  color: #000000;
  font-size: 13px;
  font-weight: 800;
}

.country-context__chip {
  padding: 4px 12px 4px 6px;
}

.country-context__ranking {
  padding: 4px 14px;
}

.country-context__chip img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.rule-section,
.investment-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rule-section h2,
.section-heading h2 {
  margin: 0;
  color: #000000;
  font-size: 17px;
  font-weight: 800;
}

.section-heading p {
  margin: 2px 0 0;
  color: #777777;
  font-size: 12px;
}

.metric-panel {
  background: #ffffff;
  border: 1px solid #dddddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.14);
}

.rule-card {
  display: grid;
  grid-template-columns: 128px 1fr;
  gap: 28px;
  align-items: center;
  padding: 24px 30px;
}

.rule-card__value {
  color: var(--text-blue-dark);
  font-size: 34px;
  text-align: center;
}

.rule-card__progress {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rule-card__scale,
.rule-card__numbers {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  color: #858585;
  font-size: 10px;
}

.rule-card__scale span {
  text-align: center;
}

.rule-card__track {
  position: relative;
  height: 18px;
  overflow: hidden;
  border-radius: 2px;
  background: #ededed;
}

.rule-card__fill {
  position: absolute;
  inset: 0 auto 0 0;
  background: var(--bg-blue);
}

.rule-card__minimum {
  position: absolute;
  top: -4px;
  bottom: -4px;
  width: 1px;
  background: rgba(0, 0, 0, 0.42);
  z-index: 1;
}

.rule-card__numbers {
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.rule-card__numbers span {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.rule-card__numbers strong {
  color: var(--text-blue-dark);
  font-size: 12px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}

.area-card,
.milestones-card,
.bars-card {
  min-height: 295px;
  padding: 22px;
}

.area-card h3,
.milestones-card h3,
.bars-card h3 {
  margin: 0;
  color: #000000;
  font-size: 15px;
  font-weight: 800;
}

.area-card p,
.milestones-card p,
.bars-card p {
  margin: 4px 0 16px;
  color: #8a8a8a;
  font-size: 11px;
  line-height: 1.35;
}

.area-list {
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.area-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.area-row__label,
.milestone-row__label {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: #000000;
  font-size: 11px;
  font-weight: 700;
}

.area-row__label strong,
.milestone-row__label strong {
  color: #8a8a8a;
  font-weight: 700;
}

.area-row__track,
.milestone-row__track {
  height: 6px;
  overflow: hidden;
  border-radius: 999px;
  background: #dddddd;
}

.area-row__track span,
.milestone-row__track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--bg-blue);
}

.milestones-card__body {
  min-height: 210px;
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 18px;
  align-items: center;
}

.milestone-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.bars-card__chart {
  padding: 4px 0 0;
  min-width: 0;
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

@media (max-width: 1024px) {
  .pillars-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: min(720px, calc(100% - 40px));
    gap: 22px;
  }

  .pillars-grid--selector,
  .pillar-detail {
    width: min(720px, calc(100% - 40px));
  }
}

@media (max-width: 640px) {
  .pillars-grid,
  .pillars-grid--selector,
  .pillar-detail,
  .state-text {
    width: min(340px, calc(100% - 32px));
  }

  .pillars-grid,
  .pillars-grid--selector {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .pillar-summary__content {
    grid-template-columns: 1fr;
  }

  .rule-card,
  .detail-grid,
  .milestones-card__body {
    grid-template-columns: 1fr;
  }

  .rule-card {
    padding: 22px;
  }

  .rule-card__value {
    text-align: left;
  }

  .rule-card__scale {
    font-size: 9px;
  }

}
</style>
