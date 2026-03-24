<script setup>
import IntroCard from '@/components/IntroCard.vue';

const title = "Monitorização do Mecanismo de Recuperação e Resiliência";
const description = "Explore como cada Estado-Membro está a cumprir os seus marcos e metas para garantir um futuro resiliente.";
</script>

<template>
  <div>
    <IntroCard 
      :title="title" 
      :description="description" 
      height="400px" 
      width="100%" 
    />
  </div>
</template>