<script setup>
defineProps({
  label: String,        
  options: Array,       
  modelValue: String    
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div class="filter-container">
    <select 
      :value="modelValue" 
      @change="$emit('update:modelValue', $event.target.value)"
      class="filter-select"
    >
      <option value="" disabled selected>Filtrar por: {{ label }}</option>
      <option v-for="option in options" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.filter-container {
  position: relative;
  display: inline-block;
}

.filter-select {
    appearance: none;
    background-color: white;
    background-image: url('@/assets/arrow-down-gray.svg'); 
    background-repeat: no-repeat;
    background-position: right 15px center; 
    background-size: 11px; 
    border: 1px solid #ccc;
    border-radius: 15px;
    padding: 8px 40px 8px 15px; 
    font-family: Inter, sans-serif;
    font-size: 14px;
    color: #666;
    cursor: pointer;
    min-width: 180px;
    outline: none;
}
</style>