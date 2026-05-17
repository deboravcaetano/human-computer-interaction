<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from './Button.vue'
import AppIcon from './AppIcon.vue'
import {
	getAllCountryPillars,
	getCountries,
	getCountryDetails,
	getFaqs,
	getIndicators,
	getLatestNews,
	getMetasMarcos,
	getPillars,
	getReviews,
	getSummary,
	getTopCountries,
} from '@/services/api'
import { exportData } from '@/services/exporter'
import questionIcon from '@/assets/Question.svg'
import downloadIcon from '@/assets/Download.svg'

const router = useRouter()

const menuItems = computed(() => 
    router.options.routes.filter(route => route.name && !route.meta?.hideInNavbar)
)

const goTo = (path: string) => {
	if (!path) return
	router.push(path)
}

const countItems = (value: unknown) => Array.isArray(value) ? value.length : value ? 1 : 0

const handleGlobalExport = async (format: string) => {
	const [
		summary,
		countries,
		countryDetails,
		indicators,
		reviews,
		pillars,
		countryPillars,
		topCountries,
		latestNews,
		faqs,
		metasMarcos,
	] = await Promise.all([
		getSummary(),
		getCountries(),
		getCountryDetails(),
		getIndicators(),
		getReviews(),
		getPillars(),
		getAllCountryPillars(),
		getTopCountries(),
		getLatestNews(),
		getFaqs(),
		getMetasMarcos(),
	])

	const datasets = [
		{ secao: 'Resumo', registos: countItems(summary), dados: summary },
		{ secao: 'Países', registos: countItems(countries), dados: countries },
		{ secao: 'Detalhes de países', registos: countItems(countryDetails), dados: countryDetails },
		{ secao: 'Indicadores', registos: countItems(indicators), dados: indicators },
		{ secao: 'Histórico', registos: countItems(reviews), dados: reviews },
		{ secao: 'Pilares', registos: countItems(pillars), dados: pillars },
		{ secao: 'Pilares por país', registos: countItems(countryPillars), dados: countryPillars },
		{ secao: 'Top países', registos: countItems(topCountries), dados: topCountries },
		{ secao: 'Últimas notícias', registos: countItems(latestNews), dados: latestNews },
		{ secao: 'FAQ', registos: countItems(faqs), dados: faqs },
		{ secao: 'Metas e marcos', registos: countItems(metasMarcos), dados: metasMarcos },
	]

	exportData({
		format,
		filename: 'exportacao-global-prr',
		title: 'Exportação global - Monitorização do PRR',
		data: format === 'JSON' ? datasets : datasets.map(({ secao, registos, dados }) => ({
			secao,
			registos,
			dados: JSON.stringify(dados),
		})),
		metadata: {
			dataExportacao: new Date().toLocaleDateString('pt-PT'),
		},
	})
}

</script>

<template>
	<footer class="footer">
		<div class="footer__header">
			<div class="footer__brand">
				<AppIcon class="footer__logo" backgroundColor="var(--bg-blue-dark)" />
				<div class="footer__brand-text">
					<span class="footer__title">Monitorização do Plano <br>de Recuperação e Resiliência</br></span>
				</div>
			</div>
		</div>

		<div class="footer__separator" />

		<div class="footer__content">
			<section class="footer__left">
				<div class="footer__sections">
					<span class="footer__sections-label">Secções</span>
					<ul class="footer__menu">
						<li
							v-for="page in menuItems"
							:key="page.path as string"
							class="footer__menu-item"
						>
							<button
								type="button"
								class="footer__menu-text"
								@click="goTo(page.path as string)"
							>
								{{ page.name as string }}
							</button>
						</li>
					</ul>
				</div>
			</section>

			<section class="footer__right">
				<div class="footer__actions">
					<Button 
					text="FAQ" 
					color="primary" 
					textsize="12px" 
					:icon="true" 
					:iconPath="questionIcon" 
					@click="goTo('/faq')"
					/>
					<Button text="Exportar" color="primary" textsize="12px" :icon="true" :iconPath="downloadIcon" :exportable="true" @export="handleGlobalExport" />
				</div>

				<p class="footer__updated">Dados atualizados em: 08/03/2026</p>
			</section>
		</div>
	</footer>
</template>

<style scoped>
.footer {
	width: 100%;
	background: radial-gradient(circle at 20% 0, #1d2e68, var(--bg-blue-dark));
	color: var(--text-purple-light);
	font-family: var(--font-primary);
}

.footer__header {
	width: 100%;
	background-color: var(--bg-blue-dark);
	padding: 0.3rem 3.25rem 0.1rem;
	display: flex;
	align-items: flex-end;
}

.footer__separator {
	height: 2px;
	width: 100%;
	background-color: var(--bg-blue-light);
}

.footer__top-border {
	height: 3px;
	width: 100%;
    background-color: var(--bg-blue-light);
}

.footer__content {
	display: flex;
	justify-content: space-between;
	padding: 1.75rem 3.25rem 1.5rem;
	gap: 2rem;
    background-color: var(--bg-blue-dark);
}

.footer__left {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 1.5rem;
}

.footer__brand {
	display: flex;
	align-items: flex-end;
}

.footer__logo {
	transform: scale(0.55);
	transform-origin: left bottom;
	margin: 0.1rem 0 0.5rem;
}

.footer__brand-text {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	font-size: 0.9rem;
    padding-left: 0.1 rem;
}

.footer__title {
	font-weight: 600;
	line-height: 1.1;
	margin: 0.1rem -1.9rem 0.5rem;
	
}

.footer__subtitle {
	font-weight: 400;
}

.footer__sections {
	display: flex;
	align-items: flex-start;
}

.footer__sections-label {
	display: block;
	margin: 0;
	padding-right: 1.5rem;
	font-size: 0.9rem;
	font-weight: 600;
	border-right: 1px solid var(--bg-blue-light);
}

.footer__menu {
	list-style: none;
	padding: 0 0 0 1.5rem;
	margin: 0;
	display: flex;
	flex-direction: column;
	gap: 0.4rem;
}

.footer__menu-item {
    font-size: 12px;
	margin: 0;
}

.footer__menu-text {
	background: none;
	border: none;
	padding: 0;
	color: var(--text-purple-light);
	font: inherit;
	cursor: pointer;
	text-align: left;
}

.footer__menu-text:hover {
	color: var(--text-white);
}

.footer__right {
	margin-left: auto;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: flex-end;
	gap: 0.75rem;
}

.footer__actions {
	display: flex;
	gap: 0.8rem;
}

.footer__updated {
	font-size: 0.72rem;
	color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 900px) {
	.footer__content {
		flex-direction: column;
		align-items: flex-start;
	}

	.footer__right {
		align-items: flex-start;
	}
}
</style>
