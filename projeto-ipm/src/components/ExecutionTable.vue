<script lang="ts">
import Button from './Button.vue';
import downloadIcon from '@/assets/Download.svg';

export default {
    name: 'ExecutionTable',
    components: {
        Button
    },
    props: {
        rows: {
            type: Array,
            required: true
        },
        variant: {
            type: String,
            default: 'execution'
        },
        emptyLabel: {
            type: String,
            default: 'Sem resultados.'
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
            downloadIcon,
            sortKey: 'country',
            sortDirection: 'asc',
            expandedRowId: null
        };
    },
    computed: {
        displayRows() {
            if (this.variant !== 'execution') {
                return Array.isArray(this.rows) ? this.rows : [];
            }
            return this.sortedRows;
        },
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
            if (key === 'funds') return this.parseNumber(row.funds);
            if (key === 'concluded') return Number(row.concluded) || 0;
            if (key === 'execution') return Number(row.execution) || 0;
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
        },
        toggleRow(rowId) {
            this.expandedRowId = this.expandedRowId === rowId ? null : rowId;
        },
        isExpanded(rowId) {
            return this.expandedRowId === rowId;
        },
        milestoneStatusClass(status) {
            if (!status) return 'milestone--muted';
            const s = status.toLowerCase();
            if (s === 'concluido' || s === 'concluded' || s === 'completed') return 'milestone--done';
            if (s === 'not assessed' || s === 'nao avaliado') return 'milestone--pending';
            if (s === 'suspenso') return 'milestone--warning';
            return 'milestone--muted';
        }
    }
};
</script>

<template>
    <div v-if="variant === 'execution'" class="country-table">
        <div class="country-row country-row--head">
            <button type="button" class="country-sort" :class="{ 'country-sort--active': sortKey === 'country' }" @click="setSort('country')">
                <span>Pais</span>
                <svg class="country-sort__icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 4v16m0 0-3-3m3 3 3-3M17 20V4m0 0 3 3m-3-3-3 3" />
                </svg>
            </button>
            <button type="button" class="country-sort" :class="{ 'country-sort--active': sortKey === 'funds' }" @click="setSort('funds')">
                <span>Fundos Aprovados</span>
                <svg class="country-sort__icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 4v16m0 0-3-3m3 3 3-3M17 20V4m0 0 3 3m-3-3-3 3" />
                </svg>
            </button>
            <button type="button" class="country-sort" :class="{ 'country-sort--active': sortKey === 'execution' }" @click="setSort('execution')">
                <span>Execucao</span>
                <svg class="country-sort__icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 4v16m0 0-3-3m3 3 3-3M17 20V4m0 0 3 3m-3-3-3 3" />
                </svg>
            </button>
            <button type="button" class="country-sort" :class="{ 'country-sort--active': sortKey === 'concluded' }" @click="setSort('concluded')">
                <span>Marcos Concluidos</span>
                <svg class="country-sort__icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 4v16m0 0-3-3m3 3 3-3M17 20V4m0 0 3 3m-3-3-3 3" />
                </svg>
            </button>
        </div>
        <div v-for="row in displayRows" :key="row.country" class="country-row">
            <div class="country-cell country-cell--name">
                <img :src="row.flag" :alt="`Bandeira de ${row.country}`" class="country-flag" />
                <span class="country-name">{{ row.country }}</span>
            </div>
            <span class="country-cell">{{ row.funds }}</span>
            <span class="country-cell">{{ row.execution }}%</span>
            <div class="country-cell country-cell--progress">
                <div class="progress-track">
                    <span class="progress-fill" :style="{ width: `${calcProgress(row.concluded, row.total)}%` }"></span>
                </div>
                <span class="progress-text">{{ row.concluded }} / {{ row.total }}</span>
            </div>
        </div>
    </div>

    <div v-else class="metas-table">
        <div class="metas-table__header">
            <span>Pais</span>
            <span>Objetivo</span>
            <span>Tipo</span>
        </div>
        <div v-if="!displayRows.length" class="metas-table__empty">{{ emptyLabel }}</div>
        <div v-else class="metas-table__body">
            <div
                v-for="row in displayRows"
                :key="row.id || row.countryName"
                class="metas-table__item"
            >
                <!-- Linha principal -->
                <div class="metas-table__row">
                    <div class="metas-table__country">
                        <img :src="row.flagSrc" :alt="`Bandeira de ${row.countryName}`" />
                        <span>{{ row.countryName }}</span>
                    </div>
                    <p class="metas-table__objective">{{ row.objective }}</p>
                    <div class="metas-table__type">
                        <span :class="['metas-table__pill', row.type === 'Investimento' ? 'metas-table__pill--primary' : 'metas-table__pill--muted']">
                            {{ row.type }}
                        </span>
                        <button
                            type="button"
                            class="metas-table__chevron-btn"
                            :class="{ 'metas-table__chevron-btn--open': isExpanded(row.id) }"
                            :aria-label="isExpanded(row.id) ? 'Fechar detalhes' : 'Ver detalhes'"
                            @click="toggleRow(row.id)"
                        >
                            <span class="metas-table__chevron" aria-hidden="true"></span>
                        </button>
                    </div>
                </div>

                <!-- Submenu expandido -->
                <transition name="expand">
                    <div v-if="isExpanded(row.id)" class="metas-table__detail">
                        <div class="metas-table__detail-inner">
                            <!-- Coluna esquerda: milestones -->
                            <div class="metas-table__milestones">
                                <div
                                    v-if="row.milestones && row.milestones.length"
                                    v-for="(milestone, index) in row.milestones"
                                    :key="index"
                                    class="milestone"
                                >
                                    <div class="milestone__date">{{ milestone.date || '—' }}</div>
                                    <div class="milestone__indicator">
                                        <span
                                            class="milestone__dot"
                                            :class="milestoneStatusClass(milestone.status)"
                                        ></span>
                                        <span
                                            v-if="index < row.milestones.length - 1"
                                            class="milestone__line"
                                        ></span>
                                    </div>
                                    <div class="milestone__label">{{ milestone.label }}</div>
                                </div>
                                <p v-else class="milestone__empty">Sem marcos disponíveis.</p>
                            </div>

                            <!-- Divisor -->
                            <div class="metas-table__divider"></div>

                            <!-- Coluna direita: descrição -->
                            <div class="metas-table__description">
                                <p class="metas-table__description-title">Descrição</p>
                                <div class="metas-table__description-actions">
                                    <Button 
                                        text="Exportar" 
                                        color="primary" 
                                        textsize="12px" 
                                        :icon="true" 
                                        :iconPath="downloadIcon" 
                                        :exportable="true" 
                                    />
                                </div>
                                <p class="metas-table__description-text">
                                    {{ row.description || 'Sem descrição disponível.' }}
                                </p>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
        <div v-if="$slots.footer" class="metas-table__footer">
            <slot name="footer" />
        </div>
    </div>
</template>

<style scoped>
/* ── Execution table (sem alterações) ── */
.country-table {
    background: #f7f7f7;
    border-radius: 14px;
    padding: 4px 0;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
    font-family: var(--font-primary);
}

.country-row {
    display: grid;
    grid-template-columns: 1.4fr 1fr 0.7fr 1.2fr;
    align-items: center;
    gap: 12px;
    padding: 12px 24px;
    border-bottom: 1px solid #dedede;
    font-size: 14px;
    color: var(--text-black);
}

.country-row:last-child { border-bottom: none; }

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

.country-sort--active { color: var(--bg-blue); }
.country-sort:hover { color: var(--bg-blue); transform: translateY(-1px); }

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

/* ── Metas table ── */
.metas-table {
    background: #eef1f4;
    border-radius: 14px;
    padding: 12px 16px 16px;
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
    display: flex;
    flex-direction: column;
    gap: 0;
    font-family: var(--font-primary);
}

.metas-table__header {
    display: grid;
    grid-template-columns: 200px minmax(0, 1fr) 160px;
    align-items: center;
    gap: 12px;
    font-size: 11px;
    text-transform: uppercase;
    color: var(--text-gray);
    border-bottom: 1px solid #d9d9d9;
    padding-bottom: 6px;
    margin-bottom: 4px;
}

.metas-table__body {
    display: flex;
    flex-direction: column;
}

.metas-table__item {
    border-bottom: 1px solid #d9d9d9;
}

.metas-table__item:last-of-type {
    border-bottom: none;
}

.metas-table__row {
    display: grid;
    grid-template-columns: 200px minmax(0, 1fr) 160px;
    align-items: center;
    gap: 12px;
    padding: 10px 0;
    font-size: 12px;
    color: var(--text-gray-dark);
}

.metas-table__country {
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 600;
}

.metas-table__country img {
    width: 28px;
    height: 20px;
    border-radius: 4px;
    object-fit: cover;
}

.metas-table__objective { margin: 0; }

.metas-table__type {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.metas-table__pill {
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    color: var(--text-white);
}

.metas-table__pill--primary { background: #1d4ed8; }
.metas-table__pill--muted { background: #bfc3cc; color: #4a4a4a; }

.metas-table__chevron-btn {
    width: 24px;
    height: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0;
    transition: transform 200ms ease;
    flex-shrink: 0;
}

.metas-table__chevron-btn--open {
    transform: rotate(180deg);
}

.metas-table__chevron {
    width: 18px;
    height: 18px;
    background: url('@/assets/arrow-down-gray.svg') center / contain no-repeat;
    display: block;
}

/* ── Submenu de detalhe ── */
.metas-table__detail {
    overflow: hidden;
}

.metas-table__detail-inner {
    display: grid;
    grid-template-columns: 260px 1px 1fr;
    gap: 0;
    background: #fff;
    border-radius: 10px;
    margin: 0 0 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.07);
    overflow: hidden;
}

/* Coluna milestones */
.metas-table__milestones {
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 0;
}

.milestone {
    display: grid;
    grid-template-columns: 80px 24px 1fr;
    align-items: flex-start;
    gap: 8px;
    position: relative;
}

.milestone__date {
    font-size: 11px;
    color: var(--text-gray);
    padding-top: 2px;
    text-align: right;
}

.milestone__indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
}

.milestone__dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid #fff;
    flex-shrink: 0;
    margin-top: 2px;
    box-shadow: 0 0 0 2px currentColor;
}

.milestone__dot.milestone--done    { background: #1d4ed8; color: #1d4ed8; }
.milestone__dot.milestone--pending { background: #fff; color: #94a3b8; }
.milestone__dot.milestone--warning { background: #fbbf24; color: #fbbf24; }
.milestone__dot.milestone--muted   { background: #cbd5e1; color: #cbd5e1; }

.milestone__line {
    width: 2px;
    flex: 1;
    min-height: 24px;
    background: #e2e8f0;
    margin: 2px 0;
}

.milestone__label {
    font-size: 11px;
    color: var(--text-gray-dark);
    padding-top: 2px;
    padding-bottom: 16px;
    line-height: 1.4;
}

.milestone__empty {
    font-size: 11px;
    color: var(--text-gray);
    margin: 0;
    padding: 8px 0;
}

/* Divisor vertical */
.metas-table__divider {
    background: #e5e7eb;
    width: 1px;
    align-self: stretch;
}

/* Coluna descrição */
.metas-table__description {
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.metas-table__description-title {
    margin: 0;
    font-size: 12px;
    font-weight: 700;
    color: var(--text-gray-dark);
}

.metas-table__description-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: -28px;
}

.metas-table__export {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border: 1px solid #1d4ed8;
    border-radius: 6px;
    background: #fff;
    color: #1d4ed8;
    font-size: 11px;
    font-weight: 600;
    font-family: var(--font-primary);
    cursor: pointer;
    transition: background 150ms ease;
}

.metas-table__export:hover { background: #eff6ff; }

.metas-table__export svg {
    width: 13px;
    height: 13px;
}

.metas-table__description-text {
    margin: 0;
    font-size: 12px;
    color: var(--text-gray-dark);
    line-height: 1.6;
}

/* Animação expand */
.expand-enter-active,
.expand-leave-active {
    transition: max-height 300ms ease, opacity 250ms ease;
    max-height: 400px;
}

.expand-enter-from,
.expand-leave-to {
    max-height: 0;
    opacity: 0;
}

/* ── Footer ── */
.metas-table__footer {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
    color: var(--text-gray);
    margin-top: 10px;
}

.metas-table__empty {
    text-align: center;
    padding: 16px 0;
    color: var(--text-gray);
}

@media (max-width: 720px) {
    .country-row {
        grid-template-columns: 1.2fr 1fr;
        row-gap: 8px;
    }

    .country-row--head { display: none; }

    .country-cell:nth-child(3),
    .country-cell:nth-child(4) { grid-column: 1 / -1; }

    .metas-table__header,
    .metas-table__row {
        grid-template-columns: 1fr;
    }

    .metas-table__type { justify-content: flex-start; }

    .metas-table__detail-inner {
        grid-template-columns: 1fr;
    }

    .metas-table__divider { display: none; }
}
</style>