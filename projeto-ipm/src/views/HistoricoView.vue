<script setup>
import { computed, onMounted, ref } from 'vue';
import IntroCard from '@/components/IntroCard.vue';
import InfoCard from '@/components/InfoCard.vue';
import Button from '@/components/Button.vue';
import ExportImg from '@/assets/Download.svg'
import FilterSelect from '@/components/FilterSelect.vue';
import HistoryList from '@/components/HistoryList.vue';
import { getCountries, getPillars, getReviews } from '@/services/api';

const filtroPais = ref('');
const filtroEstado = ref('');
const filtroPilares = ref('');

const estados = ['Aprovado', 'Pendente', 'Recusado'];
const countries = ref([]);
const pillars = ref([]);
const reviews = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');

const title = "Histórico de Revisões da União Europeia";
const description = "Este painel permite acompanhar as alterações oficiais nos Planos de Recuperação e Resiliência, garantindo a transparência e a responsabilidade na execução dos fundos."

const pilares = computed(() => pillars.value.map((pillar) => pillar.name));

const getFlagPath = (flagAsset) => {
    return new URL(`../assets/flags/${flagAsset}.svg`, import.meta.url).href;
};

const paises = computed(() => {
    return countries.value.map((country) => ({
        label: country.name,
        value: country.name,
        icon: getFlagPath(country.flagAsset)
    }));
});

const getCountryById = (countryId) => countries.value.find((country) => country.id === countryId);
const getPillarById = (pillarId) => pillars.value.find((pillar) => pillar.id === pillarId);

const filteredReviews = computed(() => {
    return reviews.value.filter((review) => {
        const country = getCountryById(review.countryId);
        const pillar = getPillarById(review.pillarId);
        const countryMatches = !filtroPais.value || country?.name === filtroPais.value;
        const statusMatches = !filtroEstado.value || review.status === filtroEstado.value.toLowerCase();
        const pillarMatches = !filtroPilares.value || pillar?.name === filtroPilares.value;

        return countryMatches && statusMatches && pillarMatches;
    });
});

const totalRevisoes = computed(() => filteredReviews.value.length);
const totalAprovados = computed(() => filteredReviews.value.filter((review) => review.status === 'aprovado').length);
const totalPendentes = computed(() => filteredReviews.value.filter((review) => review.status === 'pendente').length);
const totalRecusados = computed(() => filteredReviews.value.filter((review) => review.status === 'recusado').length);

const historyItems = computed(() => {
    return filteredReviews.value.map((review) => {
        const country = getCountryById(review.countryId);
        const pillar = getPillarById(review.pillarId);

        return {
            ...review,
            country: country?.name ?? 'País desconhecido',
            flag: country?.flagAsset ? getFlagPath(country.flagAsset) : '',
            category: pillar?.name ?? ''
        };
    });
});

onMounted(async () => {
    try {
        const [countriesData, pillarsData, reviewsData] = await Promise.all([
            getCountries(),
            getPillars(),
            getReviews()
        ]);

        countries.value = countriesData;
        pillars.value = pillarsData;
        reviews.value = reviewsData;
    } catch (error) {
        errorMessage.value = 'Não foi possível carregar o histórico.';
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
            height="320px" 
            width="100%" 
        >
        </IntroCard>
        <div class="info-cards">
            <InfoCard
                title="Total"
                :description="isLoading ? '...' : String(totalRevisoes)"
                height="130px"
                width="260px" 
                backgroundColor="#FDCA40"
                borderColor="#795A08"
            ></InfoCard>
            <InfoCard
                title="Aprovados"
                :description="isLoading ? '...' : String(totalAprovados)"
                height="130px"
                width="260px" 
            ></InfoCard>
            <InfoCard
                title="Pendentes"
                :description="isLoading ? '...' : String(totalPendentes)"
                height="130px"
                width="260px" 
            ></InfoCard>
            <InfoCard
                title="Recusados"
                :description="isLoading ? '...' : String(totalRecusados)"
                height="130px"
                width="260px" 
            ></InfoCard>
        </div>
        <div class="buttons">
            <div class="left-buttons">
                <FilterSelect 
                    label="País" 
                    :options="paises" 
                    all-label="Todos os Países"
                    v-model="filtroPais" 
                />
                <FilterSelect 
                    label="Estado" 
                    :options="estados" 
                    all-label="Todos os Estados"
                    v-model="filtroEstado" 
                />
                <FilterSelect 
                    label="Pilares" 
                    :options="pilares" 
                    all-label="Todos os Pilares"
                    v-model="filtroPilares" 
                />
            </div>
            <div class="right-buttons">
                <Button 
                text="Exportar" 
                textsize="15px" 
                :icon="true" 
                :iconPath="ExportImg"
                :exportable="true"
                />
            </div>
        </div>
        <p v-if="errorMessage" class="state-text state-text--error">{{ errorMessage }}</p>
        <p v-else-if="isLoading" class="state-text">A carregar histórico...</p>
        <HistoryList v-else :items="historyItems" />
    </div>
</template>

<style scoped>
.info-cards {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 24px;
  padding: 40px 20px;
  margin-top: -60px;
  margin-bottom: 80px;
  flex-wrap: wrap;
  position: relative;
  z-index: 2;
}

.buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  padding: 0 20px;
  margin: 60px auto 0;
  gap: 20px;
}

.left-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
}

.right-buttons {
  display: flex;
  align-items: center;
}

.state-text {
  max-width: 1200px;
  width: 100%;
  padding: 0 20px;
  margin: 24px auto 0;
  font-family: var(--font-primary);
  color: var(--text-gray);
}

.state-text--error {
  color: #b42318;
}

@media (max-width: 1024px) {
  .info-cards {
    margin-top: -50px;
    gap: 20px;
    padding: 30px 16px;
  }
  
  .buttons {
    padding: 0 20px;
  }
  
  .left-buttons {
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .info-cards {
    margin-top: -45px;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-bottom: 60px;
  }
  
  .buttons {
    flex-wrap: wrap;
    justify-content: flex-start; 
    gap: 16px;
    padding: 0 16px;
    margin-top: 40px;
  }
  
  .left-buttons {
    gap: 12px;
    flex: 1;
    justify-content: flex-start; 
  }
  
  .right-buttons {
    flex-shrink: 0;
  }
}

@media (max-width: 480px) {
  .info-cards {
    margin-top: -30px;
    padding: 20px 16px;
  }
  
  .buttons {
    flex-direction: column;
    align-items: flex-start; 
    gap: 16px;
    padding: 0 16px;
  }
  
  .left-buttons {
    flex-direction: column;
    gap: 12px;
    width: 100%;
    align-items: flex-start; 
  }
  
  .right-buttons {
    width: 100%;
  }
}
</style>
