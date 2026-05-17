<script lang="ts">
import BarsGraph from '@/components/graphs/BarsGraph.vue';
import CircleProgress from '@/components/graphs/CircleProgress.vue';
import HorizontalBarsGraph from '@/components/graphs/HorizontalBarsGraph.vue';
import Button from '@/components/Button.vue';
import ExecutionTable from '@/components/ExecutionTable.vue';
import SummaryCard from '@/components/SummaryCard.vue';
import { getCountries } from '@/services/api';
import { exportData } from '@/services/exporter';
import arrowDown from '@/assets/arrow-down.svg';

const TOTAL_MARCOS = 120;
const roundToOne = (value) => Math.round(value * 10) / 10;
const formatNumber = (value) => {
    if (value === null || value === undefined) return '';
    const numberValue = Number(value);
    if (Number.isNaN(numberValue)) return String(value);
    return numberValue.toLocaleString('pt-PT');
};

export default {
    name: 'ExecucaoVisaoGeralView',
    components: {
        BarsGraph,
        CircleProgress,
        HorizontalBarsGraph,
        Button,
        ExecutionTable,
        SummaryCard
    },
    data() {
        return {
            arrowDown,
            summaryCards: [],
            executionByCountry: [],
            rawOverview: null
        };
    },
    async mounted() {
        try {
            const [overviewResponse, countries] = await Promise.all([
                fetch('http://localhost:3000/executionOverview'),
                getCountries()
            ]);

            if (!overviewResponse.ok) throw new Error('Falha ao obter dados da execucao.');
            const overview = await overviewResponse.json();
            this.rawOverview = overview;

            const evolutions = Array.isArray(countries)
                ? countries.map((c) => Number(c.evolution) || 0).filter((v) => Number.isFinite(v))
                : [];

            const meanEvolution = evolutions.length
                ? evolutions.reduce((sum, v) => sum + v, 0) / evolutions.length
                : 0;

            const metasPercent = overview.metasAtrasoTotal
                ? (Number(overview.metasAtrasoCount) || 0) / Number(overview.metasAtrasoTotal) * 100
                : 0;

            this.summaryCards = [
                {
                    title: 'Marcos Concluidos',
                    value: formatNumber(overview.marcosConcluidos),
                    total: formatNumber(overview.marcosTotal),
                    percent: roundToOne(meanEvolution),
                    helper: ''
                },
                {
                    title: 'Total de Fundos Aprovados e Desembolsados',
                    bars: [
                        { name: 'Desembolsados', value: overview.fundsDisbursed || 0, color: '#1d4ed8' },
                        { name: 'Aprovados', value: overview.fundsApproved || 0, color: '#bfc3cc' },
                    ],
                },
                {
                    title: 'Execucao por Pilares / Areas',
                    pillars: [
                        { title: 'Transição Verde', value: overview.pillars?.transicaoVerde || 0, color: '#2f8f5f' },
                        { title: 'Transformação Digital', value: overview.pillars?.transformacaoDigital || 0, color: '#6a2aa0' },
                        { title: 'Crescimento', value: overview.pillars?.crescimento || 0, color: '#168fa0' },
                        { title: 'Coesao Social e Territorial', value: overview.pillars?.coesao || 0, color: '#d97706' },
                        { title: 'Saúde', value: overview.pillars?.saude || 0, color: '#dc2626' },
                        { title: 'Políticas para a próxima geração', value: overview.pillars?.politicas || 0, color: '#d1a21a' },
                    ],
                },
                {
                    title: 'Metas em Atraso',
                    value: formatNumber(overview.metasAtrasoCount),
                    total: formatNumber(overview.metasAtrasoTotal),
                    percent: roundToOne(metasPercent),
                    helper: overview.metasAtrasoDelta || ''
                }
            ];

            this.executionByCountry = Array.isArray(countries)
                ? countries.map((country) => {
                    const execution = Number(country.evolution) || 0;
                    return {
                        country: country.name,
                        flag: new URL(`../assets/flags/${country.flagAsset}.svg`, import.meta.url).href,
                        funds: country.gdp,
                        execution,
                        concluded: Math.round((execution / 100) * TOTAL_MARCOS),
                        total: TOTAL_MARCOS
                    };
                })
                : [];
        } catch (error) {
            console.error(error);
        }
    },
    methods: {
        handleExportMarcos(format) {
            const card = this.summaryCards[0];
            exportData({
                format,
                filename: 'marcos-concluidos',
                title: card.title,
                data: [
                    { indicador: 'Marcos Concluídos', valor: card.value, total: card.total, percentagem: `${card.percent}%` }
                ],
                metadata: {
                    dataExportacao: new Date().toLocaleDateString('pt-PT')
                }
            });
        },
        handleExportFundos(format) {
            const card = this.summaryCards[1];
            exportData({
                format,
                filename: 'fundos-aprovados-desembolsados',
                title: card.title,
                data: card.bars.map((bar) => ({ categoria: bar.name, valor: bar.value })),
                metadata: {
                    dataExportacao: new Date().toLocaleDateString('pt-PT')
                }
            });
        },
        handleExportPilares(format) {
            const card = this.summaryCards[2];
            exportData({
                format,
                filename: 'execucao-por-pilares',
                title: card.title,
                data: card.pillars.map((p) => ({ pilar: p.title, valor: p.value })),
                metadata: {
                    dataExportacao: new Date().toLocaleDateString('pt-PT')
                }
            });
        },
        handleExportMetas(format) {
            const card = this.summaryCards[3];
            exportData({
                format,
                filename: 'metas-em-atraso',
                title: card.title,
                data: [
                    { indicador: 'Metas em Atraso', valor: card.value, total: card.total, percentagem: `${card.percent}%`, delta: card.helper }
                ],
                metadata: {
                    dataExportacao: new Date().toLocaleDateString('pt-PT')
                }
            });
        }
    }
};
</script>

<template>
    <div class="execucao-page">
        <section class="execucao-header">
            <h1 class="execucao-title">Visao Geral de Execucao</h1>
            <p class="execucao-description">
                Visao consolidada do progresso de execucao dos planos nacionais,
                incluindo fundos aprovados, desembolsos realizados e marcos atingidos por Estado-Membro.
            </p>
        </section>

        <section v-if="summaryCards.length >= 4" class="summary-grid">
            <SummaryCard :title="summaryCards[0].title" class="summary-card--large">
                <template #actions>
                    <Button :exportable="true" :compact="true" color="primary" @export="handleExportMarcos" />
                </template>
                <div class="summary-body summary-body--split">
                    <div class="summary-metric">
                        <p class="summary-value">{{ summaryCards[0].value }}</p>
                        <p class="summary-subtitle">de {{ summaryCards[0].total }}</p>
                    </div>
                    <CircleProgress :percentage="summaryCards[0].percent" :scale="0.95" />
                </div>
            </SummaryCard>

            <SummaryCard :title="summaryCards[1].title" :helper="summaryCards[1].helper">
                <template #actions>
                    <Button :exportable="true" :compact="true" color="primary" @export="handleExportFundos" />
                </template>
                <div class="summary-body summary-body--center">
                    <BarsGraph :bars="summaryCards[1].bars" :maxHeight="120" unit="B" />
                </div>
            </SummaryCard>

            <SummaryCard :title="summaryCards[2].title" :helper="summaryCards[2].helper">
                <template #actions>
                    <Button :exportable="true" :compact="true" color="primary" @export="handleExportPilares" />
                </template>
                <HorizontalBarsGraph :bars="summaryCards[2].pillars" :maxWidth="200" />
            </SummaryCard>

            <SummaryCard :title="summaryCards[3].title" :helper="summaryCards[3].helper" class="summary-card--large">
                <template #actions>
                    <Button :exportable="true" :compact="true" color="primary" @export="handleExportMetas" />
                </template>
                <div class="summary-body summary-body--split">
                    <div class="summary-metric">
                        <p class="summary-value">{{ summaryCards[3].value }}</p>
                        <p class="summary-subtitle">de {{ summaryCards[3].total }}</p>
                    </div>
                    <CircleProgress :percentage="summaryCards[3].percent" :scale="0.95" />
                </div>
            </SummaryCard>
        </section>

        <section class="country-section">
            <div class="country-header">
                <h2 class="country-title">Execucao por Estado-Membro</h2>
                <router-link to="/execucao/estado-membro" class="view-all-link">
                    <Button
                        class="view-all-button"
                        text="Ver tudo"
                        textsize="13px"
                        :icon="true"
                        :iconPath="arrowDown"
                    />
                </router-link>
            </div>

            <ExecutionTable
                v-if="executionByCountry.length"
                :rows="executionByCountry"
                :limit-top="true"
                :limit-count="5"
            />
        </section>
    </div>
</template>

<style scoped>
.execucao-page {
    background: linear-gradient(
        180deg,
        #e0e0e0 0px,
        #e0e0e0 320px,
        #efefef 320px,
        #efefef 100%
    );
    padding: 84px 6px 4px;
    min-height: 100vh;
    box-sizing: border-box;
}

.execucao-header {
    max-width: 1600px;
    margin: 0 auto 26px;
}

.execucao-title {
    font-family: var(--font-secondary);
    font-size: clamp(22px, 2.4vw, 30px);
    font-weight: 700;
    color: var(--text-black);
    margin: 0 0 10px;
}

.execucao-description {
    font-family: var(--font-primary);
    font-size: 14px;
    color: var(--text-gray-dark);
    max-width: 680px;
    margin: 0;
    margin-bottom: 60px;
}

.summary-grid {
    max-width: 1600px;
    margin: 0 auto 32px;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 18px;
}

.summary-body {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
}

.summary-body--split { justify-content: space-between; }
.summary-body--stack { flex-direction: column; gap: 16px; }
.summary-body--center { justify-content: center; align-items: center; text-align: center; }

.summary-value {
    font-family: var(--font-secondary);
    font-size: 20px;
    font-weight: 700;
    color: var(--text-blue-dark);
    margin: 0;
}

.summary-subtitle {
    font-family: var(--font-primary);
    font-size: 12px;
    color: var(--text-gray);
    margin: 0;
}

:deep(.summary-card--large .summary-value) { font-size: 24px; }
:deep(.summary-card--large .summary-subtitle) { font-size: 13px; }

.country-section {
    max-width: 1600px;
    margin: 0 auto;
}

.country-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
}

.country-title {
    font-family: var(--font-secondary);
    font-size: 18px;
    font-weight: 700;
    color: var(--text-black);
    margin: 0;
}

:deep(.bar-chart-wrapper) { padding: 12px 12px 8px; min-width: 0; gap: 12px; align-items: center; }
:deep(.bars-container) { gap: 14px; justify-content: center; }
:deep(.bar) { width: 56px; }
:deep(.chart-wrapper) { min-width: 0; padding: 12px 12px; }
:deep(.bar-label) { width: 110px; }
:deep(.legend) { justify-content: center; width: 100%; }

.view-all-button :deep(.btn__icon) { transform: rotate(-90deg); }
.view-all-link { text-decoration: none; }

@media (max-width: 1100px) {
    .summary-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 720px) {
    .execucao-page {
        padding: 18px 12px 48px;
        background: linear-gradient(180deg, #e0e0e0 0px, #e0e0e0 260px, #efefef 260px, #efefef 100%);
    }
    .summary-grid { grid-template-columns: 1fr; }
    .summary-body--split { flex-direction: column; gap: 16px; }
}
</style>