<script lang="ts">
export default {
    name: 'ExecutionTable',
    props: {
        rows: {
            type: Array,
            required: true
        }
    },
    methods: {
        calcProgress(concluded: number, total: number) {
            return Math.round((concluded / total) * 100);
        }
    }
};
</script>

<template>
    <div class="country-table">
        <div class="country-row country-row--head">
            <span>Pais</span>
            <span>Fundos Aprovados</span>
            <span>Execucao</span>
            <span>Marcos Concluidos</span>
        </div>

        <div
            v-for="row in rows"
            :key="row.country"
            class="country-row"
        >
            <div class="country-cell country-cell--name">
                <img :src="row.flag" :alt="`Bandeira de ${row.country}`" class="country-flag" />
                <span class="country-name">{{ row.country }}</span>
            </div>
            <span class="country-cell">{{ row.funds }}</span>
            <span class="country-cell">{{ row.execution }}%</span>
            <div class="country-cell country-cell--progress">
                <div class="progress-track">
                    <span
                        class="progress-fill"
                        :style="{ width: `${calcProgress(row.concluded, row.total)}%` }"
                    ></span>
                </div>
                <span class="progress-text">{{ row.concluded }} / {{ row.total }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.country-table {
    background: #f7f7f7;
    border-radius: 14px;
    padding: 4px 0;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}

.country-row {
    display: grid;
    grid-template-columns: 1.4fr 1fr 0.7fr 1.2fr;
    align-items: center;
    gap: 12px;
    padding: 12px 24px;
    border-bottom: 1px solid #dedede;
    font-family: var(--font-primary);
    font-size: 14px;
    color: var(--text-black);
}

.country-row:last-child {
    border-bottom: none;
}

.country-row--head {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--text-gray);
}

.country-cell--name {
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 600;
}

.country-flag {
    width: 30px;
    height: 20px;
    border-radius: 4px;
    object-fit: cover;
}

.country-cell--progress {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.progress-track {
    width: 100%;
    max-width: 180px;
    height: 10px;
    background: #d4d4d4;
    border-radius: 999px;
    overflow: hidden;
}

.progress-fill {
    display: block;
    height: 100%;
    background: #1d4ed8;
    border-radius: inherit;
}

.progress-text {
    font-size: 11px;
    color: var(--text-gray-dark);
}

@media (max-width: 720px) {
    .country-row {
        grid-template-columns: 1.2fr 1fr;
        row-gap: 8px;
    }

    .country-row--head {
        display: none;
    }

    .country-cell:nth-child(3),
    .country-cell:nth-child(4) {
        grid-column: 1 / -1;
    }
}
</style>
