<script lang="ts">
import ExecutionTable from '@/components/ExecutionTable.vue';
import { getCountries } from '@/services/api';
import Button from '@/components/Button.vue';
import arrowDown from '@/assets/arrow-down.svg';

const TOTAL_MARCOS = 120;

export default {
    name: 'ExecucaoEstadoMembroView',
    components: {
        ExecutionTable,
        Button
    },
    data() {
        return {
            executionByCountry: [],
            isLoading: true,
            errorMessage: '',
            arrowDown
        };
    },
    async mounted() {
        try {
            const countries = await getCountries();
            this.executionByCountry = countries.map((country) => {
                const execution = Number(country.evolution) || 0;
                return {
                    country: country.name,
                    flag: new URL(`../assets/flags/${country.flagAsset}.svg`, import.meta.url).href,
                    funds: country.gdp,
                    execution,
                    concluded: Math.round((execution / 100) * TOTAL_MARCOS),
                    total: TOTAL_MARCOS
                };
            });
        } catch (error) {
            console.error(error);
            this.errorMessage = 'Não foi possível carregar os países.';
        } finally {
            this.isLoading = false;
        }
    }
};
</script>

<template>
    <div class="execucao-page">
        <section class="execucao-header">
            <h1 class="execucao-title">Execucao por Estado-Membro</h1>
            <p class="execucao-description">
                Lista completa com o progresso de execucao por Estado-Membro.
            </p>
        </section>

        <p v-if="isLoading" class="state-text">A carregar países...</p>
        <p v-else-if="errorMessage" class="state-text state-text--error">{{ errorMessage }}</p>

        <div v-else class="table-container">
            <div class="table-header">
                <router-link to="/execucao/visao-geral" class="back-link">
                    <Button
                        class="back-button"
                        text="Voltar"
                        textsize="13px"
                        :icon="true"
                        :iconPath="arrowDown"
                    />
                </router-link>
            </div>
            <ExecutionTable :rows="executionByCountry" />
        </div>
    </div>
</template>

<style scoped>
.execucao-page {
    background: #efefef;
    padding: 40px 24px 60px;
    min-height: 100vh;
    box-sizing: border-box;
}

.execucao-header {
    max-width: 1600px;
    margin: 0 auto 20px;
}

.back-link {
    text-decoration: none;
}

.table-header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 12px;
}

.back-button :deep(.btn__icon) {
    transform: rotate(90deg);
}

.back-button :deep(.btn) {
    flex-direction: row-reverse;
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
}

.state-text {
    font-family: var(--font-primary);
    font-size: 14px;
    color: var(--text-gray-dark);
    margin: 18px auto 0;
    max-width: 1600px;
}

.state-text--error {
    color: #b91c1c;
}

.table-container {
    max-width: 1600px;
    margin: 0 auto;
    width: 100%;
}

@media (max-width: 720px) {
    .execucao-page {
        padding: 24px 16px 48px;
    }
}
</style>
