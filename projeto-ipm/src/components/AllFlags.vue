<script setup lang="ts">
const flags = [
  'austria-flag', 'belgium-flag', 'bulgaria-flag', 'croatia-flag',
  'cyprus-flag', 'czechia-flag', 'denmark-flag', 'estonia-flag',
  'finland-flag', 'france-flag', 'germany-flag', 'greece-flag',
  'hungary-flag', 'ireland-flag', 'italy-flag', 'latvia-flag',
  'lithuania-flag', 'luxembourg-flag', 'malta-flag', 'netherlands-flag',
  'poland-flag', 'portugal-flag', 'romania-flag', 'slovakia-flag', 'slovenia-flag'
];

const getImagePath = (name: string) => {
  return new URL(`../assets/flags/${name}.svg`, import.meta.url).href;
};

</script>

<template>
    <div class="flag-container">
      <img 
        v-for="flag in [...flags, ...flags]" 
        :key="flag + Math.random()"
        :src="getImagePath(flag)" 
        :alt="flag"
        class="flag-icon"
        />
    </div>
</template>

<style scoped>
    .flag-container {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 5px;
        width: 100%;
    }

    .flag-icon {
        height: 32px;
        width: auto;
        opacity: 0.25;
        transition: opacity 0.3s ease;
        filter: grayscale(10);
    }

</style>