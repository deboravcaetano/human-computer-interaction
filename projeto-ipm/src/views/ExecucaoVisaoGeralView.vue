<script lang="ts">
import BarsGraph from '@/components/graphs/BarsGraph.vue';
import CircleProgress from '@/components/graphs/CircleProgress.vue';
import HorizontalBarsGraph from '@/components/graphs/HorizontalBarsGraph.vue';
import Button from '@/components/Button.vue';
import ExecutionTable from '@/components/ExecutionTable.vue';
import SummaryCard from '@/components/SummaryCard.vue';
import arrowDown from '@/assets/arrow-down.svg';
import portugalFlag from '@/assets/flags/portugal-flag.svg';
import franceFlag from '@/assets/flags/france-flag.svg';
import germanyFlag from '@/assets/flags/germany-flag.svg';
import italyFlag from '@/assets/flags/italy-flag.svg';
import polandFlag from '@/assets/flags/poland-flag.svg';

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
            summaryCards: [
                {
                    title: 'Marcos Concluidos',
                    value: '3 301',
                    total: '6347',
                    percent: 52,
                    helper: ''
                },
                {
                    title: 'Total de Fundos Aprovados e Desembolsados',
                    bars: [
                        { name: 'Desembolsados', value: 393, color: '#1d4ed8' },
                        { name: 'Aprovados', value: 723.8, color: '#bfc3cc' },
                    ],
                },
                {
                    title: 'Execucao por Pilares / Areas',
                    pillars: [
                        { title: 'Transição Verde', value: 2713, color: '#2f8f5f' },
                        { title: 'Transformação Digital', value: 2205, color: '#6a2aa0' },
                        { title: 'Crescimento', value: 1452, color: '#168fa0' },
                        { title: 'Coesao Social e Territorial', value: 2487, color: '#d97706' },
                        { title: 'Saúde', value: 2289, color: '#dc2626' },
                        { title: 'Políticas para a próxima geração', value: 930, color: '#d1a21a' },
                    ],
                },
                {
                    title: 'Metas em Atraso',
                    value: '142',
                    total: '6347',
                    percent: 2.24,
                    helper: '+12 face ao mes anterior'
                }
            ],
            executionByCountry: [
                {
                    country: 'Portugal',
                    flag: portugalFlag,
                    funds: '$ 15,6 Bilhoes',
                    execution: 24,
                    concluded: 37,
                    total: 82
                },
                {
                    country: 'Franca',
                    flag: franceFlag,
                    funds: '$ 26,8 Bilhoes',
                    execution: 43,
                    concluded: 102,
                    total: 145
                },
                {
                    country: 'Alemanha',
                    flag: germanyFlag,
                    funds: '$ 67,7 Bilhoes',
                    execution: 74,
                    concluded: 76,
                    total: 108
                },
                {
                    country: 'Italia',
                    flag: italyFlag,
                    funds: '$ 44,1 Bilhoes',
                    execution: 31,
                    concluded: 65,
                    total: 122
                },
                {
                    country: 'Polonia',
                    flag: polandFlag,
                    funds: '$ 18,9 Bilhoes',
                    execution: 16,
                    concluded: 29,
                    total: 54
                },
            ]
        };
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

        <section class="summary-grid">
            <SummaryCard :title="summaryCards[0].title" class="summary-card--large">
                <div class="summary-body summary-body--split">
                    <div class="summary-metric">
                        <p class="summary-value">{{ summaryCards[0].value }}</p>
                        <p class="summary-subtitle">de {{ summaryCards[0].total }}</p>
                    </div>
                    <CircleProgress :percentage="summaryCards[0].percent" :scale="0.95" />
                </div>
            </SummaryCard>

            <SummaryCard :title="summaryCards[1].title" :helper="summaryCards[1].helper">
                <div class="summary-body summary-body--center">
                    <BarsGraph :bars="summaryCards[1].bars" :maxHeight="120" unit="B" />
                </div>
            </SummaryCard>

            <SummaryCard :title="summaryCards[2].title" :helper="summaryCards[2].helper">
                <HorizontalBarsGraph :bars="summaryCards[2].pillars" :maxWidth="200" />
            </SummaryCard>

            <SummaryCard :title="summaryCards[3].title" :helper="summaryCards[3].helper" class="summary-card--large">
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
                <Button
                    class="view-all-button"
                    text="Ver tudo"
                    textsize="13px"
                    :icon="true"
                    :iconPath="arrowDown"
                />
            </div>

            <ExecutionTable :rows="executionByCountry" />
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

.summary-body--split {
    justify-content: space-between;
}

.summary-body--stack {
    flex-direction: column;
    gap: 16px;
}

.summary-body--center {
    justify-content: center;
    align-items: center;
    text-align: center;
}

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

:deep(.summary-card--large .summary-value) {
    font-size: 24px;
}

:deep(.summary-card--large .summary-subtitle) {
    font-size: 13px;
}

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

:deep(.bar-chart-wrapper) {
    padding: 12px 12px 8px;
    min-width: 0;
    gap: 12px;
    align-items: center;
}

:deep(.bars-container) {
    gap: 14px;
    justify-content: center;
}

:deep(.bar) {
    width: 56px;
}

:deep(.chart-wrapper) {
    min-width: 0;
    padding: 12px 12px;
}

:deep(.bar-label) {
    width: 110px;
}

:deep(.legend) {
    justify-content: center;
    width: 100%;
}

.view-all-button :deep(.btn__icon) {
    transform: rotate(-90deg);
}

@media (max-width: 1100px) {
    .summary-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 720px) {
    .execucao-page {
        padding: 18px 12px 48px;
        background: linear-gradient(
            180deg,
            #e0e0e0 0px,
            #e0e0e0 260px,
            #efefef 260px,
            #efefef 100%
        );
    }

    .summary-grid {
        grid-template-columns: 1fr;
    }

    .summary-body--split {
        flex-direction: column;
        gap: 16px;
    }
}
</style>
