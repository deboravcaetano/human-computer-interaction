<script setup>
import SearchBar from '@/components/SearchBar.vue';
import Button from '@/components/Button.vue';
import historyIcon from '@/assets/history-icon.svg';
import compareIcon from '@/assets/compare-icon.svg';

import { useRouter } from 'vue-router';


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
          :iconPath="historyIcon"
        />
      </router-link>
    </div>
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
</style>