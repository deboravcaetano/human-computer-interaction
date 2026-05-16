<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import CountrySearchInput from '@/components/CountrySearchInput.vue';
import FilterSelect from '@/components/FilterSelect.vue';
import CircleProgress from '@/components/graphs/CircleProgress.vue';
import BarsGraph from '@/components/graphs/BarsGraph.vue';
import ExecutionTable from '@/components/ExecutionTable.vue';
import { getCountries, getMetasMarcos, getPillars, getCountryDetail } from '@/services/api';

const searchQuery = ref('');
const selectedType = ref('');
const selectedYear = ref('');
const selectedPillars = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');
const pageSize = ref(5);
const currentPage = ref(1);

const metasData = ref(null);
const pillars = ref([]);
const tableRows = ref([]);
const countryDetailData = ref(null);
const allCountries = ref([]);

const typeOptions = [
	{ label: 'Investimento', value: 'Investimento' },
	{ label: 'Reforma', value: 'Reforma' },
];

const years = computed(() => metasData.value?.years || []);

const countryOptions = computed(() => {
	const seen = new Set();
	return tableRows.value
		.filter((row) => {
			if (seen.has(row.countryName)) return false;
			seen.add(row.countryName);
			return true;
		})
		.map((row) => ({ name: row.countryName, flagSrc: row.flagSrc }));
});

const selectedCountryId = computed(() => {
	const search = searchQuery.value.trim().toLowerCase();
	if (!search) return null;
	const match = allCountries.value.find((c) => c.name.toLowerCase() === search);
	return match?.id || null;
});

const filteredByCountry = computed(() => {
	const search = searchQuery.value.trim().toLowerCase();
	if (!search) return tableRows.value;
	return tableRows.value.filter((row) =>
		row.countryName.toLowerCase().includes(search)
	);
});

const statusSummary = computed(() => {
	// Se há país selecionado e temos countryDetail, usamos esses dados
	if (selectedCountryId.value && countryDetailData.value) {
		const { completed, total } = countryDetailData.value.completedGoals;
		const suspensos = 0;
		const naoAvaliados = total - completed;
		const totalCalc = total || 1;
		return {
			concluidos: completed,
			suspensos,
			naoAvaliados,
			total: totalCalc,
			percentConcluidos: Math.round((completed / totalCalc) * 1000) / 10
		};
	}

	// Sem país selecionado: dados globais
	const summary = metasData.value?.summary || {};
	const concluidos = Number(summary.concluidos) || 0;
	const suspensos = Number(summary.suspensos) || 0;
	const naoAvaliados = Number(summary.naoAvaliados) || 0;
	const total = concluidos + suspensos + naoAvaliados || 1;

	return {
		concluidos,
		suspensos,
		naoAvaliados,
		total,
		percentConcluidos: Math.round((concluidos / total) * 1000) / 10
	};
});

const typeBars = computed(() => {
	const rows = filteredByCountry.value;
	return [
		{ name: 'Investimentos', value: rows.filter((r) => r.type === 'Investimento').length, color: '#1d4ed8' },
		{ name: 'Reformas', value: rows.filter((r) => r.type === 'Reforma').length, color: '#bfc3cc' },
	];
});

const filteredRows = computed(() => {
	const search = searchQuery.value.trim().toLowerCase();
	const type = selectedType.value;
	const year = selectedYear.value;
	const pillarSelection = selectedPillars.value;

	return tableRows.value.filter((row) => {
		const matchesSearch = !search || row.countryName.toLowerCase().includes(search) || row.objective.toLowerCase().includes(search);
		const matchesType = !type || row.type === type;
		const matchesYear = !year || row.year === year;
		const matchesPillar = !pillarSelection.length || pillarSelection.includes(row.pillarId);

		return matchesSearch && matchesType && matchesYear && matchesPillar;
	});
});

const totalPages = computed(() => {
	return Math.max(1, Math.ceil(filteredRows.value.length / pageSize.value));
});

const paginatedRows = computed(() => {
	const start = (currentPage.value - 1) * pageSize.value;
	return filteredRows.value.slice(start, start + pageSize.value);
});

const pageButtons = computed(() => {
	const total = totalPages.value;
	const current = currentPage.value;

	if (total <= 5) {
		return Array.from({ length: total }, (_, index) => {
			const value = index + 1;
			return { label: value, value, active: value === current };
		});
	}

	const pages = [];

	if (current <= 3) {
		for (let i = 1; i <= Math.min(4, total); i++) {
			pages.push({ label: i, value: i, active: i === current });
		}
		if (total > 4) {
			pages.push({ label: '…', value: '…', active: false });
			pages.push({ label: total, value: total, active: false });
		}
	} else if (current >= total - 2) {
		pages.push({ label: 1, value: 1, active: false });
		pages.push({ label: '…', value: '…', active: false });
		for (let i = total - 3; i <= total; i++) {
			pages.push({ label: i, value: i, active: i === current });
		}
	} else {
		pages.push({ label: 1, value: 1, active: false });
		pages.push({ label: '…', value: '…', active: false });
		pages.push({ label: current - 1, value: current - 1, active: false });
		pages.push({ label: current, value: current, active: true });
		pages.push({ label: current + 1, value: current + 1, active: false });
		pages.push({ label: '…', value: '…', active: false });
		pages.push({ label: total, value: total, active: false });
	}

	return pages;
});

const selectPage = (page) => {
	if (page === '…') return;
	currentPage.value = Number(page) || 1;
};

const goPrev = () => {
	if (currentPage.value > 1) currentPage.value -= 1;
};

const goNext = () => {
	if (currentPage.value < totalPages.value) currentPage.value += 1;
};

const togglePillar = (pillarId) => {
	if (selectedPillars.value.includes(pillarId)) {
		selectedPillars.value = selectedPillars.value.filter((item) => item !== pillarId);
		return;
	}
	selectedPillars.value = [...selectedPillars.value, pillarId];
};

onMounted(async () => {
	try {
		const [metas, countries, pillarsResponse] = await Promise.all([
			getMetasMarcos(),
			getCountries(),
			getPillars()
		]);

		metasData.value = metas;
		pillars.value = Array.isArray(pillarsResponse) ? pillarsResponse : [];
		allCountries.value = countries;

		const countryMap = new Map(countries.map((country) => [country.id, country]));
		tableRows.value = (metas.items || []).map((item) => {
			const country = countryMap.get(item.countryId);
			return {
				...item,
				countryName: country?.name || item.countryId,
				flagSrc: country
					? new URL(`../assets/flags/${country.flagAsset}.svg`, import.meta.url).href
					: ''
			};
		});
	} catch (error) {
		console.error(error);
		errorMessage.value = 'Nao foi possivel carregar os dados.';
	} finally {
		isLoading.value = false;
	}
});

// Quando muda o país selecionado, busca o countryDetail
watch(selectedCountryId, async (id) => {
	if (!id) {
		countryDetailData.value = null;
		return;
	}
	try {
		countryDetailData.value = await getCountryDetail(id);
	} catch {
		countryDetailData.value = null;
	}
});

const resetPagination = () => {
	currentPage.value = 1;
};

watch([searchQuery, selectedType, selectedYear, selectedPillars, pageSize], resetPagination);
watch(totalPages, (value) => {
	if (currentPage.value > value) currentPage.value = value;
});
watch(pageSize, (value) => {
	const normalized = Number(value) || 1;
	const clamped = Math.min(50, Math.max(1, normalized));
	if (clamped !== value) pageSize.value = clamped;
});
</script>

<template>
	<div class="metas-page">
		<section class="metas-hero">
			<div class="metas-hero__content">
				<h1>Metas e Marcos</h1>
				<p>
					A pagina de Marcos e Metas apresenta o progresso na implementacao dos
					compromissos definidos nos Planos de Recuperacao e Resiliencia dos Estados-Membros.
				</p>
			</div>
		</section>

		<section class="metas-layout">
			<aside class="metas-filters">
				<div class="filter-card">
					<CountrySearchInput
						v-model="searchQuery"
						:countries="countryOptions"
						placeholder="País"
					/>

					<FilterSelect
						label="Tipo de Medida"
						:options="typeOptions"
						v-model="selectedType"
					/>

					<FilterSelect
						label="Ano"
						:options="years"
						v-model="selectedYear"
						all-label="Todos"
					/>

					<div class="filter-group">
						<p class="filter-title">Pilar</p>
						<div class="pillar-list">
							<label v-for="pillar in pillars" :key="pillar.id" class="pillar-option">
								<input
									type="checkbox"
									:value="pillar.id"
									:checked="selectedPillars.includes(pillar.id)"
									@change="() => togglePillar(pillar.id)"
								/>
								<span class="pillar-color" :style="{ background: pillar.color }"></span>
								<span>{{ pillar.name }}</span>
							</label>
						</div>
					</div>
				</div>
			</aside>

			<div class="metas-content">
				<p v-if="isLoading" class="state-text">A carregar dados...</p>
				<p v-else-if="errorMessage" class="state-text state-text--error">{{ errorMessage }}</p>

				<div v-else class="metas-grid">
					<article class="info-card">
						<div class="info-card__header">
							<h2>Estado dos Marcos e Metas</h2>
							<p>Um marco e concluido quando o Estado-Membro apresenta evidencias e a Comissao valida positivamente.</p>
						</div>
						<div class="status-content">
							<div class="status-list">
								<div class="status-item">
									<span class="status-dot status-dot--primary"></span>
									<span class="status-label1">Concluidos</span>
									<div class="status-line1"><span></span></div>
									<strong>{{ statusSummary.concluidos }}</strong>
								</div>
								<div class="status-item">
									<span class="status-dot status-dot--warning"></span>
									<span class="status-label2">Suspensos</span>
									<div class="status-line2"><span></span></div>
									<strong>{{ statusSummary.suspensos }}</strong>
								</div>
								<div class="status-item">
									<span class="status-dot status-dot--muted"></span>
									<span class="status-label3">Nao Avaliados</span>
									<div class="status-line3"><span></span></div>
									<strong>{{ statusSummary.naoAvaliados }}</strong>
								</div>
							</div>
							<CircleProgress
								:percentage="statusSummary.percentConcluidos"
								:scale="1.05"
								:segments="[
									{ value: statusSummary.percentConcluidos, color: '#1d4ed8' },
									{ value: Math.round((statusSummary.suspensos / statusSummary.total) * 1000) / 10, color: '#fbbf24' }
								]"
							/>
						</div>
					</article>

					<article class="info-card info-card--small">
						<div class="info-card__header">
							<h2>Marcos por Tipo de Medida</h2>
							<p>Distribuicao de investimentos e reformas nos 204 marcos totais.</p>
						</div>
						<div class="type-graph">
							<BarsGraph :bars="typeBars" :maxHeight="150" unit="" legend-position="left" />
						</div>
					</article>

					<ExecutionTable variant="metas" :rows="paginatedRows" empty-label="Sem resultados.">
						<template #footer>
							<div class="table-footer">
								<span>Mostrar por pagina:</span>
								<input
									v-model.number="pageSize"
									class="page-size-input"
									type="number"
									min="1"
									max="50"
								/>
								<div class="pager">
									<button type="button" class="pager-arrow" @click="goPrev" aria-label="Pagina anterior">
										<span class="pager-icon pager-icon--left" aria-hidden="true"></span>
									</button>
									<button
										v-for="page in pageButtons"
										:key="page.label"
										:class="{ active: page.active, dots: page.label === '…' }"
										:disabled="page.label === '…'"
										type="button"
										@click="selectPage(page.value)"
									>
										{{ page.label }}
									</button>
									<button type="button" class="pager-arrow" @click="goNext" aria-label="Pagina seguinte">
										<span class="pager-icon pager-icon--right" aria-hidden="true"></span>
									</button>
								</div>
							</div>
						</template>
					</ExecutionTable>
				</div>
			</div>
		</section>
	</div>
</template>

<style scoped>
.metas-page {
	background: #f2f3f5;
	min-height: 100vh;
	font-family: var(--font-primary);
}

.metas-hero {
	background: var(--bg-blue);
	color: var(--text-white);
	padding: 40px 32px 60px;
}

.metas-hero__content {
	max-width: 1200px;
	margin: 0 auto;
}

.metas-hero h1 {
	font-family: var(--font-secondary);
	font-size: 26px;
	margin: 0 0 12px;
	color: var(--bg-yellow);
}

.metas-hero p {
	font-family: var(--font-primary);
	font-size: 14px;
	max-width: 620px;
	margin: 0;
}

.metas-layout {
	display: grid;
	grid-template-columns: 240px minmax(0, 1fr);
	gap: 20px;
	max-width: 1400px;
	margin: 16px auto 40px;
	padding: 0 24px;
}

.metas-filters {
	display: flex;
}

.filter-card {
	background: #e6e6e6;
	border-radius: 12px;
	padding: 16px;
	box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
	display: flex;
	flex-direction: column;
	gap: 12px;
	width: 100%;
}

.filter-group {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.filter-title {
	margin: 0;
	font-size: 12px;
	font-weight: 600;
	color: var(--text-gray-dark);
}

.pillar-list {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.pillar-option {
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 12px;
	color: var(--text-gray-dark);
}

.pillar-option input {
	accent-color: var(--bg-blue);
}

.pillar-color {
	width: 10px;
	height: 10px;
	border-radius: 999px;
}

.metas-content {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.metas-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 18px;
}

.info-card {
	background: #eef1f4;
	border-radius: 14px;
	padding: 18px 20px;
	box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
	display: flex;
	flex-direction: column;
	gap: 14px;
}

.info-card--small {
	align-self: start;
}

.info-card__header h2 {
	margin: 0 0 6px;
	font-size: 14px;
	color: var(--text-gray-dark);
	font-family: var(--font-secondary);
}

.info-card__header p {
	margin: 0;
	font-size: 11px;
	color: var(--text-gray);
}

.status-content {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	margin-right: 160px;
	margin-left: 120px;
}

.status-content :deep(.chart-text) {
	font-size: 2.8rem;
}

.status-list {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.status-item {
	display: grid;
	grid-template-columns: 12px 1fr 140px auto;
	align-items: center;
	gap: 10px;
	font-size: 18px;
	font-weight: 600;
	color: var(--text-gray-dark);
}

.status-dot {
	width: 12px;
	height: 12px;
	border-radius: 50%;
}

.status-dot--primary { background: #1d4ed8; }
.status-dot--warning { background: #fbbf24; }
.status-dot--muted   { background: #cbd5f5; }

.status-line1,
.status-line2,
.status-line3 {
	height: 4px;
	background: #d7dce8;
	border-radius: 999px;
	position: relative;
}

.status-line1 span {
	position: absolute;
	inset: 0 48% 0 0;
	background: #1d4ed8;
	border-radius: inherit;
}

.status-line2 span {
	position: absolute;
	inset: 0 94% 0 0;
	background: #fbbf24;
	border-radius: inherit;
}

.status-line3 span {
	position: absolute;
	inset: 0 56% 0 0;
	background: #cbd5f5;
	border-radius: inherit;
}

.type-graph {
	display: flex;
	justify-content: flex-end;
}

.type-graph :deep(.bar-chart-wrapper) {
	align-items: flex-end;
	padding: 24px 12px 16px;
	margin-left: auto;
}

.type-graph :deep(.bar-chart-wrapper--legend-left) {
	justify-content: flex-end;
	padding-left: 140px;
	padding-right: 140px;
}

.type-graph :deep(.legend--side) {
	margin-right: auto;
}

.type-graph :deep(.legend-label) {
	font-size: 1rem;
	font-weight: 600;
}

.table-footer {
	display: flex;
	align-items: center;
	gap: 10px;
	font-size: 12px;
	color: var(--text-gray);
}

.table-footer button {
	border: 1px solid #d2d2d2;
	background: #fff;
	border-radius: 4px;
	padding: 2px 6px;
	font-size: 12px;
}

.page-size-input::-webkit-outer-spin-button,
.page-size-input::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

.page-size-input {
	width: 48px;
	border: 1px solid #d2d2d2;
	border-radius: 4px;
	padding: 2px 6px;
	font-size: 12px;
	font-family: var(--font-primary);
	text-align: center;
	-moz-appearance: textfield;
}

.pager {
	display: flex;
	gap: 6px;
}

.pager-arrow {
	width: 26px;
	height: 26px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border: 1px solid #d2d2d2;
	background: #fff;
	border-radius: 6px;
}

.pager-icon {
	width: 12px;
	height: 12px;
	background: url('@/assets/arrow-down-gray.svg') center / contain no-repeat;
	display: inline-block;
}

.pager-icon--left  { transform: rotate(90deg); }
.pager-icon--right { transform: rotate(-90deg); }

.pager .active {
	background: #1d4ed8;
	color: #fff;
	border-color: #1d4ed8;
}

.state-text {
	font-family: var(--font-primary);
	font-size: 14px;
	color: var(--text-gray-dark);
}

.state-text--error { color: #b91c1c; }

@media (max-width: 1100px) {
	.metas-layout {
		grid-template-columns: 1fr;
	}

	.metas-filters { order: 2; }
	.metas-content { order: 1; }
}

@media (max-width: 720px) {
	.metas-hero {
		padding: 32px 20px 50px;
	}

	.metas-layout {
		margin-top: -24px;
		padding: 0 16px;
	}

	.metas-grid {
		grid-template-columns: 1fr;
	}

	.status-content {
		flex-direction: column;
	}
}
</style>