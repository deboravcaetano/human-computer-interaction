<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import IntroCard from '@/components/IntroCard.vue'
import Button from '@/components/Button.vue'
import FilterSelect from '@/components/FilterSelect.vue'
import CategoryBadge from '@/components/CategoryBadge.vue'
import DisbursementTable from '@/components/DisbursementTable.vue'

import downloadIcon from '@/assets/Download.svg'
import arrowIcon from '@/assets/arrow-down-black.svg'

import { getCountries, getDisbursementsByCountry } from '@/services/api'

const route = useRoute()
const router = useRouter()

const selectedType = ref('')
const country = ref({
	id: 'pt',
	name: 'Portugal',
	flagAsset: 'portugal-flag'
})
const disbursementData = ref({
	hero: {
		title: 'Fluxo de Desembolsos e Beneficiarios',
		description:
			'Consulte o historico detalhado dos pagamentos transferidos pela Uniao Europeia e a lista das entidades que receberam os maiores montantes.'
	},
	realized: [],
	planned: [],
	beneficiaries: []
})

const typeOptions = [
	{ label: 'Subvencao', value: 'Subvencao' },
	{ label: 'Emprestimo', value: 'Emprestimo' }
]

const formatAmount = (amount, unit = '') => {
	const formatted = Number(amount || 0).toLocaleString('pt-PT')
	return unit ? `EUR ${formatted} ${unit}` : `EUR ${formatted}`
}

const realizedRows = computed(() => {
	const source = disbursementData.value?.realized || []
	const filtered = selectedType.value
		? source.filter((item) => item.type === selectedType.value)
		: source
	return filtered.map((item) => ({
		...item,
		amountLabel: formatAmount(item.amount, item.amountUnit)
	}))
})

const plannedRows = computed(() => {
	const source = disbursementData.value?.planned || []
	const filtered = selectedType.value
		? source.filter((item) => item.type === selectedType.value)
		: source
	return filtered.map((item) => ({
		...item,
		amountLabel: formatAmount(item.amount, item.amountUnit)
	}))
})

const beneficiaries = computed(() => {
	const source = disbursementData.value?.beneficiaries || []
	return source.map((item) => ({
		...item,
		amountLabel: formatAmount(item.amount)
	}))
})

const flagSrc = computed(() => {
	if (!country.value?.flagAsset) return ''
	return new URL(`../assets/flags/${country.value.flagAsset}.svg`, import.meta.url).href
})

const heroTitle = computed(() => disbursementData.value?.hero?.title || 'Fluxo de Desembolsos e Beneficiarios')
const heroDescription = computed(() => disbursementData.value?.hero?.description || '')

const handleBack = () => {
	router.push('/execucao/desembolsos')
}

onMounted(async () => {
	const countryId = String(route.params.countryId || route.params.id || 'pt')

	try {
		const [countries, disbursement] = await Promise.all([
			getCountries(),
			getDisbursementsByCountry(countryId)
		])
		const found = countries.find((item) => item.id === countryId)
		if (found) country.value = found
		if (disbursement) disbursementData.value = disbursement
	} catch (error) {
		console.error('Erro ao carregar o pais', error)
	}
})
</script>

<template>
	<div class="desembolsos-pais">
		<IntroCard
			class="desembolsos-intro"
			:title="heroTitle"
			:description="heroDescription"
			height="260px"
			width="100%"
		>
			<div class="desembolsos-intro__flag">
				<img :src="flagSrc" :alt="`Bandeira de ${country.name}`" />
				<span>{{ country.name }}</span>
			</div>
		</IntroCard>

		<section class="desembolsos-content">
			<div class="desembolsos-toolbar">
				<Button
					text="Voltar"
					color="secondary"
					textsize="12px"
					:icon="true"
					:iconPath="arrowIcon"
					iconPosition="left"
					iconDirection="left"
					@click="handleBack"
				/>

				<div class="desembolsos-actions">
					<FilterSelect
						label="Filtrar"
						:options="typeOptions"
						v-model="selectedType"
						all-label="Todos"
					/>
					<Button
						text="Exportar"
						color="primary"
						textsize="12px"
						:icon="true"
						:iconPath="downloadIcon"
						:exportable="true"
					/>
				</div>
			</div>

			<DisbursementTable
				title="Cronologia de Recebimentos Realizados"
				:rows="realizedRows"
				header-variant="success"
				empty-label="Sem recebimentos realizados."
			/>

			<DisbursementTable
				title="Cronologia de Recebimentos Previstos"
				:rows="plannedRows"
				header-variant="primary"
				empty-label="Sem recebimentos previstos."
			/>

			<article class="desembolsos-section">
				<h2>100 Maiores Beneficiarios</h2>
				<div class="beneficiarios-table">
					<div class="beneficiarios-table__header">
						<span>Entidade Beneficiaria</span>
						<span>Projeto</span>
						<span>Montante Recebido</span>
						<span>Pilar Estrategico</span>
					</div>
					<div
						v-for="item in beneficiaries"
						:key="item.entity"
						class="beneficiarios-table__row"
					>
						<span>{{ item.entity }}</span>
						<span>{{ item.project }}</span>
						<span class="beneficiarios-amount">{{ item.amountLabel }}</span>
						<CategoryBadge :category="item.pillar" />
					</div>
				</div>

				<div class="beneficiarios-actions">
					<Button
						text="Ver Mais"
						color="primary"
						textsize="12px"
						:icon="true"
						:iconPath="arrowIcon"
						iconPosition="right"
						iconDirection="right"
					/>
				</div>
			</article>
		</section>
	</div>
</template>

<style scoped>
.desembolsos-pais {
	background: #eeeeee;
	min-height: 100vh;
	font-family: var(--font-primary);
}

.desembolsos-intro {
	position: relative;
}

.desembolsos-intro :deep(.intro-card) {
	background: linear-gradient(90deg, #101d42 0%, #16307d 60%, #1a2a63 100%);
}

.desembolsos-intro :deep(.intro-card-content) {
	max-width: 1280px;
	margin: 0 auto;
	padding-top: 110px;
	position: relative;
}

.desembolsos-intro :deep(.title) {
	max-width: 520px;
}

.desembolsos-intro :deep(.description) {
	max-width: 560px;
	font-size: 13px;
}

.desembolsos-intro__flag {
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

.desembolsos-intro__flag img {
	width: 168px;
	height: 114px;
	border-radius: 6px;
	object-fit: cover;
	box-shadow: 0 6px 16px rgba(6, 12, 32, 0.35);
}

.desembolsos-content {
	max-width: 1280px;
	margin: 0 auto;
	padding: 32px 24px 70px;
	display: flex;
	flex-direction: column;
	gap: 28px;
}

.desembolsos-toolbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
}

.desembolsos-actions {
	display: flex;
	align-items: center;
	gap: 12px;
}


.desembolsos-section {
	display: flex;
	flex-direction: column;
	gap: 12px;
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

.beneficiarios-amount {
	font-weight: 600;
	color: #111827;
}

.beneficiarios-actions {
	display: flex;
	justify-content: flex-end;
	margin-top: 10px;
}

@media (max-width: 900px) {
	.desembolsos-toolbar {
		flex-direction: column;
		align-items: flex-start;
	}

	.desembolsos-intro__flag {
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
	.beneficiarios-table__header,
	.beneficiarios-table__row {
		grid-template-columns: 1fr;
		gap: 8px;
	}
}
</style>