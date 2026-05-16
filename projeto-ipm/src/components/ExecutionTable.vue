<script lang="ts">
export default {
    name: 'ExecutionTable',
    props: {
        rows: {
            type: Array,
            required: true
        },
        limitTop: {
            type: Boolean,
            default: false
        },
        limitCount: {
            type: Number,
            default: 5
        }
    },
    data() {
        return {
            sortKey: 'country',
            sortDirection: 'asc'
        };
    },
    computed: {
        sortedRows() {
            const rows = Array.isArray(this.rows) ? [...this.rows] : [];
            const direction = this.getSortDirection();

            const sorted = rows.sort((a, b) => {
                const valueA = this.getSortValue(a, this.sortKey);
                const valueB = this.getSortValue(b, this.sortKey);

                if (valueA < valueB) return -1 * direction;
                if (valueA > valueB) return 1 * direction;
                return 0;
            });

            if (!this.limitTop) return sorted;
            return sorted.slice(0, Math.max(0, this.limitCount));
        }
    },
    methods: {
        setSort(key) {
            if (this.sortKey === key) {
                if (this.limitTop) return;
                this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
                return;
            }

            this.sortKey = key;
            this.sortDirection = key === 'country' ? 'asc' : 'desc';
        },
        getSortDirection() {
            if (this.limitTop) {
                return this.sortKey === 'country' ? 1 : -1;
            }

            return this.sortDirection === 'asc' ? 1 : -1;
        },
        getSortValue(row, key) {
            if (key === 'funds') {
                return this.parseNumber(row.funds);
            }

            if (key === 'concluded') {
                return Number(row.concluded) || 0;
            }

            if (key === 'execution') {
                return Number(row.execution) || 0;
            }

            return String(row.country || '').toLowerCase();
        },
        parseNumber(value) {
            if (value === null || value === undefined) return 0;
            const normalized = String(value)
                .replace(/\s/g, '')
                .replace(/,/g, '.')
                .replace(/[^0-9.\-]/g, '');
            const parsed = Number.parseFloat(normalized);
            return Number.isNaN(parsed) ? 0 : parsed;
        },
        calcProgress(concluded: number, total: number) {
            return Math.round((concluded / total) * 100);
        }
    }
};
</script>

<template>
    <div class="country-table">
        <div class="country-row country-row--head">
            <button
                type="button"
                class="country-sort"
                :class="{ 'country-sort--active': sortKey === 'country' }"
                @click="setSort('country')"
            >
                <span>Pais</span>
                <svg class="country-sort__icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 4v16m0 0-3-3m3 3 3-3M17 20V4m0 0 3 3m-3-3-3 3" />
                </svg>
            </button>
            <button
                type="button"
                class="country-sort"
                :class="{ 'country-sort--active': sortKey === 'funds' }"
                @click="setSort('funds')"
            >
                <span>Fundos Aprovados</span>
                <svg class="country-sort__icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 4v16m0 0-3-3m3 3 3-3M17 20V4m0 0 3 3m-3-3-3 3" />
                </svg>
            </button>
            <button
                type="button"
                class="country-sort"
                :class="{ 'country-sort--active': sortKey === 'execution' }"
                @click="setSort('execution')"
            >
                <span>Execucao</span>
                <svg class="country-sort__icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 4v16m0 0-3-3m3 3 3-3M17 20V4m0 0 3 3m-3-3-3 3" />
                </svg>
            </button>
            <button
                type="button"
                class="country-sort"
                :class="{ 'country-sort--active': sortKey === 'concluded' }"
                @click="setSort('concluded')"
            >
                <span>Marcos Concluidos</span>
                <svg class="country-sort__icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 4v16m0 0-3-3m3 3 3-3M17 20V4m0 0 3 3m-3-3-3 3" />
                </svg>
            </button>
        </div>

        <div
            v-for="row in sortedRows"
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

.country-sort {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font: inherit;
    font-weight: 600;
    text-transform: uppercase;
    color: inherit;
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: color 150ms ease, transform 150ms ease;
}

.country-sort:hover {
    color: var(--bg-blue);
    transform: translateY(-1px);
}

.country-sort__icon {
    width: 14px;
    height: 14px;
    stroke: currentColor;
    stroke-width: 2px;
    fill: none;
}

.country-sort--active {
    color: var(--bg-blue);
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
