<script setup>
import IntroCard from '@/components/IntroCard.vue';
import AllFlags from '@/components/AllFlags.vue';
import Top3Cards from '@/components/Top3Cards.vue';


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
    >
      <AllFlags />
    </IntroCard>
    <section class="top3-section">
          <div class="top3-container">
            <div class="top3-header">
              <h2 class="title-1">Top 3</h2>
              <p class="title-2">países que lideram a execução</p>
            </div>

            <div class="top3-cards">
              <Top3Cards
                country="Portugal" 
                :position="1"
                :progress="32"
                :projects="132"
                total="8.18 Mil M"
              />
              <Top3Cards
                country="France" 
                :position="2"
                :progress="32"
                :projects="132"
                total="8.18 Mil M"
              />
              <Top3Cards
                country="Spain" 
                :position="3"
                :progress="32"
                :projects="132"
                total="8.18 Mil M"
              />
            </div>
          </div>
    </section>
  </div> 
</template>


<style scoped>
.top3-section {
  display: flex;
  justify-content: center; 
  padding-top: 650px;
  padding-bottom: 400px;
  background-color: white; 
}

.top3-container {
  /* Largura aproximada de 3 cards (400px cada) + gaps (40px) */
  max-width: 1280px; 
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.top3-header {
  margin-bottom: 20px;
  line-height: 1.1;
}

.title-1 {
  font-size: 3.5rem; 
  font-weight: 800;
  font-family: 'Roboto', sans-serif;
  margin: 0;
  color: #000;
}

.title-2 {
  font-size: 1.5rem;
  font-weight: 700;
  font-family: 'Roboto', sans-serif;
  margin: 0;
  color: #000;
}

.top3-cards {
  display: flex;
  flex-direction: row;
  gap: 40px;
  width: 100%;
  justify-content: flex-start; 
  flex-wrap: wrap;
}
</style>