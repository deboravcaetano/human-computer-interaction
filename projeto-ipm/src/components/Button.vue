<script setup lang="ts">
  type ColorVariant = 'primary' | 'secondary'

  const props = withDefaults(
    defineProps<{
      text?: string
      color?: ColorVariant
      disabled?: boolean
      icon?: boolean
      iconPath?: string
    }>(),
    {
      text: 'Button',
      color: 'primary',
      disabled: false,
      icon: false,
      iconPath: ''
    }
  )

  const emit = defineEmits<{
    (e: 'click'): void
  }>()

  const onClick = () => {
    if (props.disabled) return
    emit('click')
  }
</script>

<template>
  <button
    :class="['btn', `btn--${color}`, { 'btn--disabled': disabled }]"
    type="button"
    :disabled="disabled"
    @click="onClick"
  >
    <span class="btn__text">{{ text }}</span>
    <img v-if="icon && iconPath" class="btn__icon" :src="iconPath" alt="" aria-hidden="true" />
  </button>
</template>

<style scoped>
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.56rem 0.95rem;
    border: 1px solid;
    border-radius: 8px;
    font-family: var(--font-primary);
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: filter 160ms ease, transform 160ms ease;
  }

  /* Primary color */
  .btn--primary {
    border-color: var(--bg-blue-dark);
    background: linear-gradient(180deg, var(--bg-blue) 0%, var(--bg-blue-dark) 100%);
    color: var(--text-white);
    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.12) inset;
  }

  .btn--primary:hover:not(:disabled) {
    filter: brightness(1.08);
  }

  /* Secondary color */
  .btn--secondary {
    border-color: var(--bg-blue-light);
    background: var(--bg-gray);
    color: var(--text-blue-dark);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .btn--secondary:hover:not(:disabled) {
    background: var(--text-white);
    border-color: var(--bg-blue);
  }

  /* Button icon */
  .btn__icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
    object-fit: contain;
  }

  /* Button text */
  .btn__text {
    display: inline-block;
  }

  /* Active state */
  .btn:active:not(:disabled) {
    transform: translateY(1px);
  }

  /* Focus state */
  .btn:focus-visible {
    outline: 2px solid var(--text-blue-neon);
    outline-offset: 2px;
  }

  /* Disabled state */
  .btn:disabled,
  .btn--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
