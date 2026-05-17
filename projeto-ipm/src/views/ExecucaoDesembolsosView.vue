<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import CountryCard from '@/components/CountryCard.vue'
import SearchBar from '@/components/SearchBar.vue'

import { getCountries } from '@/services/api'

const router = useRouter()

const countries = ref<any[]>([])
const search = ref('')
const isLoading = ref(true)

const getFlagPath = (flagAsset: string) => {
  return new URL(`../assets/flags/${flagAsset}.svg`, import.meta.url).href
}

const loadCountries = async () => {
  try {
    countries.value = await getCountries()
  } catch (error) {
    console.error('Erro ao carregar países:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(loadCountries)

const filteredCountries = computed(() => {
  if (!search.value.trim()) return countries.value

  const searchLower = search.value.toLowerCase().trim()

  return countries.value.filter((country: any) =>
    country.name && country.name.toLowerCase().includes(searchLower)
  )
})

const onCountryCardClick = (countryId: string) => {
  router.push(`/execucao/desembolsos/${countryId}`)
}
</script>

<template>
  <div class="execucao-desembolsos-view">

    <div class="execucao-desembolsos-view__container">

      <div class="execucao-desembolsos-view__header">
        <h1>Fluxo de Desembolsos e Beneficiários</h1>

        <div class="execucao-desembolsos-view__filters">
          <SearchBar
            @search="search = $event"
            placeholder="Pesquisar por país"
            width="100%"
          />
        </div>
      </div>

      <div
        v-if="isLoading"
        class="loading-state"
      >
        A carregar países...
      </div>

      <div
        v-else
        class="execucao-desembolsos-view__content"
      >
        <div
          v-for="country in filteredCountries"
          :key="country.id"
          class="card-wrapper"
        >
          <CountryCard
            :country="country.name"
            :flag-src="getFlagPath(country.flagAsset)"
            :updated-at="country.updatedAt"
            @click="onCountryCardClick(country.id)"
            :show-evolution="false"
            :show-gdp="false"
          />
        </div>

        <div 
          v-if="filteredCountries.length === 0" 
          class="loading-state"
        >
          Nenhum país encontrado para "{{ search }}".
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.execucao-desembolsos-view {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 40px 20px;
  box-sizing: border-box;
}

.execucao-desembolsos-view__container {
  width: 100%;
  max-width: 1200px;
}

.execucao-desembolsos-view__header {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 72px;
}

.execucao-desembolsos-view__header h1 {
  font-family: var(--font-primary);
  font-size: 42px;
  font-weight: 700;
  color: var(--text-black);
  margin: 0;
  line-height: 1.1;
}

.execucao-desembolsos-view__filters {
  display: flex;
  align-items: center;
  gap: 16px;
}

.execucao-desembolsos-view__filters > *:first-child {
  flex: 1;
}

.order-select {
  height: 44px;
  padding: 0 16px;
  border-radius: 12px;
  border: 1px solid #d9d9d9;
  background: white;
  font-size: 14px;
  color: #555;
}

.execucao-desembolsos-view__content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card-wrapper {
  width: 100%;
}

.loading-state {
  color: var(--text-gray);
  font-size: 16px;
}

@media (max-width: 768px) {
  .execucao-desembolsos-view__filters {
    flex-direction: column;
    align-items: stretch;
  }

  .order-select {
    width: 100%;
  }

  .execucao-desembolsos-view__header h1 {
    font-size: 32px;
  }
}
</style>