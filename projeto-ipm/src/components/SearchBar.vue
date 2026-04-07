<script setup>
import { ref } from 'vue';

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Pesquisar'
  },
  height: {
    type: String,
    default: '45px' 
  },
  width: {
    type: String,
    default: '100%'
  }
});

const searchQuery = ref('');
defineEmits(['search']);

</script>

<template>
  <div class="search-wrapper" :style="{ width: props.width }">
    <img 
      src="@/assets/search-icon.svg" 
      alt="Search" 
      class="search-icon"
    />

    <input
      type="text"
      v-model="searchQuery"
      :placeholder="props.placeholder"
      :style="{ height: props.height }"
      @input="$emit('search', searchQuery)"
      class="search-input"
    />
  </div>
</template>

<style scoped>
.search-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 16px; 
  width: 16px; 
  height: 16px;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0 16px 0 48px; 
  font-size: 16px;
  border-radius: 8px;

  border: 1px solid #c8c8c8; 
  
  outline: none;
  background-color: #fff;
}

.search-input::placeholder {
  color: #9e9e9e;
  font-size: 15px;
  
}
</style>