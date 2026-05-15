<script setup>
import { computed, onMounted, ref } from 'vue';
import IntroCard from '@/components/IntroCard.vue';
import AllFlags from '@/components/AllFlags.vue';
import Top3Cards from '@/components/Top3Cards.vue';
import InfoCard from '@/components/InfoCard.vue';
import { getCountries, getSummary, getTopCountries } from '@/services/api';

const title = "Monitorização do Mecanismo de Recuperação e Resiliência";
const description = "Explore como cada Estado-Membro está a cumprir os seus marcos e metas para garantir um futuro resiliente.";

const summary = ref([]);
const countries = ref([]);
const topCountries = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');

const topCountriesWithDetails = computed(() => {
  return topCountries.value.map((topCountry) => {
    const country = countries.value.find((item) => item.id === topCountry.countryId);

    return {
      ...topCountry,
      countryName: country?.nameEn ?? country?.name ?? topCountry.countryId
    };
  });
});

onMounted(async () => {
  try {
    const [summaryData, countriesData, topCountriesData] = await Promise.all([
      getSummary(),
      getCountries(),
      getTopCountries()
    ]);

    summary.value = summaryData;
    countries.value = countriesData;
    topCountries.value = topCountriesData;
  } catch (error) {
    errorMessage.value = 'Não foi possível carregar os dados iniciais.';
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div>
    <IntroCard 
      :title="title" 
      :description="description" 
      height="400px" 
      width="100%" 
    >
      <AllFlags />
    </IntroCard>
    <div class="info-cards-container">
      <InfoCard
        v-for="info in summary"
        :key="info.title"
        :title="info.title"
        :description="info.value"
        class="info-card-item"
      />
    </div>
    <section class="top3-section">
      <div class="top3-container">
        <div class="top3-header">
          <h2 class="title-1">Top 3</h2>
          <p class="title-2">países que lideram a execução</p>
        </div>

        <p v-if="isLoading" class="state-text">A carregar dados...</p>
        <p v-else-if="errorMessage" class="state-text state-text--error">{{ errorMessage }}</p>

        <div v-else class="top3-cards">
          <Top3Cards
            v-for="country in topCountriesWithDetails"
            :key="country.id"
            :country="country.countryName"
            :position="country.position"
            :progress="country.progress"
            :projects="country.activeProjects"
            :total="country.totalReceived"
          />
        </div>
      </div>
    </section>
  </div> 
</template>


<style scoped>
.info-cards-container {
  display: flex;
  justify-content: center;
  align-items: stretch;
  flex-wrap: wrap;
  gap: 40px;
  padding: 40px 20px;
  margin-top: -55px;
  position: relative;
  z-index: 2;
  margin-bottom: 500px; 
}

.top3-section {
  display: flex;
  justify-content: center; 
  padding: 40px 20px 100px; 
  background-color: white; 
}

.info-card-item {
  flex: 1 1 320px;
  max-width: 400px;
}

.state-text {
  width: 100%;
  margin: 0;
  font-family: var(--font-primary);
  color: var(--text-gray);
  text-align: center;
}

.state-text--error {
  color: #b42318;
}

.top3-container {
  max-width: 1280px; 
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center; 
  padding: 0 20px;
}

.top3-header {
  margin-bottom: 40px;
  line-height: 1.2;
  text-align: left; 
  width: 100%;
  max-width: 600px; 
}

.title-1 {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 800;
  font-family: 'Roboto', sans-serif;
  margin: 0 0 12px 0;
  color: #000;
  line-height: 1.1; 
}

.title-2 {
  font-size: clamp(1.2rem, 3vw, 1.5rem);
  font-weight: 700;
  font-family: 'Roboto', sans-serif;
  margin: 0; 
  color: #666;
  line-height: 1.3; 
}

.top3-cards {
  display: flex;
  gap: 24px;
  width: 100%;
  justify-content: center; 
  flex-wrap: wrap; 
  max-width: 1200px;
}


@media (max-width: 1024px) {
  .top3-cards {
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .top3-section {
    padding: 40px 16px 80px;
  }
  
  .top3-cards {
    gap: 16px;
    justify-content: center;
  }
  
  .top3-container {
    padding: 0 16px;
  }
}

@media (max-width: 480px) {
  .top3-cards {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
}


</style>