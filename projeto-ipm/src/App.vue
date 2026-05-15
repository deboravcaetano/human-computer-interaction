<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
</script>

<template>
  <main class="layout">
    <NavBar />
    <section class="layout__content">
      <Breadcrumb />
      <RouterView />
    </section>
    <Footer />
  </main>
</template>

<style>
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
}

.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout__content {
  flex: 1 0 auto;
}
</style>