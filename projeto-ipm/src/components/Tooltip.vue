<script setup lang="ts">
defineProps<{
  title?: string
  text?: string
}>()
</script>

<template>
  <div class="custom-tooltip-container">
    <slot name="trigger">
      <span class="tooltip-trigger-default" aria-hidden="true">i</span>
    </slot>

    <div class="tooltip-bubble" role="tooltip">
      <p v-if="title" class="tooltip-bubble__title">{{ title }}</p>
      <p v-if="text" class="tooltip-bubble__text">{{ text }}</p>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.custom-tooltip-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.tooltip-trigger-default {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: var(--text-black);
  color: var(--text-white);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
}

.tooltip-bubble {
  width: 300px;
  position: absolute;
  bottom: calc(100% + 8px);
  left: -120px; 
  padding: 13px 15px;
  border-radius: 12px;
  background: var(--bg-gray);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition: opacity 130ms ease, transform 130ms ease;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  pointer-events: none; 
}

.tooltip-bubble__title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-gray);
  margin-bottom: 8px;
  line-height: 1.2;
}

.tooltip-bubble__text {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-gray-dark);
  line-height: 1.4;
}

.custom-tooltip-container:hover .tooltip-bubble {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

@media (max-width: 640px) {
  .tooltip-bubble {
    left: 0;
  }
}
</style>