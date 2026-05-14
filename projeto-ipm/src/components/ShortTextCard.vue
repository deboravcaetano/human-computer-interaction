<template>
    <div class="short-text-card">
        <div class="card-header">
            <div v-if="$slots.icon" class="icon-container">
                <slot name="icon"></slot>
            </div>
            <h3 class="card-title">{{ title }}</h3>
        </div>
        <div class="card-content">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    title: string;
}>();
</script>

<style scoped>
.short-text-card {
    background-color: var(--bg-white, #ffffff);
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    font-family: var(--font-primary);
    color: var(--text-black);
    max-width: 100%;
}

.card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
}

.icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
}

.card-title {
    font-size: 1.125rem;
    font-weight: 700;
    margin: 0;
    line-height: 1.2;
}

.card-content {
    font-size: 0.95rem;
    color: var(--text-gray-dark, #3c3c3c);
    line-height: 1.6;
}

.card-content :deep(p) {
    margin-top: 0;
    margin-bottom: 16px;
}

.card-content :deep(p:last-child) {
    margin-bottom: 0;
}
</style>