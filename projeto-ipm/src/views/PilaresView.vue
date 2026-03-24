<script setup>
import IntroCard from '@/components/IntroCard.vue';

const title = "Pilares";
const description = "Os pilares são as grandes áreas estratégicas que orientam o investimento dos fundos europeus, como a Transição Ecológica e a Transformação Digital, servem para organizar e categorizar todos os marcos e metas de cada país. ";
</script>

<template>
  <div>
    <IntroCard 
      :title="title" 
      :description="description" 
      height="281" 
      width="100%" 
    >
    </IntroCard>
  </div>
</template>