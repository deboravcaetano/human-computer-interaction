<script setup lang="ts">
import Tooltip from './Tooltip.vue'

interface Props {
  country: string
  flagSrc: string

  evolution?: number | string
  gdp?: string
  updatedAt?: string

  showEvolution?: boolean
  showGdp?: boolean
  showProgress?: boolean
}

withDefaults(defineProps<Props>(), {
  showEvolution: true,
  showGdp: true,
  showProgress: true,
})
</script>

<template>
  <div class="country-card">
    
    <div class="country-card__left">
      <img
        :src="flagSrc"
        :alt="`Bandeira de ${country}`"
        class="country-card__flag"
      />

      <h2 class="country-card__name">
        {{ country }}
      </h2>
    </div>

    <div class="country-card__right">
      <div v-if="showEvolution" class="country-card__info country-card__info--evolution">
        <span class="country-card__label">Evolução Geral</span>
        <div v-if="showProgress" class="country-card__progress">
          <div class="country-card__progress-track">
            <span
              class="country-card__progress-fill"
              :style="{ width: `${evolution}%` }"
            ></span>
          </div>
        </div>
        <strong class="country-card__value">{{ evolution }}%</strong>
      </div>

      <div v-if="showGdp" class="country-card__info">
        <div class="pib-info">
          <span class="country-card__label">PIB</span>
          <Tooltip
            title="Produto Interno Bruto (PIB):"
            text="Medida padrão do valor agregado criado por meio da produção de bens e serviços em um país durante um determinado período."
          />
        </div>
        <strong class="country-card__value">{{ gdp }}</strong>
      </div>

      <div class="country-card__info">
        <span class="country-card__label">Última atualização</span>
        <strong class="country-card__value">{{ updatedAt }}</strong>
      </div>
    </div>
  </div>
</template>

<style scoped>
.country-card {
  font-family: var(--font-primary);
  width: 100%;
  min-height: 120px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 24px 28px;

  border-radius: 14px;
  border: 1px solid #e5e7eb;

  background: white;

  box-shadow: 0 4px 12px rgba(16, 24, 40, 0.08);

  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.country-card:hover {
  transform: translateY(-2px);

  box-shadow: 0 8px 24px rgba(16, 24, 40, 0.12);
}

.country-card__left {
  display: flex;
  align-items: center;
  gap: 18px;
  flex: 0 0 280px;
}

.country-card__flag {
  width: 48px;
  height: 32px;

  object-fit: cover;

  border-radius: 6px;

  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
}

.country-card__name {
  margin: 0;

  font-size: 28px;
  font-weight: 700;

  color: var(--text-black);
}

.country-card__right {
  display: flex;
  align-items: center;
  gap: 200px;
  flex: 1;
  justify-content: flex-end;
}

.country-card__info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 140px;
}

.country-card__info--evolution {
  min-width: 160px;
  max-width: 160px;
}

.country-card__label {
  font-size: 13px;
  font-weight: 500;

  color: #667085;
}

.country-card__progress {
  width: 100%;
}

.country-card__progress-track {
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.country-card__progress-fill {
  display: block;
  height: 100%;
  background: #101828;
  border-radius: inherit;
  transition: width 0.4s ease;
}

.country-card__value {
  font-size: 18px;
  font-weight: 700;

  color: #101828;
}

.pib-info {
  display: flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 900px) {
  .country-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
  }

  .country-card__left {
    flex: unset;
  }

  .country-card__right {
    width: 100%;

    justify-content: space-between;

    gap: 24px;

    flex-wrap: wrap;
  }
}

@media (max-width: 640px) {
  .country-card {
    padding: 20px;
  }

  .country-card__name {
    font-size: 22px;
  }

  .country-card__right {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
