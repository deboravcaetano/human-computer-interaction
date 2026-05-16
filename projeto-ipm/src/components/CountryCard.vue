<script setup lang="ts">
import Tooltip from '@/components/Tooltip.vue' 

const props = defineProps<{
    country: string
    flagSrc: string
    evolution: number
    gdp: string
    updatedAt: string
}>()

const emit = defineEmits<{
    (e: 'click'): void
}>()

const onCardClick = () => {
    emit('click')
}
</script>

<template>
    <button
        type="button"
        class="country-card"
        :aria-label="`Ver dados de ${props.country}`"
        @click="onCardClick"
    >
        <div class="country-card__country">
            <img :src="props.flagSrc" :alt="`Bandeira de ${props.country}`" class="country-card__flag" />
            <h3 class="country-card__name">{{ props.country }}</h3>
        </div>

        <div class="country-card__metric">
            <p class="country-card__label">Evolução geral</p>
            <div class="country-card__progress">
                <span class="country-card__progress-value" :style="{ width: `${props.evolution}%` }"></span>
            </div>
            <p class="country-card__value">{{ props.evolution }}%</p>
        </div>

        <div class="country-card__metric country-card__metric--gdp">
            <div class="country-card__label-row">
                <p class="country-card__label">PIB</p>
                
                <Tooltip 
                    title="Produto Interno Bruto (PIB):"
                    text="Medida padrão do valor agregado criado por meio da produção de bens e serviços em um país durante um determinado período."
                />
            </div>
            <p class="country-card__value country-card__value--strong">{{ props.gdp }}</p>
        </div>

        <div class="country-card__metric">
            <p class="country-card__label">Última atualização</p>
            <p class="country-card__value country-card__value--strong">{{ props.updatedAt }}</p>
        </div>
    </button>
</template>

<style scoped>
.country-card {
    width: 100%;
    display: grid;
    grid-template-columns: minmax(220px, 1.8fr) 1.2fr 1fr 1fr;
    align-items: center;
    gap: 16px;
    min-height: 100px;
    padding: 16px 28px;
    border: none;
    border-radius: 12px;
    background: var(--bg-white);
    text-align: left;
    cursor: pointer;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    transition: transform 160ms ease, box-shadow 160ms ease;
}

.country-card:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.country-card:focus-visible {
    outline: 2px solid var(--bg-blue);
    outline-offset: 2px;
}

.country-card__country {
    display: flex;
    align-items: center;
    gap: 18px;
}

.country-card__flag {
    width: 74px;
    height: 50px;
    border-radius: 8px;
    object-fit: cover;
}

.country-card__name {
    font-family: var(--font-primary);
    font-size: clamp(18px, 1.5vw, 26px);
    font-weight: 600;
    color: var(--text-black);
}

.country-card__metric {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.country-card__label-row {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    position: relative;
}

.country-card__label {
    font-family: var(--font-primary);
    font-size: clamp(10px, 0.7vw, 13px);
    font-weight: 500;
    color: var(--text-gray);
}

.country-card__progress {
    width: 100%;
    max-width: 130px;
    height: 7px;
    border-radius: 999px;
    background: var(--text-gray-light);
    overflow: hidden;
}

.country-card__progress-value {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: var(--text-black);
}

.country-card__value {
    font-family: var(--font-primary);
    font-size: clamp(15px, 1.05vw, 21px);
    font-weight: 600;
    color: var(--text-black);
}

.country-card__value--strong {
    font-weight: 700;
}

@media (max-width: 1100px) {
    .country-card {
        grid-template-columns: 1fr 1fr;
        padding: 14px 18px;
        min-height: 92px;
    }

    .country-card__name {
        font-size: 21px;
    }

    .country-card__flag {
        width: 58px;
        height: 40px;
    }
}

@media (max-width: 640px) {
    .country-card {
        grid-template-columns: 1fr;
        gap: 14px;
        padding: 14px;
    }

    .country-card__name {
        font-size: 20px;
    }

    .country-card__metric--gdp .country-card__label-row {
        justify-content: flex-start;
    }
}
</style>