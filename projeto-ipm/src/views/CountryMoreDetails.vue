<script setup>
import { useRoute } from 'vue-router'
import IntroCard from '@/components/IntroCard.vue';

const route = useRoute()
</script>

<template>
  <section class="country-more-details">
    <IntroCard 
      :title="route.meta.title" 
      :description="route.meta.description" 
      height="281px" 
      width="100%" 
    >
    </IntroCard>

    <div class="tabs-box">
      <router-link
        :to="`/paises/${route.params.countryId}/mais/pilares`"
        class="tabs-box__item"
        active-class="tabs-box__item--active"
      >
        Pilares
      </router-link>

      <router-link
        :to="`/paises/${route.params.countryId}/mais/indicadores`"
        class="tabs-box__item"
        active-class="tabs-box__item--active"
      >
        Indicadores
      </router-link>
    </div>

    <div class="page-content-wrapper">
      <router-view />
    </div>
  </section>
</template>

<style scoped>
.tabs-box {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 12px;
    background: var(--bg-blue);
    width: 100%;
    max-width: 100vw;
    overflow-x: hidden;
}

.tabs-box__item {
    border: 0;
    background: transparent;
    color: var(--bg-yellow);
    padding: 10px 18px;
    border-radius: 7px;
    font-weight: 700;
    font-size: 14px;
    font-family: 'Roboto', sans-serif;
    cursor: pointer;
    text-decoration: none; 
    transition: background-color 160ms ease, transform 160ms ease;
}

.tabs-box__item:hover {
    background: rgba(253, 202, 64, 0.12);
}

.tabs-box__item--active {
    background: var(--bg-blue-dark);
    color: var(--bg-yellow);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.page-content-wrapper {
  padding: 20px; 
}
</style>