<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <main>
    <NavBar />
    <RouterView />
  </main>
</template>

<style>
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
}
</style>