<script lang="ts">
export default {
    name: 'SummaryCard',
    props: {
        title: {
            type: String,
            default: ''
        },
        helper: {
            type: String,
            default: ''
        }
    }
};
</script>

<template>
    <article class="summary-card">
        <header v-if="title || helper" class="summary-card__header">
            <p class="summary-card__title">{{ title }}</p>
            <p v-if="helper" class="summary-card__helper">{{ helper }}</p>
        </header>
        <div class="summary-card__body">
            <slot />
        </div>
    </article>
</template>

<style scoped>
.summary-card {
    background: #f7f7f7;
    border-radius: 14px;
    padding: 16px 18px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-height: 200px;
}

.summary-card__header {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.summary-card__title {
    font-family: var(--font-primary);
    font-size: 18px;
    font-weight: 600;
    color: var(--text-gray);
    margin: 0;
}

.summary-card__helper {
    font-family: var(--font-primary);
    font-size: 11px;
    color: var(--dark-green);
    margin: 0;
}

.summary-card__body {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
}
</style>
