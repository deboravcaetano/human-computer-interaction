<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import Button from '@/components/Button.vue'
import CategoryBadge from '@/components/CategoryBadge.vue'
import FilterSelect from '@/components/FilterSelect.vue'
import IntroCard from '@/components/IntroCard.vue'

import arrowIcon from '@/assets/arrow-down.svg'
import downloadIcon from '@/assets/Download.svg'

import { getCountries, getDisbursementsByCountry } from '@/services/api'
import { exportData } from '@/services/exporter'

type Country = {
  id: string
  name: string
  flagAsset: string
}

type Beneficiary = {
  entity: string
  project: string
  amount: number
  pillar: string
}

type BeneficiaryRow = Beneficiary & {
  amountLabel: string
}

type Hero = {
  title: string
  description: string
}

const route = useRoute()
const router = useRouter()

const country = ref<Country>({ id: 'pt', name: 'Portugal', flagAsset: 'portugal-flag' })
const allBeneficiaries = ref<Beneficiary[]>([])
const selectedPillar = ref('')
const hero = ref<Hero>({
  title: 'Fluxo de Desembolsos e Beneficiarios',
  description:
    'Consulte o historico detalhado dos pagamentos transferidos pela Uniao Europeia e a lista das entidades que receberam os maiores montantes.'
})

const flagSrc = computed(() => {
  if (!country.value?.flagAsset) return ''
  return new URL(`../assets/flags/${country.value.flagAsset}.svg`, import.meta.url).href
})

const pillarOptions = computed(() => {
  const pillars = [...new Set(allBeneficiaries.value.map((item) => item.pillar).filter(Boolean))]
  return pillars.map((p) => ({ label: p, value: p }))
})

const formatAmount = (amount: number) => {
  const formatted = Number(amount || 0).toLocaleString('pt-PT')
  return `€${formatted}`
}

const filteredBeneficiaries = computed<BeneficiaryRow[]>(() => {
  const pillar = selectedPillar.value
  return allBeneficiaries.value
    .map((item) => ({ ...item, amountLabel: formatAmount(item.amount) }))
    .filter((item) => {
      const matchesPillar = !pillar || item.pillar === pillar
      return matchesPillar
    })
})

const heroTitle = computed(() => hero.value?.title || 'Fluxo de Desembolsos e Beneficiarios')
const heroDescription = computed(() => hero.value?.description || '')

const handleBack = () => {
  const countryId = String(route.params.countryId || route.params.id || 'pt')
  router.push(`/execucao/desembolsos/${countryId}`)
}

const handleExport = (format: string) => {
  exportData({
    format,
    filename: `beneficiarios-${country.value.name}`,
    title: `100 Maiores Beneficiários — ${country.value.name}`,
    data: filteredBeneficiaries.value.map((item) => ({
      entidade: item.entity,
      projeto: item.project,
      montante: item.amountLabel,
      pilar: item.pillar,
    })),
    metadata: {
      pais: country.value.name,
      dataExportacao: new Date().toLocaleDateString('pt-PT'),
    }
  })
}

onMounted(async () => {
  const countryId = String(route.params.countryId || route.params.id || 'pt')
  try {
    const [countries, disbursement] = await Promise.all([
      getCountries(),
      getDisbursementsByCountry(countryId)
    ]) as [Country[], { hero?: Hero; beneficiaries?: Beneficiary[] } | null]
    const found = countries.find((item) => item.id === countryId)
    if (found) country.value = found
    if (disbursement?.hero) hero.value = disbursement.hero
    if (disbursement?.beneficiaries) allBeneficiaries.value = disbursement.beneficiaries
  } catch (error) {
    console.error('Erro ao carregar beneficiários', error)
  }
})
</script>

<template>
  <div class="beneficiarios-page">
    <IntroCard
      class="beneficiarios-intro"
      :title="heroTitle"
      :description="heroDescription"
      height="260px"
      width="100%"
    >
      <div class="beneficiarios-intro__flag">
        <img :src="flagSrc" :alt="`Bandeira de ${country.name}`" />
        <span>{{ country.name }}</span>
      </div>
    </IntroCard>

    <section class="beneficiarios-content">
      <div class="beneficiarios-toolbar">
        <Button
          text="Voltar"
          color="primary"
          textsize="12px"
          :icon="true"
          :iconPath="arrowIcon"
          iconPosition="left"
          iconDirection="left"
          @click="handleBack"
        />
        <div class="beneficiarios-actions">
          <FilterSelect
            label="Filtrar"
            :options="pillarOptions"
            v-model="selectedPillar"
            all-label="Todos"
          />
          <Button
            text="Exportar"
            color="primary"
            textsize="12px"
            :icon="true"
            :iconPath="downloadIcon"
            :exportable="true"
            @export="handleExport"
          />
        </div>
      </div>

      <article class="beneficiarios-section">
        <h2>100 Maiores Beneficiários</h2>

        <div class="beneficiarios-table">
          <div class="beneficiarios-table__header">
            <span>Entidade Beneficiária</span>
            <span>Projeto</span>
            <span>Montante Recebido</span>
            <span>Pilar Estratégico</span>
          </div>

          <p v-if="!filteredBeneficiaries.length" class="beneficiarios-table__empty">
            Sem beneficiários encontrados.
          </p>

          <div
            v-else
            v-for="item in filteredBeneficiaries"
            :key="item.entity"
            class="beneficiarios-table__row"
          >
            <span class="beneficiarios-table__entity">{{ item.entity }}</span>
            <span>{{ item.project }}</span>
            <span class="beneficiarios-amount">{{ item.amountLabel }}</span>
            <CategoryBadge :category="item.pillar" />
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<style scoped>
.beneficiarios-page {
  background: #eeeeee;
  min-height: 100vh;
  font-family: var(--font-primary);
}

.beneficiarios-intro {
  position: relative;
}

.beneficiarios-intro :deep(.intro-card) {
  background: linear-gradient(90deg, #101d42 0%, #16307d 60%, #1a2a63 100%);
}

.beneficiarios-intro :deep(.intro-card-content) {
  max-width: 1280px;
  margin: 0 auto;
  padding-top: 110px;
  position: relative;
}

.beneficiarios-intro :deep(.title) {
  max-width: 520px;
}

.beneficiarios-intro :deep(.description) {
  max-width: 560px;
  font-size: 13px;
}

.beneficiarios-intro__flag {
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  color: #f4f6ff;
  font-weight: 600;
  font-size: 40px;
  margin-top: 80px;
}

.beneficiarios-intro__flag img {
  width: 168px;
  height: 114px;
  border-radius: 6px;
  object-fit: cover;
  box-shadow: 0 6px 16px rgba(6, 12, 32, 0.35);
}

.beneficiarios-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 24px 70px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.beneficiarios-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.beneficiarios-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.beneficiarios-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.beneficiarios-section h2 {
  margin: 0;
  font-size: 14px;
  color: #111827;
}

.beneficiarios-table {
  background: #f2f3f5;
  border-radius: 10px;
  border: 1px solid #cfd3db;
  overflow: hidden;
}

.beneficiarios-table__header {
  display: grid;
  grid-template-columns: 1.4fr 1fr 160px 200px;
  padding: 12px 18px;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 1px solid #d6d6d6;
}

.beneficiarios-table__row {
  display: grid;
  grid-template-columns: 1.4fr 1fr 160px 200px;
  padding: 12px 18px;
  font-size: 13px;
  color: #1f2937;
  align-items: center;
  border-bottom: 1px solid #d6d6d6;
}

.beneficiarios-table__row:last-child {
  border-bottom: none;
}

.beneficiarios-table__entity {
  color: #1f2937;
}

.beneficiarios-amount {
  font-weight: 600;
  color: #111827;
}

.beneficiarios-table__empty {
  margin: 0;
  padding: 24px 18px;
  font-size: 13px;
  color: var(--text-gray);
  text-align: center;
}

@media (max-width: 900px) {
  .beneficiarios-intro__flag {
    position: static;
    transform: none;
    margin-top: 16px;
  }

  .beneficiarios-table__header,
  .beneficiarios-table__row {
    grid-template-columns: 1fr 1fr 130px 160px;
  }
}

@media (max-width: 700px) {
  .beneficiarios-toolbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .beneficiarios-table__header,
  .beneficiarios-table__row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
</style>
