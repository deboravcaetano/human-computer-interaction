<script setup>
import SearchBar from '@/components/SearchBar.vue';


</script>

<template>
  <div class="page-content">
    <SearchBar class="my-search" width="100%" height="36px" />
  </div>
</template>

<style scoped>
.page-content {
  display: flex;
  justify-content: center; 
  width: 100%;             
  margin-top: 50px;   
  padding: 20px;
}

.my-search {
  max-width: 1200px;
  width: 100%;
}
</style>