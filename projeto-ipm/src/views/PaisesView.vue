<script setup>
import SearchBar from '@/components/SearchBar.vue';
import Button from '@/components/Button.vue';
import CountryCard from '@/components/CountryCard.vue';
import historyIcon from '@/assets/history-icon.svg';
import compareIcon from '@/assets/compare-icon.svg';
import portugalFlag from '@/assets/flags/portugal-flag.svg';
import franceFlag from '@/assets/flags/france-flag.svg';
import germanyFlag from '@/assets/flags/germany-flag.svg';

const countries = [
  {
    country: 'Portugal',
    flagSrc: portugalFlag,
    evolution: 52,
    gdp: '$267.92 B',
    updatedAt: '12 Dec 2025'
  },
  {
    country: 'France',
    flagSrc: franceFlag,
    evolution: 83,
    gdp: '$2822.45 B',
    updatedAt: '12 Dec 2025'
  },
  {
    country: 'Germany',
    flagSrc: germanyFlag,
    evolution: 61,
    gdp: '$4185.55 B',
    updatedAt: '16 Feb 2026'
  }
];

const onCountryCardClick = () => {
  // Placeholder until country detail page is ready.
};

</script>

<template>
  <div class="page-content">
    <SearchBar class="my-search" placeholder="Pesquisar por país" width="100%" height="36px" />
    <div class="buttons-div">
      <router-link to="/paises/historico" style="text-decoration: none;">
        <Button 
          text="Histórico" 
          textsize="15px" 
          :icon="true" 
          :iconPath="historyIcon"
        />
      </router-link>
      <router-link to="/historico" style="text-decoration: none;">
        <Button 
          text="Comparar" 
          textsize="15px" 
          :icon="true" 
          :iconPath="compareIcon"
        />
      </router-link>
    </div>

    <section class="cards-list">
      <CountryCard
        v-for="country in countries"
        :key="country.country"
        :country="country.country"
        :flag-src="country.flagSrc"
        :evolution="country.evolution"
        :gdp="country.gdp"
        :updated-at="country.updatedAt"
        @click="onCountryCardClick"
      />
    </section>
  </div>
</template>

<style scoped>
.page-content {
  display: flex;
  flex-direction: column;
  align-items: center; 
  width: 100%;             
  margin-top: 40px;   
  padding: 20px;
  box-sizing: border-box; 
}

.buttons-div {
  display: flex;       
  flex-direction: row; 
  gap: 10px;           
  margin-top: 40px;    
  width: 100%;
  max-width: 1200px;   
  justify-content: flex-end; 
}

.my-search {
  max-width: 1200px;
  width: 100%;
}

.cards-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 1200px;
  margin-top: 18px;
}
</style>