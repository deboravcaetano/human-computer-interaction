<script setup>
import { computed, onMounted, ref } from 'vue';
import IntroCard from '@/components/IntroCard.vue';
import AllFlags from '@/components/AllFlags.vue';
import Top3Cards from '@/components/Top3Cards.vue';
import InfoCard from '@/components/InfoCard.vue';
import UltimasNoticiasBg from '@/components/UltimasNoticiasBg.vue';
import UltimasNoticias from '@/components/UltimasNoticias.vue';
import { getCountries, getLatestNews, getSummary, getTopCountries } from '@/services/api';

const title = "Monitorização do Mecanismo de Recuperação e Resiliência";
const description = "Explore como cada Estado-Membro está a cumprir os seus marcos e metas para garantir um futuro resiliente.";

const summary = ref([]);
const countries = ref([]);
const topCountries = ref([]);
const latestNews = ref([]);
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
    const [summaryData, countriesData, topCountriesData, latestNewsData] = await Promise.all([
      getSummary(),
      getCountries(),
      getTopCountries(),
      getLatestNews()
    ]);

    summary.value = summaryData;
    countries.value = countriesData;
    topCountries.value = topCountriesData;
    latestNews.value = latestNewsData;
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
          <h2 class="title-1">Top 3 países</h2>
          <p class="title-2">Estados-Membros com melhor progresso na execução</p>
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

    <UltimasNoticiasBg class="home-news-spacer">
      <UltimasNoticias :items="latestNews" :initial-count="3" />
    </UltimasNoticiasBg>
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
  margin-bottom: 260px;
}

.top3-section {
  display: flex;
  justify-content: center;
  padding: 28px 20px 100px;
  background: #ffffff;
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
  margin-bottom: 28px;
  line-height: 1.2;
  text-align: left;
  width: 100%;
  max-width: 760px;
}

.title-1 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  font-family: 'Roboto', sans-serif;
  margin: 0 0 8px 0;
  color: #0b1f4b;
  line-height: 1.05;
}

.title-2 {
  font-size: clamp(1rem, 2vw, 1.15rem);
  font-weight: 500;
  font-family: 'Roboto', sans-serif;
  margin: 0;
  color: #66738f;
  line-height: 1.4;
}

.top3-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1180px;
  align-items: stretch;
}

.home-news-spacer {
  margin-top: 200px;
}

@media (max-width: 1024px) {
  .top3-cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .top3-section {
    padding: 24px 16px 80px;
  }

  .top3-cards {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .top3-container {
    padding: 0 16px;
  }

  .info-cards-container {
    margin-bottom: 180px;
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .home-news-spacer {
    margin-top: 50px;
  }
}
</style>
